import { supabase } from './supabase';

// ─── Types matching the AI response schema ─────────────────────────────────────

export interface RoadmapResource {
  title: string;
  url: string;
  type: string;
  source: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  type: 'watch' | 'read' | 'build' | 'practice';
  duration: string;
  note: string;
  learn: RoadmapResource[];
  practice: RoadmapResource[];
  inspire: RoadmapResource[];
  // Added for the Inspire tab (Main.tsx) — deliberately separate from
  // `inspire` above, which is a community/social-platform field (Reddit,
  // Discord, study groups) and is NOT video content outside youtube-mode.
  // `discover` is always a YouTube search query, regardless of mode, meant
  // to be resolved into a real video client-side via the youtube-search
  // edge function at render time — the string here is a search query, not
  // a resolved video (same URL POLICY constraint as every other resource
  // field: the model can't name a real video ID, only a query). Optional
  // because roadmaps saved before this field existed won't have it —
  // Main.tsx's InspireView must fall back to `[]`, not assume presence.
  discover?: RoadmapResource[];
}

export interface RoadmapPhase {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  duration: string;
  milestone: string;
  steps: RoadmapStep[];
}

// ─── Today's-plan selection (budget-aware, stable across renders) ──────────────
//
// Two problems this replaces (see migration 009_today_plan.sql for the
// storage side):
//   1. TodayView used to compute `pending.slice(0, 4)` fresh on every
//      render. Completing a step removed it from `pending`, so the *next*
//      pending step slid in to fill the gap — the list visibly reshuffled
//      on every click ("keeps adding others"). This selection is meant to
//      be computed ONCE per day and persisted (today_plan_step_ids), then
//      read as-is; completing a step changes its done flag, never which
//      steps are in the list.
//   2. The old slice(0, 4) had no relationship to the user's actual daily
//      time budget (hoursPerDay from the Time screen / fingerprint). This
//      selects steps to fit that budget instead of a flat count.
//
// Shared by both the owner's own TodayView and the streak-partner view —
// same function, same stored column, so neither can drift from the other
// or reshuffle independently.

// Pulls the leading number out of a duration string. The AI generation
// prompt's contract (generateRoadmap.ts, DURATION CALIBRATION) mandates
// "Xh" / "X.Xh" only — e.g. "2h", "4.5h" — so that's the expected shape.
// parseFloat naturally also handles a stray "3.75 hours"-style value if
// one ever slips through, since it stops at the first non-numeric
// character and ignores whatever follows.
// buildPlaceholderRoadmap() (preview/guest mode) instead uses ranges like
// "3-5 days" — parseFloat on that yields 3, which is a reasonable-enough
// weight for a value that (by construction) is never real, persisted, or
// visible to a streak partner: preview roadmaps aren't saved and can't be
// pinned (see Navigator_Handoff.md §4), so this path only matters for
// display consistency within the preview itself, not for real scheduling.
export function parseDurationHours(duration: string): number {
  const n = parseFloat(duration);
  return Number.isFinite(n) && n > 0 ? n : 1; // 1h fallback if unparseable
}

// Selects which step ids fit in `hoursPerDay`, walking phases/steps in
// their existing order. Always includes at least one pending step even if
// it alone exceeds the budget — an empty today's-plan is worse than a
// slightly-over-budget one.
//
// `alreadyDone` (the owner's real progress map) is used only to decide
// which steps are eligible to be *picked* — once picked, a step stays in
// the returned list even after it's completed (that's what "doesn't
// disappear" means both for the owner and for what a streak partner sees).
export function selectTodayPlan(
  phases: RoadmapPhase[],
  progress: Record<string, boolean>,
  hoursPerDay: number,
): string[] {
  const allSteps = phases.flatMap(p => p.steps);
  const pending = allSteps.filter(s => !progress[s.id]);
  const budget = hoursPerDay > 0 ? hoursPerDay : 1.5; // matches context.tsx's own default

  const picked: string[] = [];
  let used = 0;
  for (const step of pending) {
    const hrs = parseDurationHours(step.duration);
    if (picked.length > 0 && used + hrs > budget) break;
    picked.push(step.id);
    used += hrs;
  }

  // Nothing pending at all (roadmap fully complete) — fall back to the
  // first few steps so the section isn't just empty; matches TodayView's
  // pre-existing `allSteps.slice(0, 4)` fallback for the same case.
  if (picked.length === 0 && allSteps.length > 0) {
    return allSteps.slice(0, 4).map(s => s.id);
  }
  return picked;
}

export interface RoadmapTool {
  name: string;
  purpose: string;
  url: string;
}

export interface RoadmapExpert {
  name: string;
  platform: string;
  handle: string;
  url: string;
}

export interface Roadmap {
  skill: string;
  tagline: string;
  total_duration: string;
  fingerprint_type: string;
  fingerprint_note: string;
  // Not part of the AI response schema — stamped on after JSON.parse in
  // generateRoadmap() (and set directly in buildPlaceholderRoadmap()).
  // Added because mode was previously a generation-time-only param that
  // never survived onto the persisted Roadmap object, so RoadmapCard had
  // no way to tell full/sprint/youtube apart after the fact. Optional so
  // old persisted roadmaps (saved before this field existed) don't break
  // typing — callers reading it should treat a missing value as 'full'
  // (see MODE_BADGE in Main.tsx).
  mode?: 'full' | 'sprint' | 'youtube';
  phases: RoadmapPhase[];
  tools?: RoadmapTool[];
  experts?: RoadmapExpert[];
  unlearn_list: { habit: string; why: string }[];
  quick_wins: string[];
  daily_plan: { day: number; focus: string; tasks: string[]; time_estimate: string }[];
  salary_insights: {
    junior: { range: string; note: string };
    mid: { range: string; note: string };
    senior: { range: string; note: string };
  };
  skill_web: { adjacent: string[]; prerequisites: string[] };
  sprint_plan: null | Record<string, unknown>;
}

// ─── Core proxy caller ─────────────────────────────────────────────────────────
// Key rotation, retry, and backoff are all handled server-side in the edge function.
// The frontend makes one call; the proxy handles the rest.

// Waits for a valid Supabase session, using onAuthStateChange as the
// authoritative signal. After a Google OAuth redirect the PKCE code-exchange
// is async — getSession() returns null until it completes (can take 1-3 s).
// A fixed 700 ms timeout is not reliable; subscribing to SIGNED_IN is.
async function waitForAuth() {
  // Dev bypass has no real Supabase session — return null immediately so
  // callers fall through to their fallback paths without waiting 8 s.
  if (localStorage.getItem('navigator-dev-bypass')) return null;

  const { data: { session: existing } } = await supabase.auth.getSession();
  if (existing) return existing;

  return new Promise<import('@supabase/supabase-js').Session | null>(resolve => {
    let done = false;

    // Timeout: if auth never fires after 8 s, give up
    const timer = setTimeout(() => {
      if (!done) { done = true; sub.unsubscribe(); resolve(null); }
    }, 8000);

    const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!done && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        done = true;
        clearTimeout(timer);
        sub.unsubscribe();
        resolve(session);
      }
    });
  });
}

