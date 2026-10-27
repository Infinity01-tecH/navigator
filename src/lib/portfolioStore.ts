import { supabase } from './supabase';

// ─── Portfolio persistence ─────────────────────────────────────────────────────
// Backed by supabase/sql/portfolio.sql (run it once in the SQL Editor first).
// Same rule as roadmapStore.ts: every function is defensive. If the SQL has not
// been run yet, or the user is signed out, reads degrade to null / [] and
// fire-and-forget writes degrade to a no-op, so nothing else in the app breaks.

const LOCAL_PREFIX = 'local_';
const isLocal = (id: string) => id.startsWith(LOCAL_PREFIX) || id.startsWith('dev-bypass');

// ── Types ───────────────────────────────────────────────────────────────────────

export interface MyPortfolio {
  handle: string;
  displayName: string;
  bio: string;
  isPublic: boolean;
  hiddenRoadmaps: string[];
}

export interface MyBuild {
  id: string;
  roadmapId: string;
  stepId: string;
  title: string;
  proofUrl: string;
  note: string;
}

export interface PublicPhase { title: string; total: number; done: number }

export interface PublicRoadmap {
  id: string;
  skill: string;
  tagline: string | null;
  mode: 'full' | 'sprint' | 'youtube';
  total: number;
  done: number;
  percent: number;
  finished: boolean;
  quizzes: number;
  phases: PublicPhase[];
  started: string;
}

export interface PublicBuild {
  roadmap_id: string;
  skill: string;
  title: string;
  proof_url: string;
  note: string;
  created_at: string;
}

export interface PublicPortfolio {
  handle: string;
  display_name: string;
  bio: string;
  avatar_svg: string;
  roadmaps: PublicRoadmap[];
  builds: PublicBuild[];
  stats: { roadmaps: number; finished: number; steps: number; quizzes: number; builds: number };
}

// ── Handle + link helpers ───────────────────────────────────────────────────────

export const HANDLE_RE = /^[a-z0-9][a-z0-9_-]{2,29}$/;

// Lowercase, spaces → "-", drop anything not allowed. Used both for typing and
// for turning a display name into a first suggestion.
export function normalizeHandle(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 30);
}

export function validateHandle(handle: string): string | null {
  if (!handle) return 'Pick a handle.';
  if (handle.length < 3) return 'At least 3 characters.';
  if (!/^[a-z0-9]/.test(handle)) return 'Start with a letter or number.';
  if (!HANDLE_RE.test(handle)) return 'Use letters, numbers, - or _ only.';
  return null;
}

export function portfolioUrl(handle: string): string {
  return `${window.location.origin}/u/${handle}`;
}

// Proof links must be real https:// links with a dotted host. The database
// enforces the same rule; this gives a friendly message before the round trip.
export function validateProofUrl(raw: string): string | null {
  const v = raw.trim();
  if (!v) return 'Paste a link to your work.';
  if (v.length > 500) return 'That link is too long.';
  if (/\s/.test(v)) return 'Links cannot contain spaces.';
  let u: URL;
  try { u = new URL(v); } catch { return 'That does not look like a link.'; }
  if (u.protocol !== 'https:') return 'Use a link that starts with https://';
  if (!u.hostname.includes('.')) return 'That does not look like a link.';
  return null;
}

// SVG avatars are user-supplied markup. Never inject one as HTML on a public
// page (a crafted SVG could run script in a visitor's browser). Showing it
// through an <img> data URI is safe because browsers do not run scripts in
// SVG images.
export function avatarDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// ── Owner: portfolio row ────────────────────────────────────────────────────────

export async function getMyPortfolio(): Promise<MyPortfolio | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from('portfolios')
      .select('handle, display_name, bio, is_public, hidden_roadmaps')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) { console.warn('[portfolioStore] getMyPortfolio failed:', error.message); return null; }
    if (!data) return null;
    return {
      handle: data.handle as string,
      displayName: (data.display_name ?? '') as string,
      bio: (data.bio ?? '') as string,
      isPublic: !!data.is_public,
      hiddenRoadmaps: (data.hidden_roadmaps ?? []) as string[],
    };
  } catch (e) {
    console.warn('[portfolioStore] getMyPortfolio threw:', e);
    return null;
  }
}

