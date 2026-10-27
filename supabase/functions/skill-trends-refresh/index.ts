// supabase/functions/skill-trends-refresh/index.ts
//
// Weekly cron job (triggered via pg_cron, see setup notes at bottom of
// this file). Reads every row in skill_registry, queries Adzuna, GitHub,
// and YouTube for each (skipping any source whose query field is null
// for that skill), computes a blended trend_score, and upserts into
// skill_trends.
//
// ARCHITECTURE RULE (do not violate): this function is the ONLY place
// in the whole app that calls Adzuna/GitHub/YouTube for trend data. The
// Crossover screen and every other client-facing code path reads only
// from the skill_trends table, never these APIs directly. This keeps
// the user-facing screen fast and removes external-API failure modes
// from the render path entirely.
//
// Mirrors groq-proxy's hardening pattern: hard wall-clock budget so we
// never get killed mid-run by Supabase's own timeout, and per-skill
// error isolation so one bad API response doesn't blank the whole table.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ── Budget constants (same pattern as groq-proxy's TOTAL_BUDGET_MS) ───────
const TOTAL_BUDGET_MS = 50_000;       // hard wall before Supabase's ~60s kill limit
const PER_FETCH_MS = 8_000;           // AbortController timeout per individual API call
const startTime = Date.now();

function timeRemaining(): number {
  return TOTAL_BUDGET_MS - (Date.now() - startTime);
}

function budgetExceeded(): boolean {
  return timeRemaining() <= 0;
}

