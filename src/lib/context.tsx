import { createContext, useContext, useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import type { Roadmap } from './generateRoadmap';
import { selectTodayPlan, generateRelatedSkills, buildPlaceholderRoadmap } from './generateRoadmap';
import { supabase } from './supabase';
import {
  listRoadmaps, saveRoadmap as saveRoadmapRemote, persistEntry, persistTodayPlan, setPinnedRemote,
  deleteRoadmapRemote, deleteAllRoadmapsRemote, loadProfileName, saveProfileName,
  loadAvatar, saveAvatar, kvGet,
} from './roadmapStore';
import { createAvatar } from './avatarEditor/createAvatar';
import { hydrateUserData } from './sync';

export type Mode = 'full' | 'sprint' | 'youtube';
export type LearningType = 'skill' | 'subject';
export type YtLevel = 'beginner' | 'some' | 'advanced';

// ─── Auth user, derived from the Supabase session ──────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  name: string;        // full name from OAuth metadata, or email local-part
  firstName: string;   // first token of name
  initial: string;     // single uppercase letter for the avatar
}

function deriveUser(session: import('@supabase/supabase-js').Session | null): AuthUser | null {
  if (!session?.user) return null;
  const u = session.user;
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  const email = u.email ?? '';
  const rawName =
    (meta.full_name as string) ||
    (meta.name as string) ||
    (email ? email.split('@')[0] : 'Learner');
  const name = (rawName || 'Learner').trim() || 'Learner';
  const firstName = name.split(/\s+/)[0];
  const initial = (name[0] || 'L').toUpperCase();
  return { id: u.id, email, name, firstName, initial };
}

// ─── A roadmap + everything scoped to it ────────────────────────────────────────
// progress + completedAt + pinned all live per-roadmap so Reset/Delete and the
// "This week" stat can be scoped correctly. `preview` marks an ephemeral free
// roadmap that is never written to Supabase.
export interface RoadmapEntry {
  id: string;
  roadmap: Roadmap;
  progress: Record<string, boolean>;
  completedAt: Record<string, number>;
  pinned: boolean;
  createdAt: number;
  preview?: boolean;
  // Persisted today's-plan (see selectTodayPlan in generateRoadmap.ts and
  // migration 009_today_plan.sql). null/stale (todayPlanDate !== today's
  // local date) means "recompute and persist" — see ensureTodayPlan below.
  // Completing a step never changes this list, only its done state in
  // `progress` — that's what stops the plan from reshuffling on every click.
  todayPlanDate: string | null;
  todayPlanStepIds: string[];
}

// The active roadmap is the pinned one, else the most recently created.
export function activeEntryOf(roadmaps: RoadmapEntry[]): RoadmapEntry | null {
  if (roadmaps.length === 0) return null;
  return roadmaps.find(r => r.pinned) ?? [...roadmaps].sort((a, b) => b.createdAt - a.createdAt)[0];
}

// Pinned first, then newest-first.
export function sortedRoadmaps(roadmaps: RoadmapEntry[]): RoadmapEntry[] {
  return [...roadmaps].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt - a.createdAt;
  });
}

function localId(): string {
  return `local_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

// Days in the last 7 logged 'broken' or 'grace' in streak_log — i.e. days the
// user didn't complete a task, whether or not the streak itself survived it.
// Deliberately excludes 'frozen' (a declared, spent freeze) and 'completed'.
// Per handoff §0.3/§0.5: `count(*) where status in ('broken','grace') and
// day >= today - 7`. RLS on streak_log allows a user to read their own rows
// directly (see 001_streak_system.sql "own log read" policy), so this is a
// plain client-side query, not an RPC.
//
// Known limitation, not fixed here: the 7-day cutoff is computed with
// `toISOString()`, which normalizes to UTC. Note this is a *different* gap
// than the one 004_streak_timezone_fix.sql closed — that migration fixed
// what "today" means inside complete_task()/activate_freeze() (server vs.
// user-local day). This function's own 7-day window is still computed
// client-side with UTC and hasn't been touched. Same class of bug, not yet
// applied here — worth doing in the same pass if this ever gets revisited.
// Local (not UTC) 'YYYY-MM-DD' for a given Date. Used anywhere a day-key has
// to line up 1:1 with a specific streak_log row rather than just bound a
// count — see fetchRecentStreakDays below, which is why this exists as a
// named export instead of staying private to this file.
export function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const DEV_BYPASS_USER_ID = 'dev-bypass';
const DEV_BYPASS_ROADMAP_ID = 'dev-bypass-roadmap';

async function fetchMissedDaysThisWeek(userId: string): Promise<number | null> {
  if (userId === DEV_BYPASS_USER_ID) return 0;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10); // YYYY-MM-DD

  const { count, error } = await supabase
    .from('streak_log')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('status', ['broken', 'grace'])
    .gte('day', sevenDaysAgoStr);

  if (error) {
    console.error('fetchMissedDaysThisWeek failed:', error);
    return null;
  }
  return count ?? 0;
}

// Plain read of the user's current/longest streak from user_stats — used on
// initial hydration, when there's no completion event to piggyback the
// numbers off of (complete_task() only returns them as a side effect of a
// write; a returning user who hasn't completed anything yet this session
// still needs their existing streak to show up). RLS's "own stats read"
// policy (001_streak_system.sql) allows this as a direct client select, no
// RPC needed — same reasoning as fetchMissedDaysThisWeek above.
// NOTE: also reads `xp` now — the same orphaned user_stats.xp column
// SESSION_HANDOFF_3.md §0.6 flagged as live-but-unused. This is the one
// read every signed-in hydration already does for streak numbers, so
// piggybacking quiz-XP's server value on it is a free extra column, not a
// second round-trip. See adjust_quiz_xp() (new migration) for the write side.
async function fetchCurrentStreak(userId: string): Promise<{ current: number; longest: number; xp: number } | null> {
  if (userId === DEV_BYPASS_USER_ID) return { current: 3, longest: 7, xp: 0 };
  const { data, error } = await supabase
    .from('user_stats')
    .select('current_streak, longest_streak, xp')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('fetchCurrentStreak failed:', error);
    return null;
  }
  // No row yet = user has never completed a task = a real, honest 0, not
  // "unknown". complete_task() only inserts the row on first completion.
  if (!data) return { current: 0, longest: 0, xp: 0 };
  return { current: data.current_streak ?? 0, longest: data.longest_streak ?? 0, xp: data.xp ?? 0 };
}

