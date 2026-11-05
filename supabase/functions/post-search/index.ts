// Real-link lookup for roadmap resources that fell back to a generic search query.
// generateRoadmap.ts's URL POLICY already refuses to invent deep/specific URLs — when the
// AI can't name a real official domain, it deliberately falls back to a Google search link
// instead of hallucinating a fake one. That's the right call for AVOIDING dead links, but it
// means the user gets a search page instead of a real article. This function is the fix:
// given a topic, search for a real result restricted to detailed-article platforms (Quora,
// Wikipedia, Reddit, Substack, encyclopedia sites) and return a REAL, verified URL instead —
// same principle as video-analyze doing a real YouTube lookup instead of trusting an AI guess.
//
// Providers: Serper first (this runs while the user waits on a click, so it uses the
// provider with the longer track record), Searlo as backup if Serper fails or its key is
// missing. Order is configurable: supabase secrets set LINK_PROVIDER_ORDER=searlo,serper
//
// Deploy: supabase functions deploy resource-link
// Secrets: supabase secrets set SERPER_API_KEY=... SEARLO_API_KEY=...

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FETCH_TIMEOUT_MS = 8_000;

// Platforms preferred for "detailed article" style content. Edit this list to add/remove
// sites — it's used to build a Google site: filter, so any real domain works here.
const PREFERRED_SITES = ["quora.com", "reddit.com", "en.wikipedia.org", "substack.com", "britannica.com"];

interface Result {
  link: string;
  title?: string;
}

class ProviderError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function timedFetch(url: string, init: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

function firstReal(list: unknown): Result | undefined {
  if (!Array.isArray(list)) return undefined;
  for (const r of list as any[]) {
    const link = r?.link ?? r?.url;
    if (typeof link === "string" && /^https?:\/\//i.test(link)) {
      return { link, title: typeof r?.title === "string" ? r.title : undefined };
    }
  }
  return undefined;
}

// Each provider returns the first real result, or undefined for "searched fine, found
// nothing", or throws ProviderError (down, bad key, rate limit, missing key).
const providers: Record<string, (q: string) => Promise<Result | undefined>> = {
  async serper(q) {
    const key = Deno.env.get("SERPER_API_KEY");
    if (!key) throw new ProviderError("SERPER_API_KEY missing", 500);
    let res: Response;
    try {
      res = await timedFetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "X-API-KEY": key, "Content-Type": "application/json" },
        body: JSON.stringify({ q, num: 5 }),
      });
    } catch {
      throw new ProviderError("Could not reach Serper", 502);
    }
    if (!res.ok) throw new ProviderError(`Serper error (${res.status})`, res.status === 429 ? 429 : 502);
    const data = await res.json();
    return firstReal(data?.organic);
  },

  async searlo(q) {
    const key = Deno.env.get("SEARLO_API_KEY");
    if (!key) throw new ProviderError("SEARLO_API_KEY missing", 500);
    let res: Response;
    try {
      res = await timedFetch(
        `https://api.searlo.tech/api/v1/search/web?q=${encodeURIComponent(q)}&limit=5&gl=us`,
        { headers: { "X-API-Key": key } },
      );
    } catch {
      throw new ProviderError("Could not reach Searlo", 502);
    }
    if (!res.ok) throw new ProviderError(`Searlo error (${res.status})`, res.status === 429 ? 429 : 502);
    const data = await res.json();
    return firstReal(data?.organic ?? data?.results ?? data?.data?.organic);
  },
};

function providerOrder(): string[] {
  const raw = Deno.env.get("LINK_PROVIDER_ORDER") ?? "serper,searlo";
  const list = raw.split(",").map((s) => s.trim().toLowerCase()).filter((s) => s in providers);
  return list.length ? list : ["serper", "searlo"];
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

    // Both providers mirror real Google SERPs, so a standard site: filter works exactly like
    // a normal Google search — no special "restrict domain" parameter needed.
    const siteFilter = PREFERRED_SITES.map((s) => `site:${s}`).join(" OR ");
    const q = `${query.trim()} (${siteFilter})`;

    let lastErr: ProviderError | null = null;
    let searchedOk = false;

    for (const name of providerOrder()) {
      try {
        const hit = await providers[name](q);
        if (hit) return json({ url: hit.link, title: hit.title ?? query.trim() });
        // Healthy provider, genuinely no result: try the other one once before giving up,
        // since the two indexes can differ slightly.
        searchedOk = true;
      } catch (e) {
        console.error(`[resource-link] ${name} failed:`, String(e));
        lastErr = e instanceof ProviderError ? e : new ProviderError(String(e), 502);
      }
    }

    // Reaching here means nobody returned a link. If at least one provider answered
    // normally, that's a real "nothing found"; otherwise it's an outage.
    if (searchedOk) return json({ error: "No real result found for this topic." }, 404);
    return json({ error: lastErr?.message ?? "Search is unavailable right now." }, lastErr?.status ?? 502);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
