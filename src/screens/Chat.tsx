import { useState, useRef, useEffect, useMemo } from 'react';
import {
  MessageSquarePlus, Menu, ArrowLeft, Send, Square, Mic,
  Plus, BookOpen, ImagePlus, Copy, Bookmark, ThumbsUp, ThumbsDown, Check,
  Pin, PinOff, Trash2, X,
} from 'lucide-react';
import { useApp } from '../lib/context';
import { useChat, type ChatMessage, type ChatThreadSummary } from '../lib/useChatThread';
import type { RoadmapEntry } from '../lib/context';
import { loadMyNotes, saveMyNotes, loadFolders, saveFolders, newId, type MyNote, type NoteFolder } from '../lib/notes';

// Navi's glyph — pulled straight from the Figma chat mockup's own header
// badge, which already used Navigator's real brand tokens (#4E6207 / #F8FDE7).
// Not using the mockup's placeholder profile photos — those were stock photos
// of real people, not something to ship as a permanent "AI face."
function NaviBadge({ size = 32 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{ width: size, height: size, background: '#4E6207' }}
    >
      <svg viewBox="0 0 32 32" width={size * 0.56} height={size * 0.56} fill="none">
        <path
          clipRule="evenodd"
          fillRule="evenodd"
          fill="#F8FDE7"
          d="M10.0566 11.0571C6.86859 12.7434 7.90061 21.5893 9.7042 22.5505C11.7185 23.6239 14.1409 21.6307 15.0703 20.7453C16.1996 22.1964 17.695 23.2078 19.7379 22.8525C21.6152 22.526 23.1943 20.9901 23.4292 19.1276C23.6641 17.2652 23.1943 12.7517 23.1943 12.7517C23.1943 12.7517 23.9661 13.8863 23.9997 13.8927C24.5534 13.9981 24.7715 13.9729 24.7715 13.3893C24.7715 13.2718 22.1204 10 22.1204 10C22.1204 10 19.7267 13.3222 19.7379 13.3893C19.8413 14.0101 19.9896 14.0437 20.4929 13.8927C20.5265 13.8826 21.4325 12.7517 21.4325 12.7517C21.4325 12.7517 23.1943 19.5471 19.1506 20.7552C17.7972 21.1595 16.5907 18.7602 15.3134 16.2202C13.7862 13.1834 12.158 9.94543 10.0566 11.0571ZM12.6493 16.1216C13.0461 17.0847 13.5288 18.2567 14.153 19.3547C13.9542 19.6186 12.8207 21.0033 11.315 20.4531C10.4425 20.1343 10.3082 14.1947 11.4324 14.0437C11.7744 13.9977 12.1413 14.8884 12.6493 16.1216Z"
        />
      </svg>
    </div>
  );
}

function buildSystemContext(entry: RoadmapEntry | null): string {
  if (!entry) {
    return "You are Navi, a friendly and knowledgeable learning assistant inside the Navigator app. " +
      "Help the user with questions, brainstorming, and thinking through study topics. Be concise and " +
      "practical. Your knowledge is frozen at your training cutoff — you cannot browse the web or verify " +
      "current facts, so say so if asked about anything you're not sure is still accurate.";
  }
  const r = entry.roadmap;
  const doneCount = Object.values(entry.progress).filter(Boolean).length;
  const totalSteps = r.phases.reduce((n, p) => n + p.steps.length, 0);
  return `You are Navi, a friendly learning assistant inside the Navigator app, currently helping the user ` +
    `with their roadmap on "${r.skill}". They've completed ${doneCount}/${totalSteps} steps so far. ` +
    `Answer questions, help them brainstorm, and explain concepts related to this skill. Be concise and ` +
    `practical. Your knowledge is frozen at your training cutoff — you cannot browse the web or verify ` +
    `current facts, so say so if asked about anything time-sensitive.`;
}

// Chat notes saved via the Bookmark icon are grouped under one auto-managed
// folder, matched by name (NoteFolder has no "system folder" flag to hang a
// stable id off). If the user renames or deletes "AI Chats", the next save
// just recreates it — self-healing rather than throwing, since there's no
// sane alternative here.
const AI_CHATS_FOLDER_NAME = 'AI Chats';