// Real per-day status for the centered streak strip (today ± 3 days) —
// keyed by local day string, not just a count like fetchMissedDaysThisWeek
// above. Only 4 of those 7 days can ever have a row (today and the 3 before
// it); the 3 ahead of today are always absent since a day that hasn't
// happened can't have a logged status. A missing key means "no data," which
// the UI treats the same whether that's because the day is in the future or
// because it predates any tracked activity — it doesn't try to tell those
// two apart.
//
// Deliberately uses localDateStr (local calendar day), not
// `toISOString().slice(0,10)` (UTC) like fetchMissedDaysThisWeek does. That
// function only bounds a count, so a UTC vs. local mismatch at most shifts
// it by one for a day near the boundary. This one keys individual dots —
// the same mismatch here would show the wrong status on an actual cell, not
// just a slightly-off number. Correctness here depends on profiles.timezone
// actually matching the browser's zone; see the capture effect below.
async function fetchRecentStreakDays(userId: string): Promise<Record<string, string> | null> {
  if (userId === DEV_BYPASS_USER_ID) {
    const days: Record<string, string> = {};
    const today = new Date();
    for (let i = 0; i < 3; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days[localDateStr(d)] = 'completed';
    }
    return days;
  }
  // 155 days back covers the 5-month calendar panel (2 before + current + 2
  // after) with a small buffer. No upper bound — the query naturally stops at
  // today since complete_task() never writes future rows.
  const start = new Date();
  start.setDate(start.getDate() - 155);
  const startStr = localDateStr(start);

  const { data, error } = await supabase
    .from('streak_log')
    .select('day, status')
    .eq('user_id', userId)
    .gte('day', startStr);

  if (error) {
    console.error('fetchRecentStreakDays failed:', error);
    return null;
  }
  const map: Record<string, string> = {};
  for (const row of data ?? []) map[row.day as string] = row.status as string;
  return map;
}

// ─── Streak status: pending-miss detection + live freeze-window math ──────────
//
// Why this exists separately from fetchRecentStreakDays: that function only
// reads *confirmed* streak_log rows, which only exist after complete_task()
// has actually written them. Two real cases need an answer streak_log can't
// give:
//
//   1. "Is there a pending miss the two-choice screen should show right now?"
//      This needs the same gap math complete_task() itself uses
//      (today − last_completed_on), not a 4-day window read. A user who
//      hasn't opened the app in 10 days has no recentStreakDays entry for
//      today, same as a user who just hasn't done today's task yet at 9am —
//      those are different situations and streak_log alone can't tell them
//      apart.
//   2. "Is today inside an active freeze window?" activate_freeze() only
//      writes freeze_active/freeze_started_on/freeze_days to user_stats at
//      activation time — it does NOT write streak_log rows for the days the
//      freeze will cover. Those rows only get backfilled later, when the
//      user returns and completes a task (see SESSION_HANDOFF_3.md §0.7/
//      §0.8). Until then, streak_log has no record the freeze is happening
//      at all, so StreakStrip needs this live-computed answer to render an
//      active freeze correctly instead of showing today as blank.
//
// Both answers come from the same small read of user_stats, RLS-readable
// directly by the owner (same policy fetchCurrentStreak already relies on).
export interface StreakStatus {
  hasPendingMiss: boolean;
  freezeActiveToday: boolean;
  freezeDaysRemaining: number | null; // null when no active freeze
}

async function fetchStreakStatus(userId: string): Promise<StreakStatus | null> {
  if (userId === DEV_BYPASS_USER_ID) return { hasPendingMiss: false, freezeActiveToday: false, freezeDaysRemaining: null };
  const { data, error } = await supabase
    .from('user_stats')
    .select('last_completed_on, freeze_active, freeze_started_on, freeze_days')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('fetchStreakStatus failed:', error);
    return null;
  }

  // No row yet = never completed a task = nothing to resolve, no freeze possible.
  if (!data || !data.last_completed_on) {
    return { hasPendingMiss: false, freezeActiveToday: false, freezeDaysRemaining: null };
  }

  const today = new Date();
  const todayStr = localDateStr(today);
  const lastCompleted = new Date(data.last_completed_on + 'T00:00:00');
  const gapDays = Math.round((new Date(todayStr + 'T00:00:00').getTime() - lastCompleted.getTime()) / 86_400_000);

  // Mirrors activate_freeze()/complete_task()'s own boundary, confirmed identical
  // on both RPCs per SESSION_HANDOFF_3.md §0.6: valid while
  // today − freeze_started_on <= freeze_days (protects activation day + N more).
  if (data.freeze_active && data.freeze_started_on && data.freeze_days != null) {
    const freezeStart = new Date(data.freeze_started_on + 'T00:00:00');
    const elapsed = Math.round((new Date(todayStr + 'T00:00:00').getTime() - freezeStart.getTime()) / 86_400_000);
    if (elapsed <= data.freeze_days) {
      return {
        hasPendingMiss: false, // covered by the active freeze — nothing to resolve
        freezeActiveToday: true,
        freezeDaysRemaining: data.freeze_days - elapsed,
      };
    }
    // Freeze has lapsed (elapsed > freeze_days). Falls through to the normal
    // gap check below — activate_freeze() itself blocks re-freezing in this
    // state (see §0.3.1), so the two-choice screen should only offer "do task"
    // here, not "freeze" again. That distinction is the caller's job (it has
    // this same freezeActiveToday=false + hasPendingMiss=true combination to
    // work with); this function only reports state, it doesn't decide UI copy.
  }

  // gapDays === 0: completed today already, nothing pending.
  // gapDays === 1: yesterday was a miss but complete_task()'s own grace-path
  //   (Case 4, gap === 2 relative to *its* last_completed_on before today's
  //   write) means this is exactly the situation the two-choice screen exists
  //   for — surface it.
  // gapDays >= 1, no active freeze: a miss is sitting unresolved. Show it
  //   regardless of exactly how large the gap is — complete_task() itself
  //   decides grace vs. hard-reset server-side once they act; the frontend's
  //   only job here is "is there something to resolve," not replicate every
  //   branch of that decision.
  return { hasPendingMiss: gapDays >= 1, freezeActiveToday: false, freezeDaysRemaining: null };
}

// ─── Roadmap finish-date projection (catch-up backlog model) ──────────────────
//
// See project_roadmap_finish_date() (005_finish_date_projection.sql). Mirrors
// StreakStatus's null-until-loaded contract. Uses "option 2" timezone
// handling — both date params passed into the RPC are computed client-side
// via localDateStr(), the same helper the streak strip relies on, so this
// and the streak day-keys can never disagree about what "today" means. The
// SQL function itself does zero timezone logic — see the migration for why.
//
// Depends on roadmaps.hours_per_day / roadmaps.days_per_week actually
// existing and being populated — see the pace-stamping note in addRoadmap()
// below and the column-add note at the top of roadmapStore.ts. A row saved
// before that existed will read as null pace inside the RPC and the
// projection for it will not be meaningful.
export interface RoadmapProjection {
  total_steps: number;
  completed_steps: number;
  active_days_elapsed: number;
  expected_steps_by_now: number;
  backlog: number;
  pushed_days: number;
  original_target_date: string;
  projected_finish_date: string;
}

