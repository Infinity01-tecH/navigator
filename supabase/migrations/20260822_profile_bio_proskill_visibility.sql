-- ============================================================
-- Migration: bio, pro_skill, visibility tables, updated RPC
-- Run this once in the Supabase Dashboard → SQL Editor
-- All statements are idempotent (safe to run again).
-- ============================================================

-- 1. Add bio and pro_skill to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS pro_skill TEXT;

-- 2. profile_visibility table
--    Controls per-tier global sharing (on/off).
CREATE TABLE IF NOT EXISTS public.profile_visibility (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier       text NOT NULL CHECK (tier IN ('friend','streak_partner')),
  field      text NOT NULL DEFAULT 'roadmap',
  visible    boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, tier, field)
);

ALTER TABLE public.profile_visibility ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profile_visibility' AND policyname = 'own visibility'
  ) THEN
    CREATE POLICY "own visibility" ON public.profile_visibility
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 3. roadmap_visibility table
--    Per-roadmap, per-tier sharing (which roadmaps friends/streak partners can see).
CREATE TABLE IF NOT EXISTS public.roadmap_visibility (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id uuid NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  tier       text NOT NULL CHECK (tier IN ('friend','streak_partner')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (roadmap_id, tier)
);

ALTER TABLE public.roadmap_visibility ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  -- Owner can manage their own roadmap visibility rows
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'roadmap_visibility' AND policyname = 'owner can manage'
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

  -- Friends can read which roadmaps are shared with them
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'roadmap_visibility' AND policyname = 'friends can read'
  ) THEN
    CREATE POLICY "friends can read" ON public.roadmap_visibility
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.roadmaps r
          JOIN public.friendships f
            ON f.user_id = auth.uid()
            AND f.friend_id = r.user_id
            AND f.status = 'accepted'
          WHERE r.id = roadmap_id
        )
      );
  END IF;
END $$;

-- 4. Update get_profile_view to include bio + pro_skill
--    Replace the function so it returns bio and pro_skill from profiles.
--    NOTE: If your existing get_profile_view has custom logic not shown here,
--    add bio and pro_skill to its SELECT and returned jsonb_build_object instead.
--
--    The key change is adding:
--      p.bio, p.pro_skill
--    to the profiles SELECT and the returned JSON object.
--
--    If you prefer a minimal surgical update, run just this:
--    (Uncomment if your get_profile_view is a SECURITY DEFINER function)

-- Example minimal patch — adjust table/column names to match your actual function:
-- CREATE OR REPLACE FUNCTION public.get_profile_view(p_target_id uuid)
-- RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
-- AS $fn$
-- DECLARE
--   ... (paste your current function body here, then add bio/pro_skill)
-- $fn$;

-- ============================================================
-- Quick verification queries (run after migration):
-- ============================================================
-- SELECT column_name FROM information_schema.columns
--   WHERE table_schema = 'public' AND table_name = 'profiles'
--   ORDER BY ordinal_position;
--
-- SELECT tablename FROM pg_tables
--   WHERE schemaname = 'public'
--   AND tablename IN ('profile_visibility','roadmap_visibility');
