// groq-proxy — multi-provider AI proxy for Navigator.
//
// Name kept as "groq-proxy" so the frontend (supabase.functions.invoke('groq-proxy'))
// doesn't need to change. It no longer talks to Groq or GitHub Models (retired
// 2026-07-30). It tries providers in order and falls through to the next one on
// any failure: rate limit, auth error, 5xx, timeout, non-JSON body, or a
// truncated/invalid JSON answer.
//
// Every provider is called through its OpenAI-compatible chat-completions
// endpoint, so the request shape is identical for all of them.
//
// ── Supabase secrets (Edge Functions → Secrets) ────────────────────────────────
//   CEREBRAS_API_KEY   (optional)
//   MISTRAL_API_KEY    (optional)
//   GEMINI_API_KEY     (optional)
//   Any provider without a key is simply skipped. At least one is required.
//
// Optional overrides (all have defaults below). Model IDs change often, so if a
// provider starts failing with "model not found", set the matching secret
// instead of editing code:
//   CEREBRAS_MODEL, MISTRAL_MODEL, GEMINI_MODEL
//   PROVIDER_ORDER   e.g. "cerebras,mistral,gemini" (default)
//
// Each secret may hold several comma-separated keys from the SAME provider;
// they are tried in order. (Keys from one account share that account's limits,
// so this only helps if you have separate paid projects. Don't use it to get
// around free-tier limits with extra accounts: that breaks provider terms.)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ProviderDef = {
  id: string;
  url: string;
  keys: string[];
  // Tried in order for each key. A busy or rate-limited model is skipped and the
  // next one is tried (each model has its own quota and load).
  models: string[];
  // Cerebras's current API names the output cap max_completion_tokens.
  maxTokensParam: 'max_tokens' | 'max_completion_tokens';
  // Optional. Set a secret like GEMINI_REASONING_EFFORT=low to make a "thinking"
  // model think less, which makes long answers much faster. Left unset by
  // default because not every model accepts the parameter.
  reasoningEffort?: string;
};

function modelsFrom(envName: string, defaults: string[]): string[] {
  const fromEnv = (Deno.env.get(envName) ?? '').split(',').map(m => m.trim()).filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : defaults;
}

function keysFrom(name: string): string[] {
  return (Deno.env.get(name) ?? '')
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);
}

// Defaults below are best guesses; override with the *_MODEL secrets (comma-
// separated for several models) if a provider reports an unknown model. Verify current IDs in each provider's docs.
const ALL_PROVIDERS: Record<string, ProviderDef> = {
  // Fast and free-tier friendly. Used as a backup for roadmaps when Gemini is
  // slow or out of quota (put it AFTER gemini in PROVIDER_ORDER).
  groq: {
    id: 'groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    keys: [...keysFrom('GROQ_TOKEN'), ...keysFrom('GROQ_API_KEY')],
    models: modelsFrom('GROQ_MODEL', ['openai/gpt-oss-120b', 'openai/gpt-oss-20b']),
    maxTokensParam: 'max_completion_tokens',
    reasoningEffort: Deno.env.get('GROQ_REASONING_EFFORT') || 'low',
  },
  cerebras: {
    id: 'cerebras',
    url: 'https://api.cerebras.ai/v1/chat/completions',
    keys: keysFrom('CEREBRAS_API_KEY'),
    models: modelsFrom('CEREBRAS_MODEL', ['gpt-oss-120b']),
    maxTokensParam: 'max_completion_tokens',
    reasoningEffort: Deno.env.get('CEREBRAS_REASONING_EFFORT') || undefined,
  },
  mistral: {
    id: 'mistral',
    url: 'https://api.mistral.ai/v1/chat/completions',
    keys: keysFrom('MISTRAL_API_KEY'),
    models: modelsFrom('MISTRAL_MODEL', ['mistral-small-latest']),
    maxTokensParam: 'max_tokens',
    reasoningEffort: Deno.env.get('MISTRAL_REASONING_EFFORT') || undefined,
  },
  gemini: {
    id: 'gemini',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    keys: keysFrom('GEMINI_API_KEY'),
    // Second entry is a lighter model used when the first is overloaded (HTTP 503).
    models: modelsFrom('GEMINI_MODEL', ['gemini-flash-latest', 'gemini-flash-lite-latest']),
    maxTokensParam: 'max_tokens',
    reasoningEffort: Deno.env.get('GEMINI_REASONING_EFFORT') || undefined,
  },
};

