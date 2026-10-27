// supabase/functions/video-analyze/transcript.ts
//
// Layered fallback for transcript extraction. Never throws — always
// returns a result, so the caller can build a degraded analysis instead
// of failing the whole /watch flow.
//
// READ THIS BEFORE EDITING:
//
// 1. If "primary" below is an unofficial YouTube caption scraper, IP-based
//    blocking from YouTube is the most likely cause of intermittent
//    failures — Supabase edge functions egress from cloud infra, which is
//    exactly the IP range YouTube blocks hardest. A "transcript disabled"
//    -shaped error can actually mean "this request got blocked," not
//    "this video has no captions" — so classify() below does NOT treat
//    that as a hard permanent stop. Retrying the SAME provider from the
//    SAME egress IP will not fix an IP block; only a different provider
//    (different infra / a proxy) will.
//
// 2. This step shares a wall-clock budget with chapter + quiz generation
//    in the same function invocation. Supabase kills the function at 60s
//    (same limit that produced the groq-proxy 546s). TOTAL_BUDGET_MS below
//    is this step's slice — leave room for what runs after it.

import { createClient } from 'jsr:@supabase/supabase-js@2';

export interface TranscriptResult {
  transcript: string | null;
  source: string | null;
  degraded: boolean;
  reason?: 'cache_hit' | 'budget_exhausted' | 'all_providers_failed';
}

type ErrorClass = 'transient' | 'quota' | 'blocked_or_missing';

interface ClassifiedError {
  errorClass?: ErrorClass;
  status?: number;
  name?: string;
}

interface Provider {
  name: string;
  fetch: (videoId: string, signal: AbortSignal) => Promise<string>;
}

// Tune against the function's overall 60s wall-clock limit.
const TOTAL_BUDGET_MS = 18_000;
const PER_ATTEMPT_MS = 6_000;

function classify(err: unknown): ErrorClass {
  const e = (err ?? {}) as ClassifiedError;
  if (e.errorClass) return e.errorClass;
  if (e.name === 'AbortError') return 'transient';
  if (e.status === 429 || e.status === 402) return 'quota';
  if (e.status !== undefined && e.status >= 500) return 'transient';
  // 404 / "disabled" / "blocked" style errors — could be a genuinely
  // missing transcript OR an IP block wearing a disguise. Either way,
  // the right move is "try the next provider," not "retry this one."
  return 'blocked_or_missing';
}

async function withTimeout<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  ms: number,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fn(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * PROVIDERS — ordered cheapest/fastest first. Add a real second entry
 * once you have one. Until then, leave this as a single-item list — the
 * budget + cache + graceful-degrade logic below still earns its keep
 * with just one provider, because it's what stops a single flaky call
 * from taking down the whole /generating request.
 */
const providers: Provider[] = [
  {
    name: 'primary',
    fetch: async (_videoId: string, _signal: AbortSignal): Promise<string> => {
      // Your current transcript call goes here. Throw on failure.
      // Attach `.errorClass` directly on the thrown error if you can
      // determine it from a known exception type (e.g. your library's
      // own TranscriptsDisabled / IpBlocked classes) — otherwise
      // classify() will infer from `.status` / `.name`.
      throw new Error('not implemented');
    },
  },
  // { name: 'secondary', fetch: async (videoId, signal) => { ... } },
];

async function getCached(
  supabase: ReturnType<typeof createClient>,
  videoId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from('video_transcripts')
    .select('transcript')
    .eq('video_id', videoId)
    .maybeSingle();
  return data?.transcript ?? null;
}

async function setCached(
  supabase: ReturnType<typeof createClient>,
  videoId: string,
  transcript: string,
  source: string,
): Promise<void> {
  // Best-effort — a cache write failure shouldn't fail the request.
  try {
    await supabase.from('video_transcripts').upsert({
      video_id: videoId,
      transcript,
      source,
      created_at: new Date().toISOString(),
    });
  } catch {
    // swallow — caching is a nice-to-have, not a dependency
  }
}

export async function fetchTranscriptWithFallback(
  supabase: ReturnType<typeof createClient>,
  videoId: string,
): Promise<TranscriptResult> {
  const cached = await getCached(supabase, videoId);
  if (cached) {
    return { transcript: cached, source: 'cache', degraded: false, reason: 'cache_hit' };
  }

  const deadline = Date.now() + TOTAL_BUDGET_MS;

  for (const provider of providers) {
    const remaining = deadline - Date.now();
    if (remaining < 1_000) {
      return { transcript: null, source: null, degraded: true, reason: 'budget_exhausted' };
    }

    const attemptMs = Math.min(PER_ATTEMPT_MS, remaining);

    try {
      const transcript = await withTimeout(
        (signal) => provider.fetch(videoId, signal),
        attemptMs,
      );
      if (transcript?.trim()) {
        await setCached(supabase, videoId, transcript, provider.name);
        return { transcript, source: provider.name, degraded: false };
      }
      // empty result — treat like a miss, fall through to next provider
    } catch (err) {
      const kind = classify(err);

      // Only retry the SAME provider for genuinely transient errors, and
      // only once — this is a network blip, not an IP-reputation problem,
      // so a fast retry is worth the time.
      if (kind === 'transient' && deadline - Date.now() > PER_ATTEMPT_MS) {
        try {
          const retryMs = Math.min(PER_ATTEMPT_MS, deadline - Date.now());
          const transcript = await withTimeout(
            (signal) => provider.fetch(videoId, signal),
            retryMs,
          );
          if (transcript?.trim()) {
            await setCached(supabase, videoId, transcript, provider.name);
            return { transcript, source: provider.name, degraded: false };
          }
        } catch {
          // fall through to next provider
        }
      }
      // quota or blocked_or_missing → don't waste budget retrying the same
      // call path, go straight to the next provider
    }
  }

  return { transcript: null, source: null, degraded: true, reason: 'all_providers_failed' };
}