async function groqCall(system: string, user: string, maxTokens: number, kind?: 'roadmap'): Promise<string> {
  const session = await waitForAuth();
  if (!session) throw new Error('Not authenticated');

  const messages = [
    ...(system ? [{ role: 'system', content: system }] : []),
    { role: 'user', content: user },
  ];

  const { data, error } = await supabase.functions.invoke('groq-proxy', {
    body: {
      model: 'gpt-4.1-mini',
      messages,
      max_tokens: Math.max(2000, Math.min(maxTokens, 16000)),
      temperature: 0.7,
      response_format: { type: 'json_object' },
      // Lets the proxy apply the unfinished-roadmap / daily limits. Only the
      // full roadmap generation sets this; every other call stays unlimited.
      ...(kind ? { kind } : {}),
    },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    let msg = String(error.message ?? 'Proxy error');
    try {
      const body = await (error as any).context?.json?.();
      if (body?.error) msg = typeof body.error === 'string' ? body.error : (body.error.message ?? JSON.stringify(body.error));
    } catch {}
    throw new Error(msg);
  }

  const content: string = data?.choices?.[0]?.message?.content ?? data?.content ?? '';
  if (!content) throw new Error('Empty response from AI — check the provider API keys in Supabase secrets (groq-proxy).');
  return content;
}

// ─── Related-skills backfill (Inspire feed fallback) ───────────────────────────
// Small, standalone AI call — NOT a re-run of the full roadmap-generation
// prompt above. Exists for exactly one purpose: roadmaps generated BEFORE
// skill_web.adjacent had real prompt instructions (see the "skill_web.adjacent"
// line added to the main prompt above) have an empty/unreliable adjacent
// array with no real related-skill data in it. Rather than backfilling those
// via a full re-generation (which would regenerate an entire roadmap's worth
// of phases/tools/experts/etc. just to get 5 skill names — wasteful and slow),
// this fires one small, cheap, single-purpose Groq call asking for exactly
// what's needed.
//
// Called from Main.tsx's Inspire feed, BLOCKING, the first time a roadmap
// missing this data needs it (explicit product decision — see the Inspire
// feed's own comment for why this blocks rather than running in the
// background). The result is persisted back onto the roadmap via
// context.tsx's persistEntry so this only ever runs once per old roadmap,
// not on every visit.
//
// Reuses groqCall (same auth-wait, same groq-proxy invocation, same error
// unwrapping) rather than duplicating any of that — the only thing genuinely
// different here is the prompt itself and the (much smaller) expected
// response shape.
export async function generateRelatedSkills(skill: string): Promise<string[]> {
  const prompt = `Skill: "${skill}"

Return ONLY valid JSON: {"related":["","","","",""]}

related: EXACTLY 5 short skill/topic names (2-4 words each, e.g. "Music Production", "UI/UX Design") that someone learning "${skill}" would plausibly also be interested in — same broad niche or a closely neighboring one, NOT a random unrelated skill, NOT a duplicate of "${skill}" itself. Each must be a real, searchable skill/topic name on its own.`;

  const raw = await groqCall(
    'You are a learning-path assistant. Return ONLY raw valid JSON — no markdown, no backticks, no preamble.',
    prompt,
    500,
  );

  try {
    const parsed = JSON.parse(raw);
    const related = Array.isArray(parsed?.related)
      ? parsed.related.filter((s: unknown): s is string => typeof s === 'string' && s.trim().length > 0)
      : [];
    return related.slice(0, 5);
  } catch {
    // Malformed JSON from the model — treat as "couldn't get related skills
    // this time" rather than throwing, so the caller can fall through to its
    // own last-resort fallback instead of the whole feed erroring out.
    return [];
  }
}

// ─── Real roadmap generation ───────────────────────────────────────────────────

export async function generateRoadmap(
  skill: string,
  fingerprint: Record<string, string>,
  level: number | null,
  hoursPerDay: number,
  daysPerWeek: number,
  mode: 'full' | 'sprint' | 'youtube',
  sprintDays: number,
  sprintGoal: string,
  learningType: 'skill' | 'subject',
  // YouTube-mode creator targeting — collected on YouTube.tsx (ytSource /
  // ytCreator / ytAiPick) but previously never passed into this function at
  // all, which was the actual bug: "One Creator" + a typed name had no path
  // into the prompt, so the model treated every YouTube-mode generation as
  // "pick whatever's good," ignoring the selection entirely. Only
  // meaningful when mode === 'youtube'; harmless to pass for other modes
  // since youtubeSection/creatorSection below both no-op outside that mode.
  ytSource: 'single' | 'multi' = 'multi',
  ytCreator: string = '',
  ytAiPick: boolean = false,
): Promise<Roadmap> {
  const LEVEL_LABELS: Record<number, string> = {
    0: 'Complete Beginner', 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced', 4: 'Expert',
  };
  const lvl = level ?? 0;
  const levelLabel = LEVEL_LABELS[lvl] ?? 'Beginner';
  const fpSummary = Object.entries(fingerprint).map(([k, v]) => `- ${k}: ${v}`).join('\n') || '(no fingerprint)';

  // ─── Level-driven phase plan ─────────────────────────────────────────────
  // Previously the "Rules:" block hardcoded "4 phases
  // (Foundations→Intermediate→Advanced→Mastery)" no matter what level the
  // user picked on Gap.tsx. `Level: Intermediate (2/4)` was mentioned once
  // in the header, but a single label competing against an unconditional,
  // explicit phase-count rule three paragraphs later always lost — so
  // every roadmap started at Foundations regardless of level. This maps
  // level → an actual phase list, and that list (not a fixed 4) drives the
  // "Rules:" instruction, the JSON example's phase count, and the
  // tools/experts framing below.
  //
  // 0-1 (Complete Beginner/Beginner): full 4-phase ladder from scratch.
  // 2   (Intermediate): skip Foundations — assumes the fundamentals are
  //      already there, starts at Intermediate.
  // 3   (Advanced): starts at Advanced, 2 phases (Advanced→Mastery).
  // 4   (Expert): single Mastery-only phase — this is a capstone/advanced-
  //      topics list, not a curriculum, so it gets MORE steps per phase
  //      (8-10 vs the usual 5-6) so it doesn't read as a thin, half-built
  //      roadmap next to a beginner's 4-phase one.
  const PHASE_PLANS: Record<number, { titles: string[]; stepsPerPhase: string }> = {
    0: { titles: ['Foundations', 'Intermediate', 'Advanced', 'Mastery'], stepsPerPhase: '5-6' },
    1: { titles: ['Foundations', 'Intermediate', 'Advanced', 'Mastery'], stepsPerPhase: '5-6' },
    2: { titles: ['Intermediate', 'Advanced', 'Mastery'], stepsPerPhase: '5-6' },
    3: { titles: ['Advanced', 'Mastery'], stepsPerPhase: '5-6' },
    4: { titles: ['Mastery'], stepsPerPhase: '8-10' },
  };
  const phasePlan = PHASE_PLANS[lvl] ?? PHASE_PLANS[0];
  const phaseCount = phasePlan.titles.length;
  const phaseLadder = phasePlan.titles.join('→');

  const timeInfo = mode !== 'sprint'
    ? `\nSCHEDULE: ${hoursPerDay}hrs/day, ${daysPerWeek}days/week — calibrate all duration estimates to this.`
    : '';
  const sprintSection = mode === 'sprint'
    ? `\nSPRINT MODE:\n- Days: ${sprintDays}\n- Goal: ${sprintGoal}\nInclude sprint_plan with daily_plans, skip_list, honest_warning.`
    : '';

  // YouTube mode (critical, previously missing entirely — see investigation:
  // nothing branched on mode === 'youtube' anywhere in this prompt, so the
  // model picked step types and resource content the same way it would for
  // Full mode, freely choosing read/build/practice whenever the subject
  // matter called for it (e.g. "Python Syntax and Variables" as a Read step)
  // even though the entire point of this mode is "everything routes through
  // video." Product decision: every step type is forced to 'watch' with no
  // exceptions, and since a 'watch' step's whole premise is video content,
  // every resource across learn/practice/inspire must also be a real video
  // link, not just the primary "learn" one — otherwise a step badged
  // "Watch" could still open a "Practice" resource to a text tutorial.
  const youtubeSection = mode === 'youtube'
    ? `\nYOUTUBE MODE (critical): This is a YouTube-based roadmap — every single step MUST have "type": "watch". Do NOT use "read", "build", or "practice" for any step, even where a non-video step would normally make sense (e.g. syntax reference, hands-on project) — restructure that content as a video-based step instead (e.g. "watch a coding-along video", "watch a project walkthrough"). Every resource in "learn", "practice", AND "inspire" for every step must be a YouTube video link (use the YouTube search URL format below) — never a text article, docs page, or non-video link, even in "inspire".`
    : '';

  // Single-creator targeting (the actual fix for "I picked one creator and
  // it still generated more than one"). YouTube.tsx already collected
  // ytSource/ytCreator/ytAiPick correctly — the bug was that none of it
  // ever reached this function or this prompt, so the model had no signal
  // at all that a single channel was requested and just picked whatever was
  // topically relevant per step, drifting across creators after step 1.
  // Two real cases when ytSource === 'single':
  //   - a typed ytCreator name → lock to that exact creator by name.
  //   - ytAiPick with no typed name → the model picks ONE creator itself
  //     (its own judgement call, same as multi-creator AI-pick already
  //     does), but must then stay locked to that one choice for every
  //     subsequent step — not re-roll a "best fit" creator per step.
  // Multi-creator mode gets no clause at all — existing curated-from-
  // several behavior is intentionally untouched.
  const creatorSection = mode === 'youtube' && ytSource === 'single'
    ? (ytCreator.trim()
        ? `\nSINGLE CREATOR (critical, hard constraint): This roadmap must be built ENTIRELY around one creator: "${ytCreator.trim()}". EVERY "learn", "practice", and "inspire" resource across ALL phases and ALL steps must be a video from this exact creator's channel — search queries should include "${ytCreator.trim()}" by name (e.g. "${ytCreator.trim()} [topic]"). Do NOT substitute, supplement, or mix in any other creator/channel at any point, even if their content seems more relevant to a specific step — if this creator has no ideal video for a sub-topic, pick their closest related video rather than switching creators. The "experts" array should also feature only this one creator.`
        : `\nSINGLE CREATOR, AI-PICKED (critical, hard constraint): Choose exactly ONE real, well-known creator for "${skill}" — but choose deliberately, not the first famous name that comes to mind. Before naming anyone, actually weigh the realistic breadth of their catalog against the ${phaseCount === 1 ? 'single phase' : `${phaseCount} phases`} this roadmap needs (${phaseLadder}): does this creator plausibly have real videos covering ${phasePlan.titles[0].toLowerCase()}-level material through ${phasePlan.titles[phaseCount - 1].toLowerCase()}-level content, or are they known mainly for content at one level (e.g. only quick beginner explainers, or only advanced deep-dives)? Prefer a creator whose actual body of work spans the full range needed here over a bigger name whose content clusters at one level — a narrower-but-complete creator serves this roadmap better than a famous-but-lopsided one. Once chosen, name that same creator explicitly and use ONLY their videos for EVERY "learn", "practice", and "inspire" resource across the ENTIRE roadmap — every phase, every step. Do not switch to a different creator partway through, even if another creator seems better suited to a later topic — if this creator's coverage genuinely thins out at ${phasePlan.titles[phaseCount - 1]} level, pick their most advanced relevant video rather than substituting someone else. The "experts" array should feature only this one chosen creator.`)
    : '';

  const seeds = ['analytical', 'creative', 'project-based', 'community-driven', 'challenge-first', 'example-heavy', 'visual', 'storytelling'];
  const seed = seeds[Math.floor(Math.random() * seeds.length)];
  const isSubject = learningType === 'subject';

  // Level-aware framing addendum for tools/experts. Previously this clause
  // never referenced level at all, so an intermediate/advanced learner got
  // the same "here's your basic toolchain" framing as a complete beginner —
  // e.g. being told to install VS Code and set up Git as if they don't
  // already have a working setup. This doesn't change WHAT toolchain is
  // named (still the real one for the skill), only how it's pitched and how
  // deep the "learn"/"practice" resources go for the phases this roadmap
  // actually contains (which, per phasePlan above, may already exclude
  // Foundations entirely).
  const levelToolNote = lvl <= 1
    ? ` Assume no prior setup — include basic install/setup guidance where relevant.`
    : lvl === 2
    ? ` The learner already has fundamentals and a working setup — do NOT re-explain basic installation or "what is X" material; go straight into intermediate-level usage, workflows, and real-world patterns.`
    : ` The learner is already proficient — do NOT include any beginner setup, installation, or "what is X" material at all; tools and resources should assume a working environment and existing fluency, focusing on advanced/expert-level technique, edge cases, and professional workflows.`;

  const toolClause = isSubject
    ? `CONTENT SELECTION (critical): "${skill}" is a school/course subject. Structure phases around real curriculum units. "learn" = textbook explainers, university lectures, reputable course sites. "practice" = actual problem sets, past exam papers, worked examples. Generic platforms (Reddit, Discord) ONLY in "inspire", never as primary resource.${levelToolNote}`
    : `TOOL SELECTION (critical): Work out the actual professional toolchain for "${skill}". "practice" resources MUST use that real toolchain. Generic platforms (Reddit, Discord, Notion) ONLY in "inspire", never as primary resource.${levelToolNote}`;

  const paceNote = mode !== 'sprint'
    ? `against the learner's stated pace (${hoursPerDay}hrs/day, ${daysPerWeek}days/week)`
    : `against the ${sprintDays}-day sprint window`;

  const durationClause = `DURATION CALIBRATION (critical): Every "duration" value (step and phase) must be a realistic estimate for a first-time learner — not best-case, not round marketing numbers. Use format "Xh" or "X.Xh" ONLY (e.g. "2h", "4.5h") — never ranges, never days/weeks, at the step or phase level.
- watch: real runtime of the content + a light rewatch buffer.
- read: ~1.3-1.5x raw reading time to account for re-reading and looking things up.
- build: the biggest gap between naive and real — include environment setup, debugging, and getting stuck. Do NOT estimate this as "time to type the code."
- practice: assume multiple attempts before it clicks, not first-try success.
Each phase's "duration" must equal the sum of its steps' durations, in the same "Xh" format (e.g. "18h"). total_duration must be a human-readable range that is consistent with the summed phase hours ${paceNote} — do not invent it independently of the phase durations.`;

  // Stated as a hard, unconditional instruction in the same imperative voice
  // as the "Rules:" line below — not just mentioned once in the header —
  // because a single label up top previously lost to a contradicting
  // hardcoded phase count later in the same prompt. This is now the ONLY
  // place phase count/ladder is specified; the "Rules:" line and the JSON
  // example both defer to phasePlan instead of hardcoding "4 phases".
  const phaseRequirement = `PHASE STRUCTURE (critical, hard constraint): Because the learner selected "${levelLabel}", this roadmap has EXACTLY ${phaseCount} phase${phaseCount > 1 ? 's' : ''}: ${phaseLadder}. Do NOT include any phase before "${phasePlan.titles[0]}" — do not add a Foundations or "basics/refresher" phase even briefly, even as phase 1, regardless of what feels natural for "${skill}". Start immediately at "${phasePlan.titles[0]}"-level content and difficulty. Number phases 1-${phaseCount} in the exact order listed.`;

  // ─── Split generation ───────────────────────────────────────────────────────
  // One giant request (all phases + tools + experts + 14-day plan + ...) is a
  // very long answer: on free-tier models it took longer than the edge
  // function's ~150s limit, or got cut off. Instead we ask for the same content
  // in 2-3 smaller requests that run IN PARALLEL, so the total time is roughly
  // that of the slowest one:
  //   - phases, split into two halves (phase 1-2 / phase 3-4, etc.)
  //   - "extras": tagline, tools, experts, unlearn list, quick wins, daily plan,
  //     salary insights, skill web (and sprint_plan in sprint mode)
  // total_duration and each phase's duration are computed in code from the step
  // durations, so they can't disagree with each other.
  // Trade-off: one roadmap now costs 2-3 AI requests instead of 1.
  const header = `Roadmap for: "${skill}" | Type: ${isSubject ? 'Academic subject/course' : 'Practical skill'} | Level: ${levelLabel} (${lvl}/4)${timeInfo}${sprintSection}${youtubeSection}${creatorSection}

Learner profile:
${fpSummary}

Style: ${seed}.`;

  const urlPolicy = `URL POLICY: NEVER invent deep/specific URLs. Use ONLY:
- YouTube search: https://www.youtube.com/results?search_query=URL_ENCODED_QUERY
- Stable official root domains (e.g. https://react.dev/learn, https://developer.mozilla.org)
- Google search for everything else: https://www.google.com/search?q=URL_ENCODED_QUERY`;

  const discoverRule = `discover: 1-2 items per step — each a short, specific YouTube search query (2-6 words, e.g. "React useEffect cleanup explained") that would surface a real video going deeper on this exact step's topic. This is ALWAYS a video search query regardless of mode — unlike "inspire" (community/social platforms), "discover" is never a Reddit/Discord/study-group link. Use the YouTube search URL format from URL POLICY below.`;

  const buildPhasePrompt = (titles: string[], firstIndex: number) => {
    const example = titles
      .map((title, i) => `{"id":"p${firstIndex + i + 1}","number":${firstIndex + i + 1},"title":"${title}","subtitle":"","duration":"","milestone":"","steps":[{"id":"s1","title":"","type":"watch|read|build|practice","duration":"","note":"","learn":[{"title":"","url":"","type":"","source":""}],"practice":[{"title":"","url":"","type":"","source":""}],"inspire":[{"title":"","url":"","type":"","source":""}],"discover":[{"title":"","url":"","type":"","source":""}]}]}`)
      .join(',');
    const nums = titles.map((_, i) => firstIndex + i + 1).join(' and ');
    const only = `THIS REQUEST covers ONLY phase${titles.length > 1 ? 's' : ''} ${nums} of the ${phaseCount}-phase roadmap (${titles.join(', ')}). Return ONLY ${titles.length > 1 ? 'those phases' : 'that phase'} — the other phases are written in separate requests. Do not include tools, experts, daily plans or any other section here.`;

    return `${header}

${phaseRequirement}

${only}

${toolClause}

${durationClause}

Return ONLY valid JSON:
{"phases":[${example}]}

Rules: EXACTLY ${titles.length} phase${titles.length > 1 ? 's' : ''} in this response. ${phasePlan.stepsPerPhase} steps/phase. NEVER leave learn/practice/inspire/discover empty. Step/phase "duration" fields: "Xh" format ONLY, no ranges/days/weeks — see DURATION CALIBRATION above.
${discoverRule}

${urlPolicy}`;
  };

  const extrasPrompt = `${header}

${toolClause}

THIS REQUEST covers ONLY the extra sections of the roadmap (not the phases — those are written in separate requests). Do not include a "phases" field.

Return ONLY valid JSON:
{"tagline":"","fingerprint_type":"","fingerprint_note":"","tools":[{"name":"","purpose":"","url":""}],"experts":[{"name":"","platform":"youtube|x|github|linkedin|website","handle":"","url":""}],"unlearn_list":[{"habit":"","why":""}],"quick_wins":["","",""],"daily_plan":[{"day":1,"focus":"","tasks":[""],"time_estimate":""}],"salary_insights":{"junior":{"range":"","note":""},"mid":{"range":"","note":""},"senior":{"range":"","note":""}},"skill_web":{"adjacent":[""],"prerequisites":[""]},"sprint_plan":null}

Rules: 14-day daily_plan. 4 unlearn items. 3 quick_wins.
tools: 4-6 real tools of the actual toolchain for "${skill}" with a one-line purpose and a stable official root URL. Do NOT invent tools.
experts: 4-6 well-known REAL creators/experts for "${skill}" with platform, handle, and official profile URL. Do NOT invent people or handles — if unsure use a YouTube/Google search URL.
skill_web.adjacent: EXACTLY 5 short skill/topic names (2-4 words each, e.g. "Music Production", "UI/UX Design") that someone learning "${skill}" would plausibly also be interested in — same broad niche or a closely neighboring one, NOT a random unrelated skill. These are used as search terms elsewhere in the app, so each must be a real, searchable skill/topic name on its own (not a sentence, not a phase title from this roadmap, not a duplicate of "${skill}" itself). skill_web.prerequisites: 2-4 short skill names someone would ideally know BEFORE starting "${skill}" (empty array if genuinely none, e.g. for a beginner-friendly skill with no real prerequisite).

${urlPolicy}`;

  const SYSTEM = 'You are a world-class learning strategist. Return ONLY raw valid JSON — no markdown, no backticks, no preamble.';

  // Split the phase list into two halves (or one chunk for a single-phase plan).
  const mid = Math.ceil(phaseCount / 2);
  const chunks: { titles: string[]; firstIndex: number }[] = [{ titles: phasePlan.titles.slice(0, mid), firstIndex: 0 }];
  if (phaseCount > mid) chunks.push({ titles: phasePlan.titles.slice(mid), firstIndex: mid });

  const [extrasRaw, ...phaseRaws] = await Promise.all([
    groqCall(SYSTEM, extrasPrompt, 6000, 'roadmap'),
    ...chunks.map(c => groqCall(SYSTEM, buildPhasePrompt(c.titles, c.firstIndex), 8000, 'roadmap')),
  ]);

  const phases: RoadmapPhase[] = [];
  phaseRaws.forEach((raw, ci) => {
    const parsed = JSON.parse(raw);
    const list: RoadmapPhase[] = Array.isArray(parsed) ? parsed
      : Array.isArray(parsed?.phases) ? parsed.phases
      : Array.isArray(parsed?.steps) ? [parsed] : [];
    if (list.length < chunks[ci].titles.length) throw new Error('AI returned an incomplete roadmap. Please try again.');
    phases.push(...list.slice(0, chunks[ci].titles.length));
  });

  // Models sometimes return a resource as a bare string (esp. "discover" query
  // lists) instead of {title,url,type,source}. Normalize so later code can
  // safely set .url, and drop junk entries.
  for (const phase of phases) {
    for (const step of phase.steps ?? []) {
      for (const key of ['learn', 'practice', 'inspire', 'discover'] as const) {
        const raw = (step as any)[key];
        const arr: any[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
        (step as any)[key] = arr
          .map(r => typeof r === 'string' ? { title: r, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(r)}`, type: key === 'discover' ? 'video' : 'link', source: key === 'discover' ? 'YouTube' : '' } : r)
          .filter(r => r && typeof r === 'object' && typeof r.title === 'string' && r.title.trim());
      }
    }
  }

  // Durations computed in code: a phase's duration is the sum of its steps, and
  // total_duration is derived from all steps and the learner's pace.
  let totalHours = 0;
  for (const phase of phases) {
    const hours = (phase.steps ?? []).reduce((n, st) => n + parseDurationHours(st.duration), 0);
    totalHours += hours;
    phase.duration = `${Math.round(hours * 10) / 10}h`;
  }
  const perWeek = hoursPerDay * daysPerWeek;
  let totalDuration: string;
  if (mode === 'sprint') {
    totalDuration = `${sprintDays} days`;
  } else if (perWeek > 0) {
    const weeks = totalHours / perWeek;
    const lo = Math.max(1, Math.floor(weeks * 0.85));
    const hi = Math.max(lo, Math.ceil(weeks * 1.15));
    totalDuration = lo === hi ? `${lo} week${lo > 1 ? 's' : ''}` : `${lo}-${hi} weeks`;
  } else {
    totalDuration = `${Math.round(totalHours)}h`;
  }

  const extras = JSON.parse(extrasRaw) as Partial<Roadmap>;
  const roadmap: Roadmap = {
    skill,
    tagline: extras.tagline ?? '',
    total_duration: totalDuration,
    fingerprint_type: extras.fingerprint_type ?? '',
    fingerprint_note: extras.fingerprint_note ?? '',
    phases,
    tools: extras.tools ?? [],
    experts: extras.experts ?? [],
    unlearn_list: extras.unlearn_list ?? [],
    quick_wins: extras.quick_wins ?? [],
    daily_plan: extras.daily_plan ?? [],
    salary_insights: extras.salary_insights ?? {
      junior: { range: '—', note: '' }, mid: { range: '—', note: '' }, senior: { range: '—', note: '' },
    },
    skill_web: extras.skill_web ?? { adjacent: [], prerequisites: [] },
    sprint_plan: extras.sprint_plan ?? null,
  };
  roadmap.mode = mode; // stamp the real mode param — never trust the model to echo it back correctly

  // The JSON example in the prompt uses "s1" as the step id, so the model tends
  // to restart at s1/s2/... in every phase. Step ids are used as React keys and
  // as progress-map keys, so duplicates across phases collide. Rebuild them as
  // globally unique ids (p1s1, p1s2, p2s1...).
  (roadmap.phases ?? []).forEach((phase, pi) => {
    phase.id = `p${pi + 1}`;
    (phase.steps ?? []).forEach((step, si) => { step.id = `p${pi + 1}s${si + 1}`; });
  });

  // Code-enforced backstop for PHASE STRUCTURE above — same reasoning as the
  // YouTube-mode backstop just below: a prose instruction ("EXACTLY N
  // phases, do not include Foundations") is exactly the kind of constraint
  // an LLM can quietly ignore for a familiar-shaped task like "generate a
  // learning roadmap," where its training data is saturated with
  // Foundations-first examples. This is what actually fixes the reported
  // bug for real, not just "probably fixes it" — if the model still emits
  // a phase titled Foundations/Basics/Beginner/Introduction ahead of where
  // phasePlan says the roadmap should start, that phase (and only that
  // phase) is dropped and the remaining phases are renumbered 1..N so the
  // UI (which trusts phase.number verbatim — see Main.tsx PhaseCard) never
  // shows a gap like 2,3,4 with no phase 1.
  //
  // Deliberately narrow: only strips phases whose title matches an
  // earlier-than-required rung on the ladder (checked by name, not
  // position), so a model that legitimately titles its first phase
  // something creative but level-appropriate (e.g. "Sharpening the Basics"
  // for an actual Foundations-tier roadmap) isn't touched — this only
  // catches the specific failure mode of reverting to the beginner ladder
  // regardless of the requested level.
  if (lvl >= 2 && Array.isArray(roadmap.phases)) {
    const bannedLeadingTitles = phasePlan.titles[0] === 'Intermediate'
      ? ['foundations', 'basics', 'beginner', 'introduction', 'fundamentals', 'getting started']
      : phasePlan.titles[0] === 'Advanced'
      ? ['foundations', 'basics', 'beginner', 'introduction', 'fundamentals', 'getting started', 'intermediate']
      : ['foundations', 'basics', 'beginner', 'introduction', 'fundamentals', 'getting started', 'intermediate', 'advanced'];

    const filtered = roadmap.phases.filter(p => {
      const t = (p.title || '').trim().toLowerCase();
      return !bannedLeadingTitles.some(banned => t.includes(banned));
    });

    if (filtered.length > 0 && filtered.length < roadmap.phases.length) {
      roadmap.phases = filtered.map((p, i) => ({ ...p, number: i + 1 }));
    }
  }

  // Code-enforced backstop for YOUTUBE MODE's "every step is watch, every
  // resource is a video" rule. The prompt clause above asks for this, but a
  // prose instruction applied across 20-30 steps x 3 resource arrays in one
  // generation is exactly the kind of constraint an LLM can partially drop
  // partway through a long response (same failure class as the quiz
  // correct_index bug — don't trust self-reported compliance with something
  // checkable, verify/coerce it instead). This forces both invariants
  // regardless of what the model actually returned:
  //   1. step.type is always 'watch'.
  //   2. every learn/practice/inspire resource is rewritten to a YouTube
  //      search URL (same fallback shape the URL POLICY already uses
  //      elsewhere for unverifiable links) if it isn't already a real
  //      youtube.com/youtu.be link — so a "Watch" step can never surface a
  //      Practice or Inspire resource that opens a text article.
  if (mode === 'youtube') {
    const isYouTubeUrl = (url?: string) => !!url && (url.includes('youtube.com') || url.includes('youtu.be'));
    const toYouTubeSearch = (title: string) =>
      `https://www.youtube.com/results?search_query=${encodeURIComponent(title || 'tutorial')}`;

    for (const phase of roadmap.phases ?? []) {
      for (const step of phase.steps ?? []) {
        step.type = 'watch';
        for (const list of [step.learn, step.practice, step.inspire, step.discover]) {
          for (const resource of list ?? []) {
            if (!isYouTubeUrl(resource.url)) {
              resource.url = toYouTubeSearch(resource.title);
            }
          }
        }
      }
    }

    // Code-enforced backstop for the SINGLE CREATOR clause above — same
    // reasoning as the video-only backstop just above: a prose instruction
    // across every step of a long generation is a constraint an LLM can
    // drift off partway through (this is the literal bug being fixed here —
    // it wasn't even reaching the prompt before, but even once it does,
    // prose alone over 20-30 steps isn't reliable enough on its own).
    //
    // Real limit, stated plainly: these are search-query URLs
    // (youtube.com/results?search_query=...), not resolved video IDs, so
    // there is no way to verify from a URL alone that the video it
    // eventually resolves to actually belongs to the locked creator's
    // channel. What CAN be enforced: every single search query gets the
    // creator's name forced into it, so the user never opens a search that
    // omits the creator and could resolve to anyone. That's a real
    // narrowing of the actual risk, not a cosmetic one — but it's not a
    // hard guarantee the same way step.type = 'watch' above is.
    if (ytSource === 'single') {
      // Resolve which creator actually got locked in: the typed name takes
      // priority; for AI-pick, fall back to whatever the model put first in
      // "experts" (the prompt explicitly told it to put only the chosen
      // creator there). If neither is available the model didn't comply
      // with the AI-pick instruction at all — nothing to enforce against,
      // so this silently no-ops rather than forcing a garbage/empty name
      // into every query, which would be worse than doing nothing.
      const lockedCreator = ytCreator.trim() || roadmap.experts?.[0]?.name?.trim() || '';

      if (lockedCreator) {
        // Search query uses the STEP's title (the topic — "Functions",
        // "Arrays"), not the resource's own title. A drifted resource can
        // carry another creator's name baked into its title (e.g. "Fireship
        // - JS Functions in 100 Seconds"), and prepending the locked
        // creator on top of that produces a garbled mixed query. The step
        // title is creator-neutral by construction — it's the topic label,
        // never a specific video's title — so it's the safe thing to
        // rebuild the query from.
        const toCreatorSearch = (topic: string) =>
          `https://www.youtube.com/results?search_query=${encodeURIComponent(`${lockedCreator} ${topic || ''}`.trim())}`;
        // Same reasoning, for the DISPLAYED title. This was the actual gap:
        // the block below used to rewrite resource.url but leave
        // resource.title exactly as the model wrote it — so a user could
        // open a Kevin-Powell-scoped search link while the resource card
        // still visibly read "Fireship - JS Functions in 100 Seconds". The
        // url fix alone didn't reach what's actually on screen.
        const toCreatorTitle = (topic: string) => `${lockedCreator}: ${topic}`;

        for (const phase of roadmap.phases ?? []) {
          for (const step of phase.steps ?? []) {
            for (const list of [step.learn, step.practice, step.inspire, step.discover]) {
              for (const resource of list ?? []) {
                // Rewrite BOTH title and url together, unconditionally —
                // no longer gated on an "already mentions the creator"
                // check. That check let a title drift through untouched as
                // long as it happened to contain the locked creator's name
                // ANYWHERE in the string, even alongside a different
                // creator's name elsewhere in the same title. In
                // single-creator mode the model's own title text is never
                // trustworthy enough to keep, same as step.type isn't
                // trusted above — always rebuild both from the
                // creator-neutral step topic instead.
                resource.title = toCreatorTitle(step.title);
                resource.url = toCreatorSearch(step.title);
              }
            }
          }
        }

        // Same narrowing for "experts" — a single-creator roadmap showing
        // 4-6 different "expert" cards contradicts the entire premise, even
        // though experts wasn't the field the bug report was about.
        roadmap.experts = [{
          name: lockedCreator,
          platform: 'youtube',
          handle: roadmap.experts?.[0]?.handle || 'search',
          url: roadmap.experts?.[0]?.url && isYouTubeUrl(roadmap.experts[0].url)
            ? roadmap.experts[0].url
            : `https://www.youtube.com/results?search_query=${encodeURIComponent(lockedCreator)}`,
        }];
      }
    }
  }

  return roadmap;
}

// ─── Placeholder roadmap for preview / anonymous users ─────────────────────────

export function buildPlaceholderRoadmap(
  skill: string,
  learningType: 'skill' | 'subject',
  hoursPerDay: number,
  mode: 'full' | 'sprint' | 'youtube' = 'full',
): Roadmap {
  const s = skill || 'This Skill';
  const isYouTube = mode === 'youtube';
  const isSubject = learningType === 'subject';

  const yt = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  const mkStep = (id: string, title: string, type: RoadmapStep['type']): RoadmapStep => ({
    id, title, type, duration: '3-5 days', note: '',
    learn: [isYouTube
      ? { title: `${s}: ${title}`, url: yt(`${s} ${title}`), type: 'video', source: 'YouTube' }
      : { title: `Intro to ${s}`, url: `https://www.google.com/search?q=${encodeURIComponent('intro to ' + s)}`, type: 'article', source: 'Preview' }],
    practice: [isYouTube
      ? { title: `${s} coding along`, url: yt(`${s} ${title} coding along`), type: 'video', source: 'YouTube' }
      : { title: isSubject ? 'Practice problems' : 'Practice exercises', url: `https://www.google.com/search?q=${encodeURIComponent(s + (isSubject ? ' practice problems' : ' practice exercises'))}`, type: 'exercise', source: 'Preview' }],
    inspire: [isYouTube
      ? { title: `${s} project walkthrough`, url: yt(`${s} project walkthrough`), type: 'video', source: 'YouTube' }
      : { title: isSubject ? `${s} study group` : `${s} community`, url: `https://www.google.com/search?q=${encodeURIComponent(s + (isSubject ? ' study group' : ' community'))}`, type: 'community', source: 'Preview' }],
  });

  const phaseDefs: [string, string][] = isSubject
    ? [['Foundations', 'Core concepts'], ['Core Topics', 'Main units'], ['Advanced Topics', 'Harder material'], ['Exam Ready', 'Practice at exam level']]
    : [['Foundations', 'Get the fundamentals locked in'], ['Intermediate', 'Start building real things'], ['Advanced', 'Sharpen technique and speed'], ['Mastery', 'Work at a professional level']];

  return {
    skill: s,
    tagline: isSubject ? `A preview study path for ${s}` : `A preview path into ${s}`,
    total_duration: '8-12 weeks',
    mode,
    fingerprint_type: 'Preview',
    fingerprint_note: 'Sign in to personalize this to your actual answers.',
    phases: phaseDefs.map(([title, subtitle], i) => ({
      id: `p${i + 1}`, number: i + 1,
      title: `Phase ${i + 1}: ${s} ${title}`, subtitle,
      duration: '2-3 weeks',
      milestone: `Comfortable with ${title.toLowerCase()} concepts in ${s}`,
      steps: isYouTube ? [
        mkStep(`p${i + 1}s1`, `Watch: ${title} core concepts`, 'watch'),
        mkStep(`p${i + 1}s2`, `Watch: ${s} key references explained`, 'watch'),
        mkStep(`p${i + 1}s3`, `Watch: build a small ${s} project`, 'watch'),
        mkStep(`p${i + 1}s4`, `Watch: ${title} drills walkthrough`, 'watch'),
      ] : [
        mkStep(`p${i + 1}s1`, `Learn core ${title.toLowerCase()} concepts`, 'watch'),
        mkStep(`p${i + 1}s2`, `Read through key ${s} references`, 'read'),
        mkStep(`p${i + 1}s3`, isSubject ? `Work through a ${s} problem set` : `Build a small ${s} project`, 'build'),
        mkStep(`p${i + 1}s4`, `Practice ${title.toLowerCase()} drills`, 'practice'),
      ],
    })),
    tools: [
      { name: `${s} docs`, purpose: `Official documentation for ${s}`, url: `https://www.google.com/search?q=${encodeURIComponent(s + ' official documentation')}` },
      { name: 'VS Code', purpose: 'A free, widely-used editor', url: 'https://code.visualstudio.com' },
      { name: 'GitHub', purpose: 'Host and share your work', url: 'https://github.com' },
    ],
    experts: [
      { name: `Top ${s} creators`, platform: 'youtube', handle: 'search', url: `https://www.youtube.com/results?search_query=${encodeURIComponent('best ' + s + ' creators')}` },
      { name: `${s} community`, platform: 'website', handle: 'search', url: `https://www.google.com/search?q=${encodeURIComponent('best ' + s + ' experts to follow')}` },
    ],
    unlearn_list: isSubject
      ? [{ habit: 'Jumping straight to past papers without theory', why: 'Skipping fundamentals creates gaps in the exam.' }, { habit: 'Only reading, never solving', why: 'Reading without practice rarely sticks.' }]
      : [{ habit: 'Jumping straight to advanced tutorials', why: 'Skipping fundamentals creates gaps that show up later.' }, { habit: 'Never actually building anything', why: 'Watching without practicing rarely turns into real skill.' }],
    quick_wins: isSubject
      ? [`Finish one full ${s} topic`, `Join a ${s} study group`, `Complete one practice problem set`]
      : [`Finish one full ${s} tutorial`, `Join a ${s} community`, `Build one tiny ${s} project`],
    daily_plan: Array.from({ length: 7 }, (_, i) => ({
      day: i + 1, focus: `${s} — Day ${i + 1} preview`,
      tasks: ['Sign in to generate your real day-by-day plan'],
      time_estimate: `${hoursPerDay}h`,
    })),
    salary_insights: {
      junior: { range: '—', note: 'Sign in to see real estimates' },
      mid: { range: '—', note: 'Sign in to see real estimates' },
      senior: { range: '—', note: 'Sign in to see real estimates' },
    },
    skill_web: { adjacent: [], prerequisites: [] },
    sprint_plan: null,
  };
}

// ─── AI-generated topic note (§4) ──────────────────────────────────────────────
// A single roadmap step is expanded into a genuinely detailed reference note:
// a definition, several sub-aspect sections, highlighted key ideas, and 1-2
// relevant images. The model returns structured JSON; we assemble the final
// rich-HTML package here so the frontend renders a complete, consistent note.

interface TopicNoteAI {
  title?: string;
  definition?: string;
  sections?: { heading?: string; body?: string }[];
  key_points?: string[];
  common_mistake?: string;
  try_this?: string;
  image_queries?: string[];
}

// Keep only the inline formatting tags we allow inside model-authored prose.
function sanitizeInline(s: string): string {
  return (s || '')
    .replace(/<(?!\/?(mark|strong|em|code|b|i)\b)[^>]*>/gi, '')
    .trim();
}

function assembleTopicNote(skill: string, stepTitle: string, ai: TopicNoteAI): string {
  const parts: string[] = [];
  const title = sanitizeInline(ai.title || stepTitle);
  parts.push(`<h3>${title}</h3>`);

  if (ai.definition) {
    parts.push(`<p><strong>Definition:</strong> ${sanitizeInline(ai.definition)}</p>`);
  }

  // Up to 2 relevant images sourced from the model's suggested queries.
  const queries = (ai.image_queries || []).filter(Boolean).slice(0, 2);
  queries.forEach(q => {
    const query = encodeURIComponent(`${skill} ${q}`.slice(0, 70));
    parts.push(
      `<figure>` +
      `<img src="https://source.unsplash.com/featured/800x400?${query}" alt="${sanitizeInline(q)}" />` +
      `<figcaption>${sanitizeInline(q)}</figcaption>` +
      `</figure>`,
    );
  });

  (ai.sections || []).forEach(sec => {
    if (!sec?.heading && !sec?.body) return;
    if (sec.heading) parts.push(`<h4>${sanitizeInline(sec.heading)}</h4>`);
    if (sec.body) parts.push(`<p>${sanitizeInline(sec.body)}</p>`);
  });

  const points = (ai.key_points || []).filter(Boolean);
  if (points.length) {
    parts.push(`<h4>Key points</h4>`);
    parts.push('<ul>' + points.map(p => `<li>${sanitizeInline(p)}</li>`).join('') + '</ul>');
  }

  if (ai.common_mistake) {
    parts.push(`<p><strong>Common mistake:</strong> ${sanitizeInline(ai.common_mistake)}</p>`);
  }
  if (ai.try_this) {
    parts.push(`<blockquote><strong>Try this:</strong> ${sanitizeInline(ai.try_this)}</blockquote>`);
  }

  return parts.join('\n');
}

export async function generateTopicNote(
  skill: string,
  phaseTitle: string,
  stepTitle: string,
  stepNote: string,
  stepType?: string,
): Promise<string> {
  const phase = phaseTitle.replace(/^Phase \d+:\s*/, '');
  const system =
    'You are an expert tutor writing a detailed, accurate study note for a single ' +
    'learning topic. Return ONLY raw valid JSON — no markdown, no backticks, no preamble. ' +
    'Inside string values you may use ONLY these inline HTML tags for emphasis: ' +
    '<mark> (to visually highlight the most important phrases), <strong>, <em>, <code>. ' +
    'Do NOT use any other tags.';

  const prompt = `Write a study note for the topic "${stepTitle}" within the phase "${phase}" of learning "${skill}".${stepNote ? `\nContext for this step: ${stepNote}` : ''}

Requirements:
- Target length: 350-550 words total across all fields.
- definition: a clear 2-3 sentence definition of the topic (not a summary of the note).
- sections: 3-5 sections, each with a short "heading" and a detailed "body" paragraph that covers a specific SUB-ASPECT of the topic (mechanics, why it matters, how it connects, a concrete example) — go beyond a surface summary.
- Within definition and section bodies, wrap the 3-6 MOST important phrases in <mark>…</mark> so the key ideas are visually highlighted.
- key_points: 3-6 concise takeaways.
- common_mistake: one specific beginner mistake and how to avoid it.
- try_this: one small hands-on action the learner can do immediately.
- image_queries: 1-2 short, concrete image search phrases (2-4 words each) for relevant illustrative images${stepType ? ` (topic is a "${stepType}" step)` : ''}.

Return JSON exactly shaped as:
{"title": string, "definition": string, "sections": [{"heading": string, "body": string}], "key_points": [string], "common_mistake": string, "try_this": string, "image_queries": [string]}`;

  const raw = await groqCall(system, prompt, 4000);
  const ai = JSON.parse(raw) as TopicNoteAI;
  return assembleTopicNote(skill, stepTitle, ai);
}

// ─── Step-completion quiz gate ──────────────────────────────────────────────────
// Gates marking a "watch"-type step done: user must score >= QUIZ_PASS_THRESHOLD
// before toggleStep fires (see QuizModal.tsx / TodayTaskRow & StepCard in
// Main.tsx). No transcript access at this point (this fires from a checkbox
// on Today/Roadmap tabs, not from inside the /watch immersive player), so
// questions are generated from the step's own title/note/resource titles —
// specific enough that guessing without having watched the video is
// unreliable, without pretending to be a transcript-accurate comprehension
// check it structurally can't be.

export const QUIZ_PASS_THRESHOLD = 0.75; // 3/4 — one miss tolerated, not 100%

export interface QuizQuestion {
  question: string;
  options: string[];       // always length 4
  correct_index: number;   // 0-3
  explanation: string;     // shown on reveal after submit, right or wrong
}

interface StepQuizAI {
  questions?: {
    question?: string;
    options?: string[];
    correct_answer?: string;   // the literal text of the correct option, not an index
    explanation?: string;
  }[];
}

// Coerces + validates AI output into well-formed QuizQuestion[], dropping any
// malformed entries rather than surfacing a broken question to the user.
//
// Deliberately does NOT trust a model-reported correct_index into its own
// options array. Earlier version asked the model to emit both `options` and
// a `correct_index` pointing into it — LLMs reliably desync the two (the
// array and the index are generated somewhat independently over a JSON
// boundary), which surfaced as "I picked the right answer and it says I'm
// wrong." Instead the model states the correct option as literal text
// (correct_answer), and correct_index is derived here by matching that text
// against the options array — can't drift because it's computed, not
// self-reported.
function sanitizeQuizQuestions(ai: StepQuizAI): QuizQuestion[] {
  return (ai.questions || [])
    .filter(q => q?.question && Array.isArray(q.options) && q.options.length === 4 && !!q.correct_answer)
    .map(q => {
      const options = q.options!.map(o => sanitizeInline(o || ''));
      const correctText = sanitizeInline(q.correct_answer!);
      // Exact match first; falls back to a case-insensitive/trimmed match in
      // case the model repeats the answer with different casing/whitespace
      // than it used inside the options array itself.
      let idx = options.indexOf(correctText);
      if (idx === -1) {
        const norm = (s: string) => s.trim().toLowerCase();
        idx = options.findIndex(o => norm(o) === norm(correctText));
      }
      return idx === -1 ? null : {
        question: sanitizeInline(q.question!),
        options,
        correct_index: idx,
        explanation: sanitizeInline(q.explanation || ''),
      };
    })
    .filter((q): q is QuizQuestion => q !== null);
}

export async function generateStepQuiz(
  skill: string,
  stepTitle: string,
  stepNote: string,
  resourceTitles: string[],
): Promise<QuizQuestion[]> {
  const system =
    'You are an expert tutor writing a short comprehension check for a single learning ' +
    'step. Return ONLY raw valid JSON — no markdown, no backticks, no preamble.';

  const resourceContext = resourceTitles.length
    ? `\nThe resources for this step are titled: ${resourceTitles.map(t => `"${t}"`).join(', ')}.`
    : '';

  const prompt = `Write a 4-question multiple-choice quiz for the learning step "${stepTitle}" within "${skill}".${stepNote ? `\nStep description: ${stepNote}` : ''}${resourceContext}

Requirements:
- Exactly 4 questions, each with exactly 4 options.
- Questions must test SPECIFIC content someone would only know if they actually watched/did this step — concrete facts, terms, or steps mentioned in the step's actual subject matter, not generic trivia about "${skill}" as a whole that could be answered without engaging with this specific step.
- Each question has exactly one correct option. Set "correct_answer" to the EXACT text of that option, copied character-for-character from the "options" array — do not paraphrase or reformat it.
- Also include a short 1-sentence "explanation" shown after answering (say why the correct answer is right).
- Keep language simple and direct.

Return JSON exactly shaped as:
{"questions": [{"question": string, "options": [string, string, string, string], "correct_answer": string, "explanation": string}]}`;

  const raw = await groqCall(system, prompt, 1500);
  const ai = JSON.parse(raw) as StepQuizAI;
  const questions = sanitizeQuizQuestions(ai);

  // If the model returned fewer than 4 valid questions (malformed entries
  // dropped by the sanitizer), the quiz is still usable as long as at least
  // one question survived — pass threshold math (see QuizModal) works against
  // however many questions actually exist, not a hardcoded 4.
  if (questions.length === 0) throw new Error('AI returned no valid quiz questions');
  return questions;
}

// Deliberately easy, deterministic fallback — used only when generateStepQuiz
// fails (AI down/errored). This still gates completion (per product decision:
// a hard gate must not silently become a soft one on AI failure), but the
// questions are trivially answerable from the step's own on-screen title/type
// so a legitimate user is never blocked by broken infrastructure. This is NOT
// a meaningful comprehension check — it exists purely so "must pass" doesn't
// mean "stuck forever" when groq-proxy is unavailable.
export function draftStepQuiz(stepTitle: string, stepType: string): QuizQuestion[] {
  return [
    {
      question: `What step are you completing?`,
      options: [stepTitle, 'A different step', 'None of these', 'Not sure'],
      correct_index: 0,
      explanation: `You're marking "${stepTitle}" as done.`,
    },
    {
      question: `What type of step is this?`,
      options: ['watch', 'read', 'build', 'practice'],
      correct_index: Math.max(0, ['watch', 'read', 'build', 'practice'].indexOf(stepType)),
      explanation: `This step is marked as a "${stepType}" step.`,
    },
  ];
}

// ─── Skill-check quiz (Gap.tsx → SkillCheck.tsx, level 2+ only) ────────────────
//
// Separate system from generateStepQuiz above (that one gates task completion
// mid-roadmap; this one runs once, before generation, to sanity-check the
// self-reported level from Gap.tsx). Two distinct concerns — do not merge.
//
// Two-stage, both multiple-choice (no open-ended grading call — see cost
// discussion): one calibration question pitched at the picked level, then a
// yes/no "have you built real projects with this?" gate. A "yes" answer
// triggers 2-3 harder, scenario-style questions in the employer-interview
// register (why a choice was made, not what a term means) rather than more
// calibration-question difficulty. A "no" answer skips straight to scoring —
// there is no value in interrogating someone who's already told you they
// haven't built anything real yet.

export type SkillCheckLevel = 'intermediate' | 'advanced' | 'expert';

export interface SkillCheckQuestion {
  id: string;
  question: string;
  options: string[];       // always length 4
  correct_index: number;   // 0-3, derived — see sanitizeQuizQuestions note above
  tier: 'calibration' | 'deep';
}

export interface SkillCheckSet {
  calibration: SkillCheckQuestion[];  // 3 questions, not 1 — see generateSkillCheckQuiz
  deep: SkillCheckQuestion[];  // empty until the "built projects?" gate says yes
}

interface SkillCheckAI {
  calibration?: {
    question?: string;
    options?: string[];
    correct_answer?: string;
  }[];
  deep?: {
    question?: string;
    options?: string[];
    correct_answer?: string;
  }[];
}

const SKILL_CHECK_LEVEL_LABEL: Record<SkillCheckLevel, string> = {
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

// Generates BOTH tiers in one call (not two round-trips) — the deep questions
// are only shown to the user if they answer "yes" to project experience, but
// generating them up front avoids a second AI call + loading state sitting
// in the middle of onboarding after that answer. Cost: a few hundred extra
// tokens per generation even for users who end up answering "no" and never
// seeing the deep questions. Cheaper than a second network round-trip and
// the loading-state flash that would come with it.
export async function generateSkillCheckQuiz(
  skill: string,
  level: SkillCheckLevel,
): Promise<SkillCheckSet> {
  const levelLabel = SKILL_CHECK_LEVEL_LABEL[level];

  const system =
    'You are a technical interviewer writing a short skill-verification quiz. ' +
    'Return ONLY raw valid JSON — no markdown, no backticks, no preamble.';

  const prompt = `The learner claims to be at "${levelLabel}" level in "${skill}". Write a two-part verification quiz.

PART 1 — "calibration": THREE multiple-choice questions that someone genuinely at ${levelLabel} level in "${skill}" should be able to answer, but a Complete Beginner could not. Test applied understanding, not term-recall (e.g. "what would happen if you did X" rather than "what does X mean"). Vary what each one probes — don't ask three angles on the same fact.

PART 2 — "deep": THREE multiple-choice questions in the register a hiring manager would ask someone whose portfolio claims real project experience with "${skill}" — the kind of question that exposes whether someone actually built something versus just followed a tutorial. Ask about tradeoffs, "why this over that" decisions, or what breaks/changes in a realistic scenario. Do NOT ask simple definition or terminology questions here — those belong in PART 1, not PART 2.

Requirements for every question:
- Exactly 4 options each.
- Exactly one correct option. Set "correct_answer" to the EXACT text of that option, copied character-for-character from its "options" array.
- Keep language simple and direct — plain wording, no jargon beyond what's inherent to "${skill}" itself.
- Options should be plausible enough that guessing isn't trivial, but only one is actually correct.

Return JSON exactly shaped as:
{"calibration": [{"question": string, "options": [string, string, string, string], "correct_answer": string}, ...3 of these], "deep": [{"question": string, "options": [string, string, string, string], "correct_answer": string}, ...3 of these]}`;

  const raw = await groqCall(system, prompt, 2000);
  const ai = JSON.parse(raw) as SkillCheckAI;
  return sanitizeSkillCheckQuiz(ai);
}

// Same derive-don't-trust pattern as sanitizeQuizQuestions above: the model
// states the correct answer as literal text, and correct_index is computed
// by matching that text against the options array rather than trusting a
// self-reported index. See sanitizeQuizQuestions for why.
function sanitizeSkillCheckQuiz(ai: SkillCheckAI): SkillCheckSet {
  const toQuestion = (
    q: { question?: string; options?: string[]; correct_answer?: string } | undefined,
    idPrefix: string,
    tier: 'calibration' | 'deep',
  ): SkillCheckQuestion | null => {
    if (!q?.question || !Array.isArray(q.options) || q.options.length !== 4 || !q.correct_answer) return null;
    const options = q.options.map(o => sanitizeInline(o || ''));
    const correctText = sanitizeInline(q.correct_answer);
    let idx = options.indexOf(correctText);
    if (idx === -1) {
      const norm = (s: string) => s.trim().toLowerCase();
      idx = options.findIndex(o => norm(o) === norm(correctText));
    }
    if (idx === -1) return null;
    return { id: idPrefix, question: sanitizeInline(q.question), options, correct_index: idx, tier };
  };

  const calibration = (ai.calibration || [])
    .map((q, i) => toQuestion(q, `sc_calibration_${i + 1}`, 'calibration'))
    .filter((q): q is SkillCheckQuestion => q !== null);
  const deep = (ai.deep || [])
    .map((q, i) => toQuestion(q, `sc_deep_${i + 1}`, 'deep'))
    .filter((q): q is SkillCheckQuestion => q !== null);

  // Same degrade-not-discard reasoning as deep: a partially malformed
  // response (e.g. 2 of 3 calibration questions usable) still gives
  // SkillCheck.tsx something real to score against. Only a completely empty
  // calibration set is fatal — there's nothing left to show or score.
  if (calibration.length === 0) throw new Error('AI returned no valid calibration questions');
  return { calibration, deep };
}

// Fallback used only when generateSkillCheckQuiz fails outright (AI down/
// errored) — same reasoning as draftStepQuiz: never let broken infra block
// onboarding. This does NOT gate anything hard the way the step quiz does,
// so an easy, obviously-answerable fallback is fine here — worst case a
// user's level goes unadjusted for one session, not "stuck forever."
export function draftSkillCheckQuiz(skill: string): SkillCheckSet {
  return {
    calibration: [
      {
        id: 'sc_calibration_1',
        question: `Which of these is a real part of learning "${skill}"?`,
        options: ['Practicing regularly', 'Ignoring all resources', 'Never reviewing mistakes', 'Avoiding real projects'],
        correct_index: 0,
        tier: 'calibration',
      },
      {
        id: 'sc_calibration_2',
        question: `When you get stuck on "${skill}", what's the most useful first step?`,
        options: ['Break the problem into smaller pieces', 'Give up immediately', 'Guess randomly and move on', 'Avoid the topic entirely'],
        correct_index: 0,
        tier: 'calibration',
      },
      {
        id: 'sc_calibration_3',
        question: `Which habit best supports actually getting good at "${skill}"?`,
        options: ['Applying it to real, hands-on work', 'Only reading about it', 'Memorizing definitions once', 'Skipping feedback on mistakes'],
        correct_index: 0,
        tier: 'calibration',
      },
    ],
    deep: [],
  };
}