// Gemini last by default: its free tier may use prompts for training.
const ORDER = (Deno.env.get('PROVIDER_ORDER') || 'cerebras,mistral,gemini,groq')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(id => id in ALL_PROVIDERS);

const PROVIDERS: ProviderDef[] = ORDER
  .map(id => ALL_PROVIDERS[id])
  .filter(p => p.keys.length > 0);

// Time limits. A roadmap is a long generation, so allow a generous per-attempt
// timeout, but stop starting new attempts once the overall budget is spent so
// we answer before the platform (or the app's own 3 min timer) gives up.
const MAX_ATTEMPT_TIMEOUT_MS = 75_000;

// A full roadmap is a very large JSON document. The app asks for 8,000 tokens,
// which Gemini was exceeding (answers got cut off mid-JSON, finish=length), and
// "thinking" models also spend part of this budget on hidden reasoning. For
// roadmap generations we allow at least this many output tokens. Override with
// the ROADMAP_MAX_TOKENS secret.
const ROADMAP_MAX_TOKENS = Number(Deno.env.get('ROADMAP_MAX_TOKENS')) || 16_000;
const TOTAL_BUDGET_MS = 140_000;

// Per-instance memory of providers that just rate-limited us, so concurrent
// requests don't all hammer a provider that's already saying "slow down".
const cooldownUntil = new Map<string, number>(); // "provider:keyIndex" → epoch ms

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  if (PROVIDERS.length === 0) {
    return json({ error: 'No AI provider key configured on the server (set CEREBRAS_API_KEY, MISTRAL_API_KEY, GEMINI_API_KEY or GROQ_TOKEN).' }, 500);
  }

  // ── Auth: only signed-in users may spend AI budget ────────────────────────
  const authHeader = req.headers.get('Authorization') || '';
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: 'Not authenticated' }, 401);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { messages, max_tokens, temperature, response_format, kind } = body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return json({ error: 'messages are required' }, 400);
  }

  // ── Roadmap quota: checked BEFORE spending any AI budget ──────────────────
  // Only full roadmap generations send kind: 'roadmap' (notes, quizzes and the
  // related-skills call are small and unlimited). The limits live in the
  // database (roadmap_limits() in roadmap_limits.sql); the same rule is also
  // enforced by a trigger on the roadmaps table, so this check can't be the
  // only thing standing between a user and the limit. If the quota function
  // isn't installed yet, or errors, we let the request through rather than
  // blocking everyone.
  if (kind === 'roadmap') {
    const { data: quota, error: quotaError } = await supabase.rpc('roadmap_quota');
    const q = Array.isArray(quota) ? quota[0] : quota;
    if (quotaError) {
      console.warn(JSON.stringify({ event: 'quota_check_failed', message: quotaError.message }));
    } else if (q) {
      if (q.incomplete >= q.max_active) {
        return json({ error: `ROADMAP_LIMIT_ACTIVE: You already have ${q.max_active} unfinished roadmaps. Finish or delete one before creating another.` }, 429);
      }
      if (q.created_today >= q.max_daily) {
        return json({ error: `ROADMAP_LIMIT_DAILY: You have created ${q.max_daily} roadmaps in the last 24 hours. Please try again tomorrow.` }, 429);
      }
    }
  }
  // The client's `model` field is ignored on purpose: each provider has its
  // own model ID, chosen server-side.

  const wantsJson = (response_format?.type ?? 'json_object') === 'json_object';
  const effectiveMaxTokens = kind === 'roadmap'
    ? Math.max(Number(max_tokens) || 0, ROADMAP_MAX_TOKENS)
    : max_tokens;
  const started = Date.now();
  const failures: string[] = [];

  for (const provider of PROVIDERS) {
    for (let k = 0; k < provider.keys.length; k++) {
      for (const model of provider.models) {
        if (Date.now() - started > TOTAL_BUDGET_MS) {
          failures.push('time budget used up');
          return fail(failures);
        }
        const cdKey = `${provider.id}:${k}:${model}`;
        if ((cooldownUntil.get(cdKey) ?? 0) > Date.now()) {
          failures.push(`${provider.id}/${model}: cooling down after rate limit`);
          continue;
        }

        let result: CallOk | CallErr = { ok: false, reason: 'not attempted' };
        // One quick retry when the model says it is overloaded (HTTP 503 or 500);
        // those are usually gone within a few seconds.
        for (let attempt = 0; attempt < 2; attempt++) {
          // Each attempt may use whatever is left of the overall budget (up to
          // the cap), so a single slow-but-working model isn't cut off early.
          const timeoutMs = Math.max(5_000, Math.min(MAX_ATTEMPT_TIMEOUT_MS, TOTAL_BUDGET_MS - (Date.now() - started)));
          result = await callProvider(provider, provider.keys[k], model, {
            timeoutMs,
            messages,
            max_tokens: effectiveMaxTokens,
            temperature: temperature ?? 0.7,
            wantsJson,
          });
          const overloaded = !result.ok && (result.status === 503 || result.status === 500);
          if (!overloaded || attempt === 1 || Date.now() - started > TOTAL_BUDGET_MS - 20_000) break;
          await new Promise(r => setTimeout(r, 3_000));
        }

        if (result.ok) {
          console.log(JSON.stringify({
            event: 'ai_ok',
            provider: provider.id,
            model,
            usage: result.usage ?? null,
            ms: Date.now() - started,
          }));
          // Same shape the frontend already reads: data.choices[0].message.content
          return json({
            choices: [{ message: { role: 'assistant', content: result.content }, finish_reason: result.finishReason }],
            usage: result.usage ?? null,
            provider: provider.id,
            model,
          });
        }

        failures.push(`${provider.id}/${model}: ${result.reason}`);
        console.warn(JSON.stringify({ event: 'ai_fail', provider: provider.id, model, reason: result.reason, status: result.status ?? null }));
        if (result.status === 429) cooldownUntil.set(cdKey, Date.now() + (result.retryAfterMs ?? 30_000));
      }
    }
  }

  return fail(failures);
});

