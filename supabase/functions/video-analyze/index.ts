// video-analyze — YouTube immersive-mode analysis: metadata + transcript + AI chapters/quizzes.
// Deploy: supabase functions deploy video-analyze
//
// Secrets required (Supabase project-level):
//   GROQ_TOKEN, GEMINI_API_KEY (and optionally CEREBRAS_API_KEY / MISTRAL_API_KEY) — at least one
//   VIDEO_PROVIDER_ORDER — optional, default "groq,cerebras,mistral,gemini"
//   YOUTUBE_API_KEY    — server-only YouTube Data API v3 key
//   TRANSCRIPT_API_KEY — TranscriptAPI.com bearer key
//
// Contract (must match Watch.tsx exactly):
//   Request:  { url: string }
//   Response: VideoAnalysis on success, { error: string } on failure

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const YT_API = "https://www.googleapis.com/youtube/v3/videos";
const TRANSCRIPT_API = "https://transcriptapi.com/api/v2/youtube/transcript";

// ── Shared time budget — 130 s fits one full 62 s wait + retry, under Supabase's 150 s limit ──
const TOTAL_BUDGET_MS = 130_000;
const AI_FETCH_MS = 40_000;
const META_FETCH_MS = 10_000;
const TRANSCRIPT_FETCH_MS = 12_000;

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

// ── AI call: tries each configured provider/key/model until one answers ─────────
// Same providers and secrets as groq-proxy / chat-reply (CEREBRAS_API_KEY,
// MISTRAL_API_KEY, GEMINI_API_KEY — each may hold several comma-separated keys).
interface AIProvider {
  id: string;
  url: string;
  keys: string[];
  models: string[];
  maxTokensParam: "max_tokens" | "max_completion_tokens";
  reasoningEffort?: string;
}

const envList = (name: string, fallback: string[]): string[] => {
  const a = (Deno.env.get(name) ?? "").split(",").map((v) => v.trim()).filter(Boolean);
  return a.length ? a : fallback;
};

function buildProviders(): AIProvider[] {
  const all: Record<string, AIProvider> = {
    groq: {
      id: "groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      keys: [...envList("GROQ_TOKEN", []), ...envList("GROQ_API_KEY", [])],
      models: envList("VIDEO_GROQ_MODEL", ["openai/gpt-oss-120b", "openai/gpt-oss-20b"]),
      maxTokensParam: "max_completion_tokens",
      reasoningEffort: "low",
    },
    cerebras: {
      id: "cerebras",
      url: "https://api.cerebras.ai/v1/chat/completions",
      keys: envList("CEREBRAS_API_KEY", []),
      models: envList("CHAT_CEREBRAS_MODEL", ["gpt-oss-120b"]),
      maxTokensParam: "max_completion_tokens",
    },
    mistral: {
      id: "mistral",
      url: "https://api.mistral.ai/v1/chat/completions",
      keys: envList("MISTRAL_API_KEY", []),
      models: envList("CHAT_MISTRAL_MODEL", ["mistral-small-latest"]),
      maxTokensParam: "max_tokens",
    },
    gemini: {
      id: "gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      keys: envList("GEMINI_API_KEY", []),
      models: envList("CHAT_GEMINI_MODEL", ["gemini-flash-lite-latest", "gemini-flash-latest"]),
      maxTokensParam: "max_tokens",
      reasoningEffort: "low",
    },
  };
  return envList("VIDEO_PROVIDER_ORDER", ["groq", "cerebras", "mistral", "gemini"])
    .map((id) => all[id.toLowerCase()])
    .filter((p): p is AIProvider => !!p && p.keys.length > 0);
}

const cooldown = new Map<string, number>(); // rate-limited provider/key/model → retry-after (epoch ms)

