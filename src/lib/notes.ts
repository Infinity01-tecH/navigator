// ─── Notes storage ───────────────────────────────────────────────────────────────
// localStorage-backed store for the Notes Hub, mirrored to Supabase for cross-device
// sync (see ./sync). Structure:
//  • Folders     — "skill folders"; My Notes live inside a folder, never at root.
//  • My Notes    — freeform, user-authored, rich-HTML body, assigned to a folder.
//  • Topic Notes — one AI-drafted (rich HTML) note per roadmap step, editable.

import { pushNotes } from './sync';

export interface NoteFolder {
  id: string;
  name: string;
  createdAt: number;
}

export interface MyNote {
  id: string;
  title: string;
  body: string;          // rich HTML
  folderId: string | null;
  topicId?: string;      // set when created via "Add my own note" from a Topic Note
  topicTitle?: string;
  createdAt: number;
  updatedAt: number;
}

// Per-step AI-drafted note content (rich HTML), overridable by the user.
export type TopicNoteOverrides = Record<string, string>;

const FOLDERS_KEY = 'nav_note_folders';
const MY_NOTES_KEY = 'nav_my_notes';
const TOPIC_NOTES_KEY = 'nav_topic_notes';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be blocked in the iframe — degrade silently */
  }
  pushNotes(); // mirror to Supabase (debounced)
}

export function newId(): string {
  return `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

// ── Folders ─────────────────────────────────────────────────────────────────────
export function loadFolders(): NoteFolder[] {
  return read<NoteFolder[]>(FOLDERS_KEY, []).sort((a, b) => a.createdAt - b.createdAt);
}

export function saveFolders(folders: NoteFolder[]) {
  write(FOLDERS_KEY, folders);
}

export function createFolder(name: string): NoteFolder {
  const folder: NoteFolder = { id: newId(), name: name.trim() || 'Untitled folder', createdAt: Date.now() };
  saveFolders([...loadFolders(), folder]);
  return folder;
}

export function deleteFolder(id: string) {
  saveFolders(loadFolders().filter(f => f.id !== id));
  // Orphaned notes fall back to no folder rather than vanishing.
  const notes = loadMyNotes().map(n => (n.folderId === id ? { ...n, folderId: null } : n));
  saveMyNotes(notes);
}

// ── My Notes ──────────────────────────────────────────────────────────────────
export function loadMyNotes(): MyNote[] {
  return read<MyNote[]>(MY_NOTES_KEY, []).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveMyNotes(notes: MyNote[]) {
  write(MY_NOTES_KEY, notes);
}

// ── Topic Notes ───────────────────────────────────────────────────────────────
export function loadTopicOverrides(): TopicNoteOverrides {
  return read<TopicNoteOverrides>(TOPIC_NOTES_KEY, {});
}

export function saveTopicOverride(stepId: string, body: string) {
  const all = loadTopicOverrides();
  all[stepId] = body;
  write(TOPIC_NOTES_KEY, all);
}

// Escape user/roadmap text before embedding in the generated HTML.
function esc(s: string): string {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Deterministic, richly-structured AI-style draft for a topic. Returns HTML so the
// note reads as a real reference document: Topic / Aim / Objective, a "What to
// focus on" section, a detailed body, and — only for watch/read topics where it
// genuinely helps — a single contextual illustrative image.
export function draftTopicNote(
  skill: string,
  phaseTitle: string,
  stepTitle: string,
  stepNote: string,
  stepType?: string,
): string {
  const phase = phaseTitle.replace(/^Phase \d+:\s*/, '');
  const t = esc(stepTitle);
  const s = esc(skill);
  const ph = esc(phase);
  const wantsImage = stepType === 'watch' || stepType === 'read';
  const imgQuery = encodeURIComponent(`${skill} ${stepTitle}`.slice(0, 60));

  const parts: string[] = [];
  parts.push(`<h3>${t}</h3>`);
  parts.push(`<p><strong>Topic:</strong> ${t} — a core building block of ${ph} in your ${s} journey.</p>`);
  parts.push(`<p><strong>Aim:</strong> Understand what ${t} is, why it matters, and how it connects to the bigger picture of ${s}.</p>`);
  parts.push(`<p><strong>Objective:</strong> By the end you should be able to explain ${t} in your own words and apply it in a small hands-on attempt.</p>`);
  if (stepNote) parts.push(`<blockquote>${esc(stepNote)}</blockquote>`);

  parts.push(`<h4>What to focus on</h4>`);
  parts.push(
    `<ul>` +
    `<li>How ${t} fits into <strong>${ph}</strong> and what comes before/after it.</li>` +
    `<li>The one core idea behind ${t} that makes everything else click.</li>` +
    `<li>A common mistake beginners make here — and how to avoid it.</li>` +
    `<li>One small thing you can try yourself the moment you finish learning it.</li>` +
    `</ul>`,
  );

  if (wantsImage) {
    parts.push(
      `<figure>` +
      `<img src="https://source.unsplash.com/featured/800x400?${imgQuery}" alt="${t}" />` +
      `<figcaption>Visual reference for ${t}</figcaption>` +
      `</figure>`,
    );
  }

  parts.push(`<h4>The detail</h4>`);
  parts.push(
    `<p>${t} is one of those topics that rewards a little patience. Start by getting the shape of ` +
    `the idea: skim the material once for the overall structure, then go back and work slowly ` +
    `through the parts you'll actually use. Don't try to memorise everything — aim to understand ` +
    `the reasoning so you can rebuild it later.</p>`,
  );
  parts.push(
    `<p>As you learn, keep asking "why does this exist?" Most concepts in ${s} were invented to ` +
    `solve a specific, concrete problem. Once you can name the problem ${t} solves, the details ` +
    `stop feeling arbitrary and start feeling obvious.</p>`,
  );
  parts.push(
    `<p>Finish with a tiny practical rep: recreate a small example, tweak one variable, and observe ` +
    `what changes. That single loop of "predict → try → compare" will teach you more than re-reading ` +
    `the material three times. Note anything that surprised you right here in this note.</p>`,
  );

  return parts.join('\n');
}

export function clearAllNotes() {
  write(FOLDERS_KEY, []);
  write(MY_NOTES_KEY, []);
  write(TOPIC_NOTES_KEY, {});
}