function getOrCreateAIChatsFolder(): NoteFolder {
  const folders = loadFolders();
  const existing = folders.find(f => f.name === AI_CHATS_FOLDER_NAME);
  if (existing) return existing;
  const folder: NoteFolder = { id: newId(), name: AI_CHATS_FOLDER_NAME, createdAt: Date.now() };
  saveFolders([...folders, folder]);
  return folder;
}

function formatSavedTimestamp(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

interface LocalNote { id: string; folder?: string; title: string; html: string; createdAt: number; }

function loadLocalNotes(): LocalNote[] {
  try {
    const raw = localStorage.getItem('nav_my_notes');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatDivider(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// navigator.clipboard can throw in sandboxed/iframe contexts (Figma Make
// preview, per HANDOFF.md) without clipboard-write permission — fall back
// to the classic hidden-textarea + execCommand trick rather than failing silently.
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

// Replicates the iMessage-style bubble grouping from the reference mockup:
// the corner facing the screen edge (outer side) tightens to 4px when the
// group continues in that direction; the inner corner (facing center) stays
// at the full 18px always.
function bubbleRadiusStyle(isUser: boolean, isFirst: boolean, isLast: boolean): React.CSSProperties {
  const IN = '18px';
  const OUT = '4px';
  if (isUser) {
    return {
      borderTopLeftRadius: IN,
      borderBottomLeftRadius: IN,
      borderTopRightRadius: isFirst ? IN : OUT,
      borderBottomRightRadius: isLast ? IN : OUT,
    };
  }
  return {
    borderTopRightRadius: IN,
    borderBottomRightRadius: IN,
    borderTopLeftRadius: isFirst ? IN : OUT,
    borderBottomLeftRadius: isLast ? IN : OUT,
  };
}

function Bubble({ msg, isFirst, isLast, onSave, saved, onCopy, copied, feedback, onFeedback }: {
  msg: ChatMessage;
  isFirst: boolean;
  isLast: boolean;
  onSave?: () => void;
  saved?: boolean;
  onCopy?: () => void;
  copied?: boolean;
  feedback?: 'up' | 'down';
  onFeedback?: (type: 'up' | 'down') => void;
}) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2 ${isLast ? 'mb-3' : 'mb-0.5'}`}>
      {!isUser && (
        <div style={{ width: 24, height: 24 }} className="shrink-0">
          {isLast && <NaviBadge size={24} />}
        </div>
      )}
      <div className="max-w-[75%]">
        <div
          className={`px-4 py-2 ${isUser ? 'bg-primary text-foreground' : 'bg-muted text-foreground'}`}
          style={bubbleRadiusStyle(isUser, isFirst, isLast)}
        >
          <p className="text-sm font-medium whitespace-pre-wrap leading-[1.4]">{msg.content || '\u00A0'}</p>
        </div>
        {/* Copy / Save / feedback row — feedback is cosmetic only, it doesn't
            get sent anywhere; it just gives the person a way to react. */}
        {!isUser && msg.content && (
          <div className="flex items-center gap-3 mt-1.5 ml-1">
            <button onClick={onCopy} aria-label="Copy" className="text-muted-foreground hover:text-foreground transition-colors">
              {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
            </button>
            <button
              onClick={onSave}
              disabled={saved}
              aria-label={saved ? 'Saved to notes' : 'Save to notes'}
              className={saved ? 'text-primary' : 'text-muted-foreground hover:text-foreground transition-colors'}
            >
              <Bookmark size={14} fill={saved ? '#85a60c' : 'none'} />
            </button>
            <button
              onClick={() => onFeedback?.('up')}
              aria-label="Good response"
              className={feedback === 'up' ? 'text-primary' : 'text-muted-foreground hover:text-foreground transition-colors'}
            >
              <ThumbsUp size={14} fill={feedback === 'up' ? '#85a60c' : 'none'} />
            </button>
            <button
              onClick={() => onFeedback?.('down')}
              aria-label="Bad response"
              className={feedback === 'down' ? 'text-[#e0533d]' : 'text-muted-foreground hover:text-foreground transition-colors'}
            >
              <ThumbsDown size={14} fill={feedback === 'down' ? '#e0533d' : 'none'} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryPane({ onClose, threads, activeId, onSelect, onNewChat, onTogglePin, onDeleteRequest }: {
  onClose: () => void;
  threads: ChatThreadSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onTogglePin: (id: string, pinned: boolean) => void;
  onDeleteRequest: (thread: ChatThreadSummary) => void;
}) {
  return (
    <div className="w-1/2 h-full shrink-0 flex flex-col bg-background border-l border-border">
      <div className="h-14 shrink-0 flex items-center gap-2 px-4 border-b border-border">
        <button onClick={onClose} aria-label="Back to chat" className="w-8 h-8 -ml-1.5 flex items-center justify-center text-foreground">
          <ArrowLeft size={22} strokeWidth={2.4} />
        </button>
        <p className="text-base font-bold text-foreground">Chat history</p>
      </div>
      <button
        onClick={onNewChat}
        className="w-full flex items-center gap-2 px-4 py-3 border-b border-border text-sm font-semibold text-accent-foreground shrink-0"
      >
        <MessageSquarePlus size={16} />
        New chat
      </button>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        {threads.length === 0 ? (
          <p className="text-xs text-muted-foreground px-4 py-4">No conversations yet.</p>
        ) : (
          threads.map(t => (
            <div
              key={t.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(t.id)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(t.id); } }}
              className={`w-full flex items-center gap-1 px-4 py-3 border-b border-border cursor-pointer text-left ${t.id === activeId ? 'bg-accent' : ''}`}
            >
              <div className="min-w-0 flex-1">
                <p className={`text-sm truncate flex items-center gap-1.5 ${t.id === activeId ? 'font-semibold text-foreground' : 'text-foreground'}`}>
                  {t.pinned && <Pin size={11} className="text-primary shrink-0" fill="#85a60c" />}
                  <span className="truncate">{t.title || 'New Chat'}</span>
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{formatRelative(t.updated_at)}</p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); onTogglePin(t.id, !t.pinned); }}
                aria-label={t.pinned ? 'Unpin chat' : 'Pin chat'}
                className="shrink-0 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              >
                {t.pinned ? <PinOff size={16} /> : <Pin size={16} />}
              </button>
              <button
                onClick={e => { e.stopPropagation(); onDeleteRequest(t); }}
                aria-label="Delete chat"
                className="shrink-0 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-[#e0533d] transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DeleteThreadConfirm({ title, onCancel, onConfirm }: {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative w-full bg-background rounded-2xl border border-border p-5 shadow-[0_8px_20px_rgba(19,25,39,0.15)]">
        <p className="text-sm font-bold text-foreground">Delete this chat?</p>
        <p className="text-xs text-muted-foreground mt-1.5">
          "{title || 'New Chat'}" and all its messages will be permanently deleted.
        </p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-full border border-border text-sm font-semibold text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-full bg-[#ef4444] text-sm font-semibold text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Notes list now shows a checkmark on notes already attached to the composer
// and greys out further picks once the per-message cap is hit — each attached
// note's excerpt goes straight into the outgoing prompt, so this isn't just a
// UI nicety, it's the thing keeping one message from silently ballooning.
function AttachMenu({ open, onClose, onPickNote, attachedIds, atCap }: {
  open: boolean;
  onClose: () => void;
  onPickNote: (note: LocalNote) => void;
  attachedIds: Set<string>;
  atCap: boolean;
}) {
  const [showNotes, setShowNotes] = useState(false);
  const notes = useMemo(() => (showNotes ? loadLocalNotes() : []), [showNotes]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => { onClose(); setShowNotes(false); }} />
      <div className="absolute bottom-[52px] right-12 bg-background border border-border rounded-xl shadow-[0_8px_20px_rgba(19,25,39,0.12)] z-50 w-[200px] overflow-hidden">
        {!showNotes ? (
          <>
            <button
              onClick={() => setShowNotes(true)}
              className="w-full flex items-center gap-2.5 px-3.5 py-3 text-sm text-foreground hover:bg-muted border-b border-border"
            >
              <BookOpen size={16} className="text-muted-foreground" />
              Add from Notes
            </button>
            <button
              disabled
              className="w-full flex items-center gap-2.5 px-3.5 py-3 text-sm text-muted-foreground opacity-50 cursor-not-allowed"
            >
              <ImagePlus size={16} />
              Add Image <span className="text-[10px]">(soon)</span>
            </button>
          </>
        ) : notes.length === 0 ? (
          <p className="text-xs text-muted-foreground px-3.5 py-3">No notes saved yet.</p>
        ) : (
          <div className="max-h-[220px] overflow-y-auto scrollbar-hide">
            {notes.map(n => {
              const already = attachedIds.has(n.id);
              const disabled = already || atCap;
              return (
                <button
                  key={n.id}
                  onClick={() => { if (!disabled) { onPickNote(n); onClose(); setShowNotes(false); } }}
                  disabled={disabled}
                  className={`w-full flex items-center justify-between gap-2 text-left px-3.5 py-2.5 border-b border-border last:border-0 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'
                  }`}
                >
                  <span className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{n.title || 'Untitled note'}</p>
                    {n.folder && <p className="text-[10px] text-muted-foreground">{n.folder}</p>}
                  </span>
                  {already && <Check size={13} className="text-primary shrink-0" />}
                </button>
              );
            })}
            {atCap && <p className="text-[10px] text-muted-foreground px-3.5 py-2 border-t border-border">Max 3 notes per message.</p>}
          </div>
        )}
      </div>
    </>
  );
}

// ── Voice input (Web Speech API) ─────────────────────────────────────────────
// Browser-native STT, no backend involved. Only Chromium engines (Chrome, Edge,
// Android WebView-Chrome) implement this reliably — Firefox desktop has no
// SpeechRecognition at all, and iOS Safari's support is inconsistent across
// versions. Chrome's implementation streams the audio to Google's speech
// service to do the actual transcription — it is NOT on-device — worth
// knowing before treating dictated study notes as private. We feature-detect
// and disable the mic outright where it's unsupported, rather than shipping
// a button that silently does nothing.
type SpeechRecognitionResultLike = { isFinal: boolean; 0: { transcript: string } };
type SpeechRecognitionEventLike = { resultIndex: number; results: ArrayLike<SpeechRecognitionResultLike> };
type SpeechRecognitionErrorLike = { error: string };

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function Chat() {
  const { user, activeEntry } = useApp();
  const roadmapId = activeEntry && !activeEntry.preview && !activeEntry.id.startsWith('local_') ? activeEntry.id : null;
  const systemContext = buildSystemContext(activeEntry);
  const { threads, threadId, messages, loading, streaming, error, send, stop, newChat, openThread, togglePin, deleteThread } =
    useChat(user?.id ?? null, roadmapId, systemContext);

  const [input, setInput] = useState('');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [copiedIds, setCopiedIds] = useState<Set<string>>(new Set());
  const [feedbackMap, setFeedbackMap] = useState<Record<string, 'up' | 'down'>>({});
  const [historyOpen, setHistoryOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ChatThreadSummary | null>(null);
  const [attachedNotes, setAttachedNotes] = useState<LocalNote[]>([]);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseTextRef = useRef(''); // input text at the moment recording started, so dictation appends rather than clobbers

  const SpeechRecognitionCtor = useMemo(() => getSpeechRecognitionCtor(), []);
  const voiceSupported = !!SpeechRecognitionCtor;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Stop any in-flight recognition on unmount — don't leave a live mic
  // session running if the user navigates off the chat tab mid-dictation.
  useEffect(() => {
    return () => { recognitionRef.current?.stop(); };
  }, []);

  const activeThread = threads.find(t => t.id === threadId) ?? null;

  function startListening() {
    if (!SpeechRecognitionCtor || listening) return;
    setVoiceError(null);
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || 'en-US';
    baseTextRef.current = input;

    recognition.onresult = (event) => {
      let finalChunk = '';
      let interimChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalChunk += result[0].transcript;
        else interimChunk += result[0].transcript;
      }
      const base = baseTextRef.current;
      setInput((base ? base + ' ' : '') + finalChunk + interimChunk);
      if (finalChunk) baseTextRef.current = (base ? base + ' ' : '') + finalChunk;
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setVoiceError('Microphone access is blocked — check your browser permissions.');
      } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
        setVoiceError('Voice input failed — try again.');
      }
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setVoiceError('Could not start voice input.');
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  function handleSend() {
    const text = input.trim();
    if ((!text && attachedNotes.length === 0) || streaming) return;
    if (listening) stopListening();

    // Note excerpts are folded into the outgoing text here, at send time —
    // not spliced into the textarea while composing. This keeps whatever the
    // user is typing intact while notes are attached/removed as chips.
    const noteContext = attachedNotes
      .map(n => {
        const excerpt = stripHtml(n.html).slice(0, 300);
        return `Referencing my note "${n.title}": ${excerpt}${excerpt.length === 300 ? '…' : ''}`;
      })
      .join('\n\n');
    const finalText = noteContext ? `${noteContext}${text ? '\n\n' + text : ''}` : text;

    setInput('');
    setAttachedNotes([]);
    send(finalText);
  }

  // Goes through the same notes.ts CRUD Notes.tsx uses (not a hand-rolled
  // localStorage write) so this is cross-device (Supabase mirror via
  // pushNotes) and shaped correctly (folderId/body/updatedAt).
  //
  // One note per chat thread, not one note per saved message: every tap
  // of the save icon appends a timestamped Q+A entry to that thread's
  // note instead of creating a new standalone note. The thread's note is
  // found via topicId === 'chat:' + threadId — an exact, rename-proof key
  // (chosen over matching on title, which can change). The 'chat:' prefix
  // is deliberate: topicId is also used elsewhere for roadmap-step-linked
  // notes, and Notes.tsx renders a "Tied to: {topicTitle}" badge whenever
  // topicTitle is set — so topicTitle is left undefined here on purpose,
  // and the prefix guarantees this key can never collide with a real
  // step id.
  function handleSaveNote(id: string, content: string, question: string) {
    if (!threadId) return;
    try {
      const now = Date.now();
      const chatKey = 'chat:' + threadId;
      const folder = getOrCreateAIChatsFolder();
      const notes = loadMyNotes();
      const existing = notes.find(n => n.topicId === chatKey);

      const entry =
        `<p><strong>${formatSavedTimestamp(now)}</strong></p>` +
        (question ? `<p>${question.replace(/\n/g, '<br/>')}</p>` : '') +
        `<blockquote>${content.replace(/\n/g, '<br/>')}</blockquote>`;

      if (existing) {
        const updated: MyNote = {
          ...existing,
          body: existing.body + entry,
          updatedAt: now,
        };
        saveMyNotes(notes.map(n => (n.id === existing.id ? updated : n)));
      } else {
        const title = (activeThread?.title && activeThread.title !== 'New Chat')
          ? activeThread.title
          : 'Untitled chat';
        const note: MyNote = {
          id: newId(),
          title,
          body: entry,
          folderId: folder.id,
          topicId: chatKey,
          createdAt: now,
          updatedAt: now,
        };
        saveMyNotes([...notes, note]);
      }
      setSavedIds(prev => new Set(prev).add(id));
    } catch {
      // Same "storage may be blocked in the iframe" case notes.ts's own
      // write() already accounts for — degrade silently, same as it does.
    }
  }

  async function handleCopy(id: string, content: string) {
    const ok = await copyToClipboard(content);
    if (!ok) return;
    setCopiedIds(prev => new Set(prev).add(id));
    setTimeout(() => {
      setCopiedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 1500);
  }

  // Cosmetic only, per design — toggling thumbs up/down doesn't persist or
  // send anywhere, it just gives the person a place to react.
  function toggleFeedback(id: string, type: 'up' | 'down') {
    setFeedbackMap(prev => {
      const next = { ...prev };
      if (next[id] === type) delete next[id];
      else next[id] = type;
      return next;
    });
  }

  // Adds a note as a removable chip instead of splicing its text straight
  // into the textarea. Deduped by id, capped at 3 — each chip's excerpt goes
  // into the prompt at send time, so more chips is directly more tokens and
  // slower replies, not a free UI feature.
  function handlePickNote(note: LocalNote) {
    setAttachedNotes(prev => {
      if (prev.some(n => n.id === note.id) || prev.length >= 3) return prev;
      return [...prev, note];
    });
  }

  function removeAttachedNote(id: string) {
    setAttachedNotes(prev => prev.filter(n => n.id !== id));
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <NaviBadge size={40} />
        <p className="text-sm text-muted-foreground mt-3">Sign in to chat with Navi.</p>
      </div>
    );
  }

  // Divider shows above the first message and after any 20+ minute gap.
  // `question` walks backward for the nearest prior user message so
  // handleSaveNote can save the Q+A pair together (format B), not just
  // the assistant's reply in isolation.
  const withDividers = messages.map((m, i) => {
    const prev = messages[i - 1];
    const showDivider = !prev || (new Date(m.created_at).getTime() - new Date(prev.created_at).getTime()) > 20 * 60 * 1000;
    const isFirstInGroup = !prev || prev.role !== m.role || showDivider;
    const next = messages[i + 1];
    const isLastInGroup = !next || next.role !== m.role;
    let question = '';
    for (let j = i - 1; j >= 0; j--) {
      if (messages[j].role === 'user') { question = messages[j].content; break; }
    }
    return { m, showDivider, isFirstInGroup, isLastInGroup, question };
  });

  return (
    <div className="h-full w-full overflow-hidden relative">
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ width: '200%', transform: historyOpen ? 'translateX(-50%)' : 'translateX(0%)' }}
      >
        {/* Main chat pane */}
        <div className="w-1/2 h-full shrink-0 flex flex-col">
          {/* Header */}
          <div className="h-14 shrink-0 bg-background border-b border-border flex items-center px-4 gap-3">
            <NaviBadge size={32} />
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-semibold text-foreground leading-[1.2] truncate">Navi</p>
              <p className="text-[12px] text-foreground/50 leading-[1.4] truncate">
                {activeThread?.title && activeThread.title !== 'New Chat' ? activeThread.title : 'Navi is active'}
              </p>
            </div>
            <button onClick={newChat} aria-label="New chat" className="shrink-0 text-foreground">
              <MessageSquarePlus size={22} strokeWidth={1.6} />
            </button>
            <button onClick={() => setHistoryOpen(true)} aria-label="Chat history" className="shrink-0 text-foreground">
              <Menu size={22} strokeWidth={1.6} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-2 scrollbar-hide">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">Loading chat…</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <NaviBadge size={44} />
                <p className="text-sm font-semibold text-foreground mt-3 mb-1">Ask Navi anything</p>
                <p className="text-xs text-muted-foreground">
                  Questions, brainstorming, explanations — Navi knows what you're learning{activeEntry ? ` (${activeEntry.roadmap.skill})` : ''}.
                </p>
              </div>
            ) : (
              withDividers.map(({ m, showDivider, isFirstInGroup, isLastInGroup, question }) => (
                <div key={m.id}>
                  {showDivider && (
                    <p className="text-center text-[12px] text-muted-foreground my-3">{formatDivider(m.created_at)}</p>
                  )}
                  <Bubble
                    msg={m}
                    isFirst={isFirstInGroup}
                    isLast={isLastInGroup}
                    onSave={m.role === 'assistant' ? () => handleSaveNote(m.id, m.content, question) : undefined}
                    saved={savedIds.has(m.id)}
                    onCopy={m.role === 'assistant' ? () => handleCopy(m.id, m.content) : undefined}
                    copied={copiedIds.has(m.id)}
                    feedback={feedbackMap[m.id]}
                    onFeedback={m.role === 'assistant' ? (type) => toggleFeedback(m.id, type) : undefined}
                  />
                </div>
              ))
            )}
            {error && <p className="text-xs text-[#e0533d] text-center mt-2">{error}</p>}
          </div>

          {/* Footer input bar — attach sits inward (next to the field), send/mic sits outward (far edge) */}
          <div className="px-4 pt-2 pb-4 shrink-0 relative">
            {listening && (
              <div className="flex items-center gap-1.5 px-1 pb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e0533d] animate-pulse" />
                <span className="text-[11px] font-semibold text-[#e0533d]">Listening…</span>
              </div>
            )}

            {attachedNotes.length > 0 && (
              <div className="flex items-center gap-1.5 pb-2 overflow-x-auto scrollbar-hide">
                {attachedNotes.map(n => (
                  <span
                    key={n.id}
                    className="inline-flex items-center gap-1 bg-accent border border-primary text-accent-foreground text-[11px] font-semibold pl-2 pr-1.5 py-1 rounded-full shrink-0 max-w-[160px]"
                  >
                    <BookOpen size={11} className="shrink-0" />
                    <span className="truncate">{n.title || 'Untitled note'}</span>
                    <button
                      onClick={() => removeAttachedNote(n.id)}
                      aria-label={`Remove ${n.title || 'note'}`}
                      className="shrink-0 text-primary hover:text-foreground transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={listening ? 'Listening…' : 'Message...'}
                rows={1}
                disabled={listening}
                className="flex-1 resize-none max-h-24 text-sm text-foreground placeholder:text-muted-foreground bg-transparent focus:outline-none py-1 disabled:opacity-60"
              />
              <button onClick={() => setAttachOpen(o => !o)} aria-label="Attach" className="shrink-0 text-muted-foreground">
                <Plus size={22} strokeWidth={1.6} />
              </button>
              {streaming ? (
                <button onClick={stop} aria-label="Stop" className="shrink-0 text-foreground">
                  <Square size={20} strokeWidth={1.6} />
                </button>
              ) : listening ? (
                <button onClick={stopListening} aria-label="Stop recording" className="shrink-0 text-[#e0533d]">
                  <Square size={20} strokeWidth={1.6} fill="#e0533d" />
                </button>
              ) : input.trim() || attachedNotes.length > 0 ? (
                <button onClick={handleSend} aria-label="Send" className="shrink-0 text-accent-foreground">
                  <Send size={22} strokeWidth={1.6} />
                </button>
              ) : voiceSupported ? (
                <button onClick={startListening} aria-label="Voice input" className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                  <Mic size={22} strokeWidth={1.6} />
                </button>
              ) : (
                <button aria-label="Voice input not supported in this browser" disabled className="shrink-0 text-muted-foreground opacity-60 cursor-not-allowed">
                  <Mic size={22} strokeWidth={1.6} />
                </button>
              )}
            </div>
            {voiceError && <p className="text-[11px] text-[#e0533d] mt-1.5 px-1">{voiceError}</p>}

            <AttachMenu
              open={attachOpen}
              onClose={() => setAttachOpen(false)}
              onPickNote={handlePickNote}
              attachedIds={new Set(attachedNotes.map(n => n.id))}
              atCap={attachedNotes.length >= 3}
            />
          </div>
        </div>

        {/* History pane — slides in as its own full-width screen, pushing
            the chat pane fully off to the left, rather than overlaying it. */}
        <HistoryPane
          onClose={() => setHistoryOpen(false)}
          threads={threads}
          activeId={threadId}
          onSelect={id => { openThread(id); setHistoryOpen(false); }}
          onNewChat={() => { newChat(); setHistoryOpen(false); }}
          onTogglePin={(id, pinned) => togglePin(id, pinned)}
          onDeleteRequest={thread => setDeleteTarget(thread)}
        />
      </div>

      {deleteTarget && (
        <DeleteThreadConfirm
          title={deleteTarget.title}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            const id = deleteTarget.id;
            setDeleteTarget(null);
            deleteThread(id);
          }}
        />
      )}
    </div>
  );
}
