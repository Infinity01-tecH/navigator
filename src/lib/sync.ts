import { kvGet, kvSet } from './roadmapStore';

// ─── Cross-device sync for notes + achievements/streak ────────────────────────────
// localStorage is the source of truth for instant, offline-first UX. On each change
// we mirror the relevant blob up to Supabase (`user_kv`); on sign-in we pull the
// remote blobs down into localStorage so a fresh device restores everything.
// Every call is best-effort — failures never block the local experience.

export const LS = {
  folders: 'nav_note_folders',
  myNotes: 'nav_my_notes',
  topicNotes: 'nav_topic_notes',
  lastStreak: 'nav_last_streak',
  earnedPrefix: 'nav_earned_ach_',
};

function get<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}
function put(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

// ── Notes ──────────────────────────────────────────────────────────────────────

let notesTimer: ReturnType<typeof setTimeout> | null = null;

export function pushNotes() {
  if (notesTimer) clearTimeout(notesTimer);
  notesTimer = setTimeout(() => {
    kvSet('notes', {
      folders: get(LS.folders, []),
      myNotes: get(LS.myNotes, []),
      topicNotes: get(LS.topicNotes, {}),
    });
  }, 700);
}

export async function pullNotes(): Promise<boolean> {
  const remote = await kvGet<{ folders?: unknown; myNotes?: unknown; topicNotes?: unknown }>('notes');
  if (!remote) return false;
  if (remote.folders) put(LS.folders, remote.folders);
  if (remote.myNotes) put(LS.myNotes, remote.myNotes);
  if (remote.topicNotes) put(LS.topicNotes, remote.topicNotes);
  return true;
}

// ── Achievements + streak ────────────────────────────────────────────────────────

function collectEarned(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(LS.earnedPrefix)) {
        const id = k.slice(LS.earnedPrefix.length);
        out[id] = get<string[]>(k, []);
      }
    }
  } catch { /* ignore */ }
  return out;
}

let achTimer: ReturnType<typeof setTimeout> | null = null;

export function pushAchievements() {
  if (achTimer) clearTimeout(achTimer);
  achTimer = setTimeout(() => {
    kvSet('achievements', {
      lastStreak: Number(get<number>(LS.lastStreak, 0)),
      earned: collectEarned(),
    });
  }, 700);
}

export async function pullAchievements(): Promise<boolean> {
  const remote = await kvGet<{ lastStreak?: number; earned?: Record<string, string[]> }>('achievements');
  if (!remote) return false;
  if (typeof remote.lastStreak === 'number') put(LS.lastStreak, remote.lastStreak);
  if (remote.earned) {
    for (const [id, ids] of Object.entries(remote.earned)) put(LS.earnedPrefix + id, ids);
  }
  return true;
}

// Pull everything on sign-in (best-effort, parallel).
export async function hydrateUserData(): Promise<void> {
  await Promise.allSettled([pullNotes(), pullAchievements()]);
}
