// New, standalone edge function for the Inspire feed's video source.
//
// DELIBERATELY SEPARATE from youtube-search (which stays untouched) —
// see conversation history: the PREVIOUS attempt at feed-shaped YouTube
// search (youtube-shorts-search) caused four rounds of production 502s
// and was deleted, root cause never fully confirmed. youtube-search
// (singular-result mode, used by ResourceActions + Tier 3 fallback) is
// currently working and depended on across the live app — this function
// intentionally does NOT touch it, to avoid any chance of regressing a
// proven, load-bearing path while iterating on the feed's new needs.
//
// Reuses the same hardened patterns youtube-search already established
// (and which were almost certainly absent from the version that 502'd):
//   - explicit AbortController timeout on every fetch
//   - ONE batched videos.list call for ALL candidate durations, not N
//     separate calls (the N+1 pattern is a strong suspect for both the
//     quota burn AND the timeout-driven 502s in the deleted function)
//   - explicit res.ok checks before ever parsing a body — a 403
//     quotaExceeded response has a totally different shape than a 200,
//     and treating it as one silently is exactly the kind of bug that
//     throws deep in the code and surfaces as an opaque 502 to the caller
//   - never lets one query's failure sink the whole request
//
// Deploy: supabase functions deploy youtube-feed-search
// Reuses the existing YOUTUBE_API_KEY secret — no new signup needed.
//
// CALLER CONTRACT:
//   POST body: { query: string, maxResults?: number, pageToken?: string }
//   Response:  { results: { videoId, title, channel, durationSeconds }[], nextPageToken: string | null }
//   pageToken is YouTube's own opaque search.list cursor — round-tripped
//   as-is, never parsed or constructed here. Pass the previous response's
//   nextPageToken back in to get the next page of the SAME query; omit it
//   (or pass undefined) for the first page. nextPageToken comes back null
//   once YouTube has no further pages — caller should treat that skill's
//   query as exhausted and stop requesting more pages for it.
//   NOTE: duration/window filtering is applied PER PAGE, not across pages —
//   a page that's mostly out-of-window videos can legitimately return few
//   or zero results even with nextPageToken still non-null. That's expected
//   given YouTube's search order isn't duration-aware; caller should keep
//   paging on a thin page rather than treating it as exhaustion.
//   On total failure: { results: [], nextPageToken: null } with a 200 —
//   NEVER a hard error for "found nothing," since the caller
//   (buildShortsFeed) should treat an empty pool as "try the next tier,"
//   not as an exception to catch.
//   Genuine failures (missing query, missing API key) still return
//   proper 4xx/5xx — only "legitimately found zero matching videos"
//   collapses to results: [].

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const YOUTUBE_SEARCH_API = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEOS_API = "https://www.googleapis.com/youtube/v3/videos";
const FETCH_TIMEOUT_MS = 8_000;

// Feed's constraint is 1-3 minutes (widened from the original 2-3 minute
// window — narrower band was starving supply on several queries), tighter
// and more literal than youtube-search's fallback ladder (which treats
// 3min as an "acceptable ceiling," not a target). Here: prefer 60-180s,
// but if a query has zero candidates in that window, fall back to the
// single shortest available candidate rather than returning nothing —
// "some video" still beats "no video," same product principle
// youtube-search already established, just applied to a range instead of
// a single ceiling.
const FEED_MIN_SECONDS = 60;
const FEED_MAX_SECONDS = 180;

const DEFAULT_MAX_RESULTS = 8;
const SEARCH_POOL_SIZE = 15; // ask YouTube for more than we need, since duration filtering will eliminate some