async function callAI(
  messages: Record<string, unknown>[],
  opts: { maxTokens?: number; temperature?: number; jsonMode?: boolean; deadline: number },
): Promise<string> {
  const providers = buildProviders();
  if (providers.length === 0) throw new Error("No AI provider key configured (set GROQ_TOKEN, GEMINI_API_KEY, CEREBRAS_API_KEY or MISTRAL_API_KEY)");

  const timeLeft = () => opts.deadline - Date.now();
  const failures: string[] = [];

  for (const p of providers) {
    for (let ki = 0; ki < p.keys.length; ki++) {
      for (const model of p.models) {
        const cdKey = `${p.id}:${ki}:${model}`;
        if ((cooldown.get(cdKey) ?? 0) > Date.now()) continue;

        // Attempts: (reasoning on, JSON mode) → (reasoning off, JSON mode) → (no JSON mode).
        // A provider answering 400 means it rejected a parameter, so we retry
        // without it before giving up on that provider.
        const attempts = [
          ...(p.reasoningEffort ? [{ r: true, j: !!opts.jsonMode }] : []),
          { r: false, j: !!opts.jsonMode },
          ...(opts.jsonMode ? [{ r: false, j: false }] : []),
        ];
        for (const att of attempts) {
          const withReasoning = att.r;
          if (timeLeft() < 3000) throw new Error("Timed out waiting for an AI model" + (failures.length ? ` (${failures.join(" | ")})` : ""));

          const payload: Record<string, unknown> = {
            model,
            messages,
            temperature: opts.temperature ?? 0.5,
            [p.maxTokensParam]: opts.maxTokens ?? 4096,
          };
          if (att.j) payload.response_format = { type: "json_object" };
          if (withReasoning && p.reasoningEffort) payload.reasoning_effort = p.reasoningEffort;

          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), Math.min(AI_FETCH_MS, Math.max(2000, timeLeft() - 1000)));
          let res: Response;
          try {
            res = await fetch(p.url, {
              method: "POST",
              headers: { Authorization: `Bearer ${p.keys[ki]}`, "Content-Type": "application/json" },
              body: JSON.stringify(payload),
              signal: ctrl.signal,
            });
          } catch (err) {
            failures.push(`${p.id}/${model}: ${ctrl.signal.aborted ? "timed out" : String(err)}`);
            break; // next model
          } finally {
            clearTimeout(timer);
          }

          if (res.ok) {
            const data = await res.json();
            const content = data?.choices?.[0]?.message?.content;
            if (typeof content === "string" && content.trim()) return content;
            failures.push(`${p.id}/${model}: empty answer`);
            break;
          }

          const errText = (await res.text().catch(() => "")).slice(0, 160);
          if (res.status === 400 && att !== attempts[attempts.length - 1]) continue; // retry without the rejected parameter
          failures.push(`${p.id}/${model}: HTTP ${res.status} ${errText}`);
          if (res.status === 429) cooldown.set(cdKey, Date.now() + 60_000);
          break; // next model / key / provider
        }
      }
    }
  }
  throw new Error("All AI providers failed: " + failures.join(" | "));
}

// ── YouTube video ID extraction — handles watch/short/embed/live links, loose paste ──
function extractVideoId(raw: string): string | null {
  let s = raw.trim();
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
      const embedMatch = u.pathname.match(/^\/(embed|shorts|live)\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch) return embedMatch[2];
      // Recognized YouTube host, but not a shape that contains a real video ID
      // (search results, channel/playlist pages, homepage, etc). Fail clean here
      // instead of falling through to the loose scan below — that scan grabs ANY
      // 11-char alphanumeric run anywhere in the string, which a search-query URL
      // will often contain by accident, producing a fake "video ID" that then
      // fails downstream as a confusing "video not found" instead of a clear
      // "that's not a video link."
      return null;
    }
  } catch {
    // fall through to loose scan below
  }
  const loose = raw.match(/[a-zA-Z0-9_-]{11}/);
  return loose ? loose[0] : null;
}

// ── ISO8601 duration ("PT1H2M10S") → seconds ──────────────────────────────────────
function iso8601ToSeconds(iso: string): number {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return 0;
  const h = parseInt(m[1] ?? "0", 10);
  const min = parseInt(m[2] ?? "0", 10);
  const s = parseInt(m[3] ?? "0", 10);
  return h * 3600 + min * 60 + s;
}

