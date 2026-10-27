import { supabase } from './supabase';
import type { Roadmap } from './generateRoadmap';
import type { RoadmapEntry } from './context';

// ─── Roadmap + KV persistence ──────────────────────────────────────────────────
// Roadmaps (with their own per-roadmap progress, completion timestamps, and pin
// flag) live in a `roadmaps` table so a refresh — or another device — restores
// them. Notes and achievements mirror into a generic `user_kv` table. Every
// function is defensive: if the table is missing or the user is signed out it
// degrades to a no-op / [] / null rather than throwing, so the in-memory /
// localStorage experience keeps working even before the migration is applied.
//
// Run once in the Supabase SQL editor (see the assistant message for the full
// migration, including the new `completed_at` + `pinned` columns and `user_kv`):
//
//   create table if not exists public.roadmaps (
//     id uuid primary key default gen_random_uuid(),
//     user_id uuid not null references auth.users(id) on delete cascade,
//     skill text,
//     data jsonb not null,
//     progress jsonb not null default '{}'::jsonb,
//     completed_at jsonb not null default '{}'::jsonb,
//     pinned boolean not null default false,
//     created_at timestamptz not null default now(),
//     updated_at timestamptz not null default now()
//   );
//   alter table public.roadmaps enable row level security;
//   create policy "own roadmaps" on public.roadmaps
//     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
//
//   create table if not exists public.user_kv (
//     user_id uuid not null references auth.users(id) on delete cascade,
//     key text not null,
//     value jsonb not null,
//     updated_at timestamptz not null default now(),
//     primary key (user_id, key)
//   );
//   alter table public.user_kv enable row level security;
//   create policy "own kv" on public.user_kv
//     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
//
// 005_finish_date_projection.sql additionally reads two more columns that
// must exist on `roadmaps` before saveRoadmap() below can populate them —
// CREATE FUNCTION does not validate column references at creation time, only
// when the function actually runs, so a missing column here won't surface as
// an error until the first live projection fetch. Run this if it hasn't been
// run yet (safe to re-run, `if not exists` makes it a no-op otherwise):
//
//   alter table public.roadmaps
//     add column if not exists hours_per_day numeric,
//     add column if not exists days_per_week int;
//
// These capture the plan the user actually set on Time.tsx at the moment the
// roadmap was created — project_roadmap_finish_date() reads days_per_week to
// compute the catch-up backlog projection. Without a value stamped here at
// insert time, that RPC has nothing real to calculate from.

const LOCAL_PREFIX = 'local_';
const isLocal = (id: string) => id.startsWith(LOCAL_PREFIX) || id.startsWith('dev-bypass');

// ── Roadmaps ────────────────────────────────────────────────────────────────────

// Load every roadmap for the current user, newest first.
export async function listRoadmaps(): Promise<RoadmapEntry[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('roadmaps')
      .select('id, data, progress, completed_at, pinned, created_at, today_plan_date, today_plan_step_ids')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) { console.warn('[roadmapStore] listRoadmaps failed:', error.message); return []; }
    return (data ?? []).map(row => ({
      id: row.id as string,
      roadmap: row.data as Roadmap,
      progress: (row.progress ?? {}) as Record<string, boolean>,
      completedAt: (row.completed_at ?? {}) as Record<string, number>,
      pinned: !!row.pinned,
      createdAt: new Date(row.created_at as string).getTime(),
      // Null on any pre-009 row or a fresh insert — TodayView/StreakPartnerCard
      // both treat todayPlanDate !== today as "stale, recompute" (see
      // selectTodayPlan in generateRoadmap.ts), so this degrades safely: the
      // first read after the migration just computes and persists a plan
      // instead of assuming one already exists.
      todayPlanDate: (row.today_plan_date as string | null) ?? null,
      todayPlanStepIds: (row.today_plan_step_ids ?? []) as string[],
    }));
  } catch (e) {
    console.warn('[roadmapStore] listRoadmaps threw:', e);
    return [];
  }
}

// Cheap existence check for the splash-gate: does this user have at least one
// saved roadmap, without paying for the full `data` jsonb blob per row.
// `head: true` tells PostgREST to skip returning rows entirely and just give
// us a count — this is the whole point versus reusing listRoadmaps() here.
export async function hasAnyRoadmap(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { count, error } = await supabase
      .from('roadmaps')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (error) { console.warn('[roadmapStore] hasAnyRoadmap failed:', error.message); return false; }
    return (count ?? 0) > 0;
  } catch (e) {
    console.warn('[roadmapStore] hasAnyRoadmap threw:', e);
    return false;
  }
}

