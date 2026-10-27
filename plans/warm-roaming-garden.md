# Plan: Migrate AI backend from GitHub Models → Groq (single key + wait-on-rate-limit)

## Context

The app currently calls GitHub Models (`gpt-4.1-mini`) through the `groq-proxy` edge function. The user's Groq account has larger, better models available: `openai/gpt-oss-120b`, `qwen/qwen3.8-27b`, `openai/gpt-oss-20b`. The user wants to use **a single Groq API key** and rely on a wait-then-retry strategy when the TPM rate limit is hit — rather than rotating across multiple keys.

The migration is server-side only. No client code changes are needed.

---

## What changes

### 1. `supabase/functions/groq-proxy/index.ts`

**Endpoint:**
```
FROM: https://models.inference.ai.azure.com/chat/completions
  TO: https://api.groq.com/openai/v1/chat/completions
```

**Secret name:**
```
FROM: GITHUB_TOKEN_1 … GITHUB_TOKEN_10
  TO: GROQ_TOKEN  (single secret, no index)
```
Function reads `Deno.env.get('GROQ_TOKEN')` — one value, no loop.

**Model priority list (unchanged from prior plan):**
```typescript
const MODEL_POOL = [
  "openai/gpt-oss-120b",  // primary — best quality
  "qwen/qwen3.8-27b",     // first fallback
  "openai/gpt-oss-20b",   // second fallback
];
```

**Rate-limit strategy — wait, not rotate:**

When the single key hits a 429:
1. Read the `retry-after` header from Groq (typically 5–62 seconds for TPM exhaustion)
2. Sleep exactly that long (default 62s if header absent)
3. Retry the same model with the same key
4. Only advance to the next model if retries on the current model keep failing after the wait

```
attempt flow (per model):
  loop:
    call Groq
    if ok → return
    if 429 → sleep(retry-after ?? 62s), then retry same model
    if 401/403 → fail immediately (key is wrong, no point waiting)
    if other error → fail immediately (non-retryable)
  if too many retries → next model
```

**Budget:** Extended to 130s (fits one full 62s wait + a second attempt + overhead), staying under Supabase's 150s wall-clock limit.

**Max retries per model:** 3 (so worst case: 3 × 62s = 186s, but the 130s budget cuts this off gracefully). In practice Groq's retry-after is usually 5–30s, not always 62s.

### 2. `supabase/functions/video-analyze/index.ts`

Same three changes:
- Endpoint → Groq API
- Secret → `GROQ_TOKEN` (single)
- Model pool → same priority list, same wait-on-429 logic

### 3. `src/lib/generateRoadmap.ts`

Reduce `max_tokens` in the `generateRoadmap()` call from `8000` → `7000`.  
Safe for all roadmap sizes (expert 10-step roadmaps top out ~6,500 tokens). Reduces TPM pressure per call, so the wait after a rate limit is shorter.

### 4. Supabase secrets (manual step)

User sets one secret:
```
supabase secrets set GROQ_TOKEN=gsk_...
```
Then deploys:
```
supabase functions deploy groq-proxy video-analyze
```
Old `GITHUB_TOKEN_*` secrets can be left or removed — they are simply no longer read.

---

## What does NOT change

- `src/lib/generateRoadmap.ts` — `groqCall()` sends `model: 'gpt-4.1-mini'` in the body, but the proxy overrides it with the model pool. No change needed beyond the `max_tokens` reduction.
- `src/lib/useChatThread.ts` — calls `chat-reply`, unrelated.
- All client-side logic, UI, XP, streaks, quiz logic — untouched.

---

## Verification

1. Set `GROQ_TOKEN=gsk_...` in Supabase secrets
2. Deploy: `supabase functions deploy groq-proxy video-analyze`
3. Generate a roadmap — confirm quality is visibly better than gpt-4.1-mini
4. Watch tab: paste a YouTube URL — chapters + quiz should still generate
5. To test the wait-and-retry: trigger two roadmap generations in quick succession and confirm the second one succeeds after a brief wait (not an error)

---

## Notes / risks

- **JSON mode**: `response_format: { type: "json_object" }` — supported on Groq for the listed models. If a model returns a 400 (unsupported), it surfaces immediately as an error (non-retryable) — easy to diagnose.
- **Wait duration**: Groq's actual `retry-after` values vary by how much TPM was consumed. A 7000-token roadmap nearly fills the 8K TPM window in one call, so the wait could be close to 60s. This is expected and is the intended UX tradeoff when using a single key.