// ── Fetch with timeout, never throws — returns null on any failure ───────
async function safeFetch(url: string, opts: RequestInit = {}): Promise<any | null> {
  const controller = new AbortController();
  const timeoutMs = Math.max(1000, Math.min(PER_FETCH_MS, timeRemaining()));
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    if (!res.ok) {
      console.error(`fetch failed ${res.status} for ${url}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`fetch error for ${url}:`, err instanceof Error ? err.message : err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ── Source: Adzuna (job demand) ────────────────────────────────────────
// Adzuna has no single "worldwide" endpoint — each country is a separate
// call. We query a small fixed set of major markets and sum counts,
// rather than all ~20 countries Adzuna supports, to stay inside the time
// budget. This is a real, deliberate coverage tradeoff, not an oversight.
const ADZUNA_COUNTRIES = ['us', 'gb', 'ca', 'au', 'in'];

async function getAdzunaCount(query: string, appId: string, appKey: string): Promise<number | null> {
  let total = 0;
  let anySucceeded = false;
  for (const country of ADZUNA_COUNTRIES) {
    if (budgetExceeded()) break;
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1` +
      `?app_id=${appId}&app_key=${appKey}` +
      `&what=${encodeURIComponent(query)}` +
      `&results_per_page=1`;
    const data = await safeFetch(url);
    if (data && typeof data.count === 'number') {
      total += data.count;
      anySucceeded = true;
    }
  }
  return anySucceeded ? total : null;
}

// ── Source: GitHub (developer activity) ────────────────────────────────
// Counts repos matching a topic, created in the last 7 days — a proxy
// for "how much new activity is happening around this skill right now,"
// not total historical repo count (which would barely move week to week
// for a mature topic like "react").
async function getGithubCount(topics: string[], token?: string): Promise<number | null> {
  if (!topics || topics.length === 0) return null;
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const topicQuery = topics.map(t => `topic:${t}`).join('+');
  const url = `https://api.github.com/search/repositories?q=${topicQuery}+created:>${since}&per_page=1`;
  const headers: Record<string, string> = { 'Accept': 'application/vnd.github+json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const data = await safeFetch(url, { headers });
  return data && typeof data.total_count === 'number' ? data.total_count : null;
}

// ── Source: YouTube (learning interest) ────────────────────────────────
// Counts tutorial-style videos published in the last 7 days. NOTE: this
// costs 100 quota units per call (search.list), and the default daily
// quota is 10,000 units — i.e. ~100 calls/day TOTAL, shared with
// whatever Watch.tsx already uses. With 50 skills, a full weekly run
// alone costs 5,000 units. This is the tightest constraint in the whole
// pipeline — see the coverage note at the bottom of this file.
async function getYoutubeCount(query: string, apiKey: string): Promise<number | null> {
  const publishedAfter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const url = `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet&type=video` +
    `&q=${encodeURIComponent(query)}` +
    `&publishedAfter=${publishedAfter}` +
    `&maxResults=1` +
    `&key=${apiKey}`;
  const data = await safeFetch(url);
  return data?.pageInfo?.totalResults ?? null;
}

// ── Percentage change helper ───────────────────────────────────────────
// Returns null (not 0) when we can't honestly compute a change — either
// this is the first run (no previous value) or the source was skipped
// for this skill. Null propagates through to "not counted in blend"
// rather than silently scoring as "0% change" (which would be a lie —
// we don't know, we're not saying it's flat).
function pctChange(current: number | null, previous: number | null): number | null {
  if (current == null || previous == null) return null;
  if (previous === 0) return current > 0 ? 100 : null; // avoid divide-by-zero; treat any new activity from 0 as +100%
  return ((current - previous) / previous) * 100;
}

// ── Blended score ───────────────────────────────────────────────────────
// Weights only apply across whichever sources actually produced a
// number for this skill — a skill with only YouTube data gets a score
// based purely on YouTube, not YouTube-diluted-by-two-missing-zeros.
// This was flagged explicitly to David: never let a missing source
// silently drag a score toward 0.
function blendScore(demandPct: number | null, devPct: number | null, interestPct: number | null): number {
  const weighted: { value: number; weight: number }[] = [];
  if (demandPct != null) weighted.push({ value: demandPct, weight: 0.5 });
  if (devPct != null) weighted.push({ value: devPct, weight: 0.3 });
  if (interestPct != null) weighted.push({ value: interestPct, weight: 0.2 });

  if (weighted.length === 0) return 0;

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  const raw = weighted.reduce((sum, w) => sum + w.value * (w.weight / totalWeight), 0);

  // Clamp into a 0-100 display range. Raw pct-change can be negative
  // (declining) or wildly large (a niche skill going from 2 postings to
  // 20 is +900%) — clamp rather than let outliers dominate sort order.
  return Math.max(0, Math.min(100, 50 + raw)); // 50 = "flat/no change" baseline
}

// ── Main handler ────────────────────────────────────────────────────────
Deno.serve(async (_req: Request) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const adzunaAppId = Deno.env.get('ADZUNA_APP_ID')!;
  const adzunaAppKey = Deno.env.get('ADZUNA_APP_KEY')!;
  const githubToken = Deno.env.get('GITHUB_TOKEN'); // optional — works unauthenticated at lower rate limit
  const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY')!;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: skills, error: fetchErr } = await supabase
    .from('skill_registry')
    .select('canonical_key, adzuna_query, github_topics, youtube_query');

  if (fetchErr || !skills) {
    return new Response(JSON.stringify({ error: 'failed to load skill_registry', detail: fetchErr }), { status: 500 });
  }

  const results: { canonical_key: string; status: 'ok' | 'skipped_budget' | 'error' }[] = [];

  for (const skill of skills) {
    if (budgetExceeded()) {
      results.push({ canonical_key: skill.canonical_key, status: 'skipped_budget' });
      continue;
    }

    try {
      // Load previous counts for delta calculation (null-safe — first
      // run for any skill will have no prior row).
      const { data: prev } = await supabase
        .from('skill_trends')
        .select('adzuna_count, github_count, youtube_count')
        .eq('canonical_key', skill.canonical_key)
        .maybeSingle();

      const [adzunaCount, githubCount, youtubeCount] = await Promise.all([
        skill.adzuna_query ? getAdzunaCount(skill.adzuna_query, adzunaAppId, adzunaAppKey) : Promise.resolve(null),
        skill.github_topics?.length ? getGithubCount(skill.github_topics, githubToken) : Promise.resolve(null),
        skill.youtube_query ? getYoutubeCount(skill.youtube_query, youtubeApiKey) : Promise.resolve(null),
      ]);

      const demandPct = pctChange(adzunaCount, prev?.adzuna_count ?? null);
      const devPct = pctChange(githubCount, prev?.github_count ?? null);
      const interestPct = pctChange(youtubeCount, prev?.youtube_count ?? null);

      const sourcesUsed: string[] = [];
      if (adzunaCount != null) sourcesUsed.push('adzuna');
      if (githubCount != null) sourcesUsed.push('github');
      if (youtubeCount != null) sourcesUsed.push('youtube');

      const trendScore = blendScore(demandPct, devPct, interestPct);

      const { error: upsertErr } = await supabase.from('skill_trends').upsert({
        canonical_key: skill.canonical_key,
        adzuna_count: adzunaCount,
        adzuna_count_prev: prev?.adzuna_count ?? null,
        github_count: githubCount,
        github_count_prev: prev?.github_count ?? null,
        youtube_count: youtubeCount,
        youtube_count_prev: prev?.youtube_count ?? null,
        demand_change_pct: demandPct,
        dev_change_pct: devPct,
        interest_change_pct: interestPct,
        trend_score: trendScore,
        sources_used: sourcesUsed,
        computed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      results.push({ canonical_key: skill.canonical_key, status: upsertErr ? 'error' : 'ok' });
      if (upsertErr) console.error(`upsert failed for ${skill.canonical_key}:`, upsertErr);
    } catch (err) {
      console.error(`unhandled error scoring ${skill.canonical_key}:`, err);
      results.push({ canonical_key: skill.canonical_key, status: 'error' });
    }
  }

  return new Response(JSON.stringify({
    total: skills.length,
    ok: results.filter(r => r.status === 'ok').length,
    skipped_budget: results.filter(r => r.status === 'skipped_budget').length,
    errors: results.filter(r => r.status === 'error').length,
    elapsed_ms: Date.now() - startTime,
  }), { headers: { 'Content-Type': 'application/json' } });
});

// ─────────────────────────────────────────────────────────────────────────
// SETUP NOTES (do these manually, not part of this file's execution):
//
// 1. Deploy this function:
//      supabase functions deploy skill-trends-refresh
//
// 2. Set required secrets (ADZUNA_APP_ID / ADZUNA_APP_KEY already set
//    per earlier conversation — these two are new):
//      supabase secrets set YOUTUBE_API_KEY=<your existing youtube key>
//      supabase secrets set GITHUB_TOKEN=<optional, raises rate limit from 60/hr to 5000/hr>
//
//    SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected by
//    Supabase into every Edge Function — you don't set these yourself.
//
// 3. Schedule via pg_cron (run this SQL once, in the SQL editor):
//
//      select cron.schedule(
//        'skill-trends-weekly',
//        '0 3 * * 1',  -- Monday 03:00 UTC, adjust as you like
//        $$
//        select net.http_post(
//          url := 'https://<your-project-ref>.supabase.co/functions/v1/skill-trends-refresh',
//          headers := jsonb_build_object('Authorization', 'Bearer <service-role-key>')
//        );
//        $$
//      );
//
//    Requires the pg_cron and pg_net extensions enabled on your project
//    (Database → Extensions in the dashboard, if not already on).
//
// 4. KNOWN COVERAGE LIMIT — read before assuming this "just works" at
//    full scale: YouTube's search.list costs 100 quota units per call,
//    default daily quota is 10,000 units. A full run across 50 skills
//    costs 5,000 units in one shot. If Watch.tsx's existing YouTube
//    usage shares this same quota (it does — same Google Cloud project
//    unless you provisioned a separate key), a single weekly trends run
//    could meaningfully eat into the daily budget the rest of the app
//    needs that same day. Two real options if this becomes a problem:
//      a) Request a quota increase from Google (real process, not
//         instant, not guaranteed).
//      b) Split the 50 skills across multiple days instead of one run
//         (e.g. ~7-8 skills/day, full coverage every ~week) — spreads
//         quota usage instead of spiking it once weekly.
//    Not fixed in this version — flagging so it doesn't surprise you
//    silently in production.
// ─────────────────────────────────────────────────────────────────────────