// Scoped to a single roadmap (unlike the streak fetchers above, which are
// scoped to the user). RLS/ownership is enforced server-side inside the RPC
// itself (r.user_id = auth.uid()) — a bad or someone-else's roadmapId just
// returns no rows here, not their data.
// offsetDays lets DevStreakPanel's Ctrl+Shift+P simulate "N days have
// passed" without waiting real time or hand-editing Supabase rows. It only
// shifts the `p_today` value sent to the RPC — completed_steps and
// created_at both stay real, which is the entire point (see the projection
// section's header comment above): this exercises the real backlog SQL
// against real progress, it doesn't fake a display number. Defaults to 0 so
// every non-dev call site is unaffected.
async function fetchProjection(roadmapId: string, createdAt: number, offsetDays = 0): Promise<RoadmapProjection | null> {
  if (roadmapId === DEV_BYPASS_ROADMAP_ID) return null;
  const todayDate = new Date();
  if (offsetDays) todayDate.setDate(todayDate.getDate() + offsetDays);
  const today = localDateStr(todayDate);
  const createdLocal = localDateStr(new Date(createdAt));

  const { data, error } = await supabase.rpc('project_roadmap_finish_date', {
    p_roadmap_id: roadmapId,
    p_today: today,
    p_created_local: createdLocal,
  });

  if (error) {
    console.error('fetchProjection failed:', error);
    return null;
  }
  return data?.[0] ?? null;
}

export interface AppState {
  skill: string;
  learningType: LearningType;
  mode: Mode;
  answers: Record<string, string>;
  level: number | null;
  hoursPerDay: number;
  daysPerWeek: number;
  sprintDays: number;
  sprintGoal: string;
  ytSource: 'single' | 'multi';
  ytCreator: string;
  ytLevel: YtLevel;
  ytAiPick: boolean;
  free: boolean;
  roadmaps: RoadmapEntry[];
  roadmapSkill: string;
}

const DEFAULT: AppState = {
  skill: '',
  learningType: 'skill',
  mode: 'full',
  answers: {},
  level: null,
  hoursPerDay: 1.5,
  daysPerWeek: 5,
  sprintDays: 7,
  sprintGoal: '',
  ytSource: 'single',
  ytCreator: '',
  ytLevel: 'beginner',
  ytAiPick: false,
  free: true,
  roadmaps: [],
  roadmapSkill: '',
};

const Ctx = createContext<{
  state: AppState;
  set: (partial: Partial<AppState>) => void;
  reset: () => void;
  user: AuthUser | null;
  authReady: boolean;
  // true once the post-auth roadmap fetch for this session has resolved (or
  // been skipped, for guests). Start.tsx's returning-user redirect depends on
  // this, not authReady alone — authReady only means "we know if there's a
  // session," not "we know if there are roadmaps yet."
  roadmapsHydrated: boolean;
  username: string | null;
  signOut: () => Promise<void>;
  devBypassLogin: () => void;
  // Multi-roadmap helpers
  activeEntry: RoadmapEntry | null;
  profileName: string;
  setProfileName: (name: string) => void;
  // SVG string of the user's chosen avatar (from the DiceBear editor overlay
  // — see AvatarEditorOverlay.tsx). Empty string means "no custom avatar set
  // yet" — UI falls back to the existing initial-letter circle.
  avatarSvg: string;
  setAvatarSvg: (svg: string) => void;
  addRoadmap: (roadmap: Roadmap, opts?: { preview?: boolean }) => Promise<string>;
  toggleStep: (entryId: string, stepId: string) => void;
  ensureTodayPlan: (entryId: string) => void;
  // Backfills roadmap.skill_web.adjacent via a small standalone AI call
  // (generateRelatedSkills, generateRoadmap.ts) for roadmaps generated before
  // that field had real prompt instructions. Called from the Inspire feed,
  // BLOCKING, the first time a roadmap's adjacent list is empty and is
  // actually needed (tier-1 skill search came back thin) — see Main.tsx's
  // InspireView for the call site and the product decision to block rather
  // than run this in the background. No-ops (resolves immediately) if
  // roadmap.skill_web.adjacent already has entries, so this is safe to call
  // unconditionally on every "need related skills" moment without needing
  // separate staleness tracking the way ensureTodayPlan needs a date check.
  ensureRelatedSkills: (entryId: string) => Promise<string[]>;
  pinRoadmap: (id: string) => void;
  unpinRoadmap: (id: string) => void;
  resetRoadmapProgress: (id: string | 'all') => void;
  deleteRoadmap: (id: string | 'all') => void;
  // Declares a freeze window, 1–10 days. Throws on failure (lapsed-freeze
  // re-attempt, quota exhausted) — callers should catch and surface the error.
  activateFreeze: (days: number) => Promise<void>;
  // Streak: count of days in the last 7 logged 'broken' or 'grace'. null
  // until the first successful fetch (on hydration or after a completion).
  missedDaysThisWeek: number | null;
  // Real streak numbers from complete_task()'s return row (or the initial
  // hydration fetch below). null until the first successful read — callers
  // should treat null as "not loaded yet", not "streak is zero". A genuine
  // zero-streak user (no completions yet) is 0, not null.
  currentStreak: number | null;
  longestStreak: number | null;
  // Real per-day streak_log status for today ± 3 days, keyed by local
  // 'YYYY-MM-DD'. null until the first successful fetch; a day simply absent
  // from the map (not null) means no log row for that day — see
  // fetchRecentStreakDays above for what that does and doesn't distinguish.
  recentStreakDays: Record<string, string> | null;
  // Live-computed streak status — pending miss + active-freeze math that
  // streak_log can't answer on its own (see fetchStreakStatus above for why).
  // null until the first successful fetch.
  streakStatus: StreakStatus | null;
  // Live finish-date projection for the active roadmap — null until loaded,
  // or permanently null for a preview roadmap (never persisted, nothing to
  // query). Refetched on active-roadmap change and after every completion —
  // see the effect + recordTaskCompletion in AppProvider below.
  projection: RoadmapProjection | null;
  // DEV-ONLY (always 0 outside a dev build — see devSimulateProjection).
  // Exposed read-only here so any component (e.g. StreakCalendarPanel) can
  // reflect "today through today+offsetDays" as simulated without each
  // consumer needing its own copy of the offset math. Not itself gated on
  // import.meta.env.DEV the way the setters are, because reading a number
  // that's always 0 in production is harmless — only the two functions that
  // can *change* it are gated.
  projectionOffsetDays: number;
  // Watch.tsx chapter-quiz XP — see the QUIZ_XP_KEY block near
  // clearEarnedFor for why this is a real stored counter, not a
  // live-recompute like Main.tsx's step-based xpModel(). Cross-device: every
  // adjustQuizXp() call is mirrored through the atomic adjust_quiz_xp() RPC
  // (new migration) when signed in, same security-definer pattern
  // complete_task()/activate_freeze() use for exactly this "two devices
  // near-simultaneously" requirement — NOT the user_kv/notes blob-sync
  // pattern, which is last-write-wins and wrong for a running total.
  // localStorage remains a fast local cache / guest-mode fallback, not the
  // source of truth for a signed-in user anymore (see hydration effect).
  // NOTE: Main.tsx's xpModel() does not yet add this into its displayed
  // total — that's a one-line follow-up in a file not touched this pass.
  quizXp: number;
  adjustQuizXp: (delta: number) => void;
  // DEV-ONLY. No-ops outside import.meta.env.DEV. See the "DEV-ONLY: streak
  // testing overrides" block in AppProvider for the full contract — never
  // touches Supabase, purely overrides client render state for testing.
  // Delete this line + its AppProvider block + DevStreakPanel.tsx together
  // once streak-state testing no longer needs a shortcut.
  devOverrideStreak: (opts: {
    streak?: number;
    frozen?: boolean;
    freezeDaysRemaining?: number;
    grace?: boolean;
    broken?: boolean;
    pendingMiss?: boolean;
    reset?: boolean;
  }) => void;
  // DEV-ONLY. See devSimulateProjection's own comment above its definition
  // in AppProvider — separate contract from devOverrideStreak, real
  // (read-only) Supabase call under a simulated date, not a pure in-memory
  // override. Delete alongside devOverrideStreak per the same checklist.
  devSimulateProjection: (offsetDays: number) => void;
}>(null!);

