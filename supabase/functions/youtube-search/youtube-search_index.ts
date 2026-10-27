// Real YouTube video lookup for roadmap "Watch Video" resources.
// generateRoadmap.ts's URL POLICY only ever produces a YouTube SEARCH RESULTS link for video
// resources — the AI has no way to name a real, specific, currently-valid video ID (same
// reasoning as resource-link: a model can't verify a video actually exists). This function
// does the real lookup via YouTube's own Search API and returns a real video ID, so "Watch
// Video" opens an actual video instead of a search page.
//
// Deploy: supabase functions deploy youtube-search
// Reuses the YOUTUBE_API_KEY secret already configured for video-analyze — no new signup.
//
// DURATION LADDER (added — this function used to return the single top relevance result with
// no length awareness at all):
// search.list's `snippet` part never includes duration — YouTube only exposes that via a
// separate videos.list?part=contentDetails call. So this now runs TWO API calls per lookup
// instead of one: search.list for a POOL of candidates (was maxResults=1, now 5), then one
// videos.list call for all 5 IDs at once to get contentDetails.duration for the whole pool in
// a single request (not 5 separate calls). Preference order: first candidate <=120s wins,
// else first candidate <=180s wins, else the #1 relevance result is returned anyway,
// uncapped — matches the product call that some video is always better than showing nothing,
// and 3 minutes is the acknowledged real-world fallback ceiling, not a hard limit.
//
// COST — real, not hypothetical:
// search.list is still 100 quota units, unchanged (same 10,000/day allowance as before).
// videos.list is ~1-7 units depending on parts requested; here it's a single call for up to 5
// IDs at once (part=contentDetails only), so it's a small, roughly-fixed add-on per lookup,
// not 5x anything — worth knowing, not worth worrying about at normal usage.
// LATENCY — this is the one that actually matters: every lookup is now two sequential network
// calls (must have IDs before durations can be requested), where it used to be one. Expect
// noticeably slower resolves across the board, and two places (not one) where a timeout or
// YouTube error can now surface.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const YOUTUBE_SEARCH_API = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEOS_API = "https://www.googleapis.com/youtube/v3/videos";
const FETCH_TIMEOUT_MS = 8_000;

// Fallback ladder, in seconds. Checked in order — first threshold that has a
// matching candidate wins. If nothing in the pool matches EITHER rung, the
// original #1 relevance result is returned regardless of length (see PICK
// step below) rather than returning nothing.
const DURATION_RUNGS_SECONDS = [120, 180];

// Parses YouTube's ISO 8601 duration format (e.g. "PT1M45S", "PT2H", "PT45S")
// into whole seconds. Returns null for anything unparseable rather than
// guessing — a null duration is treated as "unknown length" by the caller,
// not as 0 seconds, which would wrongly make it win every rung.
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

// Same quota-vs-misconfiguration distinction already made in video-analyze's metadata fetch —
// a 403 quotaExceeded is a very different, non-actionable situation from a bad key, and
// deserves a different message so nobody goes hunting for a broken key that's actually fine.
// Shared between the search.list and videos.list error paths below rather than duplicated.
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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string" || !query.trim()) {
      return json({ error: "Missing search query" }, 400);
    }

    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    if (!apiKey) return json({ error: "Server misconfigured: YOUTUBE_API_KEY missing" }, 500);

    // order=relevance (YouTube's own blended ranking) rather than order=viewCount — biases
    // toward videos that actually match the topic, not just whatever's most-viewed overall
    // (a viral-but-tangential result would win under raw view count). Swap to "viewCount"
    // here if raw popularity should win instead — one-line change.
    //
    // maxResults raised from 1 to 5: a duration filter needs a POOL to choose from — asking
    // for exactly 1 result meant there was never anything to fall back to if that single
    // result was too long. Relevance ordering is preserved, so candidate[0] is still "the"
    // top match; we're just allowed to skip past it now if it fails both duration rungs and
    // something further down the relevance list doesn't.
    const searchParams = new URLSearchParams({
      part: "snippet",
      q: query.trim(),
      type: "video",
      maxResults: "5",
      order: "relevance",
      safeSearch: "moderate",
      key: apiKey,
    });

    let searchRes: Response;
    try {
      searchRes = await fetchWithTimeout(`${YOUTUBE_SEARCH_API}?${searchParams.toString()}`);
    } catch {
      return json({ error: "Could not reach YouTube. Try again." }, 502);
    }

    if (!searchRes.ok) {
      const { message, status } = await classifyYouTubeError(searchRes);
      return json({ error: message }, status);
    }

    const searchData = await searchRes.json();
    const items: any[] = Array.isArray(searchData?.items) ? searchData.items : [];
    // Relevance order preserved from the API response — candidates[0] is the original
    // single result this function used to return unconditionally.
    const candidates = items
      .map((item) => ({ videoId: item?.id?.videoId as string | undefined, title: item?.snippet?.title as string | undefined }))
      .filter((c): c is { videoId: string; title: string | undefined } => !!c.videoId);

    if (candidates.length === 0) return json({ error: "No real video found for this topic." }, 404);

    // Single videos.list call for every candidate ID at once — NOT one call per candidate.
    // part=contentDetails only (no snippet/statistics) keeps this call as cheap as possible
    // since title is already in hand from the search step.
    const idsParam = candidates.map((c) => c.videoId).join(",");
    const videosParams = new URLSearchParams({
      part: "contentDetails",
      id: idsParam,
      key: apiKey,
    });

    let videosRes: Response;
    try {
      videosRes = await fetchWithTimeout(`${YOUTUBE_VIDEOS_API}?${videosParams.toString()}`);
    } catch {
      // Duration lookup failing shouldn't sink the whole request — the search step already
      // succeeded and candidates[0] is a perfectly valid result, just with unknown length.
      // Fall through to the no-duration-data path below rather than erroring out entirely.
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
    // If videosRes wasn't ok (real error OR the fetch-failure fallback above), durationById
    // stays empty — every candidate below resolves to duration `null` ("unknown"), and the
    // PICK step's rung checks simply never match, landing on the final fallback
    // (candidates[0], uncapped) exactly as if no duration data had ever been requested.

    // PICK: walk the rungs in order, first candidate (in original relevance order) at or
    // under a rung's threshold wins that rung. If nothing matches ANY rung, fall back to
    // candidates[0] regardless of its length (or unknown length) — "some video" beats
    // "no video" per the product call, and top relevance is the least-arbitrary choice
    // available at that point.
    let chosen = candidates[0];
    outer: for (const rung of DURATION_RUNGS_SECONDS) {
      for (const c of candidates) {
        const secs = durationById.get(c.videoId);
        if (secs != null && secs <= rung) {
          chosen = c;
          break outer;
        }
      }
    }

    return json({
      url: `https://www.youtube.com/watch?v=${chosen.videoId}`,
      title: chosen.title ?? query.trim(),
    });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