type CallOk = { ok: true; content: string; usage?: unknown; finishReason?: string };
type CallErr = { ok: false; reason: string; status?: number; retryAfterMs?: number };

async function callProvider(
  provider: ProviderDef,
  key: string,
  model: string,
  opts: { timeoutMs: number; messages: unknown[]; max_tokens?: number; temperature: number; wantsJson: boolean },
): Promise<CallOk | CallErr> {
  // First attempt asks for JSON mode. If the provider rejects that parameter
  // (HTTP 400), retry once without it; the JSON check below still protects us.
  for (const useJsonMode of opts.wantsJson ? [true, false] : [false]) {
    const payload: Record<string, unknown> = {
      model,
      messages: opts.messages,
      temperature: opts.temperature,
    };
    if (opts.max_tokens) payload[provider.maxTokensParam] = opts.max_tokens;
    if (useJsonMode) payload.response_format = { type: 'json_object' };
    if (provider.reasoningEffort) payload.reasoning_effort = provider.reasoningEffort;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs);
    let resp: Response;
    let text: string;
    try {
      resp = await fetch(provider.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      text = await resp.text();
    } catch (e) {
      clearTimeout(timer);
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false, reason: ctrl.signal.aborted ? `timed out after ${Math.round(opts.timeoutMs / 1000)}s` : `network error: ${msg}` };
    }
    clearTimeout(timer);

    if (resp.status === 400 && useJsonMode) continue; // retry without response_format

    if (!resp.ok) {
      const retryAfter = Number(resp.headers.get('retry-after'));
      return {
        ok: false,
        status: resp.status,
        retryAfterMs: Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter * 1000, 120_000) : undefined,
        reason: `HTTP ${resp.status} ${snippet(text)}`,
      };
    }

    // Providers can return plain text on errors even with a 2xx/5xx status,
    // so never assume the body is JSON.
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return { ok: false, status: resp.status, reason: `non-JSON response: ${snippet(text)}` };
    }

    const choice = data?.choices?.[0];
    let content: string = choice?.message?.content ?? '';
    if (!content) return { ok: false, reason: 'empty response' };

    if (opts.wantsJson) {
      const parsed = extractJson(content);
      if ('error' in parsed) {
        const finish = choice?.finish_reason ?? 'unknown';
        const cut = finish === 'length';
        const head = content.trim().slice(0, 60).replace(/\s+/g, ' ');
        const tail = content.trim().slice(-60).replace(/\s+/g, ' ');
        return {
          ok: false,
          reason: `${cut ? 'answer cut off at token limit' : 'model returned invalid JSON'} (finish=${finish}, ${content.length} chars, usage=${JSON.stringify(data?.usage ?? null)}, parseError="${parsed.error.slice(0, 160)}", around="${parsed.around}", starts "${head}", ends "${tail}")`,
        };
      }
      content = parsed.text;
    }

    return { ok: true, content, usage: data?.usage, finishReason: choice?.finish_reason };
  }
  return { ok: false, reason: 'provider rejected the request' };
}

