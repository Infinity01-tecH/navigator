import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useSmoothScroll } from '../lib/useSmoothScroll';
import { Play, Pause, ChevronLeft, ChevronRight, Bookmark, Brain, Check, Lock, RotateCcw, RotateCw, Maximize, Minimize, Settings, ArrowLeft, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { NAV_LOGO_PATH, NAV_LOGO_VIEWBOX } from '../lib/navLogo';
import { useApp } from '../lib/context';
import { QuizResult } from '../app/components/QuizResult';
import { RichEditor } from '../app/components/RichEditor';
import watchSvg from '../imports/SetupNavigatorPwaProject-4/svg-upgd4ezqsn';

// ── YT IFrame API types ───────────────────────────────────────────────────────
declare global {
  interface Window {
    YT: {
      Player: new (el: HTMLElement, opts: YTOpts) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}
// YouTube's own internal quality labels — not real pixel heights, just their
// long-standing string enum (see IFrame API docs: getAvailableQualityLevels /
// setPlaybackQuality). 'auto' lets YouTube's own adaptive logic decide, same
// as never calling this at all.
type YTQuality = 'auto' | 'small' | 'medium' | 'large' | 'hd720' | 'hd1080' | 'hd1440' | 'hd2160' | 'highres';

interface YTPlayer {
  playVideo(): void; pauseVideo(): void;
  seekTo(s: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number; getDuration(): number; getPlayerState(): number;
  destroy(): void;
  // Quality controls. YouTube's own docs note suggestedQuality/setPlaybackQuality
  // is best-effort, not a hard guarantee — the player's internal adaptive-bitrate
  // logic can still override it based on connection/player size. Still a real,
  // functioning call; just not a lock. getAvailableQualityLevels() returns only
  // the levels actually offered for the loaded video, never a fixed list.
  getAvailableQualityLevels(): YTQuality[];
  getPlaybackQuality(): YTQuality;
  setPlaybackQuality(quality: YTQuality): void;
}
interface YTOpts {
  videoId: string;
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (e: { target: YTPlayer }) => void;
    onStateChange?: (e: { data: number }) => void;
  };
}

// ── Domain types ──────────────────────────────────────────────────────────────
interface VideoQuiz {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}
interface VideoChapter {
  id: string;
  index: number;
  title: string;
  startTime: number;
  endTime: number;
  // Was `quiz: VideoQuiz | null` (exactly one question, always). Now an
  // array so a chapter can carry more than one — target scaling, once
  // video-analyze is updated to actually emit that many (NOT done this
  // pass, see normalizeChapter below): <3min → 1 · 3–7min → 2 · 7–12min → 3
  // · 12min+ → 4. The frontend doesn't compute or enforce that scaling
  // itself — the quiz interrupt just asks however many questions are
  // actually present, so nothing here needs to change again once the
  // backend catches up. [] means no quiz for this chapter (no interrupt
  // fires, chapter unlocks the next one automatically on playback).
  quizzes: VideoQuiz[];
}
interface VideoAnalysis {
  videoId: string;
  title: string;
  thumbnail: string;
  durationSecs: number;
  chapters: VideoChapter[];
  // Timestamped caption blocks (~20s each) from video-analyze. [] when the
  // video has no captions, or when an older deployed function omits it.
  transcript: { start: number; text: string }[];
}
interface CaptureItem {
  id: string;
  timestamp: number;
  chapterTitle: string;
  note: string; // RichEditor HTML string; '' until the user writes something
}

// A chapter's quiz resolves exactly once. 'passed' = ≥70%. 'skipped' = user
// used the bare escape hatch on a failed attempt — no XP penalty math; this
// exists only so a broken/unanswerable AI-generated question (see
// validateQuiz in video-analyze/index.ts — "must match" isn't "will match")
// never becomes a hard dead end with no way to continue. Re-visiting a
// resolved chapter never re-fires the interrupt (§ ask: "if they have
// answered the quiz already, they don't have to answer another").
type QuizOutcome = 'passed' | 'skipped';
interface ChapterResolution {
  outcome: QuizOutcome;
  wrongCount: number; // always 0 now — kept on the shape for resolvedChapters' record type
}

// ─── Chapter XP idempotency ───────────────────────────────────────────────────
// Tracks which `${videoId}:${chapterId}` pairs have already been awarded XP,
// per user, so re-watching a video never double-grants quiz XP. Stored in
// localStorage (same tier as the quiz XP cache) keyed by userId to prevent
// cross-user contamination on a shared device.
const CHAPTER_XP_KEY = 'nav_chapter_xp';

function getAwardedChapters(userId: string): Set<string> {
  try {
    const raw = localStorage.getItem(CHAPTER_XP_KEY);
    const all: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    return new Set(all[userId] ?? []);
  } catch {
    return new Set();
  }
}

function markChapterAwarded(userId: string, key: string) {
  try {
    const raw = localStorage.getItem(CHAPTER_XP_KEY);
    const all: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    const set = new Set(all[userId] ?? []);
    set.add(key);
    all[userId] = [...set];
    localStorage.setItem(CHAPTER_XP_KEY, JSON.stringify(all));
  } catch {
    // best-effort — a failed write just means XP re-grants on next watch (minor vs a hard error)
  }
}

// ─── Captures persistence ─────────────────────────────────────────────────────
// Captures (timestamped notes taken during a watch session) are persisted in
// localStorage keyed by videoId so they survive navigation and tab reloads.
// One entry per video — revisiting a video picks up where you left off.
const VIDEO_CAPTURES_KEY = 'nav_video_captures';

function loadVideoCaptures(videoId: string): CaptureItem[] {
  try {
    const raw = localStorage.getItem(VIDEO_CAPTURES_KEY);
    const all: Record<string, CaptureItem[]> = raw ? JSON.parse(raw) : {};
    return all[videoId] ?? [];
  } catch {
    return [];
  }
}

function saveVideoCaptures(videoId: string, captures: CaptureItem[]) {
  try {
    const raw = localStorage.getItem(VIDEO_CAPTURES_KEY);
    const all: Record<string, CaptureItem[]> = raw ? JSON.parse(raw) : {};
    if (captures.length === 0) {
      delete all[videoId];
    } else {
      all[videoId] = captures;
    }
    localStorage.setItem(VIDEO_CAPTURES_KEY, JSON.stringify(all));
  } catch {
    // best-effort — a failed write means captures aren't persisted this session
  }
}

// Backend today still returns a single `quiz: VideoQuiz | null` per chapter
// (video-analyze not yet updated — separate, un-started work). This is the
// one seam that absorbs that gap: whatever shape arrives, chapters always
// come out with a `quizzes` array downstream of this function.
function normalizeAnalysis(raw: any): VideoAnalysis {
  const chapters: VideoChapter[] = (raw?.chapters ?? []).map((ch: any) => ({
    id: ch.id,
    index: ch.index,
    title: ch.title,
    startTime: ch.startTime,
    endTime: ch.endTime,
    quizzes: Array.isArray(ch.quizzes) ? ch.quizzes
           : Array.isArray(ch.quiz) ? ch.quiz
           : ch.quiz ? [ch.quiz] : [],
  }));
  return {
    videoId: raw.videoId,
    title: raw.title,
    thumbnail: raw.thumbnail,
    durationSecs: raw.durationSecs,
    chapters,
    transcript: Array.isArray(raw.transcript)
      ? raw.transcript.filter((l: any) => l && typeof l.text === 'string' && typeof l.start === 'number')
      : [],
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  return `${m}:${String(sec).padStart(2,'0')}`;
}

function NavLogo({ size, color = '#131927' }: { size: number; color?: string }) {
  return (
    <svg viewBox={NAV_LOGO_VIEWBOX} width={size} height={size} fill="none">
      <path clipRule="evenodd" d={NAV_LOGO_PATH} fill={color} fillRule="evenodd" />
    </svg>
  );
}

// ── Input Phase ───────────────────────────────────────────────────────────────
function InputPhase({ defaultUrl, onAnalyze }: { defaultUrl?: string; onAnalyze: (url: string) => void }) {
  const navigate = useNavigate();
  const [url, setUrl] = useState(defaultUrl ?? '');
  const isYT = /youtu(\.be|be\.com)/.test(url);

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
              d={watchSvg.pcca5f60}
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
            <path d={watchSvg.p1b5c2d80} fill="#131313" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex flex-col flex-1 px-5 pb-8 gap-6 overflow-y-auto">

        {/* Immersive mode badge + headings */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-[6px]">
            <div
              className="flex items-center justify-center shrink-0 p-[10px]"
              style={{ background: '#8cb200', borderRadius: 17 }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d={watchSvg.p35f45400}
                  stroke="#131927"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.667"
                />
              </svg>
            </div>
            <span className="text-[24px] font-bold text-foreground tracking-[-0.072px]">
              Immersive mode
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h2
              className="text-[32px] leading-[40px] text-foreground"
              style={{ fontWeight: 590, letterSpacing: '-0.096px' }}
            >
              Paste a YouTube link
            </h2>
            <p className="text-[16px] text-foreground leading-[20px] tracking-[-0.048px]">
              {"We'll parse the transcript, generate chapters, and quiz you at the end of each concept — no passive watching."}
            </p>
          </div>
        </div>

        {/* URL input */}
        <div className="flex flex-col gap-2">
          <label
            className="text-[18px] text-foreground leading-[24px]"
            style={{ fontWeight: 510 }}
          >
            YouTube URL
          </label>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full h-[56px] px-[16px] bg-card rounded-[16px] text-[14px] text-foreground placeholder:text-muted-foreground placeholder:underline focus:outline-none"
          />
          <p className="text-[11px] text-muted-foreground leading-[16px] px-1">
            Works best with tutorials that have chapter timestamps in the description or auto-generated captions enabled.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => onAnalyze(url)}
          disabled={!isYT}
          className="w-full h-[56px] rounded-full text-[16px] font-semibold text-foreground mt-auto transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          style={{ background: '#8cb200' }}
        >
          Analyze Video
        </button>
      </div>
    </div>
  );
}

// ── Analyzing Phase ───────────────────────────────────────────────────────────
const STEPS = ['Fetching video metadata', 'Parsing transcript', 'Generating concepts', 'Building quizzes'];

function AnalyzingPhase() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      <style>{`
        @keyframes spin-slow { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
      `}</style>
      <div className="relative w-[72px] h-[72px] mb-8">
        <svg className="absolute inset-0" width="72" height="72" style={{ animation: 'spin-slow 3s linear infinite' }}>
          <circle cx="36" cy="36" r="32" fill="none" stroke="#c8f135" strokeWidth="2" strokeDasharray="10 6" strokeLinecap="round" opacity="0.6" />
        </svg>
        <div className="absolute inset-2 rounded-[18px] bg-primary flex items-center justify-center">
          <NavLogo size={32} />
        </div>
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Analyzing video</h2>
      <p className="text-sm text-muted-foreground mb-6">{STEPS[step]}…</p>
      <div className="flex gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-500"
            style={{ background: i <= step ? '#c8f135' : '#e5e7ea', transform: i === step ? 'scale(1.4)' : 'scale(1)' }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Quiz Interrupt (full-screen) ────────────────────────────────────────────
// Was QuizPanel — a single question embedded in the lower workspace panel,
// competing for space with the video/controls still visible above it. Now a
// full-screen takeover (absolute inset-0 inside the app's 390px shell,
// matching AnimatedOutlet's own overlay pattern in Layout.tsx — see
// DESIGN-SYSTEM.md §9.3 — rather than `fixed`, which would break out of
// that shell on desktop preview). One question at a time, not all N inline,
// matching how Fingerprint.tsx already runs its own quiz flow.
//
// State machine (current — simplified from an earlier retry-only-wrong-ones
// + forced-skip-with-XP-penalty design):
//   All questions answered → 'result' stage, rendered via the shared
//   QuizResult ring (also used by QuizModal — see app/components/QuizResult).
//   ≥70% correct: PASS (+2 XP once, unlocks next chapter, Continue only).
//   <70%: FAIL — offers Rewatch chapter, Try Again (full retry of the whole
//     set, not just what was missed), or Skip (bare escape hatch, 0 XP, no
//     penalty math — exists so a broken/unanswerable AI-generated question,
//     see validateQuiz in video-analyze/index.ts, never becomes a hard dead
//     end with no way through).
// A chapter's quiz resolves exactly once — resolving sets outcome state in
// the parent (ImmersivePlayer) and this component unmounts. Re-entering an
// already-resolved chapter never re-triggers this at all (gated upstream).
type InterruptStage = 'asking' | 'result';

function QuizInterrupt({
  chapter, chapters, activeChapter, onResolve, onRewatch,
}: {
  chapter: VideoChapter;
  chapters: VideoChapter[];
  activeChapter: number;
  onResolve: (outcome: QuizOutcome, wrongCount: number) => void;
  onRewatch: () => void;
}) {
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>(() => chapter.quizzes.map(() => null));
  const [stage, setStage] = useState<InterruptStage>('asking');

  const quiz = chapter.quizzes[cursor];
  const isLastInQueue = cursor === chapter.quizzes.length - 1;

  const correctCount = answers.filter((a, i) => a !== null && a === chapter.quizzes[i]?.answer).length;

  function selectAndAdvance(opt: string) {
    setSelected(opt);
  }

  function next() {
    setAnswers(a => a.map((v, i) => (i === cursor ? selected : v)));
    if (!isLastInQueue) {
      setCursor(c => c + 1);
      setSelected(null);
      return;
    }
    setStage('result');
  }

  function retry() {
    setAnswers(chapter.quizzes.map(() => null));
    setCursor(0);
    setSelected(null);
    setStage('asking');
  }

  function rewatchChapter() {
    // This component doesn't own player seek/resume; it just needs to
    // unmount and let ImmersivePlayer re-arm this chapter's interrupt for
    // when playback reaches the end again.
    onRewatch();
  }

  function skip() {
    onResolve('skipped', 0);
  }

  if (stage === 'result') {
    return (
      <QuizResult
        correct={correctCount}
        total={chapter.quizzes.length}
        passThreshold={0.7}
        onPrimaryAction={correctCount / chapter.quizzes.length >= 0.7 ? () => onResolve('passed', 0) : retry}
        primaryLabel={correctCount / chapter.quizzes.length >= 0.7 ? 'Continue' : 'Try Again'}
        onSecondaryAction={correctCount / chapter.quizzes.length >= 0.7 ? undefined : rewatchChapter}
        secondaryLabel="↩ Rewatch chapter"
        onSkip={correctCount / chapter.quizzes.length >= 0.7 ? undefined : skip}
        review={chapter.quizzes.map((q, i) => ({
          question: q.question,
          correct: answers[i] === q.answer,
          explanation: q.explanation,
        }))}
      />
    );
  }

  if (!quiz) return null;

  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col overflow-hidden">
      {/* "You are here" thin chapter strip */}
      <div className="shrink-0 px-5 py-2.5 border-b border-border bg-card" style={{ paddingTop: 42 }}>
        <div className="flex items-center gap-1 overflow-hidden mb-2">
          {chapters.map((ch, i) => (
            <div key={ch.id} className="flex items-center gap-1 shrink-0" title={ch.title}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === activeChapter ? 24 : 8,
                  background: i < activeChapter ? '#c8f135' : i === activeChapter ? '#131927' : '#e5e7ea',
                }}
              />
            </div>
          ))}
        </div>
        {chapter.quizzes.length > 1 && (
          <p className="text-[11px] font-semibold text-muted-foreground">
            Question {cursor + 1} of {chapter.quizzes.length}
          </p>
        )}
      </div>

      {/* Quiz content */}
      <div className="flex-1 overflow-y-auto px-5" style={{ paddingTop: 18, paddingBottom: 16 }}>
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <Brain size={12} className="text-primary" />
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Knowledge Check</p>
        </div>
        <p className="text-[11px] text-muted-foreground mb-2 truncate">↳ {chapter.title}</p>
        <p className="text-[18px] font-bold text-foreground leading-[26px] tracking-[-0.054px] mb-5">{quiz.question}</p>

        <div className="flex flex-col gap-[10px]">
          {quiz.options.map((opt, i) => {
            const isSelected = selected === opt;
            return (
              <button
                key={i}
                onClick={() => selectAndAdvance(opt)}
                className={`flex items-center gap-[16px] p-[16px] rounded-[16px] text-left transition-all duration-150 ${isSelected ? 'bg-accent' : 'bg-card'}`}
              >
                <div className={`flex items-center justify-center rounded-[16px] shrink-0 size-[36px] transition-colors ${isSelected ? 'bg-primary/30' : 'bg-muted'}`}>
                  <span className={`text-[14px] font-bold transition-colors ${isSelected ? 'text-accent-foreground' : 'text-muted-foreground'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                </div>
                <span className={`text-[16px] leading-[22px] tracking-[-0.048px] font-[510] transition-colors flex-1 ${isSelected ? 'text-foreground' : 'text-foreground'}`}>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {selected && (
          <button
            onClick={next}
            className="w-full h-[56px] bg-primary text-foreground text-[16px] font-semibold rounded-full transition-all mt-4"
          >
            {isLastInQueue ? 'See results →' : 'Next question →'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Completion Screen ─────────────────────────────────────────────────────────
// sessionXp: the real sum of this session's chapter-quiz outcomes (+2 per
// pass, 0 on a skip — see QuizOutcome). Previously a fabricated
// `chapters.length * 50` unrelated to any actual quiz result.
// totalXp: the signed-in user's running quizXp total (context), so this
// screen doesn't only show the session delta with no sense of the running
// number it's adding to.
function CompletionScreen({ analysis, captures, sessionXp, totalXp }: {
  analysis: VideoAnalysis; captures: CaptureItem[]; sessionXp: number; totalXp: number;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center bg-background overflow-y-auto" style={{ paddingTop: 24, paddingBottom: 32 }}>
      <div className="w-20 h-20 rounded-[28px] bg-primary flex items-center justify-center mb-5 text-4xl">🎉</div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Sprint Complete</p>
      <h2 className="text-[22px] font-bold text-foreground leading-tight mb-1">{analysis.title}</h2>
      <p className="text-xs text-muted-foreground mb-7">{analysis.chapters.length} concepts · {captures.length} captures</p>

      <div className="w-full bg-accent border border-primary rounded-2xl p-4 mb-3">
        <p className="text-xl font-bold text-accent-foreground">{sessionXp >= 0 ? '+' : ''}{sessionXp} XP this session</p>
        <p className="text-xs text-primary mt-0.5">{totalXp} XP total</p>
      </div>

      {captures.length > 0 && (
        <div className="w-full border border-border rounded-2xl p-4 mb-6 text-left">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Your captures</p>
          {captures.map(c => (
            <p key={c.id} className="text-sm text-muted-foreground py-1.5 border-b border-border last:border-0 flex items-center gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground shrink-0">{fmt(c.timestamp)}</span>
              {c.chapterTitle}
            </p>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/')}
        className="w-full h-14 bg-primary text-foreground text-base font-semibold rounded-full hover:bg-primary transition-all"
      >
        Back to Home
      </button>
    </div>
  );
}

// ── Immersive Player ──────────────────────────────────────────────────────────
function ImmersivePlayer({ analysis }: { analysis: VideoAnalysis }) {
  const navigate = useNavigate();
  const { adjustQuizXp, quizXp, user } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef    = useRef<YTPlayer | null>(null);
  const pollRef      = useRef<ReturnType<typeof setInterval>>();
  const quizFired    = useRef(new Set<string>());
  // Wraps the video box + scrub bar + smart controls only (not the top bar
  // or the workspace panel below) — this is what actually goes fullscreen /
  // gets expanded, so the quiz-relevant controls stay reachable and the
  // notes/chapters workspace doesn't get dragged along for the ride.
  const playerShellRef = useRef<HTMLDivElement>(null);

  const [ready,         setReady]         = useState(false);
  const [isPlaying,     setIsPlaying]     = useState(false);
  const [currentTime,   setCurrentTime]   = useState(0);
  const [duration,      setDuration]      = useState(analysis.durationSecs || 1);
  const [activeChapter, setActiveChapter] = useState(0);
  // Index of the chapter currently showing its full-screen interrupt, or
  // null. Replaces the old activeQuiz: { quiz, chapter } shape, which held
  // exactly one quiz object and had nowhere to put the multi-question array
  // QuizInterrupt actually consumes.
  const [interruptChapterIdx, setInterruptChapterIdx] = useState<number | null>(null);
  // A chapter's quiz resolves exactly once — keyed by chapter id so
  // revisiting an already-resolved chapter never re-fires the interrupt
  // ("if they have answered the quiz already, they don't have to answer
  // another") and so the lock/unlock boundary below can be derived from it.
  const [resolvedChapters, setResolvedChapters] = useState<Record<string, ChapterResolution>>({});
  const [workspace,     setWorkspace]     = useState<'roadmap' | 'captures' | 'transcript'>('roadmap');
  const [copied,        setCopied]        = useState(false);
  const activeLineRef = useRef<HTMLButtonElement>(null);
  const [captures,      setCaptures]      = useState<CaptureItem[]>(() => loadVideoCaptures(analysis.videoId));
  // Persist captures to localStorage whenever they change so they survive
  // navigation away and tab reloads. Saved under the video's own ID.
  useEffect(() => {
    saveVideoCaptures(analysis.videoId, captures);
  }, [analysis.videoId, captures]);

  // Which capture's note editor is currently expanded — auto-set to the
  // capture just created so the "type a note under the timestamp" flow
  // doesn't need a second tap to find it.
  const [editingCaptureId, setEditingCaptureId] = useState<string | null>(null);
  const [completed,     setCompleted]     = useState(false);
  // True fullscreen (Fullscreen API succeeded) vs faked CSS expand (sandbox
  // blocked requestFullscreen — see toggleFullscreen). Both render the same
  // expanded layout; this only matters for which exit path runs.
  const [isFullscreen,  setIsFullscreen]  = useState(false);
  const [fsMode,        setFsMode]        = useState<'native' | 'css' | null>(null);
  // Local scrub-drag position while the user is actively dragging the bar —
  // null when not dragging, in which case the bar renders from currentTime
  // as before. Kept separate from currentTime so drag movement doesn't
  // fight the 500ms poll's own writes to currentTime mid-drag.
  const [scrubPreview,  setScrubPreview]  = useState<number | null>(null);
  const scrubBarRef = useRef<HTMLDivElement>(null);
  // Overlay chrome (scrub bar + controls row) visibility — now that it sits
  // on top of the video instead of below it, it can't stay permanently
  // visible or it just permanently covers picture content, which is worse
  // than the old layout. Visible by default (paused-on-load state), tap
  // toggles it, and it auto-hides a few seconds after play starts — same
  // pattern as the reference file's own YouTube-style chrome and every
  // other video player. A drag/scrub in progress always keeps it visible
  // (see the effect below) since auto-hiding mid-drag would be broken.
  const [chromeVisible, setChromeVisible] = useState(true);
  const chromeHideTimer = useRef<ReturnType<typeof setTimeout>>();

  // Quality picker. availableQualities is populated from the real player on
  // ready — YouTube only offers whatever levels actually exist for that
  // specific video/encode, so this is never a fixed hardcoded list. Starts
  // at ['auto'] (always a valid choice) until onReady fires.
  const [availableQualities, setAvailableQualities] = useState<YTQuality[]>(['auto']);
  const [currentQuality,     setCurrentQuality]      = useState<YTQuality>('auto');
  const [qualityMenuOpen,    setQualityMenuOpen]     = useState(false);

  // Cross-device resume (video_progress table, 010_video_progress.sql).
  // resumeAppliedRef guards the one-time seek-on-ready — without it, a
  // second onReady firing (e.g. a re-init) would seek back to the saved
  // position even after the user has already played past it this session.
  const resumeAppliedRef = useRef(false);
  const lastSavedPosRef  = useRef(0); // last position_s actually written, to skip redundant writes
  // Mirrors `completed` state for the unmount cleanup below, which reads it
  // inside a closure from the mount-time render (the init effect only
  // depends on analysis.videoId, so it never re-runs when completed
  // changes) — a plain `completed` read there would always see its
  // initial `false`, never a real completion that happened mid-session.
  const completedRef = useRef(false);

  // Upserts the resume position for this (user, video). Fire-and-forget,
  // matching recordTaskCompletion's pattern elsewhere in this app — playback
  // never waits on this write succeeding. Skipped entirely for guests
  // (no user) since video_progress is RLS-scoped to auth.uid().
  function saveVideoProgress(pos: number) {
    if (!user) return;
    lastSavedPosRef.current = pos;
    supabase
      .from('video_progress')
      .upsert(
        { user_id: user.id, video_id: analysis.videoId, position_s: pos, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,video_id' },
      )
      .then(({ error }) => {
        if (error) console.warn('[watch] video_progress save failed:', error.message);
      });
  }

  // Clears the saved position on real completion — next open should start
  // at 0, not resume a few seconds from the end. Separate from
  // saveVideoProgress rather than saveVideoProgress(0) so a finished video
  // has no row at all (RLS delete policy — see 010_video_progress.sql).
  function clearVideoProgress() {
    if (!user) return;
    lastSavedPosRef.current = 0;
    supabase
      .from('video_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('video_id', analysis.videoId)
      .then(({ error }) => {
        if (error) console.warn('[watch] video_progress clear failed:', error.message);
      });
  }

  function showChromeTemporarily() {
    setChromeVisible(true);
    clearTimeout(chromeHideTimer.current);
    // Don't re-arm the auto-hide while the quality popover is open — it's
    // nested inside this same scrim, so chrome fading out from under it
    // mid-selection would strand the menu with no visible anchor.
    if (isPlaying && !qualityMenuOpen) {
      chromeHideTimer.current = setTimeout(() => setChromeVisible(false), 3000);
    }
  }

  // Mirrors the drag-in-progress guard elsewhere in this file: opening the
  // menu cancels any pending auto-hide and pins chrome visible; closing it
  // (select or tap-outside) re-arms the normal timer via showChromeTemporarily.
  useEffect(() => {
    if (qualityMenuOpen) {
      clearTimeout(chromeHideTimer.current);
      setChromeVisible(true);
    } else {
      showChromeTemporarily();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qualityMenuOpen]);

  // First chapter index whose quiz hasn't resolved yet — everything at or
  // before this index is reachable (including going back into already-
  // resolved chapters); everything after it is locked until this one
  // resolves. A chapter with no quizzes never locks anything.
  const firstLockedIndex = useMemo(() => {
    for (let i = 0; i < analysis.chapters.length; i++) {
      const ch = analysis.chapters[i];
      if (ch.quizzes.length > 0 && !resolvedChapters[ch.id]) return i;
    }
    return analysis.chapters.length; // nothing locked
  }, [analysis.chapters, resolvedChapters]);

  // Real session XP — the sum of this session's actual quiz outcomes: +2 per
  // pass, 0 for a skip (the skip escape hatch carries no penalty — see
  // QuizOutcome above). Replaces CompletionScreen's old fabricated
  // chapters.length*50.
  const sessionXp = useMemo(
    () => Object.values(resolvedChapters).reduce(
      (sum, r) => sum + (r.outcome === 'passed' ? 2 : 0), 0,
    ),
    [resolvedChapters],
  );

  // Init YouTube IFrame API + player
  useEffect(() => {
    const init = () => {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: analysis.videoId,
        // width/height as '100%' — omitting these was the actual bug behind
        // the oversized player. The IFrame API defaults to a fixed 640x390px
        // iframe when they're not passed, which ignores the 16:9 wrapper's
        // CSS aspect-ratio entirely. '100%' makes the injected iframe fill
        // containerRef instead, which the wrapper actually controls.
        width: '100%',
        height: '100%',
        playerVars: {
          controls: 0, rel: 0, modestbranding: 1, playsinline: 1,
          iv_load_policy: 3, disablekb: 1, fs: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: async e => {
            setReady(true);
            const d = e.target.getDuration();
            if (d > 0) setDuration(d);
            // 'auto' first, then whatever real levels YouTube reports for
            // this specific video — order matches how the menu renders.
            const levels = e.target.getAvailableQualityLevels?.() ?? [];
            setAvailableQualities(['auto', ...levels]);
            setCurrentQuality(e.target.getPlaybackQuality?.() ?? 'auto');

            // Resume from last saved position, unless the saved spot is
            // within the last 5s of the video (or past duration) — same
            // "basically finished counts as finished" rule YouTube itself
            // uses, rather than resuming into the credits/outro.
            if (user && !resumeAppliedRef.current) {
              resumeAppliedRef.current = true;
              const { data } = await supabase
                .from('video_progress')
                .select('position_s')
                .eq('user_id', user.id)
                .eq('video_id', analysis.videoId)
                .maybeSingle();
              const saved = data?.position_s ?? 0;
              const dur = e.target.getDuration() || duration;
              if (saved > 0 && saved < dur - 5) {
                e.target.seekTo(saved, true);
                setCurrentTime(saved);
                lastSavedPosRef.current = saved;
              }
            }
          },
          onStateChange: e => {
            setIsPlaying(e.data === 1);
            if (e.data === 0) {
              setCompleted(true); // ended
              completedRef.current = true;
              clearVideoProgress();
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      init();
    } else {
      if (!document.getElementById('yt-iframe-api')) {
        const tag = document.createElement('script');
        tag.id  = 'yt-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = init;
    }

    // Poll current time every 500ms. Piggybacks the resume-progress save on
    // this same interval rather than a second timer — writes only every
    // ~10s of actual playback progress (skipped if paused/barely moved),
    // not every 500ms tick, to avoid hammering Supabase.
    pollRef.current = setInterval(() => {
      const t = playerRef.current?.getCurrentTime?.() ?? 0;
      setCurrentTime(t);
      // No isPlaying check needed/reliable here — this callback closes over
      // the effect's mount-time isPlaying and never sees it change (the
      // effect only depends on analysis.videoId). getCurrentTime() itself
      // already only advances during real playback and holds steady while
      // paused, so gating on "moved forward by >=10s" achieves the same
      // thing without a stale read.
      if (t - lastSavedPosRef.current >= 10) {
        saveVideoProgress(t);
      }
      // Active chapter = last chapter whose startTime ≤ t
      const idx = analysis.chapters.reduce(
        (best, ch, i) => t >= ch.startTime ? i : best, 0
      );
      setActiveChapter(idx);
    }, 500);

    return () => {
      clearInterval(pollRef.current);
      clearTimeout(chromeHideTimer.current);
      // Save whatever position we're leaving at — covers a mid-video
      // navigation-away between two 10s checkpoints. Skipped if the video
      // already ended (onStateChange already cleared the row above; a
      // trailing save here would just recreate it with a stale timestamp).
      const t = playerRef.current?.getCurrentTime?.();
      if (t && t > 0 && !completedRef.current) saveVideoProgress(t);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis.videoId]);

  // Native fullscreen can be exited outside our own button — Esc key,
  // browser/OS chrome, swipe-down on mobile — so state has to follow the
  // document's real fullscreenElement rather than only being set by our
  // own toggle. Only relevant when fsMode === 'native'; the CSS-fallback
  // expand has no browser-level exit to listen for.
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        setFsMode(null);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Auto-pause + quiz trigger at chapter end. Was checking `ch.quiz`
  // (singular) — a field that no longer exists once VideoChapter moved to
  // `quizzes: VideoQuiz[]`, so this always bailed out and the interrupt
  // never fired at all. Fixed, and now also skips chapters already resolved
  // (rewatching a passed chapter's ending shouldn't re-ask).
  useEffect(() => {
    if (!ready || interruptChapterIdx !== null || completed) return;
    const ch = analysis.chapters[activeChapter];
    if (!ch || ch.quizzes.length === 0) return;
    if (resolvedChapters[ch.id]) return;
    if (quizFired.current.has(ch.id) || ch.endTime <= 0) return;
    if (currentTime >= ch.endTime - 0.8) {
      quizFired.current.add(ch.id);
      playerRef.current?.pauseVideo();
      setInterruptChapterIdx(activeChapter);
    }
  }, [currentTime, activeChapter, ready, interruptChapterIdx, completed, analysis.chapters, resolvedChapters]);

  function togglePlay() {
    if (!ready) return;
    isPlaying ? playerRef.current?.pauseVideo() : playerRef.current?.playVideo();
    showChromeTemporarily();
  }

  // "Can't skip chapters, but can go back" — clamped to firstLockedIndex so
  // manual seeking (chevron buttons, chapter-list taps, scrub-bar taps)
  // can't jump past an unresolved quiz. Going backward is always allowed:
  // every already-visited index is by definition <= firstLockedIndex.
  function seekToChapter(idx: number) {
    const clamped = Math.max(0, Math.min(analysis.chapters.length - 1, idx));
    const allowed = Math.min(clamped, firstLockedIndex);
    const ch = analysis.chapters[allowed];
    if (!ch) return;
    playerRef.current?.seekTo(ch.startTime, true);
    setActiveChapter(allowed);
  }

  // ── Transcript tab ──
  // Same quiz gate as the chapter list: lines at/after the end of the first
  // unresolved-quiz chapter stay locked, so the transcript can't be used to
  // skip past a quiz. Everything at or before that chapter is reachable.
  const transcriptLimit = firstLockedIndex < analysis.chapters.length
    ? analysis.chapters[firstLockedIndex].endTime
    : Infinity;

  const activeLineIdx = useMemo(() => {
    let idx = -1;
    for (let i = 0; i < analysis.transcript.length; i++) {
      if (analysis.transcript[i].start <= currentTime) idx = i; else break;
    }
    return idx;
  }, [analysis.transcript, currentTime]);

  useEffect(() => {
    if (workspace === 'transcript') activeLineRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeLineIdx, workspace]);

  function seekToLine(start: number) {
    if (!ready || start >= transcriptLimit) return;
    playerRef.current?.seekTo(start, true);
    setCurrentTime(start);
    const idx = analysis.chapters.reduce((best, ch, i) => (start >= ch.startTime ? i : best), 0);
    setActiveChapter(idx);
  }

  async function copyTranscript() {
    const text = analysis.transcript.map(l => `[${fmt(l.start)}] ${l.text}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard can be blocked in sandboxed iframes — nothing to do */ }
  }

  // Free playback within the current chapter — rewind has no floor besides
  // the chapter's own startTime (going further back is a chapter-jump, not
  // a nudge), forward is capped 2s before the chapter's endTime so viewers
  // can't nudge-scrub past the tail end right before a quiz fires. This is
  // independent of firstLockedIndex on purpose: it only ever moves within
  // whatever chapter is currently active, so it can never reach a locked
  // chapter regardless of direction.
  function nudge(deltaSecs: number) {
    if (!ready) return;
    const ch = analysis.chapters[activeChapter];
    if (!ch) return;
    const floor = ch.startTime;
    const ceiling = ch.endTime > ch.startTime ? ch.endTime - 2 : ch.startTime;
    const target = Math.max(floor, Math.min(ceiling, currentTime + deltaSecs));
    playerRef.current?.seekTo(target, true);
    setCurrentTime(target);
    showChromeTemporarily();
  }

  // Drag-to-seek on the segmented bar, same chapter-local bounds as nudge()
  // above but landing on an exact position rather than a fixed delta.
  // Dragging into a different chapter's segment is allowed backward (any
  // already-visited chapter, i.e. index <= firstLockedIndex) but forward
  // drags are clamped to stay inside the active chapter — crossing into
  // the next segment is a chapter-jump (tap the segment, or the chevron),
  // not something a drag should do implicitly while a quiz might still be
  // pending on the chapter you're leaving.
  function scrubToClientX(clientX: number) {
    const bar = scrubBarRef.current;
    if (!bar || !ready) return null;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawTarget = pct * duration;

    // Floor is the earliest reachable point at all — the start of chapter
    // 0 — not the active chapter's own start, so dragging left genuinely
    // crosses back into earlier, already-visited chapters (the "moved to
    // the first chapter to rewatch something" case). Ceiling stays capped
    // inside the active chapter's own near-end: forward drag can't jump
    // ahead into a chapter that hasn't been reached yet, same reasoning as
    // nudge()'s forward cap.
    const activeCh = analysis.chapters[activeChapter];
    if (!activeCh) return null;
    const floor = analysis.chapters[0]?.startTime ?? 0;
    const ceiling = activeCh.endTime > activeCh.startTime ? activeCh.endTime - 2 : activeCh.startTime;
    return Math.max(floor, Math.min(ceiling, rawTarget));
  }

  function handleScrubMove(clientX: number) {
    const t = scrubToClientX(clientX);
    if (t !== null) setScrubPreview(t);
    // Actively dragging — don't let the auto-hide timer fire mid-gesture.
    clearTimeout(chromeHideTimer.current);
    setChromeVisible(true);
  }

  function commitScrub() {
    if (scrubPreview !== null) {
      playerRef.current?.seekTo(scrubPreview, true);
      setCurrentTime(scrubPreview);
      // Don't wait on the 500ms poll to notice a backward drag landed in an
      // earlier chapter — the segment highlight and title label under the
      // bar would show stale info for up to half a second otherwise.
      const idx = analysis.chapters.reduce(
        (best, ch, i) => scrubPreview >= ch.startTime ? i : best, 0,
      );
      setActiveChapter(idx);
    }
    setScrubPreview(null);
    showChromeTemporarily();
  }

  // Fullscreen: try the real API on the player shell (video + scrub bar +
  // controls, not the top bar or workspace — see playerShellRef comment)
  // first. Figma Make's sandboxed iframe is the likely reason this fails —
  // requestFullscreen() rejects when the embedding iframe lacks
  // allow="fullscreen", and that's a parent-frame permission this app's
  // own code can't grant itself. If it rejects, fall back to the CSS-only
  // expand, which is bounded by the 390px shell rather than the real
  // device screen but doesn't depend on any iframe permission.
  // Best-effort, not a hard lock — see the YTPlayer interface comment above.
  // setPlaybackQuality('auto') is the documented way to hand control back to
  // YouTube's own adaptive logic, same as never having called this at all.
  function selectQuality(q: YTQuality) {
    playerRef.current?.setPlaybackQuality(q);
    setCurrentQuality(q);
    setQualityMenuOpen(false);
  }

  const QUALITY_LABELS: Record<YTQuality, string> = {
    auto: 'Auto', small: '240p', medium: '360p', large: '480p',
    hd720: '720p', hd1080: '1080p', hd1440: '1440p', hd2160: '4K', highres: 'Max',
  };

  async function toggleFullscreen() {
    if (isFullscreen) {
      if (fsMode === 'native' && document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
      setFsMode(null);
      return;
    }
    const el = playerShellRef.current;
    if (el?.requestFullscreen) {
      try {
        await el.requestFullscreen();
        setIsFullscreen(true);
        setFsMode('native');
        return;
      } catch {
        // Sandboxed iframe blocked it — fall through to CSS expand.
      }
    }
    setIsFullscreen(true);
    setFsMode('css');
  }

  function capture() {
    const ch = analysis.chapters[activeChapter];
    const id = Date.now().toString();
    setCaptures(prev => [...prev, {
      id,
      timestamp: currentTime,
      chapterTitle: ch?.title ?? '',
      note: '',
    }]);
    // Jump straight to the note editor for what was just saved — per spec,
    // "when they save a timestamp, they should be able to type whatsoever
    // note they have" right then, not hunt for it in a list afterward.
    setWorkspace('captures');
    setEditingCaptureId(id);
  }

  function updateCaptureNote(id: string, html: string) {
    setCaptures(prev => prev.map(c => (c.id === id ? { ...c, note: html } : c)));
  }

  // A chapter's quiz resolves exactly once. +2 on a clean pass; 0 on a skip
  // (bare escape hatch, no penalty — see QuizOutcome above). Recorded into
  // resolvedChapters, which is both what unlocks the next chapter and what
  // stops this same chapter from ever re-firing the interrupt again.
  function handleResolve(outcome: QuizOutcome, wrongCount: number) {
    if (interruptChapterIdx === null) return;
    const ch = analysis.chapters[interruptChapterIdx];
    if (!ch) return;
    if (outcome === 'passed' && user) {
      const awardKey = `${analysis.videoId}:${ch.id}`;
      if (!getAwardedChapters(user.id).has(awardKey)) {
        adjustQuizXp(2);
        markChapterAwarded(user.id, awardKey);
      }
    }
    setResolvedChapters(prev => ({ ...prev, [ch.id]: { outcome, wrongCount } }));
    setInterruptChapterIdx(null);
    setWorkspace('roadmap');
    playerRef.current?.playVideo();
  }

  // "Rewatch chapter" — un-marks this chapter as fired so the trigger effect
  // arms again once playback reaches its end a second time, seeks back to
  // its start, and resumes. No outcome recorded — the chapter stays locked
  // (if it was) until it's actually passed or forced through.
  function handleRewatchFromInterrupt() {
    if (interruptChapterIdx === null) return;
    const ch = analysis.chapters[interruptChapterIdx];
    if (ch) quizFired.current.delete(ch.id);
    setInterruptChapterIdx(null);
    if (ch) playerRef.current?.seekTo(ch.startTime, true);
    playerRef.current?.playVideo();
  }

  if (completed) return <CompletionScreen analysis={analysis} captures={captures} sessionXp={sessionXp} totalXp={quizXp} />;

  return (
    <div className="flex flex-col h-full relative" style={{ background: '#0a0a0a' }}>
      {/* Full-screen quiz interrupt — absolute inset-0 inside this relative
          wrapper, so it covers the video + controls + workspace all at once,
          matching the "full-screen interrupt popup" spec rather than the old
          QuizPanel's embedded-in-the-workspace footprint. */}
      {interruptChapterIdx !== null && analysis.chapters[interruptChapterIdx] && (
        <QuizInterrupt
          key={analysis.chapters[interruptChapterIdx].id}
          chapter={analysis.chapters[interruptChapterIdx]}
          chapters={analysis.chapters}
          activeChapter={interruptChapterIdx}
          onResolve={handleResolve}
          onRewatch={handleRewatchFromInterrupt}
        />
      )}

      {/* Player shell: the video box itself IS the watchable area now — no
          separate stacked scrub-bar/controls rows outside it. Those are
          absolute overlays inside the 16:9 box, matching the reference
          file's actual pattern (top controls: absolute inset-x-0 top-0
          px-4 py-3; bottom controls: absolute inset-x-0 bottom-0 px-4
          py-3). That's what gets height down near 16:9 — eliminating extra
          flow rows, not just shrinking their padding. */}
      <div
        ref={playerShellRef}
        className={isFullscreen ? 'flex flex-col' : 'shrink-0 flex flex-col'}
        style={
          isFullscreen
            ? { position: 'absolute', inset: 0, zIndex: 40, background: '#000' }
            : { background: '#000' }
        }
      >
        <div
          className="w-full relative overflow-hidden"
          style={isFullscreen ? { flex: '1 1 auto', minHeight: 0 } : { aspectRatio: '16/9', flexShrink: 0 }}
        >
          <div ref={containerRef} className="w-full h-full [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!absolute [&_iframe]:!inset-0" />

          {/* Tap-catcher: sits directly above the iframe, below every real
              control. This exists because the YT iframe is cross-origin —
              once it's mounted (and especially once playback starts and
              YouTube's own internal overlay starts intercepting), pointer
              events landing on it never bubble up to a parent onClick.
              That's the actual reason the chrome only ever showed once at
              mount and never again on tap: there was no listener actually
              catching those later taps at all, not a logic bug in the
              toggle itself. This div is the fix — a transparent layer the
              iframe can't swallow, since it sits in front of it in paint
              order. When chrome is already visible we still want this to
              catch taps (tapping the video itself while chrome is showing
              re-arms the auto-hide timer rather than doing nothing), so it
              stays pointer-events:auto always; it's the individual control
              rows/buttons above it (z-20) that take priority for their own
              area via normal DOM stacking. */}
          <div
            className="absolute inset-0 z-10"
            onClick={() => (chromeVisible ? showChromeTemporarily() : (setChromeVisible(true), showChromeTemporarily()))}
          />

          {/* Top scrim + controls — px-4 py-3 matches the reference's own
              top control row; back/fullscreen are size-6-equivalent (we use
              px-based icon sizes already, kept at the same visual weight). */}
          <div
            className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 transition-opacity duration-200 z-20"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.25) 70%, transparent)',
              opacity: chromeVisible ? 1 : 0,
              pointerEvents: chromeVisible ? 'auto' : 'none',
            }}
          >
            <button
              onClick={e => { e.stopPropagation(); navigate(-1); }}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.15)' }}
              aria-label="Back"
            >
              <ArrowLeft size={15} className="text-white" />
            </button>
            {!isFullscreen && (
              <p className="text-[12px] font-semibold text-white flex-1 truncate mx-2 text-center min-w-0">
                {analysis.title}
                <span className="font-normal text-white/50"> · {analysis.chapters.length} ch</span>
              </p>
            )}
            <div className="relative shrink-0">
              <button
                onClick={e => { e.stopPropagation(); setQualityMenuOpen(o => !o); }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.15)' }}
                aria-label="Video quality"
                aria-expanded={qualityMenuOpen}
              >
                <Settings size={14} className="text-white" />
              </button>

              {qualityMenuOpen && (
                <>
                  {/* Tap-outside catcher — same pattern as the video tap-catcher
                      below, scoped to just this popover so it doesn't eat other
                      chrome taps. z-30 sits above the z-20 control rows. */}
                  <div
                    className="fixed inset-0 z-30"
                    onClick={e => { e.stopPropagation(); setQualityMenuOpen(false); }}
                  />
                  <div
                    className="absolute right-0 top-10 z-30 rounded-xl overflow-hidden py-1 min-w-[104px]"
                    style={{ background: 'rgba(19,25,39,0.92)', backdropFilter: 'blur(8px)' }}
                    onClick={e => e.stopPropagation()}
                  >
                    {availableQualities.map(q => (
                      <button
                        key={q}
                        onClick={() => selectQuality(q)}
                        className="w-full flex items-center justify-between gap-3 px-3.5 py-2 text-left hover:bg-background/10 transition-colors"
                      >
                        <span className="text-[12px] font-medium text-white">{QUALITY_LABELS[q]}</span>
                        {currentQuality === q && <Check size={12} className="text-primary shrink-0" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={e => { e.stopPropagation(); toggleFullscreen(); }}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.15)' }}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize size={14} className="text-white" /> : <Maximize size={14} className="text-white" />}
            </button>
          </div>

          {/* Center play/pause — reference's center button pattern, reusing
              the existing togglePlay so gating/state stays identical.
              pointerEvents on the WRAPPER stays 'none' even when chrome is
              visible — only the button itself re-enables it. The wrapper is
              `inset-0` (the full video box) purely for centering; giving it
              'auto' meant its invisible margins sat at the same z-20 as the
              top scrim and won the stacking tie by DOM order, silently
              eating clicks on the back/fullscreen buttons in the corners.
              Found via Playwright hit-testing against real compiled CSS —
              didn't show up against approximate/CDN-JIT styling since nothing
              was actually laid out to overlap in that test. */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 z-20"
            style={{ opacity: chromeVisible ? 1 : 0, pointerEvents: 'none' }}
          >
            <button
              onClick={e => { e.stopPropagation(); togglePlay(); }}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              style={{ background: 'rgba(0,0,0,0.4)', pointerEvents: chromeVisible ? 'auto' : 'none' }}
            >
              {isPlaying
                ? <Pause size={22} fill="#fff" className="text-white" />
                : <Play  size={22} fill="#fff" className="text-white ml-0.5" />
              }
            </button>
          </div>

          {/* Bottom scrim + scrub bar + transport controls, all folded into
              one overlay block — px-4 matches the reference's horizontal
              padding, pt-2 pb-3 keeps total overlay height close to its
              44-48px control-row measurements while fitting three stacked
              elements (segments / timestamps+title / transport) instead of
              the reference's flat single row, since chapter gating has no
              equivalent in a plain YouTube player. */}
          <div
            className="absolute inset-x-0 bottom-0 px-4 pt-6 pb-2.5 transition-opacity duration-200 z-20"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.35) 60%, transparent)',
              opacity: chromeVisible ? 1 : 0,
              pointerEvents: chromeVisible ? 'auto' : 'none',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Segmented scrub bar — draggable, larger invisible hit-area
                than its visual 5px so it's usable floating over video with
                no card background to anchor a tap. */}
            <div
              ref={scrubBarRef}
              className="flex items-center h-4 -my-1.5 cursor-pointer relative"
              style={{ touchAction: 'none' }}
              onMouseDown={e => handleScrubMove(e.clientX)}
              onMouseMove={e => { if (e.buttons === 1) handleScrubMove(e.clientX); }}
              onMouseUp={commitScrub}
              onMouseLeave={() => { if (scrubPreview !== null) commitScrub(); }}
              onTouchStart={e => handleScrubMove(e.touches[0].clientX)}
              onTouchMove={e => handleScrubMove(e.touches[0].clientX)}
              onTouchEnd={commitScrub}
            >
              <div className="flex h-[5px] w-full rounded-full overflow-hidden gap-[2px]">
                {analysis.chapters.map((ch, i) => {
                  const displayTime = scrubPreview ?? currentTime;
                  const w = ((ch.endTime - ch.startTime) / duration) * 100;
                  const fill = ch.endTime > ch.startTime
                    ? Math.max(0, Math.min(100, ((displayTime - ch.startTime) / (ch.endTime - ch.startTime)) * 100))
                    : 0;
                  return (
                    <div
                      key={ch.id}
                      className="relative h-full rounded-sm overflow-hidden shrink-0"
                      style={{ width: `${w}%`, background: 'rgba(255,255,255,0.25)' }}
                    >
                      <div
                        className="absolute inset-y-0 left-0"
                        style={{
                          width: `${fill}%`,
                          background: i === activeChapter ? '#c8f135' : 'rgba(200,241,53,0.5)',
                          transition: scrubPreview !== null ? 'none' : 'width 0.5s linear',
                          opacity: i > firstLockedIndex ? 0.35 : 1,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] text-white/70">{fmt(scrubPreview ?? currentTime)}</span>
              <span className="text-[10px] font-medium text-white/85 truncate mx-2 flex-1 text-center">
                {analysis.chapters[activeChapter]?.title}
              </span>
              <span className="text-[10px] text-white/70">{fmt(duration)}</span>
            </div>

            <div className="flex items-center justify-center gap-5 mt-1.5">
              <button
                onClick={e => { e.stopPropagation(); seekToChapter(activeChapter - 1); }}
                className="flex items-center justify-center w-7 h-7"
                style={{ opacity: activeChapter === 0 ? 0.3 : 0.85 }}
                disabled={activeChapter === 0}
                aria-label="Previous concept"
              >
                <ChevronLeft size={18} className="text-white" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); nudge(-10); }}
                className="flex items-center justify-center w-7 h-7"
                style={{ opacity: 0.85 }}
                aria-label="Rewind 10 seconds"
              >
                <RotateCcw size={15} className="text-white" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); togglePlay(); }}
                className="flex items-center justify-center w-9 h-9 rounded-full"
                style={{ background: '#c8f135' }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying
                  ? <Pause size={15} fill="#131927" className="text-foreground" />
                  : <Play  size={15} fill="#131927" className="text-foreground ml-0.5" />
                }
              </button>
              <button
                onClick={e => { e.stopPropagation(); nudge(10); }}
                className="flex items-center justify-center w-7 h-7"
                style={{ opacity: 0.85 }}
                aria-label="Forward 10 seconds"
              >
                <RotateCw size={15} className="text-white" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); seekToChapter(activeChapter + 1); }}
                className="flex items-center justify-center w-7 h-7"
                style={{ opacity: (activeChapter === analysis.chapters.length - 1 || activeChapter >= firstLockedIndex) ? 0.3 : 0.85 }}
                disabled={activeChapter === analysis.chapters.length - 1 || activeChapter >= firstLockedIndex}
                aria-label="Next concept"
              >
                <ChevronRight size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 bg-background flex flex-col overflow-hidden">
        {/* Workspace header */}
        <div className="shrink-0 flex items-center justify-between px-5 border-b border-border" style={{ paddingTop: 10, paddingBottom: 10 }}>
          <div className="flex gap-5">
            {(['roadmap', 'transcript', 'captures'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setWorkspace(tab)}
                className="text-sm font-semibold transition-colors"
                style={{ color: workspace === tab ? '#131927' : '#9ea2ae' }}
              >
                {tab === 'captures' ? `Notes (${captures.length})` : tab === 'transcript' ? 'Transcript' : 'Chapters'}
              </button>
            ))}
          </div>
          <button
            onClick={capture}
            className="flex items-center gap-1.5 rounded-full border border-primary transition-all hover:bg-[#eaf9b0] active:scale-95"
            style={{ background: '#F8FDE7', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5 }}
          >
            <Bookmark size={11} className="text-accent-foreground" />
            <span className="text-[11px] font-semibold text-accent-foreground">Capture</span>
          </button>
        </div>

        {/* Workspace content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {workspace === 'roadmap' ? (
            <div className="px-4 py-3">
              {analysis.chapters.map((ch, i) => {
                const isActive = i === activeChapter;
                const isDone   = currentTime > ch.endTime && ch.endTime > 0;
                const isLocked = i > firstLockedIndex;
                return (
                  <button
                    key={ch.id}
                    onClick={() => seekToChapter(i)}
                    disabled={isLocked}
                    className="w-full flex items-start gap-3 py-3 px-3 rounded-2xl mb-1 text-left transition-all disabled:cursor-not-allowed"
                    style={{
                      background:   isActive ? '#F8FDE7' : 'transparent',
                      border:       isActive ? '1px solid #c8f135' : '1px solid transparent',
                      opacity:      isLocked ? 0.45 : 1,
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold transition-all"
                      style={{ background: isDone || isActive ? '#c8f135' : '#f3f4f6', color: '#131927' }}
                    >
                      {isLocked ? <Lock size={10} className="text-muted-foreground" /> : isDone ? <Check size={10} className="text-foreground" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug" style={{ color: isActive ? '#131927' : '#394050' }}>
                        {ch.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-muted-foreground">{fmt(ch.startTime)}</span>
                        {ch.quizzes.length > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground font-semibold">
                            {ch.quizzes.length > 1 ? `${ch.quizzes.length} quiz` : 'quiz'}
                          </span>
                        )}
                        {resolvedChapters[ch.id] && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                            style={{
                              background: resolvedChapters[ch.id].outcome === 'passed' ? '#E6F4FF' : '#FFF1F1',
                              color:      resolvedChapters[ch.id].outcome === 'passed' ? '#003F6B' : '#b91c1c',
                            }}
                          >
                            {resolvedChapters[ch.id].outcome === 'passed' ? 'passed' : 'skipped'}
                          </span>
                        )}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : workspace === 'transcript' ? (
            <div className="px-4 py-3">
              {analysis.transcript.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-sm text-muted-foreground max-w-xs">
                    No transcript for this video. It has no captions to read.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between px-1 pb-2">
                    <span className="text-[11px] text-muted-foreground">Tap a line to jump there</span>
                    <button
                      onClick={copyTranscript}
                      className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground"
                    >
                      {copied ? <Check size={11} /> : <Copy size={11} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  {analysis.transcript.map((l, i) => {
                    const isActive = i === activeLineIdx;
                    const isLocked = l.start >= transcriptLimit;
                    return (
                      <button
                        key={i}
                        ref={isActive ? activeLineRef : undefined}
                        onClick={() => seekToLine(l.start)}
                        disabled={isLocked}
                        className="w-full flex items-start gap-3 py-2 px-3 rounded-xl mb-0.5 text-left transition-all disabled:cursor-not-allowed"
                        style={{
                          background: isActive ? '#F8FDE7' : 'transparent',
                          border:     isActive ? '1px solid #c8f135' : '1px solid transparent',
                          opacity:    isLocked ? 0.45 : 1,
                        }}
                      >
                        <span className="text-[11px] text-muted-foreground shrink-0 mt-0.5 w-9">{fmt(l.start)}</span>
                        <span className="text-sm leading-snug" style={{ color: isActive ? '#131927' : '#394050' }}>{l.text}</span>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          ) : (
            <div className="px-5 py-4">
              {captures.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Bookmark size={26} className="mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Tap "Capture" while watching to save moments here.</p>
                </div>
              ) : (
                captures.map(c => {
                  const isEditing = editingCaptureId === c.id;
                  return (
                    <div key={c.id} className="border border-border rounded-2xl mb-2 overflow-hidden">
                      <button
                        onClick={() => setEditingCaptureId(isEditing ? null : c.id)}
                        className="w-full flex items-start gap-3 p-4 text-left"
                      >
                        <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shrink-0">
                          <Bookmark size={14} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{c.chapterTitle || 'Untitled chapter'}</p>
                          <p className="text-[11px] text-muted-foreground">
                            at {fmt(c.timestamp)}{c.note ? ' · has notes' : ' · tap to add a note'}
                          </p>
                        </div>
                      </button>
                      {isEditing && (
                        <div className="px-4 pb-4">
                          <RichEditor
                            value={c.note}
                            onChange={html => updateCaptureNote(c.id, html)}
                            placeholder="What do you want to remember about this moment?"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Root Watch Screen ─────────────────────────────────────────────────────────
export function Watch() {
  const [params] = useSearchParams();
  const urlParam = decodeURIComponent(params.get('url') ?? '');

  const [phase,    setPhase]    = useState<'input' | 'analyzing' | 'player' | 'error'>(urlParam ? 'analyzing' : 'input');
  const [videoUrl, setVideoUrl] = useState(urlParam);
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [errMsg,   setErrMsg]   = useState('');

  useEffect(() => {
    if (phase === 'analyzing' && videoUrl) void runAnalyze(videoUrl);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  async function runAnalyze(url: string) {
    try {
      const { data, error } = await supabase.functions.invoke('video-analyze', { body: { url } });
      if (error) {
        // The generic "non-2xx" text hides the real reason — read the response body.
        let msg = (error as any).message ?? 'Edge function error';
        try {
          const body = await (error as any).context?.json?.();
          if (body?.error) msg = typeof body.error === 'string' ? body.error : (body.error.message ?? msg);
        } catch { /* keep generic message */ }
        throw new Error(msg);
      }
      if (data?.error) throw new Error(data.error);
      setAnalysis(normalizeAnalysis(data));
      setPhase('player');
    } catch (e: any) {
      setErrMsg(e.message ?? 'Could not analyze video. Make sure video-analyze is deployed.');
      setPhase('error');
    }
  }

  function handleAnalyze(url: string) { setVideoUrl(url); setPhase('analyzing'); }

  if (phase === 'input')     return <InputPhase defaultUrl={videoUrl} onAnalyze={handleAnalyze} />;
  if (phase === 'analyzing') return <AnalyzingPhase />;
  if (phase === 'error')     return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-5">
        <NavLogo size={26} />
      </div>
      <h2 className="text-lg font-bold text-foreground mb-2">Analysis failed</h2>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-xs">{errMsg}</p>
      <button onClick={() => setPhase('input')} className="w-full h-12 bg-primary text-foreground text-sm font-semibold rounded-full">
        Try another URL
      </button>
    </div>
  );
  if (!analysis) return null;
  return <ImmersivePlayer analysis={analysis} />;
}
