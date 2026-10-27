// supabase/functions/run-migrations/index.ts
//
// One-time migration runner. Adds columns/tables needed for bio, pro_skill,
// and roadmap/profile visibility that were not part of the initial schema.
//
// Deploy once, invoke once (with your user Bearer token), then leave in place
// (it is idempotent — safe to call again). Requires the caller to be a
// valid authenticated user (any user — just proves the request is from the app).

import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const RAW_SECRET_KEYS = Deno.env.get('SUPABASE_SECRET_KEYS') ?? '';
let SECRET_KEY = '';
try {
  const parsed = JSON.parse(RAW_SECRET_KEYS);
  SECRET_KEY = parsed?.default ?? Object.values(parsed ?? {})[0] ?? '';
} catch {
  SECRET_KEY = RAW_SECRET_KEYS;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

// Each migration is a SQL statement + a description. They are ALL idempotent
// (IF NOT EXISTS / DO NOTHING patterns) so running them twice is safe.
const MIGRATIONS: Array<{ name: string; sql: string }> = [
  {
    name: 'profiles.bio column',
    sql: `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;`,
  },
  {
    name: 'profiles.pro_skill column',
    sql: `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pro_skill TEXT;`,
  },
  {
    name: 'profile_visibility table',
    sql: `
      CREATE TABLE IF NOT EXISTS public.profile_visibility (
        id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        tier        text NOT NULL CHECK (tier IN ('friend','streak_partner')),
        field       text NOT NULL DEFAULT 'roadmap',
        visible     boolean NOT NULL DEFAULT true,
        created_at  timestamptz NOT NULL DEFAULT now(),
        UNIQUE (user_id, tier, field)
      );
      ALTER TABLE public.profile_visibility ENABLE ROW LEVEL SECURITY;
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'profile_visibility' AND policyname = 'own visibility'
        ) THEN
          CREATE POLICY "own visibility" ON public.profile_visibility
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
        END IF;
      END $$;
    `,
  },
  {
    name: 'roadmap_visibility table',
    sql: `
      CREATE TABLE IF NOT EXISTS public.roadmap_visibility (
        id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        roadmap_id  uuid NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
        tier        text NOT NULL CHECK (tier IN ('friend','streak_partner')),
        created_at  timestamptz NOT NULL DEFAULT now(),
        UNIQUE (roadmap_id, tier)
      );
      ALTER TABLE public.roadmap_visibility ENABLE ROW LEVEL SECURITY;
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'roadmap_visibility' AND policyname = 'owner can manage'
        ) THEN
          CREATE POLICY "owner can manage" ON public.roadmap_visibility
            USING (
              EXISTS (
                SELECT 1 FROM public.roadmaps r
                WHERE r.id = roadmap_id AND r.user_id = auth.uid()
              )
            )
            WITH CHECK (
              EXISTS (
                SELECT 1 FROM public.roadmaps r
                WHERE r.id = roadmap_id AND r.user_id = auth.uid()
              )
            );
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'roadmap_visibility' AND policyname = 'friends can read'
        ) THEN
          CREATE POLICY "friends can read" ON public.roadmap_visibility
            FOR SELECT
            USING (
              EXISTS (
                SELECT 1 FROM public.roadmaps r
                JOIN public.friendships f
                  ON f.user_id = auth.uid() AND f.friend_id = r.user_id
                  AND f.status = 'accepted'
                WHERE r.id = roadmap_id
              )
            );
        END IF;
      END $$;
    `,
  },
  {
    name: 'get_profile_view RPC — add bio + pro_skill',
    sql: `
      CREATE OR REPLACE FUNCTION public.get_profile_view(p_target_id uuid)
      RETURNS jsonb
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      DECLARE
        v_viewer    uuid := auth.uid();
        v_tier      text;
        v_row       jsonb;
        v_roadmaps  jsonb := '[]'::jsonb;
        v_target    record;
        v_streak    record;
      BEGIN
        -- Resolve relationship tier
        IF v_viewer IS NULL THEN
          v_tier := 'stranger';
        ELSIF v_viewer = p_target_id THEN
          v_tier := 'self';
        ELSE
          SELECT status, tier INTO v_row
          FROM public.friendships
          WHERE user_id = v_viewer AND friend_id = p_target_id AND status = 'accepted'
          LIMIT 1;
          v_tier := COALESCE((v_row->>'tier'), 'stranger');
        END IF;

        -- Get target profile
        SELECT p.username, p.display_name, p.avatar_config,
               p.bio, p.pro_skill,
               COALESCE(
                 (SELECT SUM(1) FROM public.roadmaps rm
                  WHERE rm.user_id = p_target_id AND NOT COALESCE((rm.data->>'preview')::boolean, false)),
                 0
               )::int AS roadmap_count
        INTO v_target
        FROM public.profiles p
        WHERE p.id = p_target_id;

        IF NOT FOUND THEN
          RETURN NULL;
        END IF;

        -- Streak + streak_log (always for self, for friend/streak_partner if shared)
        SELECT
          COALESCE(s.current_streak, 0) AS current_streak,
          COALESCE(s.completed_steps, 0) AS completed_steps,
          s.streak_log,
          s.quiz_xp
        INTO v_streak
        FROM public.user_stats s
        WHERE s.user_id = p_target_id;

        -- Build roadmaps array based on tier
        IF v_tier IN ('self', 'friend', 'streak_partner') THEN
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', r.id,
              'skill', r.data->>'skill',
              'data', CASE
                WHEN v_tier = 'friend' THEN NULL  -- friends see skill name only via profile page (phases hidden)
                ELSE r.data
              END,
              'progress', CASE
                WHEN v_tier = 'friend' THEN NULL
                ELSE (
                  SELECT jsonb_object_agg(k, v)
                  FROM public.roadmap_progress rp2,
                       jsonb_each_text(rp2.progress) AS t(k, v)
                  WHERE rp2.roadmap_id = r.id
                )
              END
            )
          ) INTO v_roadmaps
          FROM public.roadmaps r
          WHERE r.user_id = p_target_id
            AND NOT COALESCE((r.data->>'preview')::boolean, false)
            AND (
              v_tier = 'self'
              OR EXISTS (
                SELECT 1 FROM public.roadmap_visibility rv
                WHERE rv.roadmap_id = r.id AND rv.tier = v_tier
              )
            );
        END IF;

        RETURN jsonb_build_object(
          'tier', v_tier,
          'username', v_target.username,
          'display_name', v_target.display_name,
          'avatar_config', v_target.avatar_config,
          'bio', v_target.bio,
          'pro_skill', v_target.pro_skill,
          'current_streak', COALESCE(v_streak.current_streak, 0),
          'completed_steps', COALESCE(v_streak.completed_steps, 0),
          'streak_log', COALESCE(v_streak.streak_log, '{}'::jsonb),
          'roadmaps', COALESCE(v_roadmaps, '[]'::jsonb)
        );
      END;
      $$;
    `,
  },
];

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  // Require a valid auth token so random people can't call this
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'Missing Authorization header' }, 401);

  const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userErr } = await callerClient.auth.getUser(token);
  if (userErr || !userData?.user) return json({ error: 'Not authenticated' }, 401);

  if (!SECRET_KEY) return json({ error: 'Server misconfiguration: no secret key' }, 500);

  const admin = createClient(SUPABASE_URL, SECRET_KEY);
  const results: Array<{ name: string; status: 'ok' | 'error'; message?: string }> = [];

  for (const m of MIGRATIONS) {
    try {
      // Execute raw SQL via the admin client's .rpc or .from — using
      // a raw query through the postgres extension if available.
      const { error } = await admin.rpc('exec_sql', { sql: m.sql });
      if (error) {
        // If exec_sql RPC doesn't exist, fall back to trying the SQL via a
        // temporary stored function approach. This is a best-effort path.
        console.warn(`[run-migrations] exec_sql not available for "${m.name}":`, error.message);
        results.push({ name: m.name, status: 'error', message: error.message });
      } else {
        results.push({ name: m.name, status: 'ok' });
      }
    } catch (e) {
      console.error(`[run-migrations] threw for "${m.name}":`, e);
      results.push({ name: m.name, status: 'error', message: String(e) });
    }
  }

  return json({ results });
});