// Insert a freshly generated roadmap (pinned) and return its row id (null on fail).
// Throws if the insert is rejected by PostgREST (e.g. schema mismatch) so the
// Generating screen can surface the real error rather than silently losing the roadmap.
//
// `pace` stamps hours_per_day/days_per_week onto the row at creation time —
// see the 005-migration note at the top of this file. Optional + defaulted
// (matching AppState's own DEFAULT in context.tsx: 1.5h/day, 5 days/week)
// rather than required, so a caller that forgets to pass it still gets a
// sane row instead of nulls the projection RPC can't do anything with.
export async function saveRoadmap(
  roadmap: Roadmap,
  pace?: { hoursPerDay: number; daysPerWeek: number },
): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('roadmaps')
    .insert({
      user_id: user.id,
      skill: roadmap.skill,
      data: roadmap,
      progress: {},
      completed_at: {},
      pinned: true,
      hours_per_day: pace?.hoursPerDay ?? 1.5,
      days_per_week: pace?.daysPerWeek ?? 5,
    })
    .select('id')
    .single();

  if (error) {
    // The roadmap-limit trigger (roadmap_limits.sql) raises a message that
    // starts with ROADMAP_LIMIT_ACTIVE / ROADMAP_LIMIT_DAILY. Pass it through
    // untouched (no "[DB]" prefix) so Generating.tsx can show it as a friendly
    // limit message instead of a generic failure.
    if (error.message.includes('ROADMAP_LIMIT_')) {
      throw new Error(error.message.slice(error.message.indexOf('ROADMAP_LIMIT_')));
    }
    // Surface schema / permission errors to the caller rather than swallowing them.
    const detail = (error as any)?.details ?? '';
    throw new Error(`[DB] ${error.message}${detail ? ` (${detail})` : ''}`);
  }
  return data?.id ?? null;
}

// How many unfinished roadmaps / new roadmaps in the last 24h this user has,
// and the limits. Returns null if the quota function isn't installed yet or the
// user is signed out, so callers can treat "unknown" as "don't block". Handy for
// disabling a "Create New Roadmap" button early with a friendly message.
export interface RoadmapQuota {
  incomplete: number;
  createdToday: number;
  maxActive: number;
  maxDaily: number;
}

export async function getRoadmapQuota(): Promise<RoadmapQuota | null> {
  try {
    const { data, error } = await supabase.rpc('roadmap_quota');
    if (error) { console.warn('[roadmapStore] getRoadmapQuota failed:', error.message); return null; }
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) return null;
    return {
      incomplete: row.incomplete,
      createdToday: row.created_today,
      maxActive: row.max_active,
      maxDaily: row.max_daily,
    };
  } catch (e) {
    console.warn('[roadmapStore] getRoadmapQuota threw:', e);
    return null;
  }
}

// Persist progress + completion timestamps for one roadmap (fire-and-forget).
// Deliberately does NOT touch today_plan_date/today_plan_step_ids — see
// persistTodayPlan() below, which is the only writer for those two columns.
// Keeping them on separate update calls means an ordinary toggleStep()
// click (which calls this) can never accidentally clobber or reset the
// stored plan; only an explicit "the plan is stale, recompute it" path
// touches it.
export async function persistEntry(entry: RoadmapEntry): Promise<void> {
  if (isLocal(entry.id)) return; // preview roadmaps aren't in the table
  try {
    const { error } = await supabase
      .from('roadmaps')
      .update({
        progress: entry.progress,
        completed_at: entry.completedAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', entry.id);
    if (error) console.warn('[roadmapStore] persistEntry failed:', error.message);
  } catch (e) {
    console.warn('[roadmapStore] persistEntry threw:', e);
  }
}

// Persists a freshly computed today's-plan (see selectTodayPlan in
// generateRoadmap.ts). Called once per day, the first time TodayView or
// StreakPartnerCard notices todayPlanDate !== today's local date — never
// called from toggleStep, so a checkbox click can't touch this.
export async function persistTodayPlan(
  entryId: string,
  todayPlanDate: string,
  todayPlanStepIds: string[],
): Promise<void> {
  if (isLocal(entryId)) return;
  try {
    const { error } = await supabase
      .from('roadmaps')
      .update({
        today_plan_date: todayPlanDate,
        today_plan_step_ids: todayPlanStepIds,
        updated_at: new Date().toISOString(),
      })
      .eq('id', entryId);
    if (error) console.warn('[roadmapStore] persistTodayPlan failed:', error.message);
  } catch (e) {
    console.warn('[roadmapStore] persistTodayPlan threw:', e);
  }
}

// Set the single pinned roadmap for the user (pass null to clear all pins).
export async function setPinnedRemote(id: string | null): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('roadmaps').update({ pinned: false }).eq('user_id', user.id);
    if (id && !isLocal(id)) {
      await supabase.from('roadmaps').update({ pinned: true }).eq('id', id);
    }
  } catch (e) {
    console.warn('[roadmapStore] setPinnedRemote threw:', e);
  }
}