// ── Parse creator-added chapter timestamps out of the video description ──────────
// Heuristic, matching YouTube's own minimum (3+ ascending timestamps, first near 0:00).
// Will occasionally false-positive on unrelated "12:34"-shaped text in a description —
// acceptable for v1, flagging here rather than pretending it's exact.
function parseDescriptionChapters(description: string, durationSecs: number): { startTime: number; title: string }[] {
  const lines = description.split(/\r?\n/);
  const lineRe = /^\s*(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\s*[-–—:]?\s*(.+?)\s*$/;
  const found: { startTime: number; title: string }[] = [];

  for (const line of lines) {
    const m = line.match(lineRe);
    if (!m) continue;
    const h = m[1] ? parseInt(m[1], 10) : 0;
    const min = parseInt(m[2], 10);
    const sec = parseInt(m[3], 10);
    const title = m[4].trim();
    if (!title || sec > 59) continue;
    const startTime = h * 3600 + min * 60 + sec;
    if (startTime > durationSecs) continue;
    found.push({ startTime, title });
  }

  if (found.length < 3) return [];
  for (let i = 1; i < found.length; i++) {
    if (found[i].startTime <= found[i - 1].startTime) return [];
  }
  if (found[0].startTime > 5) return [];
  return found;
}

// ── TranscriptAPI fetch, with retry on the statuses their own docs mark retryable ──
interface TranscriptSegment { text: string; start: number; duration: number }

async function fetchTranscript(videoId: string, apiKey: string, deadline: number): Promise<TranscriptSegment[] | null> {
  const RETRYABLE = new Set([408, 429, 503]);
  const fullVideoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const url = `${TRANSCRIPT_API}?video_url=${encodeURIComponent(fullVideoUrl)}&format=json&include_timestamp=true`;

  for (let attempt = 0; attempt < 3; attempt++) {
    const timeLeft = deadline - Date.now();
    if (timeLeft < 2000) return null;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), Math.min(TRANSCRIPT_FETCH_MS, Math.max(1000, timeLeft)));
    try {
      const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${apiKey}` },
        signal: ctrl.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data.transcript) ? data.transcript : null;
      }
      if (RETRYABLE.has(res.status)) {
        const retryAfter = parseInt(res.headers.get("retry-after") ?? "0", 10);
        await sleep(Math.min((retryAfter || 1 + attempt) * 1000, Math.max(0, timeLeft - 1000)));
        continue;
      }
      // 404 (no captions), 400/401/422 — not retryable, proceed without a transcript
      return null;
    } catch {
      clearTimeout(timer);
      if (timeLeft < 3000) return null;
      await sleep(600);
      continue;
    }
  }
  return null;
}

function sliceTranscript(segments: TranscriptSegment[], start: number, end: number): string {
  return segments
    .filter((s) => s.start >= start && s.start < end)
    .map((s) => s.text.replace(/\s+/g, " ").trim())
    .join(" ");
}

// Capped hard at 16k chars (~4k tokens) — the old 60k cap produced prompts large
// enough that gpt-4.1-mini couldn't reliably respond inside the 30s per-attempt
// timeout, so every retry across all 10 keys failed identically until the full
// 55s budget ran out. Retrying a too-large request doesn't help; shrinking it does.
// Tradeoff: for long videos this only covers roughly the first ~15-20 minutes of
// transcript — chapters/quizzes for content past that point won't be grounded.
// Sampling evenly across the full duration instead of truncating from the start
// would fix that, at the cost of more code — worth doing if long videos matter.
function fullTranscriptText(segments: TranscriptSegment[], capChars = 16000): string {
  const full = segments.map((s) => `[${s.start.toFixed(1)}s] ${s.text.replace(/\s+/g, " ").trim()}`).join("\n");
  return full.length > capChars ? full.slice(0, capChars) + "\n...(truncated)" : full;
}

// ── Types matching Watch.tsx's contract exactly ──────────────────────────────────
interface VideoQuiz { question: string; options: string[]; answer: string; explanation: string }
interface VideoChapter { id: string; index: number; title: string; startTime: number; endTime: number; quiz: VideoQuiz | null }
interface VideoAnalysis { videoId: string; title: string; thumbnail: string; durationSecs: number; chapters: VideoChapter[] }

function parseAIJson(raw: string): any {
  const cleaned = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  return JSON.parse(cleaned);
}

// Defensive: the model is told the answer must exactly match an option, but "must"
// isn't "will." A quiz whose answer can't be matched is worse than no quiz — the user
// picks the right option and the app tells them they're wrong. Repair or drop it.
function validateQuiz(q: any): VideoQuiz | null {
  if (!q || typeof q.question !== "string" || !Array.isArray(q.options) || q.options.length < 2) return null;
  if (typeof q.answer !== "string" || typeof q.explanation !== "string") return null;
  if (q.options.includes(q.answer)) {
    return { question: q.question, options: q.options, answer: q.answer, explanation: q.explanation };
  }
  const lenient = q.options.find((o: string) => o.trim().toLowerCase() === q.answer.trim().toLowerCase());
  if (!lenient) return null;
  return { question: q.question, options: q.options, answer: lenient, explanation: q.explanation };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

  const deadline = Date.now() + TOTAL_BUDGET_MS;

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") return json({ error: "Missing video URL" }, 400);

    const videoId = extractVideoId(url);
    if (!videoId) return json({ error: "Could not recognize a YouTube video in that link" }, 400);

    const youtubeKey = Deno.env.get("YOUTUBE_API_KEY");
    const transcriptKey = Deno.env.get("TRANSCRIPT_API_KEY");
    if (!youtubeKey) return json({ error: "Server misconfigured: YOUTUBE_API_KEY missing" }, 500);
    if (!transcriptKey) return json({ error: "Server misconfigured: TRANSCRIPT_API_KEY missing" }, 500);

    // ── 1. Video metadata: title, thumbnail, duration, description ──
    const metaCtrl = new AbortController();
    const metaTimer = setTimeout(() => metaCtrl.abort(), Math.min(META_FETCH_MS, Math.max(2000, deadline - Date.now())));
    let metaRes: Response;
    try {
      metaRes = await fetch(
        `${YT_API}?part=snippet,contentDetails&id=${videoId}&key=${youtubeKey}`,
        { signal: metaCtrl.signal },
      );
    } catch {
      clearTimeout(metaTimer);
      return json({ error: "Could not reach YouTube to fetch video info. Try again." }, 502);
    }
    clearTimeout(metaTimer);

    if (!metaRes.ok) {
      if (metaRes.status === 403) {
        const errBody = await metaRes.json().catch(() => null) as any;
        const reason = errBody?.error?.errors?.[0]?.reason;
        if (reason === "quotaExceeded") {
          return json({ error: "YouTube's daily lookup limit has been hit. This resets automatically — try again later." }, 503);
        }
      }
      return json({ error: `YouTube API error (${metaRes.status}). Check the server-side API key.` }, 502);
    }
    const metaData = await metaRes.json();
    const item = metaData?.items?.[0];
    if (!item) return json({ error: "Video not found, private, or unavailable." }, 404);

    const title: string = item.snippet?.title ?? "Untitled video";
    const description: string = item.snippet?.description ?? "";
    const durationSecs = iso8601ToSeconds(item.contentDetails?.duration ?? "PT0S");
    const thumbnail: string =
      item.snippet?.thumbnails?.high?.url ??
      item.snippet?.thumbnails?.default?.url ??
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    if (durationSecs === 0) {
      return json({ error: "Could not read this video's duration — it may be a livestream or unavailable." }, 400);
    }

    // ── 2. Transcript — always fetched, grounds quizzes even when chapters are known ──
    // Transcript fetching gets its own, earlier deadline than the true 55s ceiling —
    // AI_MIN_RESERVE_MS is carved out and protected exclusively for the AI call below.
    // Without this, a slow/retrying transcript fetch on a longer video (more data to
    // return, not necessarily bigger — TranscriptAPI's response time itself scales with
    // video length even though we only USE a capped slice of it afterward) can eat nearly
    // the whole 55s budget before the AI call even starts. A perfectly-sized AI prompt
    // still fails if it only gets 3 seconds of runway. This is what actually explained
    // the "no chapters" path failing on longer videos even after the transcript-text cap.
    const AI_MIN_RESERVE_MS = 20_000;
    const transcriptDeadline = deadline - AI_MIN_RESERVE_MS;
    const segments = await fetchTranscript(videoId, transcriptKey, transcriptDeadline);

    // ── 3. Description chapters, if the creator added them ──
    const descChapters = parseDescriptionChapters(description, durationSecs);
    const descChaptersWithEnds = descChapters.map((c, i) => ({
      ...c,
      endTime: i < descChapters.length - 1 ? descChapters[i + 1].startTime : durationSecs,
    }));

    // ── 4. Chapters known (from the description): batch quiz calls, run in parallel ──
    let chapters: VideoChapter[];

    if (descChapters.length > 0) {
      const MAX_CHAPTER_TEXT_CHARS = 1200;
      // Per-batch cap (not a total cap across the whole video). The earlier version of
      // this code capped the TOTAL combined size and silently stopped adding chapters
      // to the AI request once that ceiling was crossed — meaning every chapter after
      // the cutoff never got asked for a quiz at all, not because anything failed, but
      // because it was never sent. A 72-minute video that completed successfully with
      // no timeout still lost every quiz past ~30 minutes in, purely from a guessed
      // number being too conservative. Splitting into several smaller batches and firing
      // them AT THE SAME TIME instead removes the guess entirely — every chapter reaches
      // the AI, and total wait time stays low because the calls run concurrently, not
      // one after another. Cost: more total AI calls per video, spread across the same
      // 10-key pool that already exists for exactly this kind of load.
      const MAX_CHARS_PER_BATCH = 9000; // comfortably under the ~14k that already proved safe in a single call

      const capped = descChaptersWithEnds
        .map((c) => {
          const raw = segments ? sliceTranscript(segments, c.startTime, c.endTime) : "";
          const text = raw.length > MAX_CHAPTER_TEXT_CHARS ? raw.slice(0, MAX_CHAPTER_TEXT_CHARS) + "…" : raw;
          return { ...c, text };
        })
        .filter((c) => c.text.trim().length > 0);

      const batches: (typeof capped)[] = [];
      let current: typeof capped = [];
      let currentSize = 0;
      for (const c of capped) {
        if (current.length > 0 && currentSize + c.text.length > MAX_CHARS_PER_BATCH) {
          batches.push(current);
          current = [];
          currentSize = 0;
        }
        current.push(c);
        currentSize += c.text.length;
      }
      if (current.length > 0) batches.push(current);

      const quizSystemPrompt =
        "You write short comprehension quizzes for an educational video app. For each chapter given, write ONE multiple-choice " +
        "question grounded in its content (4 options, exactly one correct, plus a 1-2 sentence explanation). If a chapter's content " +
        "is too short or generic (e.g. an intro/outro/sponsor break) to support a real comprehension question, return null for " +
        'that chapter\'s quiz instead of inventing one. Respond ONLY with JSON: {"quizzes":[{"index":0,"quiz":{"question":"...",' +
        '"options":["...","...","...","..."],"answer":"...","explanation":"..."}},{"index":1,"quiz":null}, ...]}. The answer field ' +
        "must exactly match one of the options.";

      // Batches (if there's more than one) run concurrently via Promise.allSettled, not
      // sequentially — one slow/failed batch doesn't block or take down the others, and
      // its chapters simply end up with quiz:null (same graceful-degradation principle
      // used everywhere else in this file), instead of the whole request failing.
      const batchResults = await Promise.allSettled(
        batches.map((batch) => {
          const chapterBlocks = batch.map((c, i) => `Chapter ${i}: "${c.title}"\nContent: ${c.text}`).join("\n\n");
          const messages = [
            { role: "system", content: quizSystemPrompt },
            { role: "user", content: `Video: "${title}"\n\n${chapterBlocks}` },
          ];
          return callAI(messages, { jsonMode: true, deadline, maxTokens: 3000 });
        }),
      );

      // Each batch's AI response uses indices local to THAT batch, not the full video —
      // map results back by startTime, not by a shared/global index.
      const quizByStartTime = new Map<number, any>();
      batches.forEach((batch, bi) => {
        const result = batchResults[bi];
        if (result.status !== "fulfilled") return;
        let parsedBatch: any;
        try {
          parsedBatch = parseAIJson(result.value);
        } catch {
          return;
        }
        const quizzesRaw = Array.isArray(parsedBatch?.quizzes) ? parsedBatch.quizzes : [];
        for (const q of quizzesRaw) {
          const src = batch[q?.index];
          if (src) quizByStartTime.set(src.startTime, q?.quiz ?? null);
        }
      });

      chapters = descChaptersWithEnds.map((c, i) => ({
        id: `ch-${i}`,
        index: i,
        title: c.title,
        startTime: c.startTime,
        endTime: c.endTime,
        quiz: validateQuiz(quizByStartTime.get(c.startTime)),
      }));
    } else {
      // ── No description chapters — one call asks the AI to invent both chapter breaks
      // and quizzes from the transcript at once (already flat-capped at 16k chars). ──
      const transcriptText = segments ? fullTranscriptText(segments) : "";
      const aiMessages = [
        {
          role: "system",
          content:
            "You design chapter breakdowns for an educational video app, then write one short comprehension quiz per chapter. " +
            `The video is ${Math.round(durationSecs / 60)} minutes long. Propose 4-8 chapters based on real topic shifts in the ` +
            "transcript (not fixed time intervals). For each chapter give a short title, its start time in seconds, and either a " +
            "grounded multiple-choice quiz (4 options, one correct, brief explanation) or null if there isn't enough substantive " +
            "content to quiz on. " +
            (transcriptText
              ? ""
              : "No transcript is available for this video — base chapter breaks on the title and description only, and set " +
                "every quiz to null, since there's no content to ground questions in. ") +
            'Respond ONLY with JSON: {"chapters":[{"title":"...","startTime":0,"quiz":{"question":"...",' +
            '"options":["...","...","...","..."],"answer":"...","explanation":"..."}|null}, ...]}. The first chapter must start ' +
            "at 0. The answer field must exactly match one of the options.",
        },
        {
          role: "user",
          content: `Video: "${title}"\nDescription: ${description.slice(0, 1500)}\n\nTranscript:\n${transcriptText || "(unavailable)"}`,
        },
      ];

      const aiRaw = await callAI(aiMessages, { jsonMode: true, deadline, maxTokens: 4096 });
      let parsed: any;
      try {
        parsed = parseAIJson(aiRaw);
      } catch {
        return json({ error: "AI returned malformed data. Try again." }, 502);
      }

      const raw = Array.isArray(parsed?.chapters) ? parsed.chapters : [];
      const sorted = raw
        .filter((c: any) => typeof c?.title === "string" && typeof c?.startTime === "number")
        .sort((a: any, b: any) => a.startTime - b.startTime);

      chapters = sorted.map((c: any, i: number) => ({
        id: `ch-${i}`,
        index: i,
        title: c.title,
        startTime: Math.max(0, Math.round(c.startTime)),
        endTime: i < sorted.length - 1 ? Math.round(sorted[i + 1].startTime) : durationSecs,
        quiz: validateQuiz(c.quiz),
      }));
    }

    if (chapters.length === 0) {
      chapters = [{ id: "ch-0", index: 0, title, startTime: 0, endTime: durationSecs, quiz: null }];
    } else {
      chapters[0].startTime = 0; // guard against a gap before the first chapter
    }

    const analysis: VideoAnalysis = { videoId, title, thumbnail, durationSecs, chapters };
    return json(analysis);

  } catch (e) {
    return json({ error: String(e instanceof Error ? e.message : e) }, 500);
  }
});