// Create or update the owner's row. Returns an error message (string) on
// failure, or null on success. A taken handle comes back as a friendly line.
export async function savePortfolio(p: MyPortfolio, avatarSvg: string): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'Sign in to save your portfolio.';
    const problem = validateHandle(p.handle);
    if (problem) return problem;

    const { error } = await supabase.from('portfolios').upsert(
      {
        user_id: user.id,
        handle: p.handle,
        display_name: p.displayName.trim().slice(0, 60),
        bio: p.bio.trim().slice(0, 280),
        avatar_svg: avatarSvg.length <= 60000 ? avatarSvg : '',
        is_public: p.isPublic,
        hidden_roadmaps: p.hiddenRoadmaps,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );
    if (!error) return null;
    if ((error as { code?: string }).code === '23505') return 'That handle is taken. Try another.';
    if (/relation .* does not exist|schema cache/i.test(error.message)) {
      return 'Portfolio is not set up on the server yet (run portfolio.sql).';
    }
    return error.message;
  } catch (e) {
    return e instanceof Error ? e.message : 'Could not save.';
  }
}

// ── Owner: build proofs ─────────────────────────────────────────────────────────

export async function listMyBuilds(): Promise<MyBuild[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('portfolio_builds')
      .select('id, roadmap_id, step_id, title, proof_url, note')
      .eq('user_id', user.id);
    if (error) { console.warn('[portfolioStore] listMyBuilds failed:', error.message); return []; }
    return (data ?? []).map(r => ({
      id: r.id as string,
      roadmapId: r.roadmap_id as string,
      stepId: r.step_id as string,
      title: r.title as string,
      proofUrl: r.proof_url as string,
      note: (r.note ?? '') as string,
    }));
  } catch (e) {
    console.warn('[portfolioStore] listMyBuilds threw:', e);
    return [];
  }
}

// Attach (or replace) a proof link on one finished build step. Returns an error
// message or null.
export async function saveBuild(input: {
  roadmapId: string; stepId: string; title: string; proofUrl: string; note: string;
}): Promise<string | null> {
  if (isLocal(input.roadmapId)) return 'Save this roadmap to your account first.';
  const bad = validateProofUrl(input.proofUrl);
  if (bad) return bad;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'Sign in first.';
    const { error } = await supabase.from('portfolio_builds').upsert(
      {
        user_id: user.id,
        roadmap_id: input.roadmapId,
        step_id: input.stepId,
        title: input.title.trim().slice(0, 120) || 'Untitled build',
        proof_url: input.proofUrl.trim(),
        note: input.note.trim().slice(0, 280),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'roadmap_id,step_id' },
    );
    return error ? error.message : null;
  } catch (e) {
    return e instanceof Error ? e.message : 'Could not save.';
  }
}

export async function deleteBuild(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('portfolio_builds').delete().eq('id', id);
    if (error) console.warn('[portfolioStore] deleteBuild failed:', error.message);
  } catch (e) {
    console.warn('[portfolioStore] deleteBuild threw:', e);
  }
}

// ── Quiz passes ─────────────────────────────────────────────────────────────────
// Called from the quiz gate in Main.tsx the moment a quiz is passed. Fire and
// forget: a failure here must never block the user from completing the step.
// The database only stores the pass if the roadmap is the caller's and the step
// really is a watch step.
export function recordQuizPass(roadmapId: string, stepId: string): void {
  if (isLocal(roadmapId)) return;
  supabase.rpc('record_quiz_pass', { p_roadmap: roadmapId, p_step: stepId })
    .then(({ error }) => { if (error) console.warn('[portfolioStore] recordQuizPass failed:', error.message); },
          e => console.warn('[portfolioStore] recordQuizPass threw:', e));
}

// ── Public read ─────────────────────────────────────────────────────────────────
// Works signed out. Resolves to null when the handle does not exist OR the
// owner has not switched the portfolio on (the two are deliberately the same).
export async function fetchPublicPortfolio(handle: string): Promise<{ data: PublicPortfolio | null; failed: boolean }> {
  try {
    const { data, error } = await supabase.rpc('get_portfolio', { p_handle: handle });
    if (error) { console.warn('[portfolioStore] fetchPublicPortfolio failed:', error.message); return { data: null, failed: true }; }
    return { data: (data ?? null) as PublicPortfolio | null, failed: false };
  } catch (e) {
    console.warn('[portfolioStore] fetchPublicPortfolio threw:', e);
    return { data: null, failed: true };
  }
}
