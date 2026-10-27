// chat-reply — streaming chat proxy for Navi (multi-provider).
// Replaces the old GitHub Models version (GitHub Models was retired).
//
// Same SSE contract as before: the client (useChatThread.ts) reads
// `data: {"choices":[{"delta":{"content":"..."}}]}` lines, so the upstream
// OpenAI-style stream is piped straight through.
//
// Secrets (same ones groq-proxy uses; each may hold several comma-separated keys):
//   CEREBRAS_API_KEY, MISTRAL_API_KEY, GEMINI_API_KEY
// Optional:
//   GROQ_TOKEN                Groq key (first choice for chat — fast and free tier)
//   CHAT_PROVIDER_ORDER       default "groq,cerebras,mistral,gemini" (providers without keys are skipped)
//   CHAT_GROQ_MODEL           default "openai/gpt-oss-120b,openai/gpt-oss-20b"
//   CHAT_GROQ_REASONING       default "low"  (set "off" to disable)
//   CHAT_GEMINI_MODEL         default "gemini-flash-lite-latest,gemini-flash-latest" (comma-separated)
//   CHAT_CEREBRAS_MODEL       default "gpt-oss-120b"
//   CHAT_MISTRAL_MODEL        default "mistral-small-latest"
//   CHAT_GEMINI_REASONING     default "low"  (less "thinking" = faster first word; set "off" to disable)
//
// Limit: each user gets 20 chat messages per rolling 48 hours (chat_limits.sql
// holds the numbers). Only signed-in users can chat.
//
// Deploy: paste into the chat-reply function in Supabase and click Deploy updates.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Provider {
  id: string;
  url: string;
  keys: string[];
  models: string[];
  maxTokensParam: "max_tokens" | "max_completion_tokens";
  reasoningEffort?: string;
}

