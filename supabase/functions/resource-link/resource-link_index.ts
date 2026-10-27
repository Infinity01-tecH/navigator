// Real-link lookup for roadmap resources that fell back to a generic search query.
// generateRoadmap.ts's URL POLICY already refuses to invent deep/specific URLs — when the
// AI can't name a real official domain, it deliberately falls back to a Google search link
// instead of hallucinating a fake one. That's the right call for AVOIDING dead links, but it
// means the user gets a search page instead of a real article. This function is the fix:
// given a topic, search for a real result restricted to detailed-article platforms (Quora,
// Wikipedia, Reddit, Substack, encyclopedia sites) and return a REAL, verified URL instead —
// same principle as video-analyze doing a real YouTube lookup instead of trusting an AI guess.
//
// Deploy: supabase functions deploy resource-link
// Secrets: supabase secrets set SERPER_API_KEY=...

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SERPER_API = "https://google.serper.dev/search";
const FETCH_TIMEOUT_MS = 8_000;

// Platforms preferred for "detailed article" style content. Edit this list to add/remove
// sites — it's used to build a Google site: filter, so any real domain works here.
const PREFERRED_SITES = ["quora.com", "reddit.com", "en.wikipedia.org", "substack.com", "britannica.com"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string" || !query.trim()) {
      return json({ error: "Missing search query" }, 400);
    }

    const apiKey = Deno.env.get("SERPER_API_KEY");
    if (!apiKey) return json({ error: "Server misconfigured: SERPER_API_KEY missing" }, 500);

    // Serper mirrors real Google SERPs, so a standard site: filter works exactly like a
    // normal Google search — no special "restrict domain" parameter needed.
    const siteFilter = PREFERRED_SITES.map((s) => `site:${s}`).join(" OR ");
    const q = `${query.trim()} (${siteFilter})`;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(SERPER_API, {
        method: "POST",
        headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ q, num: 5 }),
        signal: ctrl.signal,
      });
    } catch {
      clearTimeout(timer);
      return json({ error: "Could not reach the search provider. Try again." }, 502);
    }
    clearTimeout(timer);

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        return json({ error: "Search provider rejected the request — check SERPER_API_KEY." }, 502);
      }
      if (res.status === 429) {
        return json({ error: "Search provider rate limit hit. Try again shortly." }, 429);
      }
      return json({ error: `Search provider error (${res.status}).` }, 502);
    }

    const data = await res.json();
    const organic: unknown = data?.organic;
    const results = Array.isArray(organic) ? organic : [];
    const first = results.find(
      (r: any) => typeof r?.link === "string" && /^https?:\/\//i.test(r.link),
    ) as { link: string; title?: string } | undefined;

    if (!first) return json({ error: "No real result found for this topic." }, 404);

    return json({ url: first.link, title: first.title ?? query.trim() });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