export async function deleteRoadmapRemote(id: string): Promise<void> {
  if (isLocal(id)) return;
  try {
    const { error } = await supabase.from('roadmaps').delete().eq('id', id);
    if (error) console.warn('[roadmapStore] deleteRoadmapRemote failed:', error.message);
  } catch (e) {
    console.warn('[roadmapStore] deleteRoadmapRemote threw:', e);
  }
}

export async function deleteAllRoadmapsRemote(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('roadmaps').delete().eq('user_id', user.id);
    if (error) console.warn('[roadmapStore] deleteAllRoadmapsRemote failed:', error.message);
  } catch (e) {
    console.warn('[roadmapStore] deleteAllRoadmapsRemote threw:', e);
  }
}

// ── Generic key-value store (notes, achievements, profile name) ──────────────────

export async function kvGet<T>(key: string): Promise<T | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from('user_kv')
      .select('value')
      .eq('user_id', user.id)
      .eq('key', key)
      .maybeSingle();
    if (error) { console.warn('[roadmapStore] kvGet failed:', error.message); return null; }
    return (data?.value ?? null) as T | null;
  } catch (e) {
    console.warn('[roadmapStore] kvGet threw:', e);
    return null;
  }
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from('user_kv')
      .upsert({ user_id: user.id, key, value, updated_at: new Date().toISOString() }, { onConflict: 'user_id,key' });
    if (error) console.warn('[roadmapStore] kvSet failed:', error.message);
  } catch (e) {
    console.warn('[roadmapStore] kvSet threw:', e);
  }
}

// ── Profile display name ─────────────────────────────────────────────────────────
const NAME_KEY = 'nav_display_name';

export function loadProfileName(): string {
  try { return localStorage.getItem(NAME_KEY) ?? ''; } catch { return ''; }
}

export function saveProfileName(name: string): void {
  try { localStorage.setItem(NAME_KEY, name); } catch { /* ignore */ }
  kvSet('profile_name', name);
}

// ── Avatar (SVG from the DiceBear editor overlay — Phase 6) ─────────────────────
// Same shape as loadProfileName/saveProfileName exactly: localStorage-first,
// fire-and-forget kvSet mirror via the existing generic KV helpers above — not
// a bespoke .from('user_kv').upsert() call. No new table, no new RLS policy,
// no read-back-on-sign-in hydration step (profileName doesn't have one either,
// confirmed by reading context.tsx's sign-in effect directly — see
// AVATAR_TASK_ROADMAP_v3.md Phase 6 notes for why that's a deliberate match,
// not an oversight).
//
// Cost worth knowing: `value` on user_kv is jsonb. A profile name is a few
// bytes; an avatar SVG is ~4-5KB (confirmed in Phase 5 testing) — jsonb
// happily stores that as a quoted string, but it's paying JSON
// serialization overhead on a multi-KB blob with zero structural benefit.
// Fine at this size. If avatars grow substantially (denser styles, bigger
// canvases), this is the first seam that breaks — revisit with a dedicated
// column or Supabase Storage at that point, not before.
const AVATAR_KEY = 'nav_avatar_svg';

export function loadAvatar(): string {
  try { return localStorage.getItem(AVATAR_KEY) ?? ''; } catch { return ''; }
}

export function saveAvatar(svg: string): void {
  try { localStorage.setItem(AVATAR_KEY, svg); } catch { /* ignore */ }
  kvSet('avatar_svg', svg);
}
