// supabase/functions/delete-account/index.ts
//
// Permanently deletes the calling user's account: their `roadmaps` rows,
// `user_kv` rows, and finally the `auth.users` row itself.
//
// Why this has to be an Edge Function and not a client call:
// `auth.admin.deleteUser()` requires a Supabase key with admin/service
// privileges, which must never reach the browser. This function is the
// only place that key is used, and it never leaves this server-side runtime.
//
// NOTE: SUPABASE_SERVICE_ROLE_KEY is deprecated in this project (confirmed
// in dashboard: "Legacy service role key. Use SUPABASE_SECRET_KEYS issued
// through JWT Signing Keys instead."). SUPABASE_SECRET_KEYS is auto-injected
// by Supabase into every Edge Function (confirmed via `supabase secrets
// list` — it appears alongside SUPABASE_URL/SUPABASE_ANON_KEY without
// anyone setting it manually), so it's used directly below — no manual
// secret needed.
//
// Auth model: the caller sends their own access token in the Authorization
// header (same pattern as groq-proxy). We verify that token against Supabase
// Auth ourselves (using the ANON key, not the secret key) to resolve the
// real, server-confirmed user id — we never trust a user_id passed in the
// request body. That would let anyone delete anyone's account by editing
// the request. There is no "delete this other user" path here at all.
//
// Deletion order: dependent rows (user_kv, roadmaps) are deleted explicitly
// BEFORE the auth user, rather than relying solely on the DB's
// ON DELETE CASCADE constraints. HANDOFF.md already documented one instance
// of the live schema drifting from what the CREATE TABLE docs describe
// (missing columns on `roadmaps`) — an irreversible account deletion isn't
// the place to bet on a constraint that hasn't been independently verified
// against the live project. Explicit deletes are harmless if cascade is
// also present, and load-bearing if it isn't. If anything fails partway,
// deleting dependents first means the worst case is "user still exists,
// some data cleared" (recoverable / re-triggerable), never orphaned rows
// pointing at an already-deleted user.

import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
// CHANGED AGAIN: SUPABASE_SECRET_KEYS is a JSON dictionary
// (e.g. {"default":"sb_secret_..."}), NOT a bare key string — confirmed via
// Supabase's own docs. Passing the raw JSON string straight into
// createClient() caused "Invalid API key", because the client was trying
// to use the literal text '{"default":"sb_secret_..."}' as a key. Parse it
// and pull out the "default" entry, which is what the dashboard's single
// secret key maps to when only one key exists.
const RAW_SECRET_KEYS = Deno.env.get('SUPABASE_SECRET_KEYS') ?? '';
let SECRET_KEY = '';
try {
  const parsed = JSON.parse(RAW_SECRET_KEYS);
  SECRET_KEY = parsed?.default ?? Object.values(parsed ?? {})[0] ?? '';
} catch {
  // Not JSON — assume it's already a bare key string (older/local CLI
  // behavior sometimes exposes the singular SUPABASE_SECRET_KEY form
  // instead; treat the raw value as a fallback rather than crashing here).
  SECRET_KEY = RAW_SECRET_KEYS;
}
if (!SECRET_KEY) {
  // Fall back to the deprecated var only if the new one is somehow empty —
  // better to work with a legacy-but-valid key than fail outright.
  SECRET_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
}

// CHANGED: added apikey + x-client-info. supabase-js's functions.invoke()
// sends an `apikey` header on every call; the browser's CORS preflight
// blocks the whole request if that header isn't explicitly allowed here.
// This function previously only allowed authorization + content-type,
// which is why the preflight failed with a CORS error. Matches the headers
// chat-reply already allows.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token) return json({ error: 'Missing Authorization header' }, 401);

    // Verify the caller's own token — resolves the REAL user id server-side.
    // Uses the anon client (not the secret key) specifically so this call
    // only ever succeeds for a genuinely valid, non-expired session token.
    const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await callerClient.auth.getUser(token);
    if (userErr || !userData?.user) {
      return json({ error: 'Not authenticated' }, 401);
    }
    const uid = userData.user.id;

    // Admin client using the secret key — the only place in the app this
    // key is used. Never exposed to, or reachable from, the client.
    const admin = createClient(SUPABASE_URL, SECRET_KEY);

    // 1. Delete dependent rows first (explicit, not relying solely on cascade).
    const { error: kvErr } = await admin.from('user_kv').delete().eq('user_id', uid);
    if (kvErr) {
      return json({ error: `Failed to delete user_kv rows: ${kvErr.message}` }, 500);
    }

    const { error: roadmapsErr } = await admin.from('roadmaps').delete().eq('user_id', uid);
    if (roadmapsErr) {
      return json({ error: `Failed to delete roadmaps rows: ${roadmapsErr.message}` }, 500);
    }

    // 2. Delete the auth user itself. This is the irreversible step.
    const { error: deleteUserErr } = await admin.auth.admin.deleteUser(uid);
    if (deleteUserErr) {
      // Data rows are already gone at this point but the account survives —
      // logged so it can be retried/investigated, not silently swallowed.
      console.error('[delete-account] deleteUser failed after data cleanup:', {
        uid,
        error: deleteUserErr.message,
      });
      return json({ error: `Account data was cleared, but deleting the account itself failed: ${deleteUserErr.message}` }, 500);
    }

    return json({ success: true });
  } catch (e) {
    // ADDED: top-level catch. Previously any uncaught throw in this handler
    // (e.g. createClient() rejecting a bad/missing key) produced an empty
    // response body -> client saw "Unexpected end of JSON input" instead of
    // a real error message. Now every failure path returns valid JSON.
    console.error('[delete-account] unhandled error:', e);
    return json({ error: `Unexpected server error: ${String(e)}` }, 500);
  }
});