function parseIso8601DurationToSeconds(iso: string | undefined | null): number | null {
  if (!iso) return null;
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return null;
  const hours = parseInt(m[1] ?? "0", 10);
  const minutes = parseInt(m[2] ?? "0", 10);
  const seconds = parseInt(m[3] ?? "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function classifyYouTubeError(res: Response): Promise<{ message: string; status: number }> {
  if (res.status === 403) {
    const errBody = (await res.json().catch(() => null)) as any;
    const reason = errBody?.error?.errors?.[0]?.reason;
    if (reason === "quotaExceeded") {
      return {
        message: "YouTube's daily search limit has been hit. This resets automatically — try again later.",
        status: 503,
      };
    }
  }
  return { message: `YouTube API error (${res.status}).`, status: 502 };
}

interface Candidate {
  videoId: string;
  title: string;
  channel: string | null;
  durationSeconds: number | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

  try {
    const body = await req.json().catch(() => ({}));
    const query = typeof body?.query === "string" ? body.query.trim() : "";
    const maxResults = typeof body?.maxResults === "number" && body.maxResults > 0
      ? Math.min(body.maxResults, SEARCH_POOL_SIZE)
      : DEFAULT_MAX_RESULTS;
    // Optional — round-tripped from a previous response's nextPageToken.
    // Absent/undefined means "first page," matching search.list's own
    // convention of omitting pageToken entirely for page 1.
    const pageToken = typeof body?.pageToken === "string" && body.pageToken ? body.pageToken : undefined;

    if (!query) return json({ error: "Missing search query" }, 400);

    const apiKey = Deno.env.get('YOUTUBE_API_KEY');
    if (!apiKey) return json({ error: "Server misconfigured: YOUTUBE_API_KEY missing" }, 500);

    const searchParams = new URLSearchParams({
      part: "snippet",
      q: query,
      type: "video",
      maxResults: String(SEARCH_POOL_SIZE),
      order: "relevance",
      safeSearch: "moderate", // NOTE: YouTube's API is case-sensitive here — this MUST match one of "none"/"moderate"/"strict" exactly as YouTube expects it server-side.
      key: apiKey,
    });
    if (pageToken) searchParams.set("pageToken", pageToken);

    let searchRes: Response;
    try {
      searchRes = await fetchWithTimeout(`${YOUTUBE_SEARCH_API}?${searchParams.toString()}`);
    } catch {
      // Network/timeout failure on the search step itself — nothing to
      // fall back to, this genuinely is an error, not an empty result.
      return json({ error: "Could not reach YouTube. Try again." }, 502);
    }

    if (!searchRes.ok) {
      const { message, status } = await classifyYouTubeError(searchRes);
      return json({ error: message }, status);
    }

    const searchData = await searchRes.json();
    const nextPageToken: string | null = typeof searchData?.nextPageToken === "string" ? searchData.nextPageToken : null;
    const items: any[] = Array.isArray(searchData?.items) ? searchData.items : [];
    const pool = items
      .map((item) => ({
        videoId: item?.id?.videoId as string | undefined,
        title: (item?.snippet?.title as string | undefined) ?? query,
        channel: (item?.snippet?.channelTitle as string | undefined) ?? null,
      }))
      .filter((c): c is { videoId: string; title: string; channel: string | null } => !!c.videoId);

    // Legitimately found nothing for this query — not an error, just an
    // empty pool. Caller moves on to whatever tier comes next. Still passes
    // through nextPageToken: YouTube's search order isn't duration-aware, so
    // a page with zero in-window results doesn't mean the query is
    // exhausted — the next page may have plenty. Only a null
    // nextPageToken means "truly no more pages."
    if (pool.length === 0) return json({ results: [], nextPageToken });

    // Single batched call for every candidate's duration, exactly like
    // youtube-search's pattern — this is the part most likely to have
    // been the N+1 culprit in the deleted function if it wasn't done
    // this way originally.
    const idsParam = pool.map((c) => c.videoId).join(",");
    const videosParams = new URLSearchParams({
      part: "contentDetails",
      id: idsParam,
      key: apiKey,
    });

    let videosRes: Response;
    try {
      videosRes = await fetchWithTimeout(`${YOUTUBE_VIDEOS_API}?${videosParams.toString()}`);
    } catch {
      // Duration lookup failing shouldn't sink the whole request — fall
      // through with unknown durations for everything, same principle
      // as youtube-search.
      videosRes = new Response(null, { status: 599 });
    }

    let durationById = new Map<string, number | null>();
    if (videosRes.ok) {
      const videosData = await videosRes.json();
      const detailItems: any[] = Array.isArray(videosData?.items) ? videosData.items : [];
      durationById = new Map(
        detailItems.map((d) => [d.id as string, parseIso8601DurationToSeconds(d?.contentDetails?.duration)]),
      );
    }

    const candidates: Candidate[] = pool.map((c) => ({
      ...c,
      durationSeconds: durationById.get(c.videoId) ?? null,
    }));

    // Preferred: candidates strictly inside the 1-3 min window, in
    // original relevance order.
    const inWindow = candidates.filter(
      (c) => c.durationSeconds != null && c.durationSeconds >= FEED_MIN_SECONDS && c.durationSeconds <= FEED_MAX_SECONDS,
    );

    let selected: Candidate[];
    if (inWindow.length > 0) {
      selected = inWindow.slice(0, maxResults);
    } else {
      // Nothing in-window for this query. Fall back to whichever
      // candidates have a KNOWN duration, closest to the window, rather
      // than silently including unknown-length videos ahead of ones we
      // can actually verify. Unknown-duration candidates go last, only
      // used to pad out if everything else runs dry.
      const known = candidates.filter((c) => c.durationSeconds != null);
      const unknown = candidates.filter((c) => c.durationSeconds == null);
      known.sort((a, b) => {
        const da = Math.min(Math.abs(a.durationSeconds! - FEED_MIN_SECONDS), Math.abs(a.durationSeconds! - FEED_MAX_SECONDS));
        const db = Math.min(Math.abs(b.durationSeconds! - FEED_MIN_SECONDS), Math.abs(b.durationSeconds! - FEED_MAX_SECONDS));
        return da - db;
      });
      selected = [...known, ...unknown].slice(0, maxResults);
    }

    return json({
      results: selected.map((c) => ({
        videoId: c.videoId,
        title: c.title,
        channel: c.channel,
        durationSeconds: c.durationSeconds,
      })),
      nextPageToken,
    });
  } catch (e) {
    // Last-resort guard — should be unreachable given the checks above,
    // but an unhandled throw here is exactly what produces an opaque 502
    // instead of a debuggable error body. Never let that happen silently.
    return json({ error: String(e) }, 500);
  }
});
