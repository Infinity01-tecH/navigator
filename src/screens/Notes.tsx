import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useSmoothScroll } from '../lib/useSmoothScroll';
import {
  ArrowLeft, ChevronRight, Plus, Search, Trash2, Sparkles, Map,
  Folder, FolderPlus, Pencil, RotateCw,
} from 'lucide-react';
import { useApp } from '../lib/context';
import type { Roadmap, RoadmapPhase, RoadmapStep } from '../lib/generateRoadmap';
import { generateTopicNote } from '../lib/generateRoadmap';
import { RichEditor } from '../app/components/RichEditor';
import {
  loadMyNotes, saveMyNotes, newId, loadTopicOverrides, saveTopicOverride,
  draftTopicNote, loadFolders, createFolder, deleteFolder,
  type MyNote, type NoteFolder,
} from '../lib/notes';
import backSvg from '../imports/BackIconBtn/svg-asr2mlrdv9';

type Tab = 'topic' | 'my';

function stripHtml(html: string): string {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function Notes() {
  const navigate = useNavigate();
  const smoothRef = useSmoothScroll<HTMLDivElement>();
  const { activeEntry } = useApp();
  const roadmap = activeEntry?.roadmap ?? null;
  const [params] = useSearchParams();
  const deepTopic = params.get('topic');
  const [tab, setTab] = useState<Tab>(deepTopic ? 'topic' : 'topic');

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Back + theme header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="-ml-1 p-2 flex items-center justify-center"
          aria-label="Back"
        >
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
            <path
              d={backSvg.pcca5f60}
              stroke="#131313"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className="bg-card rounded-[12px] p-2 flex items-center justify-center"
          aria-label="Toggle theme"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d={backSvg.p1b5c2d80} fill="#131313" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <div className="px-5 pb-3 shrink-0">
        <h1
          className="text-foreground mb-4"
          style={{ fontSize: 32, fontWeight: 590, lineHeight: '40px', letterSpacing: '-0.096px' }}
        >
          Notes
        </h1>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-card rounded-[14px]">
          {([['topic', 'Topic Notes'], ['my', 'My Notes']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 h-9 rounded-[11px] transition-all"
              style={{
                background: tab === id ? '#8cb200' : 'transparent',
                color: tab === id ? '#131927' : '#9ea2ae',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div ref={smoothRef} className="flex-1 overflow-y-auto px-5 py-2 scrollbar-hide">
        {tab === 'topic'
          ? <TopicNotes roadmap={roadmap} initialTopic={deepTopic} onGoRoadmap={() => navigate('/main')} onAddedMyNote={() => setTab('my')} />
          : <MyNotes />}
      </div>
    </div>
  );
}

// ─── Topic Notes ──────────────────────────────────────────────────────────────

function TopicNotes({
  roadmap, initialTopic, onGoRoadmap, onAddedMyNote,
}: {
  roadmap: Roadmap | null;
  initialTopic: string | null;
  onGoRoadmap: () => void;
  onAddedMyNote: () => void;
}) {
  const [openStep, setOpenStep] = useState<{ phase: RoadmapPhase; step: RoadmapStep } | null>(null);

  useEffect(() => {
    if (!initialTopic || !roadmap) return;
    for (const phase of roadmap.phases) {
      const step = phase.steps.find(s => s.id === initialTopic);
      if (step) { setOpenStep({ phase, step }); break; }
    }
  }, [initialTopic, roadmap]);

  if (!roadmap) {
    return (
      <EmptyState
        title="No roadmap yet"
        body="Generate a roadmap first — topic notes are drafted from its sections and topics."
      />
    );
  }

  if (openStep) {
    return (
      <TopicNoteEditor
        skill={roadmap.skill}
        phase={openStep.phase}
        step={openStep.step}
        onBack={() => setOpenStep(null)}
        onGoRoadmap={onGoRoadmap}
        onAddedMyNote={onAddedMyNote}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div className="flex items-center gap-2">
        <Sparkles size={13} className="text-primary" />
        <span style={{ fontSize: 12, color: '#9ea2ae' }}>AI-drafted notes for {roadmap.skill}</span>
      </div>
      {roadmap.phases.map(phase => (
        <div key={phase.id} className="flex flex-col gap-2">
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ea2ae', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {phase.title}
          </p>
          <div className="flex flex-col gap-1">
            {phase.steps.map(step => (
              <button
                key={step.id}
                onClick={() => setOpenStep({ phase, step })}
                className="flex items-center gap-3 px-4 py-3 rounded-[16px] text-left transition-colors"
                style={{ background: '#f8f8f8' }}
              >
                <div className="w-8 h-8 rounded-[10px] bg-accent flex items-center justify-center shrink-0">
                  <Sparkles size={14} className="text-primary" />
                </div>
                <span className="flex-1 min-w-0 truncate" style={{ fontSize: 14, fontWeight: 500, color: '#131313' }}>
                  {step.title}
                </span>
                <ChevronRight size={16} className="text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TopicNoteEditor({
  skill, phase, step, onBack, onGoRoadmap, onAddedMyNote,
}: {
  skill: string;
  phase: RoadmapPhase;
  step: RoadmapStep;
  onBack: () => void;
  onGoRoadmap: () => void;
  onAddedMyNote: () => void;
}) {
  const saved = loadTopicOverrides()[step.id];
  const [body, setBody] = useState(saved ?? '');
  const [loading, setLoading] = useState(!saved);

  async function runGenerate() {
    setLoading(true);
    try {
      const html = await generateTopicNote(skill, phase.title, step.title, step.note, step.type);
      setBody(html);
      saveTopicOverride(step.id, html);
    } catch {
      const fallback = draftTopicNote(skill, phase.title, step.title, step.note, step.type);
      setBody(fallback);
      saveTopicOverride(step.id, fallback);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!saved) runGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => { if (body) saveTopicOverride(step.id, body); };
  }, [body, step.id]);

  function handleAddMyNote() {
    saveTopicOverride(step.id, body);
    const folders = loadFolders();
    const folder = folders.find(f => f.name === skill) ?? createFolder(skill);
    const now = Date.now();
    const notes = loadMyNotes();
    notes.unshift({
      id: newId(),
      title: `My note — ${step.title}`,
      body: '',
      folderId: folder.id,
      topicId: step.id,
      topicTitle: step.title,
      createdAt: now,
      updatedAt: now,
    });
    saveMyNotes(notes);
    onAddedMyNote();
  }

  return (
    <div className="pb-4">
      <button
        onClick={() => { saveTopicOverride(step.id, body); onBack(); }}
        className="flex items-center gap-1.5 mb-4 hover:opacity-70 transition-opacity"
        style={{ fontSize: 14, fontWeight: 600, color: '#131313' }}
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> All topics
      </button>

      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-1.5 bg-accent px-2.5 py-1 rounded-full">
          <Sparkles size={12} className="text-primary" />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#4e6207' }}>AI-generated</span>
        </div>
        <button
          onClick={runGenerate}
          disabled={loading}
          className="inline-flex items-center gap-1.5 hover:opacity-70 transition-opacity disabled:opacity-40"
          style={{ fontSize: 11, fontWeight: 600, color: '#9ea2ae' }}
        >
          <RotateCw size={13} className={loading ? 'animate-spin' : ''} /> Regenerate
        </button>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#131313', marginBottom: 2 }}>{step.title}</h2>
      <p style={{ fontSize: 12, color: '#9ea2ae', marginBottom: 16 }}>{phase.title}</p>

      {loading ? (
        <div className="rounded-[16px] p-4 space-y-2.5 bg-card">
          <div className="h-4 w-2/3 bg-secondary rounded animate-pulse" />
          <div className="h-3 w-full bg-secondary rounded animate-pulse" />
          <div className="h-3 w-full bg-secondary rounded animate-pulse" />
          <div className="h-3 w-4/5 bg-secondary rounded animate-pulse" />
          <div className="h-32 w-full bg-secondary rounded-xl animate-pulse mt-3" />
          <p style={{ fontSize: 11, color: '#9ea2ae', paddingTop: 4 }}>Writing a detailed note with highlights and images…</p>
        </div>
      ) : (
        <RichEditor value={body} onChange={setBody} placeholder="Edit this note…" />
      )}

      <div className="flex flex-col gap-2 mt-5">
        <button
          onClick={handleAddMyNote}
          className="w-full h-[56px] rounded-full flex items-center justify-center gap-2 transition-opacity"
          style={{ background: '#8cb200', fontSize: 16, fontWeight: 600, color: '#131927' }}
        >
          <Plus size={16} /> Add my own note
        </button>
        <button
          onClick={onGoRoadmap}
          className="w-full h-[48px] rounded-full flex items-center justify-center gap-2 transition-opacity"
          style={{ background: '#f8f8f8', fontSize: 14, fontWeight: 600, color: '#9ea2ae' }}
        >
          <Map size={16} /> View in Roadmap
        </button>
      </div>
    </div>
  );
}

// ─── My Notes (folder-first) ──────────────────────────────────────────────────

function MyNotes() {
  const [folders, setFolders] = useState<NoteFolder[]>(() => loadFolders());
  const [notes, setNotes] = useState<MyNote[]>(() => loadMyNotes());
  const [openFolder, setOpenFolder] = useState<NoteFolder | null>(null);
  const [editing, setEditing] = useState<MyNote | null>(null);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [query, setQuery] = useState('');

  function refresh() { setFolders(loadFolders()); setNotes(loadMyNotes()); }

  function persistNotes(next: MyNote[]) {
    setNotes(next);
    saveMyNotes(next);
  }

  function addFolder() {
    if (!folderName.trim()) return;
    createFolder(folderName);
    setFolderName('');
    setCreatingFolder(false);
    refresh();
  }

  function removeFolder(id: string) {
    deleteFolder(id);
    setOpenFolder(null);
    refresh();
  }

  function createNoteInFolder(folderId: string) {
    const now = Date.now();
    setEditing({ id: newId(), title: '', body: '', folderId, createdAt: now, updatedAt: now });
  }

  function commit(note: MyNote): MyNote {
    const title = note.title.trim() || stripHtml(note.body).slice(0, 60) || 'Untitled note';
    const finalized = { ...note, title, updatedAt: Date.now() };
    const exists = notes.some(n => n.id === note.id);
    const next = exists
      ? notes.map(n => (n.id === note.id ? finalized : n))
      : [finalized, ...notes];
    persistNotes(next.sort((a, b) => b.updatedAt - a.updatedAt));
    return finalized;
  }

  function saveNote(note: MyNote) {
    commit(note);
    setEditing(null);
  }

  function persistNote(note: MyNote) {
    setEditing(commit(note));
  }

  function deleteNote(id: string) {
    persistNotes(notes.filter(n => n.id !== id));
    setEditing(null);
  }

  // ── Note editor ──
  if (editing) {
    return (
      <MyNoteEditor
        note={editing}
        folders={folders}
        onSave={saveNote}
        onPersist={persistNote}
        onDelete={deleteNote}
        onCancel={() => setEditing(null)}
      />
    );
  }

  // ── Folder-creation flow ──
  if (creatingFolder) {
    return (
      <div className="pb-4">
        <button
          onClick={() => { setCreatingFolder(false); setFolderName(''); }}
          className="flex items-center gap-1.5 mb-5 hover:opacity-70 transition-opacity"
          style={{ fontSize: 14, fontWeight: 600, color: '#131313' }}
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Back
        </button>
        <div className="w-12 h-12 rounded-[16px] bg-accent flex items-center justify-center mb-4">
          <FolderPlus size={22} className="text-primary" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#131313', marginBottom: 4 }}>New skill folder</h2>
        <p style={{ fontSize: 14, color: '#9ea2ae', marginBottom: 16 }}>Group notes by the skill or subject you're learning.</p>
        <input
          value={folderName}
          onChange={e => setFolderName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addFolder(); }}
          autoFocus
          placeholder="e.g. Web Design"
          className="w-full h-[48px] px-[16px] bg-card rounded-[16px] focus:outline-none mb-3"
          style={{ fontSize: 14, color: '#131313' }}
        />
        <button
          onClick={addFolder}
          disabled={!folderName.trim()}
          className="w-full h-[56px] rounded-full transition-opacity disabled:opacity-40"
          style={{ background: '#8cb200', fontSize: 16, fontWeight: 600, color: '#131927' }}
        >
          Create folder
        </button>
      </div>
    );
  }

  // ── Inside a folder ──
  if (openFolder) {
    const folderNotes = notes.filter(n => n.folderId === openFolder.id);
    const filtered = query.trim()
      ? folderNotes.filter(n => (n.title + ' ' + stripHtml(n.body)).toLowerCase().includes(query.trim().toLowerCase()))
      : folderNotes;

    return (
      <div className="relative min-h-[60vh] pb-4">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => { setOpenFolder(null); setQuery(''); }}
            className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            style={{ fontSize: 14, fontWeight: 600, color: '#131313' }}
          >
            <ArrowLeft size={16} strokeWidth={2.5} /> Folders
          </button>
          <button
            onClick={() => removeFolder(openFolder.id)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[#fdeeeb]"
            style={{ color: '#e0533d' }}
            aria-label="Delete folder"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-[12px] bg-accent flex items-center justify-center">
            <Folder size={17} className="text-primary" />
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#131313' }}>{openFolder.name}</p>
            <p style={{ fontSize: 11, color: '#9ea2ae' }}>{folderNotes.length} note{folderNotes.length === 1 ? '' : 's'}</p>
          </div>
        </div>

        {folderNotes.length > 5 && (
          <div className="relative mb-4">
            <Search size={15} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search notes"
              className="w-full h-[44px] pl-[40px] pr-4 bg-card rounded-full focus:outline-none"
              style={{ fontSize: 14, color: '#131313' }}
            />
          </div>
        )}

        {folderNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-14">
            <p style={{ fontSize: 14, color: '#9ea2ae', marginBottom: 16 }}>No notes in this folder yet</p>
            <button
              onClick={() => createNoteInFolder(openFolder.id)}
              className="h-[48px] px-5 rounded-full flex items-center gap-2 transition-opacity"
              style={{ background: '#8cb200', fontSize: 14, fontWeight: 600, color: '#131927' }}
            >
              <Plus size={16} /> New Note
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {filtered.map(note => (
                <button
                  key={note.id}
                  onClick={() => setEditing(note)}
                  className="w-full text-left rounded-[16px] px-4 py-3 transition-colors"
                  style={{ background: '#f8f8f8' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate" style={{ fontSize: 14, fontWeight: 600, color: '#131313' }}>
                      {note.title || 'Untitled note'}
                    </p>
                    <span style={{ fontSize: 11, color: '#9ea2ae', flexShrink: 0 }}>{formatDate(note.updatedAt)}</span>
                  </div>
                  {stripHtml(note.body) && (
                    <p className="truncate mt-0.5" style={{ fontSize: 12, color: '#9ea2ae' }}>
                      {stripHtml(note.body)}
                    </p>
                  )}
                  {note.topicTitle && (
                    <span className="inline-flex items-center gap-1 mt-1.5 bg-accent px-2 py-0.5 rounded-full" style={{ fontSize: 11, color: '#4e6207' }}>
                      <Sparkles size={10} /> {note.topicTitle}
                    </span>
                  )}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-center py-8" style={{ fontSize: 14, color: '#9ea2ae' }}>No notes match "{query}"</p>
              )}
            </div>
            <button
              onClick={() => createNoteInFolder(openFolder.id)}
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-opacity"
              style={{ background: '#8cb200' }}
              aria-label="New note"
            >
              <Plus size={24} className="text-foreground" />
            </button>
          </>
        )}
      </div>
    );
  }

  // ── Root: folder list ──
  if (folders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <div className="w-14 h-14 rounded-[18px] bg-accent flex items-center justify-center mb-4">
          <Folder size={24} className="text-primary" />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#131313', marginBottom: 4 }}>Organise notes into skill folders</h2>
        <p style={{ fontSize: 14, color: '#9ea2ae', maxWidth: 260, marginBottom: 20 }}>Create a folder for a skill, then add notes inside it.</p>
        <button
          onClick={() => setCreatingFolder(true)}
          className="h-[48px] px-5 rounded-full flex items-center gap-2 transition-opacity"
          style={{ background: '#8cb200', fontSize: 14, fontWeight: 600, color: '#131927' }}
        >
          <FolderPlus size={16} /> Create Skill Folder
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 pb-4">
      {folders.map(folder => {
        const count = notes.filter(n => n.folderId === folder.id).length;
        return (
          <button
            key={folder.id}
            onClick={() => setOpenFolder(folder)}
            className="flex items-center gap-3 rounded-[16px] px-4 py-[14px] text-left transition-colors"
            style={{ background: '#f8f8f8' }}
          >
            <div className="w-10 h-10 rounded-[12px] bg-accent flex items-center justify-center shrink-0">
              <Folder size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate" style={{ fontSize: 14, fontWeight: 600, color: '#131313' }}>{folder.name}</p>
              <p style={{ fontSize: 11, color: '#9ea2ae' }}>{count} note{count === 1 ? '' : 's'}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground shrink-0" />
          </button>
        );
      })}
      <button
        onClick={() => setCreatingFolder(true)}
        className="flex items-center justify-center gap-2 rounded-[16px] px-4 py-[14px] transition-colors hover:opacity-70"
        style={{ background: '#f8f8f8', border: '1.5px dashed #d2d5db', fontSize: 14, fontWeight: 600, color: '#9ea2ae' }}
      >
        <FolderPlus size={16} /> Create Skill Folder
      </button>
    </div>
  );
}

function MyNoteEditor({
  note, folders, onSave, onPersist, onDelete, onCancel,
}: {
  note: MyNote;
  folders: NoteFolder[];
  onSave: (n: MyNote) => void;
  onPersist: (n: MyNote) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [folderId, setFolderId] = useState<string | null>(note.folderId);
  const [mode, setMode] = useState<'edit' | 'read'>(stripHtml(note.body) ? 'read' : 'edit');

  const folderName = folders.find(f => f.id === folderId)?.name ?? null;

  function handleExit() {
    if (!title.trim() && !stripHtml(body)) { onCancel(); return; }
    onSave({ ...note, title, body, folderId });
  }

  function handleSave() {
    onPersist({ ...note, title, body, folderId });
    setMode('read');
  }

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleExit}
          className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
          style={{ fontSize: 14, fontWeight: 600, color: '#131313' }}
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Back
        </button>
        <div className="flex items-center gap-1.5">
          {mode === 'edit' ? (
            <button
              onClick={handleSave}
              className="h-9 px-4 rounded-full transition-opacity"
              style={{ background: '#8cb200', fontSize: 13, fontWeight: 600, color: '#131927' }}
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setMode('edit')}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-muted opacity-45 hover:opacity-100"
              aria-label="Edit note"
            >
              <Pencil size={16} className="text-foreground" />
            </button>
          )}
          <button
            onClick={() => onDelete(note.id)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#fdeeeb] transition-colors"
            aria-label="Delete note"
            style={{ color: '#e0533d' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {note.topicTitle && (
        <span className="inline-flex items-center gap-1 mb-3 bg-accent px-2 py-0.5 rounded-full" style={{ fontSize: 11, color: '#4e6207' }}>
          <Sparkles size={10} /> Tied to: {note.topicTitle}
        </span>
      )}

      {mode === 'edit' ? (
        <>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent focus:outline-none mb-2"
            style={{ fontSize: 20, fontWeight: 700, color: '#131313' }}
          />

          <div className="flex items-center gap-2 mb-4">
            <Folder size={14} className="text-muted-foreground" />
            <select
              value={folderId ?? ''}
              onChange={e => setFolderId(e.target.value || null)}
              className="bg-card rounded-[10px] px-2 py-1 focus:outline-none"
              style={{ fontSize: 13, fontWeight: 600, color: '#131313' }}
            >
              <option value="">No folder</option>
              {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>

          <RichEditor value={body} onChange={setBody} placeholder="Start writing…" />
        </>
      ) : (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#131313', marginBottom: 4 }}>
            {title || 'Untitled note'}
          </h2>
          {folderName && (
            <p className="flex items-center gap-1.5 mb-4" style={{ fontSize: 12, color: '#9ea2ae' }}>
              <Folder size={12} /> {folderName}
            </p>
          )}
          <div className="note-read" style={{ fontSize: 14, color: '#131313', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: body }} />
          <style>{`
            .note-read h3 { font-weight: 700; margin: 0.5em 0 0.3em; }
            .note-read h4 { font-weight: 700; margin: 0.7em 0 0.2em; color:#4b5162; }
            .note-read p { margin: 0.45em 0; }
            .note-read ul { list-style: disc; padding-left: 1.2em; margin: 0.45em 0; }
            .note-read blockquote { border-left: 3px solid #d2f25e; padding-left: 0.75em; color:#6d717f; margin: 0.6em 0; }
            .note-read figure { margin: 0.7em 0; }
            .note-read figure img { max-width: 100%; border-radius: 12px; display:block; }
            .note-read figcaption { font-size: 11px; color:#9ea2ae; margin-top: 4px; }
            .note-read img { max-width: 100%; border-radius: 12px; }
            .note-read mark { background: #fdf3a6; padding: 0 2px; border-radius: 3px; }
            .note-read code { font-family: ui-monospace,SFMono-Regular,Menlo,monospace; background:#f3f4f6; padding:1px 5px; border-radius:4px; font-size:0.9em; }
          `}</style>
        </>
      )}
    </div>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <div className="w-14 h-14 rounded-[18px] bg-accent flex items-center justify-center mb-4">
        <Sparkles size={24} className="text-primary" />
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#131313', marginBottom: 4 }}>{title}</h2>
      <p style={{ fontSize: 14, color: '#9ea2ae', maxWidth: 260 }}>{body}</p>
    </div>
  );
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