// Models sometimes wrap the JSON in ```json fences, add a sentence before or
// after it, leave a trailing comma, or put a raw line break inside a string
// value (which JSON forbids). Try to recover a valid JSON string from the
// answer. On failure, return the parser's message and the text around the
// error position so the logs show exactly what is wrong.
type JsonResult = { text: string } | { error: string; around: string };

// Escape raw newlines/tabs that appear INSIDE string values; leave everything
// else alone.
function escapeControlCharsInStrings(text: string): string {
  let out = '';
  let inStr = false;
  let esc = false;
  for (const ch of text) {
    if (!inStr) {
      if (ch === '"') inStr = true;
      out += ch;
      continue;
    }
    if (esc) { out += ch; esc = false; continue; }
    if (ch === '\\') { out += ch; esc = true; continue; }
    if (ch === '"') { out += ch; inStr = false; continue; }
    if (ch === '\n') { out += '\\n'; continue; }
    if (ch === '\r') continue;
    if (ch === '\t') { out += '\\t'; continue; }
    out += ch;
  }
  return out;
}

function extractJson(raw: string): JsonResult {
  const t = raw.trim();
  const candidates: string[] = [t];

  const fence = t.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fence) candidates.push(fence[1]);

  const first = t.indexOf('{');
  const last = t.lastIndexOf('}');
  if (first !== -1 && last > first) candidates.push(t.slice(first, last + 1));

  let firstError = '';
  let errorText = t;
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const noTrailingCommas = candidate.replace(/,\s*([}\]])/g, '$1');
    const repaired = escapeControlCharsInStrings(candidate);
    const repairedNoCommas = escapeControlCharsInStrings(noTrailingCommas);
    for (const text of [candidate, noTrailingCommas, repaired, repairedNoCommas]) {
      try {
        JSON.parse(text);
        return { text };
      } catch (e) {
        if (!firstError || i === candidates.length - 1 && text === candidate) {
          firstError = e instanceof Error ? e.message : String(e);
          errorText = candidate;
        }
      }
    }
  }

  const pos = Number(firstError.match(/position (\d+)/)?.[1]);
  const around = Number.isFinite(pos)
    ? errorText.slice(Math.max(0, pos - 60), pos + 60).replace(/\s+/g, ' ')
    : '';
  return { error: firstError || 'no JSON found', around };
}

function snippet(s: string): string {
  return s.replace(/\s+/g, ' ').slice(0, 160);
}

function fail(failures: string[]) {
  return json({ error: 'All AI providers failed: ' + failures.join(' | ') }, 502);
}

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