function clearEarnedFor(entryId: string) {
  try { localStorage.removeItem(`nav_earned_ach_${entryId}`); } catch { /* ignore */ }
}

// ─── Quiz XP (Watch.tsx chapter-quiz outcomes) ─────────────────────────────────
// Separate from Main.tsx's xpModel() (completedSteps × 50, live-recomputed
// from roadmaps.progress, per SESSION_HANDOFF_3.md §0.4) — that mechanism is
// deliberately NOT a stored running total, because unchecking a step needs
// XP to go back down and a running total can't do that without its own
// decrement logic. Quiz XP doesn't have that problem: a chapter's quiz
// resolves once and stays resolved, there's nothing to "uncheck," so a real
// additive counter is the correct shape here, not a reversal of that
// decision. +2 on a pass, -3 per still-wrong question on a forced
// pass-through, floored at 0.
//
// Local cache + guest/preview-mode fallback (no user, nothing to sync to).
// For a signed-in user this is no longer the source of truth — see
// adjustQuizXp and the hydration effect below, which reconcile it against
// the server's user_stats.xp on every sign-in via the atomic
// adjust_quiz_xp() RPC. Kept localStorage-first, same nav_*-prefixed
// convention as streak/achievement/display-name data (HANDOFF.md §13), so
// the UI still has a number to show instantly before hydration resolves.
const QUIZ_XP_KEY = 'nav_quiz_xp';
// Guards the one-time "push whatever I had locally before sync existed up
// to the server" reconciliation in the hydration effect below, so a returning
// signed-in user doesn't re-push the same local value on every single
// sign-in (which would double-count it against the server total each time).
const QUIZ_XP_MIGRATED_KEY = 'nav_quiz_xp_migrated';