const list = (v: string | undefined, fallback: string[]) => {
  const a = (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return a.length ? a : fallback;
};
const keysFrom = (name: string) => list(Deno.env.get(name), []);

const geminiReasoning = (Deno.env.get("CHAT_GEMINI_REASONING") ?? "low").trim().toLowerCase();

const groqReasoning = (Deno.env.get("CHAT_GROQ_REASONING") ?? "low").trim().toLowerCase();

const ALL: Record<string, Provider> = {
  groq: {
    id: "groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    keys: [...keysFrom("GROQ_TOKEN"), ...keysFrom("GROQ_API_KEY")],
    models: list(Deno.env.get("CHAT_GROQ_MODEL"), ["openai/gpt-oss-120b", "openai/gpt-oss-20b"]),
    maxTokensParam: "max_completion_tokens",
    reasoningEffort: groqReasoning === "off" ? undefined : groqReasoning,
  },
  cerebras: {
    id: "cerebras",
    url: "https://api.cerebras.ai/v1/chat/completions",
    keys: keysFrom("CEREBRAS_API_KEY"),
    models: list(Deno.env.get("CHAT_CEREBRAS_MODEL"), ["gpt-oss-120b"]),
    maxTokensParam: "max_completion_tokens",
  },
  mistral: {
    id: "mistral",
    url: "https://api.mistral.ai/v1/chat/completions",
    keys: keysFrom("MISTRAL_API_KEY"),
    models: list(Deno.env.get("CHAT_MISTRAL_MODEL"), ["mistral-small-latest"]),
    maxTokensParam: "max_tokens",
  },
  gemini: {
    id: "gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    keys: keysFrom("GEMINI_API_KEY"),
    models: list(Deno.env.get("CHAT_GEMINI_MODEL"), ["gemini-flash-lite-latest", "gemini-flash-latest"]),
    maxTokensParam: "max_tokens",
    reasoningEffort: geminiReasoning === "off" ? undefined : geminiReasoning,
  },
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

function waitText(minutes: number): string {
  if (minutes >= 90) return `about ${Math.round(minutes / 60)} hours`;
  if (minutes >= 60) return "about an hour";
  return `about ${minutes} minute${minutes === 1 ? "" : "s"}`;
}

const ORDER = list(Deno.env.get("CHAT_PROVIDER_ORDER"), ["groq", "cerebras", "mistral", "gemini"])
  .map((s) => s.toLowerCase())
  .filter((id) => id in ALL);

// Time allowed for the provider to START answering (response headers). Once the
// stream has started it is never cut off.
const FIRST_BYTE_TIMEOUT_MS = 25_000;
// Rate-limited provider/key/model combos are skipped for a while.
const cooldown = new Map<string, number>();

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const jsonErr = (body: unknown, status = 500) =>
    new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

  try {
    // Only signed-in users may spend AI budget.
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return jsonErr({ error: "Not authenticated" }, 401);

    const body = await req.json();
    const { messages, max_tokens = 1024, temperature = 0.7 } = body;
    if (!Array.isArray(messages) || messages.length === 0) return jsonErr({ error: "messages array required" }, 400);

    const providers = ORDER.map((id) => ALL[id]).filter((p) => p.keys.length > 0);
    if (providers.length === 0) {
      return jsonErr({ error: "No AI provider key configured (set GROQ_TOKEN, CEREBRAS_API_KEY, MISTRAL_API_KEY or GEMINI_API_KEY)." }, 500);
    }

    // Message allowance (20 per 48h). Fails open if the SQL hasn't been installed
    // yet, so a missing function never blocks everyone.
    let consumed = false;
    {
      const { data: quota, error: quotaError } = await supabase.rpc("chat_consume");
      const q = Array.isArray(quota) ? quota[0] : quota;
      if (quotaError) {
        console.warn(JSON.stringify({ evt: "chat_quota_check_failed", message: quotaError.message }));
      } else if (q) {
        if (!q.allowed) {
          return jsonErr({
            error: `You've used all ${q.limit_count} Navi messages for now. You can chat again in ${waitText(q.retry_minutes)}.`,
          }, 429);
        }
        consumed = true;
      }
    }

    const failures: string[] = [];

    for (const p of providers) {
      // Start from a random key so load spreads across several keys.
      const start = Math.floor(Math.random() * p.keys.length);
      for (let ki = 0; ki < p.keys.length; ki++) {
        const key = p.keys[(start + ki) % p.keys.length];
        for (const model of p.models) {
          const cdKey = `${p.id}:${(start + ki) % p.keys.length}:${model}`;
          if ((cooldown.get(cdKey) ?? 0) > Date.now()) continue;

          // Try once with reasoning_effort (if configured), once without if the API rejects it.
          for (const withReasoning of p.reasoningEffort ? [true, false] : [false]) {
            const payload: Record<string, unknown> = {
              model,
              messages,
              stream: true,
              temperature,
              [p.maxTokensParam]: max_tokens,
            };
            if (withReasoning && p.reasoningEffort) payload.reasoning_effort = p.reasoningEffort;

            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), FIRST_BYTE_TIMEOUT_MS);
            let res: Response;
            try {
              res = await fetch(p.url, {
                method: "POST",
                headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: ctrl.signal,
              });
            } catch (err) {
              clearTimeout(timer);
              failures.push(`${p.id}/${model}: ${ctrl.signal.aborted ? "no response in " + FIRST_BYTE_TIMEOUT_MS / 1000 + "s" : String(err)}`);
              break; // next model
            }
            clearTimeout(timer);

            if (res.ok && res.body) {
              console.log(JSON.stringify({ evt: "chat_ok", provider: p.id, model }));
              return new Response(res.body, {
                status: 200,
                headers: { ...CORS, "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
              });
            }

            const text = (await res.text().catch(() => "")).slice(0, 200);
            if (res.status === 400 && withReasoning) continue; // retry without reasoning_effort
            failures.push(`${p.id}/${model}: HTTP ${res.status} ${text}`);
            if (res.status === 429) cooldown.set(cdKey, Date.now() + 60_000);
            break; // next model / key
          }
        }
      }
    }

    console.log(JSON.stringify({ evt: "chat_fail", failures }));
    if (consumed) await supabase.rpc("chat_refund"); // the AI failed — don't charge the user a message
    return jsonErr({ error: "Navi is busy right now. Please try again in a moment.", detail: failures.join(" | ") }, 502);
  } catch (e) {
    return jsonErr({ error: String(e) }, 500);
  }
});