function loadQuizXp(): number {
  try {
    const raw = localStorage.getItem(QUIZ_XP_KEY);
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch { return 0; }
}

function saveQuizXp(n: number) {
  try { localStorage.setItem(QUIZ_XP_KEY, String(n)); } catch { /* ignore */ }
}

function hasMigratedLocalQuizXp(): boolean {
  // Fails "already migrated" if storage is unreadable — safer to skip a
  // push than to risk repeating one on every hydration.
  try { return localStorage.getItem(QUIZ_XP_MIGRATED_KEY) === '1'; } catch { return true; }
}

function markQuizXpMigrated() {
  try { localStorage.setItem(QUIZ_XP_MIGRATED_KEY, '1'); } catch { /* ignore */ }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [roadmapsHydrated, setRoadmapsHydrated] = useState(false);
  const [nameOverride, setNameOverride] = useState<string>(() => loadProfileName());
  const [avatarSvg, setAvatarSvgState] = useState<string>(() => loadAvatar());
  const [username, setUsername] = useState<string | null>(null);
  const [missedDaysThisWeek, setMissedDaysThisWeek] = useState<number | null>(null);
  const [currentStreak, setCurrentStreak] = useState<number | null>(null);
  const [longestStreak, setLongestStreak] = useState<number | null>(null);
  const [recentStreakDays, setRecentStreakDays] = useState<Record<string, string> | null>(null);
  const [streakStatus, setStreakStatus] = useState<StreakStatus | null>(null);
  const [projection, setProjection] = useState<RoadmapProjection | null>(null);
  // DEV-ONLY. See devSimulateProjection below — 0 means "real today" and is
  // the only value that ever exists outside a dev build.
  const [projectionOffsetDays, setProjectionOffsetDays] = useState(0);
  const [quizXp, setQuizXp] = useState<number>(() => loadQuizXp());
  const hydratedFor = useRef<string | null>(null);

  // See the QUIZ_XP_KEY block above for why this is a real additive counter
  // rather than a live-recompute like step XP. Floored at 0 so a low-XP user
  // hitting a forced pass-through penalty can't go negative.
  //
  // Cross-device sync: update local state optimistically first (guests never
  // go further than this — no user, nothing to sync). For a signed-in user,
  // fire the same delta at adjust_quiz_xp() in the background; its return
  // value — not the locally-guessed one — becomes the real state, so if a
  // second device adjusted XP in the same window, this device still ends up
  // correct instead of silently overwriting that other change. Errors are
  // logged and swallowed rather than surfaced — a failed XP sync shouldn't
  // interrupt someone mid-quiz; it reconciles for real on next hydration.
  function adjustQuizXp(delta: number) {
    setQuizXp(prev => {
      const next = Math.max(0, prev + delta);
      saveQuizXp(next);
      return next;
    });

    if (!user) return; // guest/preview: local-only, same rule every other preview-mode path in this file follows
    if (user.id === DEV_BYPASS_USER_ID) return;

    supabase.rpc('adjust_quiz_xp', { p_delta: delta }).then(({ data, error }) => {
      if (error) {
        console.error('adjust_quiz_xp RPC failed (local value kept, will reconcile on next sign-in):', error);
        return;
      }
      if (typeof data === 'number') {
        setQuizXp(data);
        saveQuizXp(data);
      }
    });
  }

  const set = (partial: Partial<AppState>) => setState(s => ({ ...s, ...partial }));
  const reset = () => { hydratedFor.current = null; setState(DEFAULT); };
  const signOut = async () => {
    localStorage.removeItem('navigator-dev-bypass');
    await supabase.auth.signOut();
  };

  const profileName = (nameOverride.trim() || user?.name || 'Your Profile');
  const setProfileName = (name: string) => { setNameOverride(name); saveProfileName(name); };
  const setAvatarSvg = (svg: string) => { setAvatarSvgState(svg); saveAvatar(svg); };

  const activeEntry = useMemo(() => activeEntryOf(state.roadmaps), [state.roadmaps]);

  // Refetch the projection whenever the active roadmap changes — pinning a
  // different roadmap, switching after delete, or the first one loading in
  // after hydration. Guarded on activeEntry.id specifically (not the whole
  // object) so this doesn't refire on every progress tick; toggleStep's own
  // completion path (via recordTaskCompletion below) handles "same roadmap,
  // new progress" separately. Preview roadmaps are skipped the same way
  // addRoadmap skips Supabase for them — there's no row to query.
  useEffect(() => {
    if (!activeEntry || activeEntry.preview) { setProjection(null); return; }
    let active = true;
    fetchProjection(activeEntry.id, activeEntry.createdAt, projectionOffsetDays).then(p => {
      if (active) setProjection(p);
    });
    return () => { active = false; };
    // projectionOffsetDays is intentionally a dependency: this is what makes
    // Ctrl+Shift+P's cycle actually refetch instead of just changing a
    // number nothing reads. Real (non-dev) usage always has this at 0, so
    // the effect only ever refires here on a genuine roadmap switch.
  }, [activeEntry?.id, projectionOffsetDays]);

  // Keep the derived user in sync with the Supabase session
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(deriveUser(data.session));
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(deriveUser(session));
      setAuthReady(true);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  // Pull the username from `profiles` whenever the signed-in user changes.
  // Auth.tsx guarantees this is set before a user ever reaches the app
  // (either at signup, or via the post-OAuth "pick a username" step) —
  // null here just means it hasn't loaded yet, not that it doesn't exist.
  useEffect(() => {
    if (!user) { setUsername(null); return; }
    if (user.id === DEV_BYPASS_USER_ID) { setUsername('demo'); return; }
    let active = true;
    supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setUsername(data?.username ?? null);
      });
    return () => { active = false; };
  }, [user]);

  // Capture the user's IANA timezone (e.g. 'Africa/Lagos') into `profiles`
  // once per login, but only writes if it's actually missing or stale —
  // not on every app open. This is what complete_task()/activate_freeze()
  // read (see 004_streak_timezone_fix.sql) to compute "today" in the
  // user's own local day instead of server time. Silent, no UI — there's
  // no screen or setting for this, it just needs to be right.
  useEffect(() => {
    if (!user) return;
    if (user.id === DEV_BYPASS_USER_ID) return;
    let active = true;
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!browserTz) return; // extremely old/unusual environment — nothing to write

    supabase
      .from('profiles')
      .select('timezone')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active || error) return;
        if (data?.timezone === browserTz) return; // already correct, skip the write
        supabase
          .from('profiles')
          .update({ timezone: browserTz, updated_at: new Date().toISOString() })
          .eq('id', user.id)
          .then(({ error: updateError }) => {
            if (updateError) console.warn('[context] timezone capture failed:', updateError.message);
          });
      });
    return () => { active = false; };
  }, [user]);

  // On sign-in, pull remote notes/achievements into localStorage, then merge the
  // user's saved roadmaps with any in-memory previews. Runs once per user id.
  // roadmapsHydrated flips true once this has actually resolved (or, for a
  // guest with no user, immediately — there's nothing to hydrate). This is
  // the real "done" signal Start.tsx's redirect waits on; without the guest
  // branch below, roadmapsHydrated would stay false forever for signed-out
  // users, since the effect would return before ever setting it.
  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      // Clear the previous signed-in user's roadmaps so activeEntry (derived
      // from state.roadmaps via useMemo) goes null on sign-out. Without this,
      // Start.tsx's returning-user redirect — which checks activeEntry, not
      // user — kept treating a signed-out visitor as a returning user and
      // bounced them straight to /main, still showing the last signed-in
      // user's real roadmap data. Preview/guest roadmaps are preserved
      // (filtered the same way the sign-in merge above does) since they're
      // intentionally independent of any signed-in user.
      setState(s => ({ ...s, roadmaps: s.roadmaps.filter(r => r.preview) }));
      hydratedFor.current = null;
      setRoadmapsHydrated(true);
      setMissedDaysThisWeek(null);
      setCurrentStreak(null);
      setLongestStreak(null);
      setRecentStreakDays(null);
      setStreakStatus(null);
      return;
    }
    if (hydratedFor.current === user.id) return;
    hydratedFor.current = user.id;

    // Dev bypass — all state already set in devBypassLogin(); skip Supabase.
    if (user.id === DEV_BYPASS_USER_ID) { setRoadmapsHydrated(true); return; }

    let active = true;
    (async () => {
      await hydrateUserData();

      // Sign-in hydration for avatar_svg / profile_name — previously a known
      // gap (both were localStorage-only; saved on this device, invisible on
      // any other). Fetched from the same user_kv rows saveAvatar/
      // saveProfileName already write to (roadmapStore.ts) — no new
      // storage, no new schema, just reading back what was already there.
      //
      // Deliberately only fills in when the LOCAL value is empty, not an
      // unconditional overwrite: this is a "restore what's missing" step,
      // not a "server always wins" sync. A device that already has a local
      // avatar/name (including one set moments ago, not yet mirrored)
      // should never have it silently replaced by an older or blank
      // server value on every sign-in.
      if (!avatarSvg) {
        const remoteAvatar = await kvGet<string>('avatar_svg');
        if (active && remoteAvatar) {
          setAvatarSvg(remoteAvatar);
        } else if (active) {
          // No local avatar AND nothing saved remotely either — this is a
          // genuinely brand-new user. Previously, the only place that ever
          // generated the default DiceBear Initials avatar was a useEffect
          // inside Settings.tsx, which meant a user who never happened to
          // open Settings had no avatar_svg anywhere, on any device, until
          // they did. Generating it right here means it exists the moment
          // sign-in completes, regardless of which screen the user visits
          // next — Start.tsx's top-right circle (and anywhere else that
          // reads avatarSvg) reflects it immediately instead of only after
          // some unrelated screen happens to mount first.
          //
          // user.initial is synchronous (deriveUser() above computes it
          // directly from the session, no async profile fetch involved),
          // so there's no "name not loaded yet" race to guard against here
          // the way Settings.tsx has to for its own profileName-based path.
          try {
            const svg = createAvatar('initials', { letter: user.initial }).toString();
            setAvatarSvg(svg);
          } catch (e) {
            // Non-fatal: every avatar-reading screen already has its own
            // plain-letter fallback for an empty avatarSvg, so a failure
            // here just means the user keeps seeing that a little longer,
            // not a broken UI.
            console.warn('[context] failed to generate default Initials avatar on sign-in:', e);
          }
        }
      }
      if (!nameOverride) {
        const remoteName = await kvGet<string>('profile_name');
        if (active && remoteName) setProfileName(remoteName);
      }

      const remote = await listRoadmaps();
      const missed = await fetchMissedDaysThisWeek(user.id);
      const streak = await fetchCurrentStreak(user.id);
      const recent = await fetchRecentStreakDays(user.id);
      const status = await fetchStreakStatus(user.id);
      if (!active) return;
      setState(s => {
        const previews = s.roadmaps.filter(r => r.preview);
        return { ...s, roadmaps: [...previews, ...remote] };
      });
      setMissedDaysThisWeek(missed);
      if (streak) {
        setCurrentStreak(streak.current);
        setLongestStreak(streak.longest);
        // Quiz XP: one-time reconciliation for anyone who used the feature
        // before cross-device sync existed. Real decision, made here rather
        // than asked: push the local value up once (additive, via the same
        // atomic RPC — never overwritten, so it stacks with anything a
        // second device already synced), then treat the server as the
        // source of truth from this sign-in on. Guarded so it only ever
        // fires once per device.
        const localQuizXp = loadQuizXp();
        if (localQuizXp > 0 && !hasMigratedLocalQuizXp()) {
          supabase.rpc('adjust_quiz_xp', { p_delta: localQuizXp }).then(({ data, error }) => {
            markQuizXpMigrated();
            const resolved = !error && typeof data === 'number' ? data : streak.xp;
            setQuizXp(resolved);
            saveQuizXp(resolved);
          });
        } else {
          setQuizXp(streak.xp);
          saveQuizXp(streak.xp);
        }
      }
      setRecentStreakDays(recent);
      setStreakStatus(status);
      setRoadmapsHydrated(true);
    })();
    return () => { active = false; };
  }, [authReady, user]);

  // Add a freshly generated roadmap (pinned), unpinning others. Preview roadmaps
  // stay in-memory only.
  async function addRoadmap(roadmap: Roadmap, opts?: { preview?: boolean }): Promise<string> {
    const preview = !!opts?.preview;
    let id = localId();
    if (!preview) {
      // saveRoadmapRemote now throws on schema/permission errors — let the error
      // propagate so Generating.tsx can surface the real message to the user.
      // Pace (hoursPerDay/daysPerWeek) is stamped at creation time from
      // current state — this is the plan the user actually set on Time.tsx,
      // and it's what project_roadmap_finish_date() (005 migration) reads as
      // days_per_week to compute the projection. Without this, every new
      // roadmap would insert with a null/default pace and the projection
      // would be silently wrong from the moment it's created.
      const remoteId = await saveRoadmapRemote(roadmap, {
        hoursPerDay: state.hoursPerDay,
        daysPerWeek: state.daysPerWeek,
      });
      if (remoteId) { id = remoteId; setPinnedRemote(remoteId); }
    }
    const entry: RoadmapEntry = {
      id, roadmap, progress: {}, completedAt: {}, pinned: true, createdAt: Date.now(), preview,
      // Empty/null on purpose — a brand-new roadmap has no plan yet. The
      // first TodayView render for it calls ensureTodayPlan(), which sees
      // todayPlanDate === null (always "stale") and computes+persists one.
      todayPlanDate: null, todayPlanStepIds: [],
    };
    setState(s => ({
      ...s,
      roadmapSkill: roadmap.skill,
      roadmaps: [entry, ...s.roadmaps.map(r => ({ ...r, pinned: false }))],
    }));
    return id;
  }

  // Tells the streak backend a task was completed today, captures the
  // returned streak numbers, then refreshes the missed-days stat (a
  // completion can retroactively backfill 'grace'/'frozen' days into the
  // last 7, so the count can change even though today itself isn't what
  // moved). Fire-and-forget from toggleStep's perspective, matching
  // persistEntry's existing pattern below — the local progress update is
  // optimistic and never waits on this.
  //
  // complete_task() is idempotent server-side (a same-day repeat is a
  // no-op), so this is safe to call on every step completion with no
  // client-side "did I already call this today" tracking needed.
  async function recordTaskCompletion() {
    if (!user) return;
    if (user.id === DEV_BYPASS_USER_ID) {
      setCurrentStreak(s => (s ?? 0) + 1);
      return;
    }
    const { data, error } = await supabase.rpc('complete_task');
    if (error) {
      console.error('complete_task RPC failed:', error);
      return;
    }
    // returns table(...) comes back as a one-row array for a per-user RPC.
    const row = Array.isArray(data) ? data[0] : data;
    if (row) {
      setCurrentStreak(row.current_streak ?? 0);
      setLongestStreak(row.longest_streak ?? 0);
      // streak_broken is available on `row` too if a "your streak reset"
      // UI moment (toast/animation) gets built later — not surfaced in
      // context state yet since nothing reads it. See §0.4 SQL notes.
    }
    const missed = await fetchMissedDaysThisWeek(user.id);
    if (missed !== null) setMissedDaysThisWeek(missed);
    // Today's own cell can flip from "no data" to 'completed' the instant
    // this call succeeds — refetch so the strip doesn't wait for a full
    // reload to reflect the task that was just completed.
    const recent = await fetchRecentStreakDays(user.id);
    if (recent !== null) setRecentStreakDays(recent);
    // A completion is exactly what resolves a pending miss (or ends an active
    // freeze early — complete_task() clears freeze_active on any successful
    // completion, see 001_streak_system.sql). Refetch so the two-choice
    // screen and StreakStrip's live-freeze rendering both clear immediately,
    // not on next app open.
    const status = await fetchStreakStatus(user.id);
    if (status !== null) setStreakStatus(status);
    // Completing a step changes completed_steps → backlog → pushed_days for
    // whichever roadmap is currently active. activeEntry here is a closure
    // over the render that defined recordTaskCompletion, not stale for this
    // purpose — toggleStep only ever calls recordTaskCompletion for a step
    // on the active roadmap (see toggleStep below), so this always refetches
    // the right one.
    if (activeEntry && !activeEntry.preview) {
      const proj = await fetchProjection(activeEntry.id, activeEntry.createdAt, projectionOffsetDays);
      if (proj !== null) setProjection(proj);
    }
  }

  // Declares a freeze window (1–10 days) via activate_freeze(). Mirrors
  // recordTaskCompletion's shape: fire the RPC, then refresh the derived
  // state that depends on it. Unlike recordTaskCompletion this isn't called
  // from toggleStep — it's invoked directly from the freeze-duration picker's
  // confirm action. Throws on failure (activate_freeze rejects a re-freeze
  // attempt on an already-lapsed window, and quota exhaustion — see
  // SESSION_HANDOFF_3.md §0.3.1) so the picker screen can show the real
  // error instead of silently doing nothing.
  async function activateFreeze(days: number): Promise<void> {
    if (!user) return;
    if (user.id === DEV_BYPASS_USER_ID) return;
    const { error } = await supabase.rpc('activate_freeze', { p_days: days });
    if (error) {
      console.error('activate_freeze RPC failed:', error);
      throw error;
    }
    const status = await fetchStreakStatus(user.id);
    if (status !== null) setStreakStatus(status);
    // Freeze doesn't touch current_streak/longest_streak (it preserves them,
    // doesn't change them — see §0.3.1), so those don't need refetching here.
    // recentStreakDays also doesn't need refetching: activate_freeze() writes
    // no streak_log rows at activation time (backfill happens later, on
    // return) — that's exactly why streakStatus/freezeActiveToday exists.
  }

  // ─── DEV-ONLY: streak testing overrides ──────────────────────────────────
  // Everything in this block exists purely to make streak/freeze states
  // testable without waiting real days or hand-editing Supabase rows. Two
  // entry points, both gated on import.meta.env.DEV (Vite's build-time flag —
  // false in a real production bundle, so none of this ships):
  //
  //   1. Query param on load: ?debug_streak=12&debug_frozen=1&debug_grace=1
  //      Read once, applies an in-memory override, never touches Supabase.
  //   2. devOverrideStreak(), called by DevStreakPanel.tsx's keyboard-combo
  //      panel — same in-memory-only contract.
  //   3. devSimulateProjection(), also called by DevStreakPanel.tsx (Ctrl+
  //      Shift+P / Ctrl+Shift+R) — a DIFFERENT contract from #2: it doesn't
  //      set render state directly, it sets an offset that a real Supabase
  //      call reads. See fetchProjection's offsetDays param and
  //      devSimulateProjection's own comment below for why projection can't
  //      be faked the same in-memory way the streak numbers are.
  //
  // Deliberately NOT exposed as raw setCurrentStreak/setStreakStatus/etc. on
  // the public context value — that would be a permanent footgun outliving
  // this testing phase (anyone touching an unrelated screen later could call
  // a raw setter by accident with no dev-gate at all). One function, one
  // grep target, easy to delete in full once this is no longer needed —
  // that's the whole point of building it this way.
  //
  // Neither path calls complete_task()/activate_freeze() or writes to
  // Supabase. This only ever overrides the client-side render state
  // (currentStreak/recentStreakDays/streakStatus) — closing the tab or
  // reloading without the query param wipes it, and the real backend numbers
  // come back on next hydration. That's intentional: the fastest way to
  // check "does StreakStrip render a 40-day frozen streak correctly" is to
  // fake the numbers, not to actually mutate a real user_stats row and then
  // remember to clean it up.
  const DEV = import.meta.env.DEV;

  function devOverrideStreak(opts: {
    streak?: number;
    frozen?: boolean;
    freezeDaysRemaining?: number;
    grace?: boolean;      // marks today's cell as 'grace' in recentStreakDays
    broken?: boolean;     // marks today's cell as 'broken'
    pendingMiss?: boolean;
    reset?: boolean;      // clears every override and re-syncs from the real backend
  }) {
    if (!DEV) return; // hard gate — no-op outside dev builds, not just hidden
    if (opts.reset) {
      // Real re-sync, not just clearing local state to null — a null streak
      // would render as "not loaded yet" (see the currentStreak null-vs-zero
      // contract at its declaration above), not as "back to whatever the
      // backend actually says." Re-running the same fetches hydration uses
      // is the only way "reset" means what it sounds like it means.
      if (user) {
        fetchCurrentStreak(user.id).then(s => { if (s) { setCurrentStreak(s.current); setLongestStreak(s.longest); setQuizXp(s.xp); saveQuizXp(s.xp); } });
        fetchRecentStreakDays(user.id).then(r => { if (r !== null) setRecentStreakDays(r); });
        fetchStreakStatus(user.id).then(s => { if (s !== null) setStreakStatus(s); });
      }
      return;
    }
    if (opts.streak != null) setCurrentStreak(opts.streak);
    if (opts.frozen) {
      setStreakStatus({
        hasPendingMiss: false,
        freezeActiveToday: true,
        freezeDaysRemaining: opts.freezeDaysRemaining ?? 3,
      });
    } else if (opts.pendingMiss) {
      setStreakStatus({ hasPendingMiss: true, freezeActiveToday: false, freezeDaysRemaining: null });
    } else if (opts.frozen === false) {
      setStreakStatus({ hasPendingMiss: false, freezeActiveToday: false, freezeDaysRemaining: null });
    }
    if (opts.grace || opts.broken) {
      const todayKey = localDateStr(new Date());
      setRecentStreakDays(prev => ({ ...(prev ?? {}), [todayKey]: opts.grace ? 'grace' : 'broken' }));
    }
  }

  // DEV-ONLY. Companion to devOverrideStreak above, but a different
  // contract — see the projection section's header comment near
  // fetchProjection for why. This does NOT set client render state
  // directly; it sets the offset that fetchProjection's p_today calc reads,
  // and the projection-fetch effect (keyed on activeEntry.id AND this value)
  // does a real Supabase call with that simulated date. completed_steps and
  // created_at are never touched — only "today" moves. offsetDays=0 is the
  // reset case (real today); called with 0 by devOverrideStreak's reset
  // path via Ctrl+Shift+R in DevStreakPanel.tsx.
  function devSimulateProjection(offsetDays: number) {
    if (!DEV) return; // hard gate, same as devOverrideStreak
    setProjectionOffsetDays(offsetDays);
  }

  // Query-param path: ?debug_streak=N, ?debug_frozen=1[&debug_freeze_days=N],
  // ?debug_grace=1, ?debug_broken=1, ?debug_pending_miss=1. Runs once, after
  // real hydration (depends on roadmapsHydrated so it overrides the real
  // fetch result rather than racing it and getting clobbered).
  useEffect(() => {
    if (!DEV || !roadmapsHydrated) return;
    const params = new URLSearchParams(window.location.search);
    if (![...params.keys()].some(k => k.startsWith('debug_'))) return;

    const streakParam = params.get('debug_streak');
    devOverrideStreak({
      streak: streakParam != null ? Number(streakParam) : undefined,
      frozen: params.get('debug_frozen') === '1',
      freezeDaysRemaining: params.get('debug_freeze_days') != null ? Number(params.get('debug_freeze_days')) : undefined,
      grace: params.get('debug_grace') === '1',
      broken: params.get('debug_broken') === '1',
      pendingMiss: params.get('debug_pending_miss') === '1',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DEV, roadmapsHydrated]);

  function toggleStep(entryId: string, stepId: string) {
    // Computed from the outer state snapshot, before setState, so we know
    // whether this click is completing (not un-completing) the step —
    // needed to decide whether to fire recordTaskCompletion() at all.
    // Preview roadmaps never touch the streak backend: no account, nothing
    // to persist. See addRoadmap() above.
    const targetEntry = state.roadmaps.find(r => r.id === entryId);
    const willComplete = !!targetEntry && !targetEntry.progress[stepId] && !targetEntry.preview;

    setState(s => {
      const roadmaps = s.roadmaps.map(entry => {
        if (entry.id !== entryId) return entry;
        const done = !entry.progress[stepId];
        const progress = { ...entry.progress, [stepId]: done };
        const completedAt = { ...entry.completedAt };
        if (done) completedAt[stepId] = Date.now();
        else delete completedAt[stepId];
        const next = { ...entry, progress, completedAt };
        persistEntry(next);
        return next;
      });
      return { ...s, roadmaps };
    });

    if (willComplete) {
      recordTaskCompletion();
    }
  }

  // Computes and persists today's plan (selectTodayPlan, generateRoadmap.ts)
  // when the stored one is missing or stale (todayPlanDate !== today's local
  // date). Called from TodayView/StreakPartnerCard on render, not on every
  // toggleStep — this is the ONLY place today_plan_step_ids changes, which is
  // what stops "today's plan" from reshuffling every time a step is checked
  // off (the bug this whole thing replaces). A no-op call (already fresh) is
  // just a string comparison — cheap enough to call unconditionally on mount.
  function ensureTodayPlan(entryId: string) {
    const today = localDateStr(new Date());
    const entry = state.roadmaps.find(r => r.id === entryId);
    if (!entry || entry.todayPlanDate === today) return; // already fresh

    const stepIds = selectTodayPlan(entry.roadmap.phases, entry.progress, state.hoursPerDay);

    setState(s => ({
      ...s,
      roadmaps: s.roadmaps.map(r =>
        r.id === entryId ? { ...r, todayPlanDate: today, todayPlanStepIds: stepIds } : r
      ),
    }));
    if (!entry.preview) persistTodayPlan(entryId, today, stepIds);
  }

  // See interface comment above for the full rationale. Returns the
  // (possibly freshly-backfilled) adjacent list directly so the caller
  // (Main.tsx's InspireView) doesn't have to read back through state after
  // the setState below has flushed — this fires the AI call as the caller
  // awaits it, matching the explicit "blocking" product decision.
  async function ensureRelatedSkills(entryId: string): Promise<string[]> {
    const entry = state.roadmaps.find(r => r.id === entryId);
    if (!entry) return [];

    const existing = entry.roadmap.skill_web?.adjacent ?? [];
    if (existing.length > 0) return existing;

    let related: string[] = [];
    try {
      related = await generateRelatedSkills(entry.roadmap.skill);
    } catch {
      // AI call failed outright (network/auth error) — return empty so the
      // caller falls through to its own last-resort fallback. Not persisted
      // (nothing to persist), so this will be retried on the next visit
      // rather than permanently caching a failure.
      return [];
    }
    if (related.length === 0) return [];

    const updatedRoadmap: Roadmap = {
      ...entry.roadmap,
      skill_web: { ...entry.roadmap.skill_web, adjacent: related },
    };
    const next: RoadmapEntry = { ...entry, roadmap: updatedRoadmap };

    setState(s => ({
      ...s,
      roadmaps: s.roadmaps.map(r => (r.id === entryId ? next : r)),
    }));
    // Same fire-and-forget convention as toggleStep's persistEntry call —
    // the local state update above is optimistic and doesn't wait on this.
    // preview roadmaps are never written to Supabase (see addRoadmap), so
    // skip the write for those same as every other persist call site does.
    if (!entry.preview) persistEntry(next);

    return related;
  }

  function pinRoadmap(id: string) {
    setState(s => ({ ...s, roadmaps: s.roadmaps.map(r => ({ ...r, pinned: r.id === id })) }));
    setPinnedRemote(id);
  }

  function unpinRoadmap(id: string) {
    setState(s => ({ ...s, roadmaps: s.roadmaps.map(r => (r.id === id ? { ...r, pinned: false } : r)) }));
    setPinnedRemote(null);
  }

  function resetRoadmapProgress(id: string | 'all') {
    setState(s => {
      const roadmaps = s.roadmaps.map(entry => {
        if (id !== 'all' && entry.id !== id) return entry;
        clearEarnedFor(entry.id);
        const next = { ...entry, progress: {}, completedAt: {} };
        persistEntry(next);
        return next;
      });
      return { ...s, roadmaps };
    });
  }

  function devBypassLogin() {
    const mockUser: AuthUser = {
      id: 'dev-bypass',
      email: 'demo@roadmap.app',
      name: 'Divine',
      firstName: 'Divine',
      initial: 'D',
    };
    const placeholderRoadmap = buildPlaceholderRoadmap('Web Development', 'skill', 1.5);
    const entry: RoadmapEntry = {
      id: 'dev-bypass-roadmap',
      roadmap: placeholderRoadmap,
      progress: {},
      completedAt: {},
      pinned: true,
      createdAt: Date.now(),
      preview: false,
      todayPlanDate: null,
      todayPlanStepIds: [],
    };
    localStorage.setItem('navigator-dev-bypass', '1');
    setUser(mockUser);
    setAuthReady(true);
    setRoadmapsHydrated(true);
    setCurrentStreak(3);
    setLongestStreak(7);
    const today = new Date();
    const streakDays: Record<string, string> = {};
    for (let i = 0; i < 3; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      streakDays[localDateStr(d)] = 'completed';
    }
    setRecentStreakDays(streakDays);
    setState(s => ({
      ...s,
      roadmapSkill: 'Web Development',
      roadmaps: [entry, ...s.roadmaps.filter(r => r.id !== 'dev-bypass-roadmap')],
    }));
  }

  function deleteRoadmap(id: string | 'all') {
    setState(s => {
      const removed = id === 'all' ? s.roadmaps : s.roadmaps.filter(r => r.id === id);
      removed.forEach(r => clearEarnedFor(r.id));
      if (id === 'all') deleteAllRoadmapsRemote();
      else deleteRoadmapRemote(id);
      const roadmaps = id === 'all' ? [] : s.roadmaps.filter(r => r.id !== id);
      // If we removed the pinned roadmap, the newest remaining becomes active
      // automatically (activeEntryOf falls back to newest); no re-pin needed.
      return { ...s, roadmaps };
    });
  }

  return (
    <Ctx.Provider value={{
      state, set, reset, user, authReady, roadmapsHydrated, username, signOut, devBypassLogin,
      activeEntry, profileName, setProfileName, avatarSvg, setAvatarSvg,
      addRoadmap, toggleStep, ensureTodayPlan, ensureRelatedSkills, pinRoadmap, unpinRoadmap, resetRoadmapProgress, deleteRoadmap, activateFreeze,
      missedDaysThisWeek, currentStreak, longestStreak, recentStreakDays, streakStatus, projection,
      projectionOffsetDays,
      quizXp, adjustQuizXp,
      devOverrideStreak, devSimulateProjection,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);
