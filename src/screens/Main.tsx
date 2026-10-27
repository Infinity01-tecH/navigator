import { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback, useId } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { MutableRefObject, RefObject, CSSProperties } from 'react';
import { useNavigate } from 'react-router';
import { useSmoothScroll } from '../lib/useSmoothScroll';
import {
  computeAchievements, AchievementBadge, AchievementUnlock,
  useAchievementUnlocks, StreakCelebration,
} from '../app/components/achievements';
import { StreakInterruptModal } from '../app/components/StreakInterruptModal';
import {
  Zap, Map, User as UserIcon, ChevronDown, ChevronRight, Check,
  BookOpen, Wrench, Layers, Pin, PinOff, PlusCircle, StickyNote,
  Flame, Clock, Sparkles, Bell, BarChart2,
  Target, Play, ExternalLink, Settings, Users,
  Youtube, Twitter, Github, Linkedin, Globe, Footprints, MessageCircle, Compass, Smartphone,
  VolumeX, ArrowLeft, Share2, RotateCw, Maximize, Minimize,
  SkipBack, SkipForward, Edit2, UserPlus,
} from 'lucide-react';
import { useApp, sortedRoadmaps, localDateStr } from '../lib/context';
import { useViewMode } from '../lib/viewMode';
import bookSvgPaths from '@/imports/BookScreenFalse/svg-7l40jk6qas';
import { supabase } from '../lib/supabase';
import type { RoadmapEntry } from '../lib/context';
import type { Roadmap, RoadmapStep, RoadmapPhase, RoadmapResource } from '../lib/generateRoadmap';
import { QuizModal } from './QuizModal';
import { recordQuizPass } from '../lib/portfolioStore';
import { Chat } from './Chat';
import { NaviPreloader } from '../components/NaviPreloader';

// ─── Video time formatting (FeedPlayerCard paused-progress readout) ─────────────
// mm:ss for anything under an hour, h:mm:ss beyond that (YouTube Shorts/videos
// this feed pulls are effectively never >1hr, but no reason to render "62:04"
// if one ever is).
function fmtVideoTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

// ─── Date formatting for roadmap cards ───────────────────────────────────────────
function formatCreatedDate(ts: number): string {
  const now = new Date();
  const d = new Date(ts);
  const sameYear = now.getFullYear() === d.getFullYear();
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: sameYear ? undefined : 'numeric',
  });
}

// ─── Expert platform icons ───────────────────────────────────────────────────────
const PLATFORM_ICON: Record<string, typeof Globe> = {
  youtube: Youtube,
  x: Twitter,
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  website: Globe,
};

type Tab = 'today' | 'roadmap' | 'chat' | 'inspire' | 'profile';
type StepType = RoadmapStep['type'];

// ─── XP / Level model ───────────────────────────────────────────────────────────
const XP_PER_STEP = 50;
const XP_PER_LEVEL = 1000;
// STREAK_DAYS mock removed — current_streak now comes from real backend
// state via useApp() (context.tsx, wired to complete_task()/user_stats).
// See StreakStrip, ProfileView, and Main() below.

// quizXp defaults to 0 so any other call site importing xpModel that I don't
// have visibility into still compiles unchanged — it just won't reflect
// quiz XP in its total until it's updated to pass it too. This is the ONLY
// place quizXp folds in (see ProfileView) — it's a true account-wide number
// (Watch.tsx isn't scoped to any roadmap), so it belongs in the one XP
// figure that's actually meant to be account-wide, not in StatsGrid's
// per-roadmap "XP earned" tile (someone else's data, in the partner case).
export function xpModel(completedSteps: number, quizXp: number = 0) {
  const xp = completedSteps * XP_PER_STEP + quizXp;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const intoLevel = xp % XP_PER_LEVEL;
  const toNext = XP_PER_LEVEL - intoLevel;
  const pct = Math.round((intoLevel / XP_PER_LEVEL) * 100);
  return { xp, level, intoLevel, toNext, pct };
}

// Monday 00:00 of the current week, in ms.
function startOfWeek(): number {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // Mon = 0
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d.getTime();
}

function fmtHours(h: number): string {
  return Number.isInteger(h) ? `${h}h` : `${h.toFixed(1)}h`;
}

// ─── Roadmap Mode Badge ──────────────────────────────────────────────────────────
// Distinguishes Full/Sprint/YouTube roadmaps at a glance in the collapsed
// RoadmapCard header, since roadmap.skill alone (e.g. "Windows 11") gives no
// indication of which generation mode produced it. roadmap.mode is optional
// (older persisted roadmaps predate the field — see generateRoadmap.ts) and
// defaults to 'full' rather than omitting the badge, since 'full' was always
// the default mode value in AppState before this field existed.
const MODE_BADGE: Record<'full' | 'sprint' | 'youtube', { Icon: typeof Zap; cls: string; label: string }> = {
  full:    { Icon: Zap,        cls: 'text-primary', label: 'Full Roadmap' },
  sprint:  { Icon: Footprints, cls: 'text-primary', label: 'Sprint Blueprint' },
  // Red is a deliberate one-off exception to the lime-only icon palette —
  // this is YouTube's own brand mark, not an app accent color, same logic
  // already applied to the Youtube icon in PLATFORM_ICON/expert badges.
  youtube: { Icon: Youtube,    cls: 'text-[#FF0000]', label: 'YouTube-Based' },
};

function RoadmapModeIcon({ mode }: { mode?: 'full' | 'sprint' | 'youtube' }) {
  const { Icon, cls, label } = MODE_BADGE[mode ?? 'full'];
  return <Icon size={14} className={`${cls} shrink-0`} aria-label={label} />;
}

// ─── Type Badge ────────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: StepType }) {
  const cfg: Record<string, { label: string; Icon: typeof BookOpen; cls: string }> = {
    watch:    { label: 'Watch',    Icon: Play,     cls: 'bg-[#FFE4E4] text-[#C01010]' },
    read:     { label: 'Read',     Icon: BookOpen, cls: 'bg-[#DBEAFE] text-[#1D4ED8]' },
    build:    { label: 'Build',    Icon: Layers,   cls: 'bg-[#FFEDD5] text-[#C2410C]' },
    practice: { label: 'Practice', Icon: Wrench,   cls: 'bg-[#F3E8FF] text-[#7E22CE]' },
  };
  const { label, Icon, cls } = cfg[type] ?? { label: type, Icon: BookOpen, cls: 'bg-muted text-muted-foreground' };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${cls}`}>
      <Icon size={9} />
      {label}
    </span>
  );
}

// ─── Resource actions ────────────────────────────────────────────────────────────

function isYouTube(url?: string): boolean {
  return !!url && (url.includes('youtube.com') || url.includes('youtu.be'));
}

// generateRoadmap.ts's URL POLICY deliberately falls back to a Google search link whenever
// the AI can't name a real, verified official domain — better than hallucinating a fake one,
// but it leaves the user looking at a search page instead of a real article. This detects
// that specific fallback shape and, only in that case, asks the resource-link edge function
// for a real result instead (restricted to Quora/Reddit/Wikipedia/Substack/encyclopedia-style
// platforms). Anything that already IS a real link (a stable root domain the AI was confident
// about) is left untouched — no need to second-guess a link that was never a guess.
function isGenericSearchFallback(url?: string): boolean {
  return !!url && url.includes('google.com/search');
}

// window.open() only survives as a trusted user-gesture action when called synchronously
// inside the click handler — calling it after an awaited network response gets silently
// blocked by most browsers' popup blockers. Opening a blank tab FIRST, then redirecting it
// once the real URL resolves, sidesteps that entirely.
async function openWithFallback(url: string, queryLabel: string) {
  if (!isGenericSearchFallback(url)) {
    window.open(url, '_blank', 'noopener');
    return;
  }
  const win = window.open('', '_blank', 'noopener');
  try {
    const { data, error } = await supabase.functions.invoke('resource-link', {
      body: { query: queryLabel },
    });
    const realUrl = !error && data?.url ? data.url : url; // fall back to the original search link if the lookup fails
    if (win) win.location.href = realUrl;
    else window.open(realUrl, '_blank', 'noopener'); // popup was already blocked regardless — best effort
  } catch {
    if (win) win.location.href = url;
  }
}

// generateRoadmap.ts's URL POLICY only ever produces a YouTube SEARCH RESULTS link for video
// resources (it has no way to name a real, specific video ID) — this resolves that to a real
// video via the youtube-search edge function before navigating into the immersive player.
// Unlike openWithFallback, there's no popup-blocker concern here — navigate() is a React
// Router transition, not window.open, so it's safe to await the lookup first.
function isGenericYouTubeFallback(url?: string): boolean {
  return !!url && url.includes('youtube.com/results');
}

// In-memory, module-level (not component state) session cache for resolved
// youtube-search lookups, keyed on the query string (title) actually sent to
// the edge function. Module-level on purpose: it needs to survive
// InspireView/FeedPlayerCard mounting and unmounting as the user leaves and
// re-opens the Inspire tab, and it's shared for free by every call site that
// goes through resolveVideoUrl (both the feed's per-card resolution and
// ResourceActions' single-video click-to-watch) — a query resolved via
// either path is equally valid to reuse from the other. Deliberately *not*
// persisted (localStorage/user_kv) and has no TTL/eviction: this is scoped to
// "don't re-hit the network for something already resolved this session,"
// not a durable resolved-video cache. A stale entry surviving past a real
// page reload is an acceptable tradeoff given the scope of what was asked.
const resolvedVideoCache = new globalThis.Map<string, { url: string; title: string }>();

// In-memory, module-level cache of last-known playback position per feed
// card, keyed on card.key. This is a SEPARATE problem from
// resolvedVideoCache above: that one caches "what video did this search
// resolve to" (skips a network call on re-entry). This one caches "where
// was playback when the player was destroyed" (skips restarting from 0:00
// on re-entry). FeedPlayerCard's own player-mount effect destroys the real
// YT.Player instance every time a card leaves the prefetch window
// (shouldMount: true -> false) — that's intentional (can't keep unlimited
// live iframes around), but a fresh YT.Player always boots at time 0
// regardless of what was cached in resolvedVideoCache, since video ID
// resolution and playback position are unrelated pieces of state. Reading
// this before destroy and passing it back in as playerVars.start on the
// next create is what makes "scroll away, scroll back" resume roughly
// where left off instead of restarting — not persisted, no TTL, same
// session-only scope as resolvedVideoCache and same tradeoff (lost on a
// real page reload).
const lastPlaybackPositionCache = new globalThis.Map<string, number>();

async function resolveVideoUrl(url: string, title: string): Promise<{ url: string; title: string }> {
  if (!isGenericYouTubeFallback(url)) return { url, title };
  const cached = resolvedVideoCache.get(title);
  if (cached) return cached;
  try {
    const { data, error } = await supabase.functions.invoke('youtube-search', {
      body: { query: title },
    });
    if (!error && data?.url) {
      const result = { url: data.url, title: data.title || title };
      resolvedVideoCache.set(title, result);
      return result;
    }
  } catch {
    // fall through to original
  }
  return { url, title }; // fall back to the original search link if the lookup fails
}

function Pill({ Icon, label, onClick }: { Icon: typeof Play; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-[11px] font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-all"
    >
      <Icon size={10} />
      {label}
    </button>
  );
}

function ResourceModal({ resources, onClose }: { resources: RoadmapResource[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative w-full max-w-[420px] bg-background rounded-t-3xl p-5 pb-8"
        style={{ animation: 'sheetUp 0.25s ease' }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
        <div className="w-10 h-1 bg-secondary rounded-full mx-auto mb-4" />
        <p className="text-sm font-bold text-foreground mb-3">Choose a resource</p>
        <div className="space-y-2">
          {resources.map((r, i) => (
            <button
              key={i}
              onClick={() => { openWithFallback(r.url, r.title || `Resource ${i + 1}`); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 border border-border rounded-2xl hover:bg-muted transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <ExternalLink size={14} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{r.title || `Resource ${i + 1}`}</p>
                {r.source && <p className="text-[11px] text-muted-foreground truncate">{r.source}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Resource pills + a jump-to-note icon (spec §4.5).
function ResourceActions({ resources, stepId }: { resources: RoadmapResource[]; stepId?: string }) {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);

  const withUrl = resources.filter(r => r.url);
  const videos = withUrl.filter(r => isYouTube(r.url));
  const others = withUrl.filter(r => !isYouTube(r.url));

  function openResource() {
    if (others.length === 1) openWithFallback(others[0].url, others[0].title || 'resource');
    else if (others.length > 1) setModal(true);
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        {videos.map((v, i) => (
          <Pill
            key={`v${i}`}
            Icon={Play}
            label="Watch video"
            onClick={async () => {
              const resolved = await resolveVideoUrl(v.url, v.title);
              navigate(`/watch?url=${encodeURIComponent(resolved.url)}&title=${encodeURIComponent(resolved.title)}`);
            }}
          />
        ))}
        {others.length > 0 && (
          <Pill
            Icon={ExternalLink}
            label={others.length > 1 ? `Open resource (${others.length})` : 'Open resource'}
            onClick={openResource}
          />
        )}
        {stepId && (
          <button
            onClick={() => navigate(`/notes?topic=${encodeURIComponent(stepId)}`)}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-primary hover:border-primary hover:bg-accent transition-all"
            title="Open topic note"
            aria-label="Open topic note"
          >
            <StickyNote size={13} />
          </button>
        )}
      </div>
      {modal && <ResourceModal resources={others} onClose={() => setModal(false)} />}
    </>
  );
}

// ─── Step-completion quiz gate (shared by StepCard + TodayTaskRow) ──────────────
// watch-type steps require passing a quiz before toggleStep fires — see
// QuizModal.tsx. Only 'watch' gates (per product decision): read/build/practice
// steps toggle immediately, same as before this feature existed. Un-completing
// an already-done step never re-gates — the gate only stands between "not done"
// and "done", not between "done" and "not done".
function useStepCompletionGate(entry: RoadmapEntry, step: RoadmapStep) {
  const { toggleStep } = useApp();
  const [quizOpen, setQuizOpen] = useState(false);
  const done = !!entry.progress[step.id];

  function onCheckboxClick() {
    if (done) { toggleStep(entry.id, step.id); return; } // un-checking never gates
    if (step.type !== 'watch') { toggleStep(entry.id, step.id); return; }
    setQuizOpen(true);
  }

  const quizModal = quizOpen && (
    <QuizModal
      skill={entry.roadmap.skill}
      step={step}
      onClose={() => setQuizOpen(false)}
      onPass={() => {
        setQuizOpen(false);
        recordQuizPass(entry.id, step.id); // portfolio: remember the pass (fire-and-forget)
        toggleStep(entry.id, step.id);
      }}
    />
  );

  return { done, onCheckboxClick, quizModal };
}

// ─── Step Card ─────────────────────────────────────────────────────────────────

function StepCard({ entry, step }: { entry: RoadmapEntry; step: RoadmapStep }) {
  const { done, onCheckboxClick, quizModal } = useStepCompletionGate(entry, step);

  const allResources = [...(step.learn ?? []), ...(step.practice ?? [])].filter(r => r.url);

  return (
    <div className={`px-4 py-3.5 border-b border-border last:border-0 transition-opacity ${done ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={onCheckboxClick}
          className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
            done ? 'border-primary bg-primary' : 'border-border hover:border-primary'
          }`}
        >
          {done && <Check size={11} className="text-foreground" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-snug ${done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {step.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <TypeBadge type={step.type} />
            <span className="text-[11px] text-muted-foreground">{step.duration}</span>
          </div>
          <div className="mt-2.5">
            <ResourceActions resources={allResources} stepId={step.id} />
          </div>
        </div>
      </div>
      {quizModal}
    </div>
  );
}

// ─── Phase Card ────────────────────────────────────────────────────────────────

function PhaseCard({ entry, phase, index }: { entry: RoadmapEntry; phase: RoadmapPhase; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const completed = phase.steps.filter(s => entry.progress[s.id]).length;
  const total = phase.steps.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="border border-border rounded-2xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-card transition-colors text-left"
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold text-foreground"
          style={{ background: pct === 100 ? '#c8f135' : '#f3f4f6' }}
        >
          {pct === 100 ? <Check size={13} className="text-foreground" /> : phase.number}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{phase.title}</p>
          <p className="text-[11px] text-muted-foreground">{completed}/{total} steps · {phase.duration}</p>
        </div>
        <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden mr-1">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <ChevronDown
          size={16}
          className="text-muted-foreground transition-transform shrink-0"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <div className="border-t border-border">
          {phase.steps.map(step => <StepCard key={step.id} entry={entry} step={step} />)}
          <div className="px-4 py-3 bg-card">
            <p className="text-[11px] text-muted-foreground font-medium">🏁 {phase.milestone}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Roadmap detail (phases + tools + experts + salary) ──────────────────────────

function RoadmapDetail({ entry }: { entry: RoadmapEntry }) {
  const roadmap = entry.roadmap;
  const si = roadmap.salary_insights;

  return (
    <div>
      {roadmap.phases.map((phase, i) => (
        <PhaseCard key={phase.id} entry={entry} phase={phase} index={i} />
      ))}

      {roadmap.tools && roadmap.tools.length > 0 && (
        <div className="mt-2 mb-3 border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-muted border-b border-border flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tools you'll use</p>
          </div>
          <div className="divide-y divide-[#f3f4f6]">
            {roadmap.tools.map((tool, i) => (
              <a
                key={`${tool.name}-${i}`}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted transition-colors group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{tool.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{tool.purpose}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-muted-foreground shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {roadmap.experts && roadmap.experts.length > 0 && (
        <div className="mt-2 mb-3 border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-muted border-b border-border flex items-center gap-2">
            <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Follow the experts</p>
          </div>
          <div className="divide-y divide-[#f3f4f6]">
            {roadmap.experts.map((expert, i) => {
              const Icon = PLATFORM_ICON[expert.platform?.toLowerCase()] ?? Globe;
              return (
                <a
                  key={`${expert.name}-${i}`}
                  href={expert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-accent border border-primary flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{expert.name}</p>
                    {expert.handle && expert.handle !== 'search' && (
                      <p className="text-xs text-muted-foreground truncate">{expert.handle}</p>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-muted-foreground shrink-0" />
                </a>
              );
            })}
          </div>
        </div>
      )}

      {si && si.junior?.range && si.junior.range !== '—' && (
        <div className="mt-2 border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 bg-muted border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Salary insights</p>
          </div>
          <div className="px-4 py-3 space-y-2">
            {([['Junior', si.junior], ['Mid-level', si.mid], ['Senior', si.senior]] as const).map(([lvl, s]) => (
              <div key={lvl} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{lvl}</span>
                <span className="text-sm font-semibold text-foreground">{s.range}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// ─── Skill crossover (recommended next skill) ─────────────────────────────────
// This used to be a static pill-list rendered inline inside RoadmapDetail
// (i.e. buried at the bottom of each expanded roadmap card). It has been
// MOVED, not duplicated: it now lives behind a dedicated "Skill Crossover"
// button on the roadmap list screen (RoadmapListView, below), which opens a
// roadmap picker (if >1 roadmap exists) followed by a full-screen animated
// diagram. Same underlying data (roadmap.skill_web.adjacent), same tap
// behavior (navigate('/', { state: { skill: name } })) — just a richer,
// dedicated presentation instead of a buried box at the bottom of a card.
//
// Read-only render of skill_web.adjacent, generated once at roadmap-creation
// time by the same AI call that builds the whole roadmap (see Roadmap
// interface, generateRoadmap.ts). No new AI call, no new edge function —
// this deliberately does NOT call ensureRelatedSkills (context.tsx), which
// has its own AI-backfill path and is already claimed by InspireView's
// buildShortsFeed (currently mid-refactor — tiers 1/2 removed pending a
// youtube-search-based replacement, ensureRelatedSkills' role in that
// redesign explicitly undecided). Coupling this render to that function
// would tie a simple, isolated display to code whose own future is in flux.
//
// skill_web is non-optional on the Roadmap type, but real code elsewhere
// (buildPlaceholderRoadmap's guest/preview fallback) populates it with
// { adjacent: [], prerequisites: [] } — so an empty array is a legitimate
// runtime state to design for, not just a theoretical type gap.
//
// Tap target: navigates to '/' with { state: { skill: name } }. This is
// UNVERIFIED against Start.tsx, which is not available in this session —
// if Start doesn't read location.state.skill to prefill its input, the tap
// silently lands on a blank Start screen with the name lost. Flag this as
// an open follow-up, not a confirmed working flow. (Carried forward
// unchanged from the original SkillCrossover implementation.)

// Timing constants for the chained draw-on animation. Each segment draws in
// over DRAW_MS, staggered by STAGGER_MS per segment (segment i starts at
// i * STAGGER_MS), so with N segments the whole reveal finishes at
// (N-1)*STAGGER_MS + DRAW_MS. The root node (roadmap.skill) pulses in first,
// before any segment starts, matching the reference video's "your business"
// node appearing before its line draws outward.
const CROSSOVER_DRAW_MS = 700;
const CROSSOVER_STAGGER_MS = 260;

interface CrossoverNode {
  name: string;
  x: number;
  y: number;
  isRoot: boolean;
}

// Lays out the roadmap skill + every adjacent skill as ONE continuous
// vertical S-chain — root at top, then each subsequent skill alternating
// left/right of center as it steps down the screen, mirroring the reference
// image's single snaking line (your business -> key aspects -> frameworks ->
// blueprints) rather than independent spokes off a shared center point.
// This is deliberately a chain, not a hub-and-spoke: it's the only shape
// that stays legible regardless of how many adjacent skills the AI returns —
// it gets longer (scrolls), never more cramped (spokes colliding).
function layoutCrossoverChain(names: string[], width: number, stepY: number, swingX: number): CrossoverNode[] {
  const centerX = width / 2;
  const nodes: CrossoverNode[] = [{ name: names[0], x: centerX, y: stepY * 0.6, isRoot: true }];
  for (let i = 1; i < names.length; i++) {
    const dir = i % 2 === 1 ? 1 : -1; // alternate right/left each step, like the reference's zigzag
    nodes.push({
      name: names[i],
      x: centerX + dir * swingX,
      y: stepY * 0.6 + i * stepY,
      isRoot: false,
    });
  }
  return nodes;
}

// Full-screen chained diagram: roadmap.skill as the root bubble, followed by
// a hand-drawn-style S-curve that draws itself downward on mount, passing
// through one labeled dot per skill_web.adjacent entry in sequence — same
// topology as the reference video, just vertical instead of diagonal so it
// scrolls naturally regardless of count. Tapping a label does exactly what
// the old inline pill-list did.
function SkillCrossoverDiagram({ roadmap, onBack }: { roadmap: Roadmap; onBack: () => void }) {
  const navigate = useNavigate();
  const adjacent = roadmap.skill_web?.adjacent ?? [];
  const chainNames = [roadmap.skill, ...adjacent];

  // ViewBox width is fixed logical canvas; height grows with chain length so
  // longer lists (more adjacent skills) get more vertical room instead of
  // squeezing nodes closer together. Scroll handles anything past viewport
  // height — this is the actual fix for "handle however many come back."
  const VB_W = 350;
  const STEP_Y = 130;
  const SWING_X = 105;
  const VB_H = Math.max(360, STEP_Y * chainNames.length + 60);

  const nodes = useMemo(
    () => layoutCrossoverChain(chainNames, VB_W, STEP_Y, SWING_X),
    [chainNames.join('|'), VB_W, STEP_Y, SWING_X]
  );

  // Re-triggers the draw-on animation each time this screen mounts (i.e.
  // every time the user picks a roadmap), not just on first app load.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Single rAF isn't reliable here: this screen mounts mid-tree (after a
    // picker selection), not on a fresh page load, so the "undrawn"
    // (strokeDashoffset: length) state and the "drawn" (mounted=true) state
    // can land in the SAME paint if only one frame separates them — the
    // transition then has nothing to animate from, so the line either
    // snaps straight to fully-drawn or never visibly draws at all. Labels
    // don't share this failure mode (they use a keyframe `animation` +
    // `animation-delay`, which fires on its own clock regardless of prior
    // paints) — which is exactly why the pills were popping in on schedule
    // while the lines looked broken. Nesting a second rAF guarantees the
    // browser has painted the initial (undrawn) state before flipping to
    // the animated (drawn) one.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setMounted(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 shrink-0 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 -ml-1.5 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={22} strokeWidth={2.6} className="text-foreground" />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate">Skill Crossover</h1>
          <p className="text-xs text-muted-foreground">Where {roadmap.skill} can take you next</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-8 scrollbar-hide">
        {adjacent.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4">
              <Layers size={22} className="text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">No crossover skills yet</p>
            <p className="text-xs text-muted-foreground max-w-[260px] mb-6">
              This roadmap doesn't have any recommended next skills attached yet.
            </p>
            <button
              onClick={() => navigate('/start', { state: { skipAutoRedirect: true } })}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-border rounded-2xl px-4 py-4 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-accent-foreground hover:bg-accent transition-colors"
            >
              <PlusCircle size={17} /> Create New Roadmap
            </button>
          </div>
        ) : (
          <>
            <div className="relative" style={{ width: '100%', aspectRatio: `${VB_W} / ${VB_H}` }}>
              <svg
                viewBox={`0 0 ${VB_W} ${VB_H}`}
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                style={{ display: 'block' }}
                fill="none"
              >
                {/* One continuous S-curve strung through every node in sequence
                    — each segment connects node i to node i+1, drawn via
                    stroke-dashoffset staggered so the reveal reads top-to-bottom,
                    same as the branch line reaching each label in the reference. */}
                {nodes.slice(0, -1).map((from, i) => {
                  const to = nodes[i + 1];
                  const dx = to.x - from.x;
                  const dy = to.y - from.y;
                  // Bezier control points pull the curve toward whichever side
                  // the destination node sits on, producing the same lazy
                  // S-bend as the reference instead of a straight diagonal.
                  const c1x = from.x + dx * 0.15;
                  const c1y = from.y + dy * 0.55;
                  const c2x = to.x - dx * 0.15;
                  const c2y = to.y - dy * 0.55;
                  const path = `M ${from.x} ${from.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.x} ${to.y}`;
                  const length = Math.sqrt(dx * dx + dy * dy) * 1.2; // generous estimate so the draw never visibly truncates on a curve
                  return (
                    <path
                      key={`seg-${i}`}
                      d={path}
                      stroke="#c8f135"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: length,
                        strokeDashoffset: mounted ? 0 : length,
                        transition: `stroke-dashoffset ${CROSSOVER_DRAW_MS}ms ease`,
                        transitionDelay: `${200 + i * CROSSOVER_STAGGER_MS}ms`,
                      }}
                    />
                  );
                })}

                {/* Node dots removed per feedback — the line + label alone are
                    enough; the circles were reading as a separate, unwanted
                    element regardless of when they animated in. */}
              </svg>

              {/* Labels — positioned as normal DOM elements absolutely
                  overlaid on the SVG (percentage-based from viewBox
                  coordinates) rather than SVG <text>, so they stay crisp,
                  wrap normally, and remain tappable with a real hit target
                  on mobile. Root label renders as an outlined pill (echoing
                  the reference's "your business" bubble); every other node
                  renders as the same lime pill the old pill-list used. */}
              {nodes.map((node, i) => {
                const leftPct = (node.x / VB_W) * 100;
                const topPct = (node.y / VB_H) * 100;
                const isLast = i === nodes.length - 1;
                // Label still waits for its incoming line segment to finish
                // drawing (200 + (i-1)*STAGGER + DRAW_MS) before popping in,
                // so it doesn't appear ahead of the line reaching it. No dot
                // to sync with anymore — dots were removed per feedback.
                const delayMs = node.isRoot ? 0 : 200 + (i - 1) * CROSSOVER_STAGGER_MS + CROSSOVER_DRAW_MS + 80;
                // Root and middle nodes: box straddles/covers the point the
                // curve passes through, dead-centered in both axes. Last node:
                // the incoming line should visibly terminate AT the box, not
                // disappear inside it — so anchor by the box's top edge instead
                // of its center, leaving the line touching the boundary.
                const anchorTransform = isLast ? 'translate(-50%, 6px)' : 'translate(-50%, -50%)';
                // The entrance animation used to hardcode its own end transform
                // (translate(-50%, -140%)), which fully overrides the inline
                // `transform` above for the animation's duration — silently
                // repositioning every label away from the point the curve
                // actually passes through. Each node type now gets its own
                // keyframe whose `to` frame matches its real anchorTransform,
                // so the animation only affects opacity + a small settle-in
                // offset, never where the label actually sits.
                const animName = isLast ? 'crossoverLabelInLast' : 'crossoverLabelIn';
                return (
                  <button
                    key={`label-${i}`}
                    onClick={() => !node.isRoot && navigate('/start', { state: { skill: node.name } })}
                    disabled={node.isRoot}
                    className={`absolute inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 transition-colors ${
                      node.isRoot
                        ? 'border-2 border-[#131927] bg-background cursor-default'
                        : 'bg-accent border border-primary hover:bg-[#e4f7a1]'
                    }`}
                    style={{
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      transform: anchorTransform,
                      // Delay lives INSIDE the shorthand string, not as a sibling
                      // `animationDelay` property. The `animation` shorthand resets
                      // every sub-property it doesn't explicitly mention back to its
                      // initial value — including delay — the moment it's assigned,
                      // regardless of whether animationDelay was set before or after
                      // it, or on a prior render. That was silently zeroing every
                      // label's stagger to 0s, so all four popped in together
                      // instead of trailing their line segments in sequence.
                      animation: mounted ? `${animName} 320ms ease ${delayMs}ms forwards` : 'none',
                    }}
                    title={node.isRoot ? roadmap.skill : `Start a roadmap for ${node.name}`}
                  >
                    <span className={`text-xs font-semibold ${node.isRoot ? 'text-foreground' : 'text-accent-foreground'}`}>
                      {node.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-[11px] text-muted-foreground mt-4">
              Tap a skill to start a new roadmap for it.
            </p>

            {/* Same action + same nav target as RoadmapListView's own
                "Create New Roadmap" button — this doesn't replace that one,
                it's a second entry point so the user isn't forced back out
                of the diagram (through the picker/list) just to start a new
                roadmap for something that ISN'T one of the chain's tap
                targets above. */}
            <button
              onClick={() => navigate('/start', { state: { skipAutoRedirect: true } })}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-border rounded-2xl px-4 py-4 mt-6 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-accent-foreground hover:bg-accent transition-colors"
            >
              <PlusCircle size={17} /> Create New Roadmap
            </button>

            <style>{`
              /* Root + middle nodes: box is centered on the point the curve
                 passes through. End position matches anchorTransform exactly
                 (translate(-50%, -50%)) — the animation only adds a small
                 upward settle-in, it never changes where the label ends up. */
              @keyframes crossoverLabelIn {
                from { opacity: 0; transform: translate(-50%, -50%) translateY(6px); }
                to   { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
              }
              /* Last node: box hangs below the point where the line
                 terminates. End position matches anchorTransform exactly
                 (translate(-50%, 6px)). */
              @keyframes crossoverLabelInLast {
                from { opacity: 0; transform: translate(-50%, 6px) translateY(6px); }
                to   { opacity: 1; transform: translate(-50%, 6px) translateY(0); }
              }
            `}</style>
          </>
        )}
      </div>
    </div>
  );
}

// Roadmap picker sheet — shown when the user taps "Skill Crossover" and
// there's more than one roadmap to choose from. If there's exactly one
// roadmap, RoadmapListView skips this and opens the diagram directly.
// Explains what Skill Crossover is. Kept as a standalone component (not
// inlined) since the diagram screen's own doc comment flags a possible
// future need for the same explanation there — easy to reuse if that
// happens without duplicating the copy.
function SkillCrossoverInfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[390px] bg-background rounded-t-2xl px-5 pt-5 pb-7"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-secondary rounded-full mx-auto mb-4" />
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shrink-0">
            <Layers size={17} className="text-primary" />
          </div>
          <h2 className="text-base font-bold text-foreground">What is Skill Crossover?</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Every roadmap you generate comes with a few recommended next skills —
          things that naturally build on what you're learning. Skill Crossover
          shows you that chain visually, one roadmap at a time. Tap any skill in
          the chain to start a brand new roadmap for it.
        </p>
        <button
          onClick={onClose}
          className="w-full h-11 bg-primary text-foreground text-sm font-semibold rounded-full mt-5 hover:bg-primary transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function SkillCrossoverPicker({
  entries,
  onPick,
  onCancel,
}: {
  entries: RoadmapEntry[];
  onPick: (entry: RoadmapEntry) => void;
  onCancel: () => void;
}) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-3 shrink-0 flex items-center gap-3">
        <button
          onClick={onCancel}
          className="w-9 h-9 -ml-1.5 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={22} strokeWidth={2.6} className="text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground">Skill Crossover</h1>
          <p className="text-xs text-muted-foreground">Pick a roadmap to see what's next</p>
        </div>
        <button
          onClick={() => setShowInfo(true)}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors shrink-0"
          aria-label="What is Skill Crossover?"
        >
          <span className="text-xs font-bold">?</span>
        </button>
      </div>
      {showInfo && <SkillCrossoverInfoModal onClose={() => setShowInfo(false)} />}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-8 scrollbar-hide">
        {entries.map(entry => (
          <button
            key={entry.id}
            onClick={() => onPick(entry)}
            className="w-full flex items-center gap-3 border border-border rounded-2xl px-4 py-3.5 mb-2.5 text-left hover:border-primary hover:bg-accent transition-colors"
          >
            <RoadmapModeIcon mode={entry.roadmap.mode} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground truncate">{entry.roadmap.skill}</p>
              <p className="text-[11px] text-muted-foreground">
                {(entry.roadmap.skill_web?.adjacent?.length ?? 0)} recommended next {(entry.roadmap.skill_web?.adjacent?.length ?? 0) === 1 ? 'skill' : 'skills'}
              </p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Roadmap card (design-faithful, Figma VocabularyScreen style) ────────────────

const STEP_RING: Record<string, string> = {
  watch:    '#C01010',
  read:     '#1D4ED8',
  build:    '#C2410C',
  practice: '#7E22CE',
};

function RoadmapVocabStep({ entry, step, index: _index }: { entry: RoadmapEntry; step: RoadmapStep; index: number }) {
  const { done, onCheckboxClick, quizModal } = useStepCompletionGate(entry, step);
  const [open, setOpen] = useState(false);
  const allResources = [...(step.learn ?? []), ...(step.practice ?? [])].filter(r => r.url);
  const ringColor = done ? '#8cb200' : (STEP_RING[step.type] ?? '#d7d7d7');

  return (
    <>
      <div className={`relative w-full flex items-start gap-3 px-3.5 py-2.5 transition-opacity ${done ? 'opacity-50' : ''}`}>
        {/* Small circle — no number, type-colored Instagram-style ring */}
        <button
          onClick={onCheckboxClick}
          className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-[4px] transition-all ${done ? 'bg-primary' : 'bg-secondary'}`}
          style={{ boxShadow: `0 0 0 2px #f9ffe5, 0 0 0 3.5px ${ringColor}` }}
          aria-label={done ? 'Mark incomplete' : 'Mark complete'}
        >
          {done && <Check size={9} className="text-white" strokeWidth={3.5} />}
        </button>

        <div className="flex-1 min-w-0">
          {/* Step title — lighter weight than phase heading */}
          <p className={`text-[13.5px] font-medium leading-[18px] tracking-[-0.02px] ${done ? 'line-through text-muted-foreground' : 'text-foreground'}`}
            style={{ fontFamily: 'system-ui,sans-serif' }}>
            {step.title}
          </p>
          {/* TypeBadge + duration — clean, no icon */}
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <TypeBadge type={step.type} />
            <span className="text-[11px] text-muted-foreground">{step.duration}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 mt-1.5">
          {allResources.length > 0 && (
            <button
              onClick={() => setOpen(o => !o)}
              className="w-[20px] h-[20px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Resources"
            >
              <BookOpen size={13} />
            </button>
          )}
          <ChevronDown
            size={12}
            className="text-muted-foreground transition-transform cursor-pointer"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            onClick={() => setOpen(o => !o)}
          />
        </div>
      </div>

      {open && allResources.length > 0 && (
        <div className="px-3.5 pb-2.5 -mt-1 pl-10">
          <ResourceActions resources={allResources} stepId={step.id} />
        </div>
      )}

      {quizModal}
    </>
  );
}

function PhaseVocabCard({ entry, phase, phaseIndex }: { entry: RoadmapEntry; phase: RoadmapPhase; phaseIndex: number }) {
  const [open, setOpen] = useState(phaseIndex === 0);
  const completed = phase.steps.filter(s => entry.progress[s.id]).length;
  const total = phase.steps.length;
  const pct = Math.round((completed / (total || 1)) * 100);

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-3 px-3.5 py-3 text-left"
      >
        {/* Phase number circle — no border */}
        <div
          className={`w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 mt-[3px] transition-all ${pct === 100 ? 'bg-primary' : 'bg-secondary'}`}
        >
          {pct === 100
            ? <Check size={12} className="text-white" strokeWidth={3} />
            : <span className="text-[14.6px] font-bold text-foreground leading-none" style={{ fontFamily: 'system-ui,sans-serif' }}>{phaseIndex + 1}</span>
          }
        </div>

        {/* Title + metadata */}
        <div className="flex-1 min-w-0">
          <p className="text-[14.9px] font-bold leading-[18.6px] tracking-[-0.028px] text-foreground"
            style={{ fontFamily: 'system-ui,sans-serif' }}>
            {phase.title}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">{completed}/{total} steps · {phase.duration}</p>
        </div>

        {/* 4-bar progress icon + chevron */}
        <div className="flex items-center gap-2 shrink-0 mt-1">
          <BarChart2 size={18} className="text-foreground" />
          <ChevronDown
            size={13}
            className="text-foreground transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </button>

      {open && (
        <div className="flex flex-col gap-[3px] pl-2">
          {phase.steps.map((step, i) => (
            <RoadmapVocabStep key={step.id} entry={entry} step={step} index={i} />
          ))}
          {phase.milestone && (
            <p className="text-[11px] text-muted-foreground font-medium px-3.5 pb-2 pt-1">🏁 {phase.milestone}</p>
          )}
        </div>
      )}
    </div>
  );
}

function RoadmapDesignContent({ entry }: { entry: RoadmapEntry }) {
  const roadmap = entry.roadmap;

  return (
    <div>
      {/* Phases as vocabulary cards */}
      <div className="flex flex-col gap-[3px]">
        {roadmap.phases.map((phase, i) => (
          <PhaseVocabCard key={phase.id} entry={entry} phase={phase} phaseIndex={i} />
        ))}
      </div>

      {roadmap.tools && roadmap.tools.length > 0 && (
        <div className="mt-6 pl-3.5 pr-1">
          <p className="text-[18.6px] font-bold text-foreground mb-2 tracking-[-0.056px]" style={{ fontFamily: 'system-ui,sans-serif' }}>
            Tools You'll Use
          </p>
          <div className="w-full h-[2px] bg-secondary mb-0" />
          {roadmap.tools.map((tool, i) => (
            <a
              key={`tool-${i}`}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-3 border-b border-border last:border-0 group"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[18px] font-medium text-foreground leading-6 tracking-[-0.054px] truncate" style={{ fontFamily: 'system-ui,sans-serif' }}>{tool.name}</p>
                <p className="text-[14px] text-muted-foreground truncate">{tool.purpose}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-muted-foreground shrink-0 ml-2" />
            </a>
          ))}
        </div>
      )}

      {roadmap.experts && roadmap.experts.length > 0 && (
        <div className="mt-6 pl-3.5 pr-1">
          <p className="text-[18.6px] font-bold text-foreground mb-2 tracking-[-0.056px]" style={{ fontFamily: 'system-ui,sans-serif' }}>
            Follow The Experts
          </p>
          <div className="w-full h-[2px] bg-secondary mb-0" />
          {roadmap.experts.map((expert, i) => {
            const Icon = PLATFORM_ICON[expert.platform?.toLowerCase()] ?? Globe;
            return (
              <a
                key={`expert-${i}`}
                href={expert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-3 border-b border-border last:border-0 group"
              >
                <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
                  <Icon className="w-[22px] h-[22px] text-accent-foreground" />
                </div>
                <p className="text-[18px] font-medium text-foreground leading-6 tracking-[-0.054px] flex-1 min-w-0 truncate" style={{ fontFamily: 'system-ui,sans-serif' }}>{expert.name}</p>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-muted-foreground shrink-0" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Path-view geometry helper (outside component — pure, no deps) ────────────
function pathSegD(a: [number, number], b: [number, number]) {
  return `C${a[0]} ${a[1] + 62} ${b[0]} ${b[1] - 62} ${b[0]} ${b[1]}`;
}

// ─── Roadmap Path View ────────────────────────────────────────────────────────
function RoadmapPathView({ entry }: { entry: RoadmapEntry }) {
  const roadmap = entry.roadmap;
  const phases = roadmap.phases;
  const n = phases.length;
  const [selPhase, setSelPhase] = useState<number | null>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const arrowRef = useRef<SVGGElement>(null);

  const SVG_W = 360;
  const START_Y = 40;
  const SPACING = 120;

  const PTS = useMemo((): [number, number][] => {
    const pts: [number, number][] = [[80, START_Y]];
    for (let i = 0; i < n; i++) {
      pts.push([i % 2 === 0 ? 280 : 80, START_Y + 110 + i * SPACING]);
    }
    const lastX = pts[pts.length - 1][0];
    pts.push([lastX === 280 ? 80 : 280, pts[pts.length - 1][1] + 80]);
    return pts;
  }, [n]);

  const SVG_H = PTS[PTS.length - 1][1] + 50;

  const fullD = useMemo(
    () => `M${PTS[0][0]} ${PTS[0][1]}` + PTS.slice(1).map((p, i) => pathSegD(PTS[i], p)).join(''),
    [PTS],
  );

  const phaseProgress = phases.map(ph => ({
    completed: ph.steps.filter(s => entry.progress[s.id]).length,
    total: ph.steps.length,
  }));
  const allDone = phaseProgress.every(p => p.total > 0 && p.completed === p.total);
  const curPhaseIdx = phaseProgress.findIndex(p => p.completed < p.total);
  const effectiveCur = curPhaseIdx === -1 ? n - 1 : curPhaseIdx;
  const P = phaseProgress.reduce((a, p) => a + (p.total > 0 ? p.completed / p.total : 0), 0);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const fill = fillRef.current;
    const arrow = arrowRef.current;
    if (!track || !fill || !arrow) return;
    const L = track.getTotalLength();
    if (L === 0) return;

    const temp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const lens: number[] = [0];
    let acc = 0;
    for (let i = 1; i < PTS.length; i++) {
      temp.setAttribute('d', `M${PTS[i - 1][0]} ${PTS[i - 1][1]}` + pathSegD(PTS[i - 1], PTS[i]));
      acc += temp.getTotalLength();
      lens.push(acc);
    }

    fill.style.strokeDasharray = `${L}`;
    let pos: number;
    if (allDone) {
      pos = L;
    } else if (P === 0) {
      pos = 0;
    } else {
      const si = Math.min(Math.floor(P), n - 1);
      const frac = P - si;
      pos = lens[si] + (lens[si + 1] - lens[si]) * frac;
    }
    fill.style.strokeDashoffset = `${L - pos}`;

    const safePos = Math.min(pos, L);
    const pt = track.getPointAtLength(safePos);
    const bPt = track.getPointAtLength(Math.min(safePos + 3, L));
    const aPt = track.getPointAtLength(Math.max(safePos - 3, 0));
    const angle = Math.atan2(bPt.y - aPt.y, bPt.x - aPt.x) * 180 / Math.PI;
    arrow.setAttribute('transform', `translate(${pt.x} ${pt.y}) rotate(${angle})`);
  }, [P, allDone, fullD, PTS, n]);

  const selIdx = selPhase ?? effectiveCur;
  const flagPt = PTS[PTS.length - 1];

  return (
    <div className="px-1 pt-1 pb-1">
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', display: 'block' }} aria-label="Roadmap path">
        {/* Dashed track */}
        <path ref={trackRef} d={fullD} fill="none" stroke="#C5CFA3" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
        {/* Progress fill */}
        <path
          ref={fillRef} d={fullD} fill="none" stroke="#8cb200" strokeWidth="4" strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 600ms cubic-bezier(0.65,0,0.35,1)' }}
        />
        {/* Start dot */}
        <circle cx={PTS[0][0]} cy={PTS[0][1]} r="6" fill="#8cb200" />
        <text x={PTS[0][0] + 14} y={PTS[0][1] + 4} fontSize="11.5" fontWeight="600" fill="#6B7160" fontFamily="system-ui,sans-serif">Start</text>

        {/* Phase nodes */}
        {phases.map((phase, i) => {
          const [x, y] = PTS[i + 1];
          const isRight = x > 180;
          const tx = isRight ? x - 28 : x + 28;
          const anchor = isRight ? 'end' : 'start';
          const prog = phaseProgress[i];
          const isDone = prog.total > 0 && prog.completed === prog.total;
          const isCur = i === effectiveCur && !isDone;
          const isSel = i === selIdx;
          return (
            <g key={phase.id} onClick={() => setSelPhase(i)} style={{ cursor: 'pointer' }}>
              {isCur && <circle cx={x} cy={y} r="23" fill="#C8F135" opacity="0.45" />}
              <circle
                cx={x} cy={y} r="16"
                fill={isDone ? '#C8F135' : '#f9ffe5'}
                stroke={isCur || isDone ? '#8cb200' : '#C5CFA3'}
                strokeWidth={isCur ? 3.5 : 2.5}
              />
              {isDone ? (
                <path d={`M${x - 5.5} ${y + 0.5}l3.8 3.8L${x + 6} ${y - 3.5}`}
                  fill="none" stroke="#0F1108" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <text x={x} y={y + 4.5} textAnchor="middle" fontSize="12" fontWeight="800"
                  fill={isCur ? '#0F1108' : '#6B7160'} fontFamily="system-ui,sans-serif">{i + 1}</text>
              )}
              <text
                x={tx} y={y - 3} textAnchor={anchor} fontSize="13.5" fontWeight="700"
                fill="#0F1108" fontFamily="system-ui,sans-serif"
                style={{ textDecoration: isSel ? 'underline' : 'none', textDecorationColor: '#8cb200' }}
              >{phase.title}</text>
              <text x={tx} y={y + 14} textAnchor={anchor} fontSize="11" fontWeight="600" fill="#6B7160" fontFamily="system-ui,sans-serif">
                {prog.completed}/{prog.total} · {phase.duration}
              </text>
              {isCur && (
                <g transform={`translate(${isRight ? tx - 74 : tx} ${y - 40})`}>
                  <rect width="74" height="18" rx="9" fill="#C8F135" />
                  <text x="37" y="13" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#0F1108" fontFamily="system-ui,sans-serif" letterSpacing="0.5">
                    You are here
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Goal flag */}
        <g transform={`translate(${flagPt[0]} ${flagPt[1]})`}>
          <line x1="0" y1="-20" x2="0" y2="22" stroke="#0F1108" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M2 -20h22l-6 7 6 7H2z" fill={allDone ? '#8cb200' : '#C5CFA3'} />
          <text x={flagPt[0] > 180 ? -12 : 28} y="8"
            textAnchor={flagPt[0] > 180 ? 'end' : 'start'}
            fontSize="11" fontWeight="600" fill="#6B7160" fontFamily="system-ui,sans-serif">
            {roadmap.total_duration}
          </text>
        </g>

        {/* Progress arrow */}
        <g ref={arrowRef}>
          <path d="M-8 -8L10 0L-8 8Z" fill="#8cb200" stroke="#8cb200" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </svg>

      {/* Selected phase detail */}
      {phases[selIdx] && (
        <div className="bg-card border border-border rounded-[18px] p-3 mx-0.5 mb-2 mt-1">
          <p className="text-[13.5px] font-bold text-foreground mb-1.5 px-0.5">
            {selIdx + 1}. {phases[selIdx].title} &middot; {phaseProgress[selIdx].completed}/{phaseProgress[selIdx].total}
          </p>
          <div>
            {phases[selIdx].steps.map((step, i) => (
              <RoadmapVocabStep key={step.id} entry={entry} step={step} index={i} />
            ))}
          </div>
          {phases[selIdx].milestone && (
            <p className="text-[11px] text-muted-foreground font-medium px-3.5 pb-1 pt-0.5">🏁 {phases[selIdx].milestone}</p>
          )}
        </div>
      )}
    </div>
  );
}

function RoadmapCard({ entry }: { entry: RoadmapEntry }) {
  const { pinRoadmap, unpinRoadmap } = useApp();
  const [open, setOpen] = useState(entry.pinned);
  const [viewMode, setViewMode] = useState<'list' | 'path'>('list');
  const roadmap = entry.roadmap;
  const allSteps = roadmap.phases.flatMap(p => p.steps);
  const total = allSteps.length;
  const completed = allSteps.filter(s => entry.progress[s.id]).length;
  const pct = Math.round((completed / (total || 1)) * 100);

  return (
    <div className="bg-accent rounded-3xl overflow-visible mb-3 w-full">
      {/* Header */}
      <div className="flex items-start gap-3.5 px-4 pt-4 pb-2">
        <div className="w-[40px] h-[40px] rounded-[17px] bg-primary flex items-center justify-center shrink-0">
          <Map size={20} className="text-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button onClick={() => setOpen(o => !o)} className="text-left flex-1 min-w-0">
              <p className="text-[18.6px] font-bold text-foreground leading-[22.3px] tracking-[-0.056px] truncate"
                style={{ fontFamily: 'system-ui,sans-serif' }}>
                {roadmap.skill}
              </p>
            </button>
            <button
              onClick={() => (entry.pinned ? unpinRoadmap(entry.id) : pinRoadmap(entry.id))}
              className="w-[32px] h-[32px] rounded-[16px] bg-accent flex items-center justify-center shrink-0 hover:bg-[#e8fba5] transition-colors"
              title={entry.pinned ? 'Unpin' : 'Pin to Today'}
            >
              {entry.pinned ? <PinOff size={14} className="text-accent-foreground" /> : <Pin size={14} className="text-accent-foreground" />}
            </button>
            <button onClick={() => setOpen(o => !o)} className="shrink-0">
              <ChevronDown
                size={15}
                className="text-foreground transition-transform"
                style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
          </div>
          <p className="text-[14px] text-muted-foreground mt-0.5">
            {roadmap.total_duration} · {total} steps · {pct}% · {formatCreatedDate(entry.createdAt)}
          </p>
        </div>
      </div>

      {/* Progress bar — badge rides on the fill bar's right edge, always in sync */}
      <div className="px-4 pb-4 pt-1">
        <div className="relative h-[10px] bg-card rounded-full" style={{ overflow: 'visible' }}>
          <div
            className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${Math.max(pct, 0)}%`, overflow: 'visible' }}
          >
            {pct > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 bg-primary text-white text-[11.7px] font-bold px-[6.7px] py-[1.7px] rounded-[10px] leading-[16.8px] whitespace-nowrap z-10"
                style={{ fontFamily: 'system-ui,sans-serif' }}
              >
                {pct}%
              </div>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="pb-5">
          {/* List / Path segmented control */}
          <div className="flex justify-center mb-3 px-4">
            <div className="relative flex items-center rounded-full p-[3px]" style={{ background: '#EEF3DA', border: '1px solid #DDE8BC' }}>
              <div
                className="absolute top-[3px] bottom-[3px] left-[3px] rounded-full transition-transform duration-300"
                style={{
                  width: 'calc(50% - 3px)',
                  background: '#C8F135',
                  transform: viewMode === 'path' ? 'translateX(100%)' : 'translateX(0)',
                }}
              />
              <button
                onClick={() => setViewMode('list')}
                className="relative z-10 rounded-full transition-colors"
                style={{ padding: '6px 11px', fontSize: '12px', fontWeight: 600, color: viewMode === 'list' ? '#0F1108' : '#6B7160' }}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('path')}
                className="relative z-10 rounded-full transition-colors"
                style={{ padding: '6px 11px', fontSize: '12px', fontWeight: 600, color: viewMode === 'path' ? '#0F1108' : '#6B7160' }}
              >
                Path
              </button>
            </div>
          </div>
          {viewMode === 'list'
            ? <RoadmapDesignContent entry={entry} />
            : <RoadmapPathView entry={entry} />
          }
        </div>
      )}
    </div>
  );
}

// ─── Motivational quote pool ─────────────────────────────────────────────────
// 30 real, attributed quotes about learning, persistence, and skill-building.
// Deliberately NOT invented lines with a name slapped on — every entry here is
// a genuine, well-attested quote so attribution is honest, not decorative.
// Shown once per Roadmap-tab visit (not auto-dismissed — it's in-flow layout
// content now, not a toast) directly under the "Pin one..." subtitle.
const QUOTES: { text: string; author: string }[] = [
  { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
  { text: "It's what you learn after you know it all that counts.", author: 'John Wooden' },
  { text: 'Once you stop learning, you start dying.', author: 'Albert Einstein' },
  { text: 'The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.', author: 'Brian Herbert' },
  { text: 'Anyone who stops learning is old, whether at twenty or eighty. Anyone who keeps learning stays young.', author: 'Henry Ford' },
  { text: 'Develop a passion for learning. If you do, you will never cease to grow.', author: 'Anthony J. D\u2019Angelo' },
  { text: 'Change is the end result of all true learning.', author: 'Leo Buscaglia' },
  { text: 'Energy and persistence conquer all things.', author: 'Benjamin Franklin' },
  { text: 'Every action you take is a vote for the type of person you wish to become.', author: 'James Clear' },
  { text: "I'm always doing what I can't do yet in order to learn how to do it.", author: 'Vincent Van Gogh' },
  { text: 'Every strike brings me closer to the next home run.', author: 'Babe Ruth' },
  { text: 'If you have the courage to start, you have the courage to succeed.', author: 'Mel Robbins' },
  { text: 'For the best return on your money, pour your purse into your head.', author: 'Benjamin Franklin' },
  { text: 'Wisdom is not a product of schooling but of the lifelong attempt to acquire it.', author: 'Albert Einstein' },
  { text: 'I am always ready to learn, although I do not always like being taught.', author: 'Winston Churchill' },
  { text: 'The mediocre teacher tells. The good teacher explains. The superior teacher demonstrates. The great teacher inspires.', author: 'William Arthur Ward' },
  { text: 'The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn.', author: 'Alvin Toffler' },
  { text: 'Learning is the only thing the mind never exhausts, never fears, and never regrets.', author: 'Leonardo da Vinci' },
  { text: 'The whole purpose of education is to turn mirrors into windows.', author: 'Sydney J. Harris' },
  { text: 'Formal education will make you a living; self-education will make you a fortune.', author: 'Jim Rohn' },
  { text: 'Intellectual growth should commence at birth and cease only at death.', author: 'Albert Einstein' },
  { text: 'If you are willing to learn, no one can help you. If you are determined to learn, no one can stop you.', author: 'Anonymous' },
  { text: 'Learning never exhausts the mind.', author: 'Leonardo da Vinci' },
  { text: 'Continuous learning is the minimum requirement for success in any field.', author: 'Brian Tracy' },
  { text: 'The only person who is educated is the one who has learned how to learn and change.', author: 'Carl Rogers' },
  { text: 'Learning is not attained by chance. It must be sought for with ardour and diligence.', author: 'Abigail Adams' },
  { text: 'Shall I tell you the secret of a true scholar? Every man I meet is my master in some point, and in that I learn from him.', author: 'Ralph Waldo Emerson' },
  { text: 'Teaching is only demonstrating that it is possible. Learning is making it possible for yourself.', author: 'Paulo Coelho' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Do the best you can until you know better. Then when you know better, do better.', author: 'Maya Angelou' },
];

function pickQuote(lastIdx: number): { quote: { text: string; author: string }; index: number } {
  if (QUOTES.length <= 1) return { quote: QUOTES[0], index: 0 };
  let idx = lastIdx;
  while (idx === lastIdx) idx = Math.floor(Math.random() * QUOTES.length);
  return { quote: QUOTES[idx], index: idx };
}

// Renders once per RoadmapListView mount (i.e. once per visit to the Roadmap
// tab / this screen) — a real quote + real author, not a synthetic line.
// No auto-dismiss and no close button: this sits in the normal document flow
// under the subtitle, so it should behave like ordinary page content rather
// than a transient toast.
function QuoteOfTheDay() {
  const [{ quote }] = useState(() => pickQuote(-1));
  return (
    <div className="flex items-start gap-2.5 bg-accent border border-primary rounded-2xl px-4 py-3.5 mb-5">
      <Sparkles size={14} className="text-primary shrink-0 mt-1" />
      <p className="text-[13px] text-accent-foreground leading-snug">
        <span className="italic">&ldquo;{quote.text}&rdquo;</span>
        <span className="font-semibold"> — {quote.author}</span>
      </p>
    </div>
  );
}

// ─── Roadmap list view ───────────────────────────────────────────────────────────

// Three-screen local flow, all inside this one component so navigating
// in/out of Crossover never touches the router or unmounts RoadmapListView
// itself (no lost scroll position on the underlying list, no route history
// entry to back out of awkwardly):
//   'list'    — the normal roadmap list + the two action buttons
//   'picker'  — only reached when there's >1 roadmap; choose which one
//   'diagram' — the animated branching Skill Crossover view for one roadmap
// A single roadmap skips 'picker' entirely and jumps straight to 'diagram',
// per SkillCrossoverPicker's own doc comment above.
type CrossoverView = { screen: 'list' } | { screen: 'picker' } | { screen: 'diagram'; entry: RoadmapEntry };

function RoadmapListView() {
  const navigate = useNavigate();
  const smoothRef = useSmoothScroll<HTMLDivElement>();
  const { state } = useApp();
  const list = sortedRoadmaps(state.roadmaps);
  const [view, setView] = useState<CrossoverView>({ screen: 'list' });

  const openCrossover = () => {
    if (list.length === 0) return; // button is disabled in this case anyway
    if (list.length === 1) {
      setView({ screen: 'diagram', entry: list[0] });
    } else {
      setView({ screen: 'picker' });
    }
  };

  if (view.screen === 'picker') {
    return (
      <SkillCrossoverPicker
        entries={list}
        onPick={entry => setView({ screen: 'diagram', entry })}
        onCancel={() => setView({ screen: 'list' })}
      />
    );
  }

  if (view.screen === 'diagram') {
    return (
      <SkillCrossoverDiagram
        roadmap={view.entry.roadmap}
        onBack={() => setView(list.length === 1 ? { screen: 'list' } : { screen: 'picker' })}
      />
    );
  }

  return (
    <div ref={smoothRef} className="h-full overflow-y-auto px-5 pt-5 pb-10 scrollbar-hide [&>*]:shrink-0">
      <h1 className="text-[20px] font-medium text-foreground mb-1 tracking-[-0.06px]"
        style={{ fontFamily: 'system-ui,sans-serif', fontVariationSettings: '"wdth" 100' }}>
        Your Roadmaps
      </h1>
      <p className="text-[16px] text-muted-foreground mb-4 tracking-[-0.048px]" style={{ fontFamily: 'system-ui,sans-serif' }}>
        Pin one to drive your Today screen.
      </p>

      {/* Your Notes shortcut */}
      <button
        onClick={() => navigate('/notes')}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-accent rounded-xl mb-5 hover:bg-[#f1ffd0] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-[8px] border-2 border-primary rounded-xl flex items-center justify-center">
            <BookOpen size={20} className="text-primary" />
          </div>
          <span className="text-[18px] font-medium text-foreground tracking-[-0.054px]"
            style={{ fontFamily: 'system-ui,sans-serif' }}>Your Notes</span>
        </div>
        <ChevronRight size={16} className="text-primary" />
      </button>

      {list.map(entry => <RoadmapCard key={entry.id} entry={entry} />)}

      {/* Create new Roadmap — solid green, matches Figma Primary button */}
      <button
        onClick={() => navigate('/start', { state: { skipAutoRedirect: true } })}
        className="w-full flex items-center justify-center bg-primary text-white rounded-xl px-5 py-3.5 text-[20px] font-bold tracking-[-0.04em] hover:bg-[#7aa200] transition-colors mt-1"
        style={{ fontFamily: 'system-ui,sans-serif' }}
      >
        Create new Roadmap
      </button>

      {/* Skill Crossover — dashed border style matching Figma */}
      <button
        onClick={openCrossover}
        disabled={list.length === 0}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-border rounded-2xl px-4 py-4 mt-3 text-[16px] font-bold text-accent-foreground hover:border-primary hover:text-accent-foreground hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ fontFamily: 'system-ui,sans-serif' }}
      >
        <Layers size={17} /> Skill Crossover
      </button>
      <div className="h-4" />
    </div>
  );
}

// ─── Shared stats grid (Today + Profile) ─────────────────────────────────────────

function StatsGrid({ entry }: { entry: RoadmapEntry }) {
  const { state } = useApp();
  const allSteps = entry.roadmap.phases.flatMap(p => p.steps);
  const completedCount = allSteps.filter(s => entry.progress[s.id]).length;

  // "This week" = sum of durations of tasks completed since Monday. We approximate
  // each task's duration by the user's daily time budget (hoursPerDay), matching
  // the spec's "3 tasks × 1.5h = 4.5h" example. Recalculates live via completedAt.
  const weekStart = startOfWeek();
  const doneThisWeek = Object.values(entry.completedAt).filter(ts => ts >= weekStart).length;
  const weekHours = doneThisWeek * state.hoursPerDay;

  const stats = [
    { label: 'Steps done', val: `${completedCount}`, Icon: Check, color: '#c8f135' },
    { label: 'This week', val: fmtHours(weekHours), Icon: Clock, color: '#0095ff' },
    { label: 'Roadmap', val: `${Math.round((completedCount / (allSteps.length || 1)) * 100)}%`, Icon: Target, color: '#ffaa00' },
    { label: 'XP earned', val: `${completedCount * XP_PER_STEP}`, Icon: Zap, color: '#c8f135' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map(({ label, val, Icon, color }) => (
        <div key={label} className="p-3.5 bg-muted border border-border rounded-2xl">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ background: `${color}22` }}>
            <Icon size={14} style={{ color }} />
          </div>
          <p className="text-lg font-bold text-foreground">{val}</p>
          <p className="text-[11px] text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Design-faithful Today tab components ─────────────────────────────────────
// These components match the Figma BookScreen design exactly.

function DesignPatternRow() {
  return (
    <svg className="block" fill="none" height="16.1824" preserveAspectRatio="none" viewBox="0 0 174 16.1824" width="174">
      <g>
        <path clipRule="evenodd" d={bookSvgPaths.p3482ec00} fill="#8CB200" fillRule="evenodd" />
        <path clipRule="evenodd" d={bookSvgPaths.p240c9600} fill="#8CB200" fillRule="evenodd" />
        <path clipRule="evenodd" d={bookSvgPaths.p9df0d00} fill="#8CB200" fillRule="evenodd" />
        <path clipRule="evenodd" d={bookSvgPaths.p6b31000} fill="#8CB200" fillRule="evenodd" />
      </g>
    </svg>
  );
}

function DesignStreakPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }}>
      {/* Right pattern */}
      <div className="absolute" style={{ height: 209, left: 298, top: -33, width: 200 }}>
        {[0, 28, 83, 138, 193].map(top => (
          <div key={top} className="absolute" style={{ top, left: 26, width: 174, height: 17 }}>
            <DesignPatternRow />
          </div>
        ))}
        {[0, 56, 112, 168].map(top => (
          <div key={`l${top}`} className="absolute" style={{ top, left: 0, width: 174, height: 17 }}>
            <DesignPatternRow />
          </div>
        ))}
      </div>
      {/* Left pattern */}
      <div className="absolute" style={{ height: 209, left: -135, top: -8, width: 200 }}>
        {[0, 28, 83, 138, 193].map(top => (
          <div key={top} className="absolute" style={{ top, left: 26, width: 174, height: 17 }}>
            <DesignPatternRow />
          </div>
        ))}
        {[0, 56, 112, 168].map(top => (
          <div key={`l${top}`} className="absolute" style={{ top, left: 0, width: 174, height: 17 }}>
            <DesignPatternRow />
          </div>
        ))}
      </div>
    </div>
  );
}

// 7-day week check strip matching the Figma design
function WeekCheckStrip({
  recentStreakDays,
  freezeActiveToday,
}: {
  recentStreakDays: Record<string, string> | null;
  freezeActiveToday: boolean;
}) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((label, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + mondayOffset + i);
    const key = localDateStr(d);
    const status = (i + mondayOffset === 0 && freezeActiveToday) ? 'frozen' : recentStreakDays?.[key];
    const completed = status === 'completed';
    return { label, key, completed, status };
  });

  return (
    <div className="flex items-start justify-between w-full px-0">
      {days.map(day => (
        <div key={day.key} className="flex flex-col gap-1 items-center">
          {day.completed ? (
            <div className="bg-primary flex items-start overflow-hidden p-2 rounded-[10px]">
              <svg fill="none" height="24" viewBox="0 0 20 20" width="24">
                <path clipRule="evenodd" d={bookSvgPaths.p3be671c0} fill="white" fillRule="evenodd" />
              </svg>
            </div>
          ) : (
            <div className="bg-card flex items-start overflow-hidden p-2 rounded-[10px]">
              <div className="relative size-[24px] flex items-center justify-center">
                <div className="size-[16px] rounded-full border-2 border-[#D7D7D7]" />
              </div>
            </div>
          )}
          <p className="text-foreground text-[14px] font-[590]"
            style={{ fontVariationSettings: '"wdth" 100', fontFamily: 'system-ui, sans-serif' }}>
            {day.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// Lesson card matching the Figma design
function DesignLessonCard({ entry, step }: { entry: RoadmapEntry; step: RoadmapStep }) {
  const { done, onCheckboxClick, quizModal } = useStepCompletionGate(entry, step);
  const [open, setOpen] = useState(false);
  const allResources = [...(step.learn ?? []), ...(step.practice ?? [])].filter(r => r.url);

  return (
    <div className={`bg-accent rounded-[12px] shrink-0 overflow-hidden transition-opacity ${done ? 'opacity-60' : ''}`}>
      {/* Main row */}
      <div className="relative" style={{ height: 110 }}>
        {/* Lesson content */}
        <div className="absolute left-2 top-2" style={{ width: 274, height: 80 }}>
          {/* Circular avatar/thumbnail with check */}
          <button
            onClick={onCheckboxClick}
            className="absolute rounded-full"
            style={{ left: 15, top: 20, width: 39, height: 39 }}
            aria-label={done ? 'Mark incomplete' : 'Mark complete'}
          >
            <div className="relative size-full rounded-full overflow-hidden" style={{ background: '#d7d7d7' }}>
              {done && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/80">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{ border: '1.463px solid #8cb200' }} />
          </button>

          {/* Title */}
          <p className={`absolute text-[20px] leading-[24px] tracking-[-0.06px] w-[186px] ${done ? 'line-through text-muted-foreground' : 'text-foreground font-[590]'}`}
            style={{ left: 88, top: 16, fontFamily: 'system-ui, sans-serif', fontVariationSettings: '"wdth" 100', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {step.title}
          </p>

          {/* Type + duration row */}
          <div className="absolute flex items-center gap-2" style={{ left: 88, top: 68 }}>
            <TypeBadge type={step.type} />
            <span className="text-[11px] text-muted-foreground">{step.duration}</span>
          </div>
        </div>

        {/* Chevron — toggles resource panel */}
        {allResources.length > 0 && (
          <button
            onClick={() => setOpen(o => !o)}
            className="absolute flex items-center justify-center"
            style={{ right: 16, top: 46 }}
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            <ChevronDown
              size={16}
              className="text-foreground transition-transform"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
        )}
      </div>

      {/* Expanded resources */}
      {open && allResources.length > 0 && (
        <div className="px-4 pb-3.5 pt-0.5 border-t border-[#d9efaf]">
          <div className="mt-3">
            <ResourceActions resources={allResources} stepId={step.id} />
          </div>
        </div>
      )}

      {quizModal}
    </div>
  );
}

// Quote card matching the Figma design
function DesignQuoteCard() {
  const [{ quote }] = useState(() => pickQuote(-1));
  return (
    <div className="bg-accent overflow-hidden relative rounded-[12px] w-full">
      {/* Left pattern — mostly cropped, matching Figma's mr-[-149px] offset */}
      <div
        className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-[39px] items-end opacity-30 pointer-events-none"
        style={{ left: -149, width: 200 }}
      >
        {[0,1,2,3].map(i => <DesignPatternRow key={i} />)}
      </div>
      {/* Right pattern */}
      <div
        className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-[40px] items-start opacity-30 pointer-events-none"
        style={{ right: -149, width: 200 }}
      >
        {[0,1,2,3].map(i => <DesignPatternRow key={i} />)}
      </div>
      {/* Quote content — determines card height */}
      <div className="relative z-10 flex flex-col items-center gap-[5px] px-14 py-5">
        <svg fill="none" height="29" viewBox="0 0 36.897 29.401" width="37" className="mb-0.5">
          <path d={bookSvgPaths.pc35ee40} fill="#8CB200" />
        </svg>
        <p
          className="text-foreground font-bold text-center w-full"
          style={{ fontSize: 15.617, lineHeight: '20.822px', letterSpacing: '-0.0468px', fontFamily: 'system-ui, sans-serif' }}
        >
          "{quote.text}"
        </p>
        <p
          className="text-primary text-center"
          style={{ fontSize: 10.411, lineHeight: '13px', fontWeight: 590, fontFamily: 'system-ui, sans-serif' }}
        >
          ~ {quote.author}
        </p>
      </div>
    </div>
  );
}

// ─── Today View ────────────────────────────────────────────────────────────────

// Visual language, redesigned per the reference image: outlined flame glyphs
// sitting directly on the connecting line — no filled circle badge behind
// each day the way the old version had. Four states map 1:1 to the same
// streak_log status strings as before ('completed' | 'grace' | 'frozen' |
// 'broken') — only the rendering changed, not the data contract.
//
// 'completed' — solid orange flame (the one state that's actually "filled,"
//   everything else stays outline-only so a completed day reads as the one
//   thing that visually "happened").
// 'grace' — outlined amber flame. Distinct from 'broken' on purpose: a grace
//   day is still a miss, but complete_task()'s own grace-window logic hasn't
//   given up on the streak yet, so it shouldn't look identical to a genuinely
//   broken day.
// 'frozen' — the "fire in ice" treatment: blue outlined flame inside a light
//   blue circle wash, distinct from every other state's plain-line look
//   specifically because a freeze is an active user decision, not a passive
//   day-status — it should read as visually distinct at a glance.
// 'broken' / no data — grey outlined flame, no fill. Reuses the neutral
//   palette for the same reason the old version did: a missed day isn't a
//   destructive action, doesn't earn the --destructive/red token.
const STREAK_DOT: Record<string, { stroke: string; fill: string; filled: boolean }> = {
  completed: { stroke: '#ffaa00', fill: '#ffaa00', filled: true },
  grace:     { stroke: '#e0a83f', fill: 'none',    filled: false },
  frozen:    { stroke: '#0095ff', fill: 'none',    filled: false },
  broken:    { stroke: '#c7cbd3', fill: 'none',    filled: false },
};
const STREAK_DOT_NONE = { stroke: '#c7cbd3', fill: 'none', filled: false };

// Uses lucide's actual Flame icon — the same glyph shown next to "N-day
// streak" in the header above — instead of a hand-drawn path. Correction
// from the first pass: lucide icons are stroke-based SVGs by default
// (fill="none" unless overridden), so Flame already supports an outline
// look via stroke + fill="none"; a custom path was never actually needed,
// and using the real icon means the header flame and the day-cell flames
// are now guaranteed to be the same shape, not two different
// approximations of "flame."
function FlameGlyph({ stroke, fill, filled, animateSlow }: { stroke: string; fill: string; filled: boolean; animateSlow?: boolean }) {
  return (
    <Flame
      size={16}
      color={stroke}
      fill={filled ? fill : 'none'}
      strokeWidth={filled ? 1.5 : 2}
      style={animateSlow ? { animation: 'streakFlamePulse 3s ease-in-out infinite' } : undefined}
    />
  );
}

// Expanded calendar view — appears when the "Keep it going" chevron is
// tapped. Shows 5 months (2 before, current, 2 after current) as a
// horizontally scroll-snapping carousel, not a stacked list — five full
// month grids stacked vertically would make this panel taller than most
// phone screens, which defeats the point of it being a collapsible
// secondary view. Reuses STREAK_DOT/FlameGlyph so a given day's color/fill
// here is guaranteed to match what the 7-day strip and any future streak
// surface show for that same key — one source of truth for "what does a
// 'frozen' day look like," not a second palette invented for this panel.
//
// Data limitation, stated plainly rather than glossed over: recentStreakDays
// only ever contains today ± 3 days (see fetchRecentStreakDays in
// context.tsx — it's a bounded window, not a full history fetch). Days
// outside that window render as "no data" (the same grey outline as a
// genuinely missed day), not as "not fetched yet" — those two things are
// indistinguishable in the UI right now, across all 5 months, not just the
// current one. If real multi-month history is needed later,
// fetchRecentStreakDays' range needs widening (or a paginated fetch added)
// — this panel doesn't invent data it doesn't have.
//
// Simulated-day highlighting (dev-only): when projectionOffsetDays > 0 (set
// via DevStreakPanel's Ctrl+Shift+P), the days from today through
// today+offsetDays render with the same solid-orange "completed" look, so
// cycling the projection simulation gives immediate calendar feedback
// instead of the grid just sitting there unchanged. This is deliberately
// NOT the same thing as writing 'completed' into recentStreakDays — real
// backend status and "currently mid dev-simulation" stay two distinguishable
// concepts internally (see the `simulated` flag on DayCell) even though they
// render identically, so a future need to tell them apart isn't blocked by
// this. Only ever non-zero in a dev build; projectionOffsetDays is hardcoded
// 0 in production (see its declaration in context.tsx).
function monthGrid(year: number, month: number, todayKey: string, recentStreakDays: Record<string, string> | null, freezeActiveToday: boolean, simulatedKeys: Set<string>, finishDateKey: string | null) {
  type DayCell = { day: number; key: string; isToday: boolean; status: string | undefined; simulated: boolean; isFinishDate: boolean } | null;
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay(); // 0 = Sunday, matches 'SMTWTFS' order used elsewhere in this file

  const blanks: DayCell[] = Array.from({ length: leadingBlanks }, () => null);
  const monthDays: DayCell[] = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const d = new Date(year, month, day);
    const key = localDateStr(d);
    const isToday = key === todayKey;
    const simulated = simulatedKeys.has(key);
    const status = (isToday && freezeActiveToday) ? 'frozen' : recentStreakDays?.[key];
    const isFinishDate = finishDateKey != null && key === finishDateKey;
    return { day, key, isToday, status, simulated, isFinishDate };
  });
  return [...blanks, ...monthDays];
}

function StreakCalendarPanel({
  recentStreakDays,
  freezeActiveToday,
  longestStreak,
  freezeDaysRemaining,
  projectionOffsetDays,
  finishDateKey,
}: {
  recentStreakDays: Record<string, string> | null;
  freezeActiveToday: boolean;
  longestStreak: number | null;
  freezeDaysRemaining: number | null;
  projectionOffsetDays: number;
  // Active roadmap's projected_finish_date (RoadmapProjection, real
  // server-computed value from project_roadmap_finish_date() — see
  // context.tsx). Already 'YYYY-MM-DD', same shape localDateStr produces,
  // so it's compared directly against cell keys with no Date parsing or
  // timezone risk. null when no active roadmap or projection hasn't
  // loaded yet (see projection's own null-until-loaded contract).
  finishDateKey: string | null;
}) {
  const today = new Date();
  const todayKey = localDateStr(today);

  // Today through today+offsetDays, inclusive — "5 days passed" reads as
  // "the next 5 days from today," matching what Ctrl+Shift+P's own label
  // ("+5d simulated") describes, not an ambiguous different window.
  const simulatedKeys = new Set<string>();
  if (projectionOffsetDays > 0) {
    for (let i = 0; i <= projectionOffsetDays; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      simulatedKeys.add(localDateStr(d));
    }
  }

  // 2 before, current, 2 after — 5 months total, centered on the current
  // month per direct request.
  const months = [-2, -1, 0, 1, 2].map(delta => {
    const d = new Date(today.getFullYear(), today.getMonth() + delta, 1);
    return { year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) };
  });

  // The finish date is a real calendar date that can fall outside the
  // ±2-month window this panel actually renders (e.g. a 6-month roadmap).
  // Silently omitting the marker in that case would look like the feature
  // just isn't working — surfacing it explicitly instead, with the actual
  // date spelled out so the information isn't lost just because the cell
  // isn't visible.
  const finishInVisibleRange = finishDateKey != null && months.some(({ year, month }) => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    return finishDateKey.startsWith(prefix);
  });

  return (
    <div className="mt-4 pt-4 border-t border-[#ffe3a8]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-[#9a7b2e]">Swipe to browse months</span>
        <div className="flex items-center gap-3 text-[11px] text-[#9a7b2e]">
          <span>Longest: <span className="font-semibold text-foreground">{longestStreak ?? '—'}</span></span>
          {freezeActiveToday && (
            <span className="flex items-center gap-1 text-[#0095ff] font-semibold">
              Frozen{freezeDaysRemaining != null ? ` · ${freezeDaysRemaining}d left` : ''}
            </span>
          )}
        </div>
      </div>

      {projectionOffsetDays > 0 && (
        <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-[#fff4d6] border border-[#f0d896] text-[10px] text-muted-foreground font-medium">
          Dev sim active: today through +{projectionOffsetDays}d shown as completed
        </div>
      )}

      {finishDateKey != null && !finishInVisibleRange && (
        <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-[#eef4ff] border border-[#c9e0ff] text-[10px] text-[#0057b8] font-medium flex items-center gap-1">
          <Target size={11} /> Projected finish ({finishDateKey}) is outside this 5-month view
        </div>
      )}

      <div
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-1 scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {months.map(({ year, month, label }) => {
          const cells = monthGrid(year, month, todayKey, recentStreakDays, freezeActiveToday, simulatedKeys, finishDateKey);
          return (
            <div key={`${year}-${month}`} className="shrink-0 w-full snap-center" style={{ scrollSnapAlign: 'center' }}>
              <p className="text-xs font-bold text-foreground mb-2 text-center">{label}</p>
              <div className="grid grid-cols-7 gap-y-2 mb-2">
                {'SMTWTFS'.split('').map((letter, i) => (
                  <span key={i} className="text-[9px] font-semibold text-[#9a7b2e] text-center">{letter}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-2">
                {cells.map((cell, i) => {
                  if (!cell) return <div key={`blank-${year}-${month}-${i}`} />;
                  const effectiveStatus = cell.simulated ? 'completed' : cell.status;
                  const style = effectiveStatus ? (STREAK_DOT[effectiveStatus] ?? STREAK_DOT_NONE) : STREAK_DOT_NONE;
                  const isFrozen = effectiveStatus === 'frozen';
                  return (
                    <div key={cell.key} className="flex flex-col items-center gap-0.5">
                      <div className="relative flex items-center justify-center">
                        {isFrozen ? (
                          <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center" style={{ background: '#e6f4ff' }}>
                            <FlameGlyph stroke={style.stroke} fill={style.fill} filled={style.filled} animateSlow />
                          </div>
                        ) : (
                          <div className="w-[22px] h-[22px] flex items-center justify-center rounded-full">
                            <FlameGlyph stroke={style.stroke} fill={style.fill} filled={style.filled} />
                          </div>
                        )}
                        {/* Projected finish date: a distinct ring marker, not
                            a flame-state color — this is a future target,
                            not a completion status, and shouldn't be
                            confusable with "completed" or "simulated." */}
                        {cell.isFinishDate && (
                          <div
                            className="absolute inset-[-2px] rounded-full pointer-events-none"
                            style={{ border: '2px solid #85a60c' }}
                            title="Projected roadmap finish date"
                          />
                        )}
                      </div>
                      <span
                        className="text-[9px] flex items-center gap-0.5"
                        style={{ color: cell.isToday ? '#131927' : '#c2ad74', fontWeight: cell.isToday ? 700 : 500 }}
                      >
                        {cell.day}
                        {cell.isFinishDate && <Target size={8} className="text-primary" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StreakStrip({
  streakCount,
  longestStreak,
  recentStreakDays,
  freezeActiveToday,
  freezeDaysRemaining,
  projectionOffsetDays,
  finishDateKey,
}: {
  streakCount: number;
  longestStreak: number | null;
  recentStreakDays: Record<string, string> | null;
  freezeActiveToday: boolean;
  freezeDaysRemaining: number | null;
  projectionOffsetDays: number;
  finishDateKey: string | null;
}) {
  const label = streakCount === 1 ? '1-day streak' : `${streakCount}-day streak`;
  // Expand/collapse for the calendar view below the 7-day strip. Chevron
  // lives next to "Keep it going" per direct request — clicking either the
  // text or the chevron toggles it, since a text-only hit target here would
  // be too easy to miss on mobile (the actual click target is the whole
  // right-hand cluster, not just the 12px icon).
  const [calendarOpen, setCalendarOpen] = useState(false);

  const today = new Date();
  const cells = Array.from({ length: 7 }, (_, i) => {
    const offset = i - 3;
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    const key = localDateStr(d);
    const letter = 'SMTWTFS'[d.getDay()];
    const isToday = offset === 0;
    // Live-math patch for the un-backfilled-freeze gap (SESSION_HANDOFF_3
    // §5/§0.8): streak_log has no row yet for a freeze activated today, so
    // recentStreakDays alone would render today blank for the freeze's
    // entire duration. freezeActiveToday (from streakStatus, computed in
    // context.tsx from user_stats directly) is checked first and wins over
    // whatever — or nothing — recentStreakDays has for today specifically.
    // Only applies to the today cell; a backfilled freeze on a past day
    // already has a real streak_log row and doesn't need this patch.
    const status = (isToday && freezeActiveToday) ? 'frozen' : recentStreakDays?.[key];
    return { key, letter, isToday, status };
  });

  return (
    <div className="rounded-2xl p-4 mb-5" style={{ background: 'linear-gradient(135deg, #FFF7E6 0%, #F8FDE7 100%)', border: '1px solid #ffe3a8' }}>
      <button
        type="button"
        onClick={() => setCalendarOpen(o => !o)}
        className="w-full flex items-center gap-2 mb-4 text-left"
        aria-expanded={calendarOpen}
        aria-label={calendarOpen ? 'Hide streak calendar' : 'Show streak calendar'}
      >
        <Flame size={18} className="text-[#ffaa00]" />
        <span className="text-sm font-bold text-foreground">{streakCount > 0 ? label : 'No streak yet'}</span>
        <span className="text-[11px] text-[#9a7b2e] ml-auto flex items-center gap-1">
          {streakCount > 0 ? 'Keep it going' : 'Complete a task to start one'}
          <ChevronDown
            size={13}
            className="text-[#9a7b2e] transition-transform"
            style={{ transform: calendarOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </span>
      </button>

      {/* Connecting line sits behind every cell at flame-center height;
          cells render on top of it so the line reads as running "through"
          the row rather than being a separate element above/below it. */}
      <div className="relative flex items-start justify-between">
        <div
          className="absolute left-0 right-0 h-px bg-[#e8d9a8]"
          style={{ top: 9 }}
        />
        {cells.map(({ key, letter, isToday, status }) => {
          const style = status ? (STREAK_DOT[status] ?? STREAK_DOT_NONE) : STREAK_DOT_NONE;
          const isFrozen = status === 'frozen';
          return (
            <div key={key} className="relative flex flex-col items-center gap-2 z-10">
              {isFrozen ? (
                // Fire-in-ice: light blue wash behind the outlined flame,
                // the one state that gets a background treatment at all —
                // deliberate, so a frozen day is unmistakable at a glance
                // against six plain-line neighbors. No border here anymore —
                // the circular blue wash itself is now the only signal for
                // "frozen," today or not; a same-day black ring on top of it
                // was redundant and is removed per direct feedback.
                <div
                  className="w-[26px] h-[26px] rounded-full flex items-center justify-center"
                  style={{ background: '#e6f4ff' }}
                >
                  <FlameGlyph stroke={style.stroke} fill={style.fill} filled={style.filled} animateSlow />
                </div>
              ) : (
                <div className="w-[26px] h-[26px] flex items-center justify-center rounded-full">
                  <FlameGlyph stroke={style.stroke} fill={style.fill} filled={style.filled} />
                </div>
              )}
              <span
                className="text-[10px] font-semibold flex items-center gap-1"
                style={{ color: isToday ? '#131927' : '#9a7b2e' }}
              >
                {letter}
                {isToday && <span className="w-1 h-1 rounded-full bg-foreground" />}
              </span>
            </div>
          );
        })}
      </div>

      {calendarOpen && (
        <StreakCalendarPanel
          recentStreakDays={recentStreakDays}
          freezeActiveToday={freezeActiveToday}
          longestStreak={longestStreak}
          freezeDaysRemaining={freezeDaysRemaining}
          projectionOffsetDays={projectionOffsetDays}
          finishDateKey={finishDateKey}
        />
      )}

      <style>{`
        @keyframes streakFlamePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.08); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}

function TodayTaskRow({ entry, step }: { entry: RoadmapEntry; step: RoadmapStep }) {
  const { done, onCheckboxClick, quizModal } = useStepCompletionGate(entry, step);
  const [open, setOpen] = useState(false);

  const allResources = [...(step.learn ?? []), ...(step.practice ?? [])].filter(r => r.url);

  return (
    <div className={`border border-border rounded-2xl overflow-hidden transition-opacity ${done ? 'opacity-55' : ''}`}>
      <div className="flex items-center gap-3 px-4 py-3.5">
        <button
          onClick={onCheckboxClick}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
            done ? 'border-primary bg-primary' : 'border-border hover:border-primary'
          }`}
          aria-pressed={done}
        >
          {done && <Check size={11} className="text-foreground" />}
        </button>

        <button onClick={() => setOpen(o => !o)} className="flex-1 min-w-0 flex items-center gap-3 text-left">
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium leading-snug ${done ? 'line-through text-muted-foreground' : 'text-foreground'}`}
              style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
            >
              {step.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <TypeBadge type={step.type} />
              <span className="text-[11px] text-muted-foreground">{step.duration}</span>
            </div>
          </div>
          <ChevronDown
            size={16}
            className="text-muted-foreground transition-transform shrink-0"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
      </div>

      {open && (
        <div className="px-4 pb-3.5 pt-0.5 border-t border-border">
          <div className="mt-3">
            <ResourceActions resources={allResources} stepId={step.id} />
          </div>
        </div>
      )}
      {quizModal}
    </div>
  );
}

// ─── Streak-partner card ─────────────────────────────────────────────────────
//
// Self-contained by design (see the "Way 1 vs Way 2" decision this session):
// nothing outside this component knows or needs to know who your streak
// partner is. context.tsx has zero awareness of `friendships` at all — that
// stays true after this card exists. If that ever needs to change (e.g. a
// second screen also needs "who is my partner"), lift the fetch into
// context.tsx then, not before — no point adding shared-state plumbing for
// a single caller.
//
// Two real steps, because get_streak_partner_status() needs a specific
// partner ID and nothing in this app currently tracks "my current streak
// partner" anywhere global:
//   1. Ask `friendships` directly: is there a row where I'm involved,
//      status = 'accepted', tier = 'streak_partner'? (a user can only have
//      one such row at a time — tier lives on the friendship row itself,
//      not a separate "who's my partner" pointer, so this is the source of
//      truth, not a cache of it)
//   2. If yes, call get_streak_partner_status(that_id) — the SECURITY
//      DEFINER RPC from Session 4, already live, already re-validates the
//      pairing server-side before returning anything.
//
// Polls every 5 minutes while mounted (Today tab open). This is genuinely
// new infrastructure in this codebase — nothing else here polls; every
// other fetch in context.tsx is on-mount or triggered by a real user
// action. Accepted tradeoff: if the partner is demoted/changed in another
// tab, this card won't notice until its next 5-min tick, not immediately.
// Shape of the `pinned_roadmap` jsonb column added in migration 008
// (get_streak_partner_status). Deliberately NOT the full Roadmap type from
// generateRoadmap.ts — this is the stripped, partner-safe shape produced
// server-side by strip_roadmap_for_partner_view(): step objects only ever
// carry id/title/type/duration/note. learn/practice/inspire are absent
// entirely (not empty arrays) because the owner's actual resource content
// is never sent to this tier at all — see SESSION_HANDOFF_5.md §1/§4.
export interface PartnerStep {
  id: string;
  title: string;
  type: RoadmapStep['type'];
  duration: string;
  note: string;
}
export interface PartnerPhase {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  duration: string;
  milestone: string;
  steps: PartnerStep[];
}
export interface PartnerRoadmap {
  id: string;
  skill: string;
  data: { phases: PartnerPhase[] };
  progress: Record<string, boolean>;
}

interface PartnerStatus {
  friendshipId: string;
  partnerUsername: string;
  partnerDisplayName: string | null;
  completedToday: boolean;
  currentStreak: number;
  freezeActiveToday: boolean;
  freezeDaysRemaining: number | null;
  // null if the partner has no active roadmap, or has one but hasn't
  // granted streak_partner-tier access to it — get_streak_partner_status()
  // doesn't distinguish those two cases in its return shape, and neither
  // does this card: both render as "nothing to show" (see PartnerTodaysPlan).
  pinnedRoadmap: PartnerRoadmap | null;
}

const PARTNER_POLL_MS = 5 * 60 * 1000;

// Resolves ONE friendship row (already known to be an accepted streak_partner
// pairing) into a full PartnerStatus. Split out from fetchStreakPartners so
// each row can be resolved in parallel via Promise.all rather than one at a
// time — with N partners this is 1 friendship query + N parallel (profile +
// RPC) pairs, not N sequential round-trips.
async function resolvePartnerStatus(
  row: { id: string; requester_id: string; addressee_id: string },
  userId: string,
): Promise<PartnerStatus | null> {
  const partnerId = row.requester_id === userId ? row.addressee_id : row.requester_id;

  const { data: partnerProfile, error: profileError } = await supabase
    .from('profiles')
    .select('username, display_name')
    .eq('id', partnerId)
    .maybeSingle();

  if (profileError) {
    console.error('[streak-partner] partner profile lookup errored', profileError, { partnerId });
    return null;
  }
  if (!partnerProfile) {
    console.warn('[streak-partner] partner profile row not found (RLS block or missing row?)', { partnerId });
    return null;
  }

  // their live status, via the RPC that re-checks the pairing server-side
  // (get_streak_partner_status — Session 4, §0.4).
  const { data: statusRows, error: statusError } = await supabase.rpc(
    'get_streak_partner_status',
    { p_partner_id: partnerId }
  );
  if (statusError) {
    console.error('[streak-partner] get_streak_partner_status RPC errored', statusError, { partnerId });
    return null;
  }

  const status = Array.isArray(statusRows) ? statusRows[0] : statusRows;
  if (!status) {
    // RPC returns empty set (not an error) if not actually partners anymore
    return null;
  }

  return {
    friendshipId: row.id,
    partnerUsername: partnerProfile.username,
    partnerDisplayName: partnerProfile.display_name,
    completedToday: !!status.completed_today,
    currentStreak: status.current_streak ?? 0,
    freezeActiveToday: !!status.freeze_active_today,
    freezeDaysRemaining: status.freeze_days_remaining ?? null,
    // Added in migration 008 — null if no active roadmap, or one exists but
    // wasn't granted to this tier. Both cases collapse to the same "show
    // nothing" render (PartnerTodaysPlan), so no need to tell them apart here.
    pinnedRoadmap: (status.pinned_roadmap ?? null) as PartnerRoadmap | null,
  };
}

// Fetches ALL of the caller's streak-partner friendships, not just one.
// Deliberately no `.maybeSingle()` — there's no DB constraint stopping a
// user from having more than one accepted streak_partner row (tier lives on
// each friendship row independently), so treating this as one-or-none was
// the actual bug: `.maybeSingle()` throws once a second row exists.
async function fetchStreakPartners(userId: string): Promise<PartnerStatus[]> {
  if (userId === 'dev-bypass') return [];
  const { data: rows, error: findError } = await supabase
    .from('friendships')
    .select('id, requester_id, addressee_id')
    .eq('status', 'accepted')
    .eq('tier', 'streak_partner')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

  if (findError) {
    console.error('[streak-partner] friendship lookup errored', findError, { userId });
    return [];
  }
  if (!rows || rows.length === 0) return [];

  const resolved = await Promise.all(rows.map(row => resolvePartnerStatus(row, userId)));
  return resolved.filter((p): p is PartnerStatus => p !== null);
}

// ─── Partner's today's tasks (view-only mirror) ──────────────────────────────
//
// Renders (a slice of) the stripped payload from
// get_streak_partner_status().pinned_roadmap. Visually mirrors TodayTaskRow
// above (same badges, same layout, same rounded-card row) so this doesn't
// read as a bolted-on afterthought — but every interactive affordance is
// removed on purpose, per the confirmed product rule (SESSION_HANDOFF_5.md
// §1): a streak partner sees the SAME "Today's Plan" slice the owner does
// under their own Today tab (see pickPartnerTodaysStepIds below), EXCEPT —
//   - no checkbox click (toggleStep isn't callable here — there's no local
//     `entry` this card owns; the owner's own progress object is read-only
//     data from another user's row, not this user's roadmap)
//   - no ResourceActions at all — not disabled, not rendered — because
//     learn/practice/inspire were never sent by the server in the first place
//   - completion state (strikethrough/opacity) still reflects the owner's
//     real progress, and updates whenever this card's 5-min poll ticks
//   - no full-roadmap accordion, no achievements grid, no stats tiles — the
//     card is scoped to today's tasks only, matching the owner's own Today
//     tab rather than the Roadmap tab's phase-by-phase tree
function PartnerStepRow({ step, done }: { step: PartnerStep; done: boolean }) {
  return (
    <div className={`px-4 py-3 border border-border rounded-2xl transition-opacity ${done ? 'opacity-55' : ''}`}>
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
            done ? 'border-primary bg-primary' : 'border-border'
          }`}
          aria-hidden="true"
        >
          {done && <Check size={11} className="text-foreground" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-snug ${done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {step.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <TypeBadge type={step.type} />
            <span className="text-[11px] text-muted-foreground">{step.duration}</span>
          </div>
          {step.note && (
            <p className="text-[12px] text-muted-foreground mt-1.5 leading-snug">{step.note}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Partner-shape twin of pickTodaysTaskIds() (see TodayView section further
// down): same rule — first four not-yet-done steps in phase order, or the
// first four steps overall once everything's done — just typed against
// PartnerPhase[]/progress instead of a full RoadmapEntry, since a partner's
// stripped payload has no `entry` to read here.
function pickPartnerTodaysStepIds(phases: PartnerPhase[], progress: Record<string, boolean>): string[] {
  const steps = phases.flatMap(p => p.steps);
  const pending = steps.filter(s => !progress[s.id]).slice(0, 4);
  const chosen = pending.length > 0 ? pending : steps.slice(0, 4);
  return chosen.map(s => s.id);
}

// Replaces the old full-roadmap accordion (PartnerPhaseRow-by-phase) that
// used to live here: per product decision, the partner card now shows ONLY
// today's picked tasks — no phase list, no achievements grid, no stats
// tiles, no expand/collapse. Same picking rule as the owner's own "Today's
// Plan" (pickTodaysTaskIds/pickPartnerTodaysStepIds: first four not-done
// steps in phase order, or the first four overall if the roadmap's fully
// complete) so a streak partner's card always mirrors what THEY see under
// their own Today tab, not their whole roadmap tree.
//
// Two call sites, two contexts — hence `withDivider`:
//   - PartnerCard (Today tab): this sits BELOW an existing name/streak
//     header inside the same card, so it needs the top border + spacing to
//     visually separate itself from that header. withDivider defaults true.
//   - Profile.tsx: this IS the entire content of its own card (Profile
//     wraps it in its own bordered/background div per roadmap), so a top
//     border here would just be a stray line with nothing above it inside
//     that card. Profile passes withDivider={false}.
export function PartnerTodaysPlan({
  roadmap, withDivider = true,
}: { roadmap: PartnerRoadmap; withDivider?: boolean }) {
  const phases = roadmap.data?.phases ?? [];
  const allSteps = phases.flatMap(p => p.steps);

  // Same pinning fix as pickTodaysTaskIds/TodayView above (see that comment
  // for the original bug). pickPartnerTodaysStepIds was being called fresh
  // on every render straight off roadmap.progress — and `roadmap` itself is
  // a brand-new object every 5-min poll tick (fetchStreakPartners returns
  // freshly-fetched PartnerStatus objects, it doesn't mutate the old ones).
  // The instant ded's progress ticked over, the completed step no longer
  // matched `!progress[id]`, dropped out of the filtered set, and the next
  // pending step slid up into the 4th slot — from emmy's side that reads as
  // "ded's task vanished and a new one appeared" instead of "that row got
  // checked off." Fix is the same shape: pick the id set once per roadmap
  // id and hold it in state; only `done` (read live off roadmap.progress
  // inside PartnerStepRow below) is allowed to change between polls.
  //
  // Caveat worth knowing: this doesn't read ded's actual pinned set out of
  // ded's own session — there's no server column for that, so it can't. It
  // independently pins using the same selection rule against whatever
  // progress snapshot THIS card first saw for this roadmap id. Same
  // algorithm, same rule as ded's own pin — in practice the same list,
  // unless ded raced multiple completions between ded's own pin moment and
  // this card's first fetch of that roadmap.
  const [todaysIds, setTodaysIds] = useState(() => pickPartnerTodaysStepIds(phases, roadmap.progress));
  const lastRoadmapId = useRef(roadmap.id);
  useEffect(() => {
    if (lastRoadmapId.current !== roadmap.id) {
      lastRoadmapId.current = roadmap.id;
      setTodaysIds(pickPartnerTodaysStepIds(phases, roadmap.progress));
    }
    // Deliberately NOT reacting to phases/roadmap.progress changing on their
    // own — that's the poll tick this fix exists to ignore. Only a genuine
    // roadmap swap (different id) should re-pick.
  }, [roadmap.id]);

  const todaysSteps = todaysIds
    .map(id => allSteps.find(s => s.id === id))
    .filter((s): s is PartnerStep => !!s);

  return (
    <div className={withDivider ? 'mt-3 pt-3 border-t border-primary' : ''}>
      <div className="flex items-center gap-2 mb-2.5">
        <Map size={13} className="text-primary shrink-0" />
        <span className="text-[12px] font-semibold text-accent-foreground truncate">{roadmap.skill}</span>
        <span className="text-[10px] text-primary shrink-0 ml-auto">Today's Plan</span>
      </div>
      {todaysSteps.length > 0 ? (
        <div className="space-y-2">
          {todaysSteps.map(step => (
            <PartnerStepRow key={step.id} step={step} done={!!roadmap.progress[step.id]} />
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground py-1">No tasks to show.</p>
      )}
    </div>
  );
}

// One partner's card — same markup the single-partner version always had,
// just pulled out so StreakPartnerSection can render one per partner.
//
// `open` defaults to true: this card's whole reason to exist is surfacing
// the partner's Today's Plan (problem 1 fix), so hiding it by default would
// bury the feature behind an extra tap. It's local state, not lifted to
// StreakPartnerSection/Main — same key={p.friendshipId} on the list item
// (see StreakPartnerSection below) means React keeps this component
// instance alive across the 5-min poll's setPartners() calls, so toggling
// doesn't get stomped by a refresh. It does NOT survive a tab switch away
// from Today, though — Main() conditionally renders `tab === 'today' &&
// <TodayView/>`, which fully unmounts this tree, not just CSS-hides it — so
// every re-entry to Today starts back at the open default. Fine for now;
// if that turns out to be annoying, the fix is lifting `open` state keyed
// by friendshipId up a level (or into localStorage), not anything in here.
function PartnerCard({ partner }: { partner: PartnerStatus }) {
  const name = partner.partnerDisplayName || partner.partnerUsername;
  const label = partner.currentStreak === 1 ? '1-day streak' : `${partner.currentStreak}-day streak`;
  const hasPlan = !!partner.pinnedRoadmap;
  const [open, setOpen] = useState(true);

  return (
    <div
      className="rounded-2xl p-4 mb-3"
      style={{ background: '#F8FDE7', border: '1px solid #d2f25e' }}
    >
      <button
        type="button"
        onClick={() => hasPlan && setOpen(o => !o)}
        // Not a real disabled state — a partner with nothing to show still
        // needs the header readable, it just isn't interactive. cursor-default
        // (not disabled/opacity) signals "nothing to toggle", not "broken".
        className={`w-full flex items-center gap-3 text-left ${hasPlan ? 'cursor-pointer' : 'cursor-default'}`}
        aria-expanded={hasPlan ? open : undefined}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-foreground"
          style={{ background: '#c8f135' }}
        >
          {name.slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{name}</p>
          <p className="text-[11px] text-accent-foreground flex items-center gap-1">
            <Flame size={11} className="text-[#ffaa00]" />
            {partner.freezeActiveToday
              ? `${label} · frozen${partner.freezeDaysRemaining != null ? ` (${partner.freezeDaysRemaining}d left)` : ''}`
              : label}
          </p>
        </div>
        <span
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
            partner.completedToday
              ? 'text-accent-foreground bg-background border border-primary'
              : 'text-muted-foreground bg-background border border-border'
          }`}
        >
          {partner.completedToday ? 'Done today' : 'Not yet today'}
        </span>
        {hasPlan && (
          <ChevronDown
            size={16}
            className="text-primary shrink-0 transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            aria-hidden="true"
          />
        )}
      </button>

      {/* Absent — not an empty state — when this partner has no active
          roadmap, or has one but never granted streak_partner-tier access
          to it. Both cases collapse to "nothing renders here."
          `open` is CSS-hide (className toggle), not a conditional unmount —
          PartnerTodaysPlan pins its today's-plan step-id set in its own
          state (see that component), and unmounting it on every collapse
          would blow that pin away and re-derive a fresh one on re-expand,
          reintroducing the exact "task vanishes, new one appears" bug this
          pin exists to prevent. Only `hasPlan` gates the actual mount. */}
      {hasPlan && (
        <div className={open ? '' : 'hidden'}>
          <PartnerTodaysPlan roadmap={partner.pinnedRoadmap!} />
        </div>
      )}
    </div>
  );
}

// Renders one PartnerCard per accepted streak-partner friendship — a user
// can have more than one (no DB constraint prevents it), so this is a list,
// not a single lookup. Self-contained by design (see the "Way 1 vs Way 2"
// decision this session): nothing outside this component knows or needs to
// know who your streak partners are. context.tsx has zero awareness of
// `friendships` at all — that stays true after this component exists.
function StreakPartnerSection() {
  const { user } = useApp();
  const [partners, setPartners] = useState<PartnerStatus[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) { setPartners([]); setLoaded(true); return; }
    let active = true;

    function poll() {
      fetchStreakPartners(user!.id).then(list => {
        if (active) { setPartners(list); setLoaded(true); }
      });
    }

    poll();
    const interval = setInterval(poll, PARTNER_POLL_MS);
    return () => { active = false; clearInterval(interval); };
  }, [user]);

  // Nothing to show: not loaded yet, or genuinely no streak partners. Both
  // render nothing rather than a placeholder — this section is a bonus, not
  // a required part of the Today tab, and most users won't have any partner
  // at all (matches how the friends list itself renders nothing when empty).
  if (!loaded || partners.length === 0) return null;

  return (
    <div className="mb-2">
      {partners.map(p => <PartnerCard key={p.friendshipId} partner={p} />)}
    </div>
  );
}

// Picks the step IDs shown in "Today's Plan": the first four not-yet-done
// steps in phase order, or the first four steps overall if the roadmap is
// fully complete. Pulled out to module scope (rather than inlined in
// TodayView) so the exact same selection logic can be called from the
// `useState` initializer AND from the "active roadmap changed" effect
// below, without duplicating it.
function pickTodaysTaskIds(entry: RoadmapEntry): string[] {
  const steps = entry.roadmap.phases.flatMap(p => p.steps);
  const pending = steps.filter(s => !entry.progress[s.id]).slice(0, 4);
  const chosen = pending.length > 0 ? pending : steps.slice(0, 4);
  return chosen.map(s => s.id);
}

function TodayView({ entry }: { entry: RoadmapEntry }) {
  const navigate = useNavigate();
  const smoothRef = useSmoothScroll<HTMLDivElement>();
  const { user, avatarSvg, currentStreak, longestStreak, recentStreakDays, streakStatus, projectionOffsetDays, projection } = useApp();
  const [unreadCount, setUnreadCount] = useState(0);

  // Refetches on every real mount of TodayView — which includes returning
  // from /notifications, since react-router unmounts route components by
  // default (no keep-alive in this app). That's sufficient to clear the
  // badge after Notifications.tsx marks rows seen on its own load — no
  // extra location-tracking needed here.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function fetchUnread() {
      const [pendingRes, proposalRes] = await Promise.all([
        supabase
          .from('friendships')
          .select('id', { count: 'exact', head: true })
          .eq('addressee_id', user!.id)
          .eq('status', 'pending')
          .is('addressee_seen_at', null),
        supabase
          .from('friendships')
          .select('id, requester_id, addressee_id, tier_proposed_by, requester_seen_at, addressee_seen_at')
          .eq('status', 'accepted')
          .not('tier_proposed_by', 'is', null)
          .or(`requester_id.eq.${user!.id},addressee_id.eq.${user!.id}`),
      ]);

      if (cancelled) return;

      const pendingCount = pendingRes.count ?? 0;
      const proposalCount = (proposalRes.data ?? []).filter(r =>
        r.tier_proposed_by && r.tier_proposed_by !== user!.id &&
        ((r.requester_id === user!.id && !r.requester_seen_at) ||
         (r.addressee_id === user!.id && !r.addressee_seen_at))
      ).length;

      setUnreadCount(pendingCount + proposalCount);
    }

    fetchUnread();
    return () => { cancelled = true; };
  }, [user]);

  const roadmap = entry.roadmap;
  const allSteps = roadmap.phases.flatMap(p => p.steps);
  const completedCount = allSteps.filter(s => entry.progress[s.id]).length;

  // Today's Plan used to be `allSteps.filter(s => !entry.progress[s.id]).slice(0, 4)`
  // recomputed fresh on every render. That meant the instant a step was
  // checked off, it no longer matched `!progress[id]`, dropped out of the
  // filtered array, and a 5th step slid up to take its place — which reads
  // as the row vanishing instead of checking off. The Roadmap tab's
  // StepCard never has this problem because it always renders every step
  // in a phase regardless of `done`. Same fix here: pick the set of step
  // IDs ONCE per active roadmap and hold it fixed in state, so completing
  // a step only flips that row's own `done` styling via TodayTaskRow
  // (checkmark + strikethrough + dimmed, matching StepCard) — the set of
  // rows rendered doesn't change until the pinned roadmap itself does.
  const [todaysTaskIds, setTodaysTaskIds] = useState(() => pickTodaysTaskIds(entry));
  const lastEntryId = useRef(entry.id);
  useEffect(() => {
    if (lastEntryId.current !== entry.id) {
      lastEntryId.current = entry.id;
      setTodaysTaskIds(pickTodaysTaskIds(entry));
    }
  }, [entry]);

  const todaysTasks = todaysTaskIds
    .map(id => allSteps.find(s => s.id === id))
    .filter((s): s is RoadmapStep => !!s);

  const dailyGoalXp = 200;
  const dailyXp = completedCount * XP_PER_STEP;
  const dailyXpPct = Math.min(100, Math.round((dailyXp / dailyGoalXp) * 100));
  const completedToday = todaysTasks.filter(s => entry.progress[s.id]).length;

  return (
    <div ref={smoothRef} className="flex flex-col h-full overflow-y-auto scrollbar-hide [&>*]:shrink-0">

      {/* ── Header: avatar + stats ── */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-[9px]">
          {/* Avatar */}
          <div
            className="rounded-full bg-[#F7D67C] flex items-center justify-center overflow-hidden shrink-0"
            style={{ width: 53, height: 53 }}
          >
            {avatarSvg ? (
              <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                dangerouslySetInnerHTML={{ __html: avatarSvg }} />
            ) : (
              <span className="text-[22px] font-bold text-foreground">{user?.initial ?? '?'}</span>
            )}
          </div>

          {/* Right stats — bare icons, no card boxes */}
          <div className="flex items-center gap-4">
            {/* Streak count */}
            <div className="flex items-center gap-1.5">
              <Flame size={18} className="text-foreground" />
              <span className="font-medium text-foreground text-[17px]">{currentStreak ?? 0}</span>
            </div>
            {/* XP */}
            <div className="flex items-center gap-1.5">
              <Zap size={18} className="text-foreground" />
              <span className="font-medium text-foreground text-[17px]">{dailyXp} XP</span>
            </div>
            {/* Bell */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={18} className="text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-1 rounded-full bg-[#ef4444] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Welcome text */}
        <p className="text-foreground text-[20px] tracking-[-0.08px]"
          style={{ fontWeight: 590, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Hey {user?.firstName ?? 'there'}, welcome back!
        </p>
      </div>

      {/* ── Daily XP ── */}
      <div className="px-4 pb-2 mt-4 flex flex-col gap-[10px]">
        <div className="flex items-center justify-between text-[16px] tracking-[-0.048px]">
          <span className="text-foreground" style={{ fontFamily: 'system-ui, sans-serif' }}>Daily XP</span>
          <span className="font-bold text-foreground">{Math.min(dailyXp, dailyGoalXp)}/{dailyGoalXp} XP</span>
        </div>
        <div className="relative bg-secondary rounded-[12px]" style={{ height: 12 }}>
          <div
            className="absolute bg-primary rounded-[12px] transition-all duration-500 flex items-center justify-end pr-1"
            style={{ width: `${Math.max(dailyXpPct, dailyXpPct > 0 ? 14 : 0)}%`, height: 12, bottom: 0, left: 0 }}
          >
            {dailyXpPct > 0 && (
              <span
                className="absolute right-0 translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[11px] font-semibold px-2 py-[2px] rounded-full whitespace-nowrap"
                style={{ top: '50%' }}
              >
                {dailyXpPct}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Streak ── */}
      <div className="px-4 pt-7 flex flex-col gap-[14px]">
        <p className="text-foreground text-[20px] tracking-[-0.3px]"
          style={{ fontWeight: 510, fontFamily: 'system-ui, sans-serif' }}>
          Streak
        </p>
        <div className="bg-accent overflow-hidden relative rounded-[12px]" style={{ height: 112 }}>
          <DesignStreakPattern />
          {/* Week check absolute-positioned so it sits over the pattern */}
          <div className="absolute inset-0 flex items-center px-4 pt-2">
            <div className="w-full">
              <WeekCheckStrip
                recentStreakDays={recentStreakDays}
                freezeActiveToday={!!streakStatus?.freezeActiveToday}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Today's Plan ── */}
      <div className="px-4 pt-7">
        <p className="text-foreground text-[20px] tracking-[-0.06px] mb-3"
          style={{ fontWeight: 510, fontFamily: 'system-ui, sans-serif' }}>
          Today's Plan
        </p>
        <div className="flex items-center justify-between text-[16px] tracking-[-0.048px] mb-4"
          style={{ fontFamily: 'system-ui, sans-serif' }}>
          <span className="text-foreground">Lessons completed</span>
          <div className="flex items-center text-primary">
            <span>{completedToday}</span>
            <span>/{todaysTasks.length || 4}</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {todaysTasks.map((step, i) => (
            <DesignLessonCard key={`${step.id}-${i}`} entry={entry} step={step} />
          ))}
          {todaysTasks.length === 0 && (
            <p className="text-sm text-muted-foreground">Nothing pending — you're all caught up! 🎉</p>
          )}
        </div>
      </div>

      {/* ── Quote ── */}
      <div className="px-4 pt-7">
        <DesignQuoteCard />
      </div>

      {/* ── Streak partner ── */}
      <div className="px-4 pt-7 pb-8">
        <StreakPartnerSection />
      </div>
    </div>
  );
}

// ─── Profile View ──────────────────────────────────────────────────────────────

// ─── Friends preview row (Profile tab) ───────────────────────────────────────
//
// Collapsed by default; tap to expand and show a small handful of friend
// circles. Deliberately self-contained (same "Way 1" reasoning as
// StreakPartnerSection above) — its own query, no context.tsx involvement, no
// sharing with Friends.tsx's own loadFriends(). Two independent callers of a
// cheap query is simpler than adding cross-file plumbing for two callers.
//
// Ordering: streak partners first, then remaining friends by most-recently-
// accepted (responded_at) — matches the decision made this session. Capped
// at 5 circles total; the rest aren't shown here, only in the full list.
//
// Each circle currently links to the full /friends screen, NOT a per-friend
// profile page — that page (Phase 3's get_profile_view + visibility
// settings) doesn't exist anywhere in this codebase yet. Deliberately
// scoped this way per direct decision: build the simple version first, wire
// it to the real profile page later once that page actually exists. When it
// does, only the onClick below needs to change — nothing else in this
// component's shape.
interface PreviewFriend {
  id: string;
  username: string;
  displayName: string | null;
  isPartner: boolean;
}

const FRIENDS_PREVIEW_CAP = 5;

// Mirrors Friends.tsx's goToProfile exactly (not imported — that one is
// module-local there, and no shared nav-helpers file exists in this
// codebase; every screen stays self-contained). /profile/:id is now a real
// route (routes.tsx), so this is the actual destination, not a placeholder.
function goToProfile(navigate: ReturnType<typeof useNavigate>, userId: string) {
  navigate(`/profile/${userId}`);
}

async function fetchFriendsPreview(userId: string): Promise<PreviewFriend[]> {
  if (userId === 'dev-bypass') return [];
  const { data, error } = await supabase
    .from('friendships')
    .select(
      `requester_id, addressee_id, tier, responded_at,
       requester:profiles!friendships_requester_id_fkey(id, username, display_name),
       addressee:profiles!friendships_addressee_id_fkey(id, username, display_name)`
    )
    .eq('status', 'accepted')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

  if (error || !data) return [];

  const list = (data as any[])
    .map(row => {
      const profile = row.requester_id === userId ? row.addressee : row.requester;
      return profile
        ? {
            id: profile.id,
            username: profile.username,
            displayName: profile.display_name,
            isPartner: row.tier === 'streak_partner',
            respondedAt: row.responded_at as string | null,
          }
        : null;
    })
    .filter((f): f is NonNullable<typeof f> => f !== null);

  // Streak partners first, then most-recently-accepted within each group.
  // Nulls (shouldn't happen for an accepted row, but not guaranteed by the
  // schema) sort last rather than crashing the comparison.
  list.sort((a, b) => {
    if (a.isPartner !== b.isPartner) return a.isPartner ? -1 : 1;
    if (!a.respondedAt) return 1;
    if (!b.respondedAt) return -1;
    return b.respondedAt.localeCompare(a.respondedAt);
  });

  return list.slice(0, FRIENDS_PREVIEW_CAP).map(({ id, username, displayName, isPartner }) => ({
    id, username, displayName, isPartner,
  }));
}

function FriendsPreviewRow() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState<PreviewFriend[] | null>(null);

  useEffect(() => {
    if (!open || !user || friends !== null) return; // fetch once, on first expand
    let active = true;
    fetchFriendsPreview(user.id).then(list => {
      if (active) setFriends(list);
    });
    return () => { active = false; };
  }, [open, user, friends]);

  return (
    <div className="border border-border rounded-2xl mb-5 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <Users size={15} className="text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Friends</span>
        </div>
        <ChevronDown
          size={16}
          className="text-muted-foreground transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-0.5 border-t border-border">
          {friends === null ? (
            <p className="text-xs text-muted-foreground py-1">Loading…</p>
          ) : friends.length === 0 ? (
            <p className="text-xs text-muted-foreground py-1">No friends yet.</p>
          ) : (
            <div className="flex items-center gap-2.5 pt-2.5">
              {friends.map(f => (
                <button
                  key={f.id}
                  onClick={() => goToProfile(navigate, f.id)}
                  className="relative shrink-0"
                  title={f.displayName || f.username}
                  aria-label={`View ${f.displayName || f.username}'s profile`}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-foreground"
                    style={{ background: '#c8f135' }}
                  >
                    {(f.displayName || f.username).slice(0, 1).toUpperCase()}
                  </div>
                  {f.isPartner && (
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white"
                      style={{ background: '#ffaa00' }}
                    >
                      <Flame size={9} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Profile hero: scroll-linked collapsing header w/ latch + overscroll-hold ────
//
// Behavior (v3 — replaces the old boolean-snap + CSS-transition model):
// - While `scrollTop` is between 0 and COLLAPSE_DISTANCE, every animated property
//   is a direct, eased function of scrollTop — not a two-state ternary. Scroll
//   down partway, scroll up partway: the header tracks the finger exactly and
//   is fully reversible in that range, same as dragging a physical sheet.
// - The OLD spec ("any scrollTop > 0 snaps fully collapsed, and returning to 0
//   does NOT re-expand") is deliberately kept, but only past full collapse:
//   once the user has scrolled all the way to scrollTop >= COLLAPSE_DISTANCE at
//   least once, collapsedLatch arms. From then on, scrolling back up to
//   scrollTop === 0 holds the header collapsed (p pinned at 1) instead of
//   auto-expanding — exactly like before. Only the overscroll-hold gesture
//   (unchanged trigger: drag-and-hold at scrollTop === 0) releases the latch.
// - This is intentionally NOT symmetric: partial scrolls are always reversible;
//   only a full collapse arms the "stays collapsed at rest" behavior. That's
//   the explicit tradeoff of layering the old latch semantics on top of
//   continuous tracking — see PR discussion / handoff notes if this needs
//   revisiting.
//
// v2 note (kept from prior version, still true): an earlier attempt at
// Telegram-style multi-stage motion (avatar shrinks-in-place, then drifts left
// on a delayed/slower transition; name arrives early on a separate faster
// fade) used independently-guessed position math for the avatar vs. the name
// block that didn't agree pixel-for-pixel, producing a cramped/misaligned
// collapsed header. The fix that mattered wasn't CSS-transition vs. JS
// interpolation — it was that every animated property must derive from the
// SAME shared position math. That discipline is preserved here: one `apply()`
// function, one set of shared constants, nothing computed independently per
// property.
//
// The dark hero surface is the avatar's own container color, not a separate
// background layer — matches the real editor architecture (Preview.tsx /
// AvatarEditor.tsx in the DiceBear fork), where there's no independent hero
// background, only the avatar's own rounded surround color.

// ─── Profile hero: scroll-linked collapsing header (continuous, reversible) ──────
//
// Every animated property is a pure function of scrollTop written imperatively
// through refs — no boolean snap, no CSS transitions fighting the gesture, so
// scrolling up and down is fully reversible and frame-accurate.
//
// The old latch semantics are preserved: once the header has fully collapsed
// once (scrollTop >= COLLAPSE_DISTANCE), latchedRef pins p at 1 even back at
// scrollTop === 0, until useOverscrollHold's drag-and-hold releases it.

/** Scroll distance over which the header fully collapses (relaxed pace). */
const COLLAPSE_DISTANCE = 260;

const OVERSCROLL_HOLD_MS = 150;
const OVERSCROLL_MAX_DRAG = 90;
const OVERSCROLL_STRETCH_CAP = 36;
const OVERSCROLL_TRIGGER_DRAG = 28;

/** Gentle ease-in-out so the collapse feels relaxed, never snappy or linear. */
function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

// Single source of truth for the header geometry in both states. The expanded
// state, the collapsed state and every frame between are derived from these
// same numbers, so nothing can drift apart.
const HERO_EXPANDED_HEIGHT = 380;
const HERO_COLLAPSED_HEIGHT = 180;

const AVATAR_EXPANDED_WIDTH = 210;
const AVATAR_EXPANDED_HEIGHT = 244;
const AVATAR_EXPANDED_TOP = 84;
const AVATAR_EXPANDED_RADIUS = 18;

const AVATAR_COLLAPSED_SIZE = 48;
const AVATAR_COLLAPSED_TOP = 72;
const AVATAR_COLLAPSED_LEFT = 20;
const AVATAR_COLLAPSED_RADIUS = 12;

const CARD_EXPANDED_TOP = 400;
const CARD_EXPANDED_HEIGHT = 196;
const CARD_EXPANDED_LEFT = 20;
const CARD_EXPANDED_PADDING = 20;

const CARD_COLLAPSED_TOP = 72;
const CARD_COLLAPSED_HEIGHT = 80;
const CARD_COLLAPSED_LEFT = AVATAR_COLLAPSED_LEFT + AVATAR_COLLAPSED_SIZE + 14;
const CARD_COLLAPSED_PADDING = 0;

/** Flow offset of the scrolling body at rest (card bottom + breathing room). */
const CONTENT_TOP = CARD_EXPANDED_TOP + CARD_EXPANDED_HEIGHT + 24;

// ─── Background color: read from the avatar's own SVG, not a separate store ──────
// DiceBear bakes `backgroundColor` into the output markup as a literal
// <rect fill="#hex" .../> covering the canvas, so the hero surface can be
// derived from the avatar that's already being fetched and rendered.
const BG_RECT_RE = /<rect[^>]*\sfill="(#[0-9a-fA-F]{3,8})"[^>]*>/;

function extractAvatarBackground(svg: string): string | null {
  if (!svg) return null;
  const match = svg.match(BG_RECT_RE);
  return match ? match[1] : null;
}

/** Mirrors AvatarEditor.tsx's surroundColor (darken ~10%) without tinycolor2. */
function darkenHex(hex: string, amount: number): string {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const num = parseInt(full.slice(0, 6), 16);
  if (Number.isNaN(num)) return hex;
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  const factor = 1 - amount / 100;
  r = Math.max(0, Math.round(r * factor));
  g = Math.max(0, Math.round(g * factor));
  b = Math.max(0, Math.round(b * factor));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const FALLBACK_HERO_COLOR = '#4e6207'; // used only if the SVG has no parseable background

function ProfileHero({
  avatarSvg,
  profileName,
  username,
  email,
  xp,
  onFriends,
  onSettings,
  scrollRef,
  contentRef,
  overscrollT,
  latchedRef,
}: {
  avatarSvg: string;
  profileName: string;
  username: string | null;
  email: string;
  xp: number;
  onFriends: () => void;
  onSettings: () => void;
  scrollRef: RefObject<HTMLDivElement | null>;
  /** The scrolling body below the header — follows the identity card exactly. */
  contentRef: RefObject<HTMLDivElement | null>;
  overscrollT: MutableRefObject<number>;
  /** true once the header has fully collapsed at least once (see useOverscrollHold). */
  latchedRef: MutableRefObject<boolean>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stretchRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const avatarInnerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardSurfaceRef = useRef<HTMLDivElement>(null);
  const titleLightRef = useRef<HTMLHeadingElement>(null);
  const titleDarkRef = useRef<HTMLHeadingElement>(null);
  const actionsLightRef = useRef<HTMLDivElement>(null);
  const actionsDarkRef = useRef<HTMLDivElement>(null);
  const captionsRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const handleRef = useRef<HTMLParagraphElement>(null);
  const emailRef = useRef<HTMLParagraphElement>(null);
  const xpRef = useRef<HTMLDivElement>(null);

  const initial = (profileName[0] || 'N').toUpperCase();

  const avatarBg = useMemo(
    () => extractAvatarBackground(avatarSvg) ?? FALLBACK_HERO_COLOR,
    [avatarSvg],
  );

  const heroColor = useMemo(() => darkenHex(avatarBg, 12), [avatarBg]);

  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  widthRef.current = width;

  // One function every animated property flows through.
  const apply = useCallback(() => {
    const scroller = scrollRef.current;
    const w = widthRef.current;
    if (!scroller || !w) return;

    const scrollTop = scroller.scrollTop;
    const rawScroll = clamp01(scrollTop / COLLAPSE_DISTANCE);
    if (rawScroll >= 1) latchedRef.current = true;
    const p = ease(rawScroll);
    // Past the collapse distance the header stops being pinned and simply
    // scrolls off the top with the rest of the page (no more overlap).
    if (stretchRef.current) {
      const away = Math.max(0, scrollTop - COLLAPSE_DISTANCE);
      stretchRef.current.style.transform =
        `translate3d(0, ${overscrollT.current - away}px, 0)`;
    }
    // How far the body itself has actually travelled — uses the REAL scrollTop
    // (not the latched value) so the latched-at-rest state doesn't shove the
    // content down by a scroll that never happened.
    const scrolled = Math.min(scrollTop, COLLAPSE_DISTANCE);

    // Hero surface — holds its colour, then clears late so the collapsed state
    // lands on a clean white header instead of a long muddy wash.
    if (heroRef.current) {
      heroRef.current.style.height = `${lerp(HERO_EXPANDED_HEIGHT, HERO_COLLAPSED_HEIGHT, p)}px`;
      heroRef.current.style.opacity = `${1 - clamp01((p - 0.3) / 0.6)}`;
    }
    if (dividerRef.current) dividerRef.current.style.opacity = `${clamp01(p * 2.5 - 1.5)}`;

    // Title + action icons cross-fade between the two treatments
    const light = 1 - clamp01(p * 2.2 - 0.5);
    const dark = clamp01(p * 2.2 - 1.2);
    if (titleLightRef.current) titleLightRef.current.style.opacity = `${light}`;
    if (titleDarkRef.current) titleDarkRef.current.style.opacity = `${dark}`;
    if (actionsLightRef.current) {
      actionsLightRef.current.style.opacity = `${light}`;
      actionsLightRef.current.style.pointerEvents = light > 0.5 ? 'auto' : 'none';
    }
    if (actionsDarkRef.current) {
      actionsDarkRef.current.style.opacity = `${dark}`;
      actionsDarkRef.current.style.pointerEvents = dark >= 0.5 ? 'auto' : 'none';
    }

    // Avatar: big centred portrait -> small chip pinned to the left. It runs on
    // its own, slightly faster curve (finishes at 62% of the collapse) so it is
    // already a chip by the time the identity card reaches the header — the two
    // never cross over each other.
    const pa = ease(clamp01(rawScroll / 0.62));
    if (avatarRef.current) {
      const s = avatarRef.current.style;
      s.top = `${lerp(AVATAR_EXPANDED_TOP, AVATAR_COLLAPSED_TOP, pa)}px`;
      s.left = `${lerp((w - AVATAR_EXPANDED_WIDTH) / 2, AVATAR_COLLAPSED_LEFT, pa)}px`;
      s.width = `${lerp(AVATAR_EXPANDED_WIDTH, AVATAR_COLLAPSED_SIZE, pa)}px`;
      s.height = `${lerp(AVATAR_EXPANDED_HEIGHT, AVATAR_COLLAPSED_SIZE, pa)}px`;
      s.borderRadius = `${lerp(AVATAR_EXPANDED_RADIUS, AVATAR_COLLAPSED_RADIUS, pa)}px`;
    }
    // Open Peeps characters are drawn centred-with-padding in their own viewBox,
    // so the portrait crop is a scale + slight downward nudge, easing back to a
    // plain fit as the chip takes over.
    if (avatarInnerRef.current) {
      // Always fit the whole character in the frame — no zoom crop, so the
      // full face (not just an eye) is visible at every collapse stage.
      const s = avatarInnerRef.current.style;
      s.width = '100%';
      s.height = '100%';
      s.transform = 'none';
    }

    // Identity card: rides up with the content, then parks beside the chip.
    // While the portrait is still wide enough to sit in the card's way, the
    // card's top is held just below it (weighted by how much they actually
    // overlap horizontally), so the card never cuts across the face — the hold
    // releases continuously as the portrait becomes a left-hand chip.
    const avatarLeft = lerp((w - AVATAR_EXPANDED_WIDTH) / 2, AVATAR_COLLAPSED_LEFT, pa);
    const avatarRight = avatarLeft + lerp(AVATAR_EXPANDED_WIDTH, AVATAR_COLLAPSED_SIZE, pa);
    const avatarBottom =
      lerp(AVATAR_EXPANDED_TOP, AVATAR_COLLAPSED_TOP, pa) +
      lerp(AVATAR_EXPANDED_HEIGHT, AVATAR_COLLAPSED_SIZE, pa);
    const cardLeft = lerp(CARD_EXPANDED_LEFT, CARD_COLLAPSED_LEFT, pa);
    const overlap = clamp01((avatarRight - cardLeft + 8) / 50);
    const cardBase = lerp(CARD_EXPANDED_TOP - scrolled, CARD_COLLAPSED_TOP, p);
    const cardTop = lerp(cardBase, Math.max(cardBase, avatarBottom + 14), overlap);
    const cardHeight = lerp(CARD_EXPANDED_HEIGHT, CARD_COLLAPSED_HEIGHT, p);
    // The identity card is only ever shown at the two rest states: fully
    // expanded (hero portrait + card below it) and fully collapsed (chip +
    // inline card). Everything in between hides it completely, so it can't
    // clip the portrait or bump into the achievements while it travels.
    const cardOpacity = Math.max(
      1 - clamp01((p - 0.1) / 0.15), // fades out just after the expanded rest
      clamp01((p - 0.82) / 0.14), // fades back in as the collapsed bar lands
    );
    if (cardRef.current) {
      const s = cardRef.current.style;
      s.top = `${cardTop}px`;
      s.left = `${cardLeft}px`;
      s.height = `${cardHeight}px`;
      s.padding = `${lerp(CARD_EXPANDED_PADDING, CARD_COLLAPSED_PADDING, p)}px`;
      s.opacity = `${cardOpacity}`;
      s.visibility = cardOpacity <= 0.01 ? 'hidden' : 'visible';
      s.pointerEvents = cardOpacity <= 0.5 ? 'none' : 'auto';
    }
    if (cardSurfaceRef.current) cardSurfaceRef.current.style.opacity = `${1 - p}`;
    if (captionsRef.current) {
      captionsRef.current.style.setProperty('--cap-h', `${lerp(15, 0, p)}px`);
      captionsRef.current.style.setProperty('--cap-o', `${clamp01(1 - p * 1.8)}`);
      captionsRef.current.style.setProperty('--gap', `${lerp(7, 1, p)}px`);
    }
    if (nameRef.current) {
      nameRef.current.style.fontSize = `${lerp(21, 15, p)}px`;
      nameRef.current.style.color = `color-mix(in srgb, #131927 ${p * 100}%, #4e6207)`;
    }
    if (handleRef.current) handleRef.current.style.fontSize = `${lerp(15, 13, p)}px`;
    if (emailRef.current) emailRef.current.style.fontSize = `${lerp(15, 12.5, p)}px`;
    if (xpRef.current) xpRef.current.style.fontSize = `${lerp(17, 13.5, p)}px`;

    // Body follows the card exactly, so the gap under it never opens up
    if (contentRef.current) {
      const shift = cardTop + cardHeight + 24 - CONTENT_TOP + scrolled;
      contentRef.current.style.transform = `translate3d(0, ${shift}px, 0)`;
    }
  }, [contentRef, scrollRef, latchedRef, overscrollT]);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        apply();
      });
    }

    // Runs continuously (not just on `scroll`) because native overscroll
    // rubber-banding happens outside the scrollable range, where `scroll`
    // events don't fire at all — and it's also what re-expands the header
    // after the hold gesture releases the latch.
    let raf: number;
    function loop() {
      apply();
      raf = requestAnimationFrame(loop);
    }

    scroller.addEventListener('scroll', onScroll, { passive: true });
    apply();
    raf = requestAnimationFrame(loop);
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [apply, scrollRef, overscrollT, width]);

  return (
    <div ref={wrapRef} className="sticky top-0 z-20 h-0">
      <div ref={stretchRef} className="absolute inset-x-0 top-0">
        {/* Hero surface (the avatar's own colour family), fades to the page */}
        <div
          ref={heroRef}
          className="absolute inset-x-0 top-0"
          style={{ height: HERO_EXPANDED_HEIGHT, background: heroColor }}
        >
          <div
            className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, transparent, ${heroColor})` }}
          />
        </div>

        <div
          ref={dividerRef}
          className="absolute inset-x-0 h-px bg-secondary opacity-0"
          style={{ top: 56 }}
        />

        {/* Title row — fixed in place, only the treatment cross-fades */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-4 z-30">
          <div className="relative">
            <h1 ref={titleLightRef} className="text-[21px] font-bold text-white">Profile</h1>
            <h1
              ref={titleDarkRef}
              className="absolute inset-0 text-[21px] font-bold text-foreground opacity-0"
            >
              Profile
            </h1>
          </div>
          <div className="relative">
            <div ref={actionsLightRef} className="flex items-center gap-2.5">
              <HeroIconButton label="Friends" tone="light" icon="users" onClick={onFriends} />
              <HeroIconButton label="Settings" tone="light" icon="settings" onClick={onSettings} />
            </div>
            <div
              ref={actionsDarkRef}
              className="absolute inset-0 flex items-center gap-2.5 opacity-0"
              style={{ pointerEvents: 'none' }}
            >
              <HeroIconButton label="Friends" tone="dark" icon="users" onClick={onFriends} />
              <HeroIconButton label="Settings" tone="dark" icon="settings" onClick={onSettings} />
            </div>
          </div>
        </div>

        {/* Avatar — sits ABOVE the identity card so the card slides underneath
            it mid-transition instead of cutting across it. */}
        <div
          ref={avatarRef}
          className="absolute z-20 overflow-hidden"
          style={{
            top: AVATAR_EXPANDED_TOP,
            width: AVATAR_EXPANDED_WIDTH,
            height: AVATAR_EXPANDED_HEIGHT,
            borderRadius: AVATAR_EXPANDED_RADIUS,
            background: heroColor,
          }}
        >
          <div
            className="relative w-full h-full flex items-center justify-center text-2xl font-bold text-foreground overflow-hidden"
            style={{ background: avatarBg }}
          >
            {avatarSvg ? (
              <div
                ref={avatarInnerRef}
                className="[&>svg]:block [&>svg]:w-full [&>svg]:h-full"
                style={{ width: '100%', height: '100%' }}
                dangerouslySetInnerHTML={{ __html: avatarSvg }}
              />
            ) : (
              initial
            )}
          </div>
        </div>

        {/* Identity card */}
        <div
          ref={cardRef}
          className="absolute z-10 overflow-hidden"
          style={{
            top: CARD_EXPANDED_TOP,
            left: CARD_EXPANDED_LEFT,
            right: 20,
            height: CARD_EXPANDED_HEIGHT,
            padding: CARD_EXPANDED_PADDING,
          }}
        >
          <div ref={cardSurfaceRef} className="absolute inset-0 rounded-2xl bg-accent" />
          <div
            ref={captionsRef}
            className="relative flex h-full flex-col justify-center [--cap-h:15px] [--cap-o:1] [--gap:7px]"
          >
            <p ref={nameRef} className="truncate font-bold leading-tight text-accent-foreground">
              {profileName}
            </p>
            <HeroCaption>name</HeroCaption>
            {username && (
              <>
                <p ref={handleRef} className="truncate font-semibold leading-tight text-primary">
                  @{username}
                </p>
                <HeroCaption>username</HeroCaption>
              </>
            )}
            <p ref={emailRef} className="truncate leading-tight text-primary">
              {email}
            </p>
            <HeroCaption>email</HeroCaption>
            <div
              ref={xpRef}
              className="flex items-center gap-1.5 font-bold text-primary"
              style={{ marginTop: 'var(--gap)' }}
            >
              <Zap size={15} className="shrink-0 fill-[#85a60c]" />
              <span>{xp} XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroCaption({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="overflow-hidden text-[11px] leading-[15px] text-muted-foreground"
      style={{ height: 'var(--cap-h)', opacity: 'var(--cap-o)', marginBottom: 'var(--gap)' }}
    >
      {children}
    </p>
  );
}

function HeroIconButton({
  label,
  tone,
  icon,
  onClick,
}: {
  label: string;
  tone: 'light' | 'dark';
  icon: 'users' | 'settings';
  onClick: () => void;
}) {
  const Icon = icon === 'users' ? Users : Settings;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full border ${
        tone === 'light' ? 'border-white/60 text-white' : 'border-border text-muted-foreground'
      }`}
    >
      <Icon size={17} />
    </button>
  );
}

// ─── Overscroll-hold gesture ──────────────────────────────────────────────────
// Reworked for the continuous-collapse model: this used to flip a `collapsed`
// boolean via setCollapsed(false). There's no boolean anymore — the header's
// position is driven entirely by scrollTop via ProfileHero's own effect. This
// hook's only job now is releasing latchedRef.current back to false; once
// that flips, ProfileHero's next tick() naturally computes p from the real
// (already-zero) scrollTop instead of pinning at 1, and the header re-expands
// on its own without this hook touching any DOM/style directly.
function useOverscrollHold(
  containerRef: RefObject<HTMLDivElement>,
  latchedRef: MutableRefObject<boolean>,
) {
  const overscrollT = useRef(0);
  const dragStartY = useRef<number | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const armed = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function clearHold() {
      if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
      armed.current = false;
    }

    function resetDrag() {
      dragStartY.current = null;
      overscrollT.current = 0;
      clearHold();
    }

    function onTouchStart(e: TouchEvent) {
      if (!latchedRef.current) return;
      if (el.scrollTop > 0) return;
      dragStartY.current = e.touches[0].clientY;
    }

    function onTouchMove(e: TouchEvent) {
      if (!latchedRef.current || dragStartY.current == null) return;
      if (el.scrollTop > 0) { resetDrag(); return; }

      const dy = e.touches[0].clientY - dragStartY.current;
      if (dy <= 0) {
        overscrollT.current = 0;
        clearHold();
        return;
      }

      const clamped = Math.min(dy, OVERSCROLL_MAX_DRAG);
      overscrollT.current = (clamped / OVERSCROLL_MAX_DRAG) * OVERSCROLL_STRETCH_CAP;

      if (dy >= OVERSCROLL_TRIGGER_DRAG && !armed.current) {
        armed.current = true;
        holdTimer.current = setTimeout(() => {
          latchedRef.current = false;
          resetDrag();
        }, OVERSCROLL_HOLD_MS);
      } else if (dy < OVERSCROLL_TRIGGER_DRAG && armed.current) {
        clearHold();
      }
    }

    function onTouchEnd() {
      resetDrag();
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      clearHold();
    };
  }, [containerRef, latchedRef]);

  return overscrollT;
}

// ─── Profile tab helper components ───────────────────────────────────────────

function ProfileMarqueeText({ text, className = '' }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const c = containerRef.current, t = textRef.current;
    if (c && t) setOverflows(t.scrollWidth > c.clientWidth + 2);
  }, [text]);
  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap ${className}`}>
      <span ref={textRef} className="inline-block" style={overflows ? { animation: 'pmarquee 5s linear infinite' } : {}}>
        {text}{overflows ? '    ' + text : ''}
      </span>
      {overflows && <style>{`@keyframes pmarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>}
    </div>
  );
}

function ProfileCircularProgress({ pct }: { pct: number }) {
  const r = 44, circ = 2 * Math.PI * r;
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(pct), 80); return () => clearTimeout(t); }, [pct]);
  return (
    <div className="relative flex items-center justify-center" style={{ width: 110, height: 110 }}>
      <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="55" cy="55" r={r} fill="none" stroke="#e5e7ea" strokeWidth="8" />
        <circle cx="55" cy="55" r={r} fill="none" stroke="#8cb200" strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={circ - (anim / 100) * circ}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[22px] font-bold text-foreground">{pct}%</span>
      </div>
    </div>
  );
}

function ProfilePhaseBars({ completed, total = 4 }: { completed: number; total?: number }) {
  return (
    <div className="flex items-end gap-[3px]">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="rounded-[2px]"
          style={{ width: 5, height: 6 + i * 4, background: i < completed ? '#131313' : '#d1d5db' }} />
      ))}
    </div>
  );
}

const PROFILE_LEVEL_NAMES = ['Navigator','Apprentice','Scholar','Expert','Master','Legend'];
const PROFILE_DAILY_GOAL = 200;

function ProfileLevelBar({ intoLevel, toNext, level, pct }: { intoLevel: number; toNext: number; level: number; pct: number }) {
  const [animPct, setAnimPct] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimPct(pct), 80); return () => clearTimeout(t); }, [pct]);
  const levelName = PROFILE_LEVEL_NAMES[Math.min(level - 1, PROFILE_LEVEL_NAMES.length - 1)];
  return (
    <div className="bg-accent rounded-[16px] px-4 py-3 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[18px] font-medium text-accent-foreground">Level {level} · {levelName}</span>
        <span className="text-[12px] text-primary">{intoLevel} / {XP_PER_LEVEL} XP</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="relative bg-secondary rounded-full" style={{ height: 10 }}>
          <div className="absolute h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${animPct}%` }} />
          {animPct > 0 && (
            <span className="absolute -translate-y-1/2 bg-primary text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
              style={{ left: `${Math.max(4, Math.min(animPct - 6, 82))}%`, top: '50%' }}>
              {Math.round(animPct)}%
            </span>
          )}
        </div>
        <span className="text-[11px] text-primary">{toNext} XP to Level {level + 1}</span>
      </div>
    </div>
  );
}

function ProfileProSkillBadge({ userId }: { userId: string }) {
  const loadSkill = () => { try { return localStorage.getItem(`pro_skill_${userId}`) ?? ''; } catch { return ''; } };
  const [skill, setSkill] = useState(() => userId === 'dev-bypass' ? 'Web Development' : loadSkill());
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(skill);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);
  function commit() {
    const v = draft.trim(); setSkill(v);
    if (userId !== 'dev-bypass') try { localStorage.setItem(`pro_skill_${userId}`, v); } catch {}
    setEditing(false);
  }
  if (editing) return (
    <form onSubmit={e => { e.preventDefault(); commit(); }} className="flex items-center">
      <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
        className="text-[13px] font-semibold border border-primary rounded-[10px] px-2 py-0.5 outline-none bg-accent text-foreground"
        placeholder="Your pro skill" maxLength={30} style={{ width: 140 }} />
    </form>
  );
  return (
    <button onClick={() => { setDraft(skill); setEditing(true); }}
      className="flex items-center gap-1 bg-accent px-3 py-[3px] rounded-[12px] shrink-0">
      {skill
        ? <span className="text-[14px] font-semibold text-foreground">{skill}</span>
        : <span className="text-[13px] text-muted-foreground">Set PRO Skill</span>}
      <Edit2 size={10} className="text-primary shrink-0" />
    </button>
  );
}

function ProfileWeekStrip({ recentStreakDays: rsd, streakStatus: ss }: {
  recentStreakDays: Record<string, string> | null;
  streakStatus: import('../lib/context').StreakStatus | null;
}) {
  const days = useMemo(() => {
    const today = new Date();
    const dow = (today.getDay() + 6) % 7; // 0=Mon
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - dow);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
      const key = localDateStr(d);
      return { label: ['Mo','Tu','We','Th','Fr','Sa','Su'][i], key, status: rsd?.[key] ?? null };
    });
  }, [rsd]);

  return (
    <div className="flex items-start justify-between w-full">
      {days.map(({ label, key, status }) => {
        const done = status === 'completed';
        const isToday = localDateStr(new Date()) === key;
        return (
          <div key={key} className="flex flex-col items-center gap-1">
            <div className={`flex items-center justify-center rounded-[10px] p-2
              ${done ? 'bg-primary' : isToday ? 'bg-secondary border border-primary' : 'bg-card'}`}
              style={{ width: 40, height: 40 }}>
              <Check size={18} className={done ? 'text-white' : 'text-muted-foreground'} strokeWidth={done ? 3 : 2} />
            </div>
            <span className={`text-[13px] font-semibold ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// chartTodayXp = actual accumulated XP for today's chart dot (shows progress even before
// the daily goal is hit). todayXp = used only for the goal progress bar (stays 0 until complete).
function ProfileXPChart({ recentStreakDays: rsd, todayXp, chartTodayXp, weekTotal }: {
  recentStreakDays: Record<string, string> | null;
  todayXp: number;
  chartTodayXp: number;
  weekTotal: number;
}) {
  const uid = useId().replace(/:/g, '');
  const gradId = `profXpGrad_${uid}`;
  const data = useMemo(() => {
    const today = new Date();
    const dow = (today.getDay() + 6) % 7;
    const weekStart = new Date(today); weekStart.setDate(today.getDate() - dow);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
      const key = localDateStr(d);
      const isToday = localDateStr(today) === key;
      const status = rsd?.[key] ?? null;
      let xp = 0;
      if (isToday) xp = Math.min(300, chartTodayXp);
      else if (status === 'completed') xp = PROFILE_DAILY_GOAL;
      else if (status === 'grace') xp = Math.round(PROFILE_DAILY_GOAL * 0.4);
      return { day: ['Mo','Tu','We','Th','Fr','Sa','Su'][i], xp };
    });
  }, [rsd, chartTodayXp]);

  const Y_MAX = 250;
  const Y_TICKS = [0, 50, 100, 150, 200, 250];
  const todayPct = Math.min(100, Math.round((todayXp / PROFILE_DAILY_GOAL) * 100));

  return (
    <div className="bg-card rounded-[15px] p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[20px] font-bold text-muted-foreground">XP Progress</span>
        <span className="text-[14px] font-semibold text-primary">Total: {weekTotal}XP</span>
      </div>
      {/* Daily goal */}
      <div className="flex items-center gap-3 mb-5">
        <Zap size={36} className="text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-[14px] font-medium text-muted-foreground mb-1">Daily Goal</p>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 bg-secondary rounded-full overflow-hidden" style={{ height: 8, maxWidth: 134 }}>
              <div className="absolute h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${todayPct}%` }} />
              {todayPct > 0 && (
                <span className="absolute -translate-y-1/2 -translate-x-1/2 bg-primary text-white text-[7px] font-bold px-1 py-0.5 rounded"
                  style={{ left: `${Math.min(todayPct, 90)}%`, top: '50%' }}>{todayPct}%</span>
              )}
            </div>
            <span className="text-[13px] text-muted-foreground whitespace-nowrap">{todayXp}/{PROFILE_DAILY_GOAL} XP</span>
          </div>
        </div>
      </div>
      {/* Chart */}
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs key="xp-chart-defs">
              <linearGradient key={gradId} id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8cb200" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#8cb200" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid key="grid" strokeDasharray="4 2" stroke="#dedede" strokeOpacity={0.5} vertical={false} />
            <XAxis key="xaxis" dataKey="day" tick={{ fontSize: 12, fill: '#cccac9' }} axisLine={false} tickLine={false} />
            <YAxis key="yaxis" domain={[0, Y_MAX]} ticks={Y_TICKS} tick={{ fontSize: 11, fill: '#cccac9' }} axisLine={false} tickLine={false} width={40} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7ea' }}
              formatter={(v: number) => [`${v} XP`, 'XP']} />
            <Area type="monotone" dataKey="xp" stroke="#8cb200" fill={`url(#${gradId})`} strokeWidth={2}
              dot={{ fill: '#fff', stroke: '#8cb200', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 5, fill: '#8cb200' }}
              isAnimationActive animationDuration={900} animationEasing="ease-out" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ProfileRoadmapTabs({
  roadmaps, selectedIdx, onSelect,
}: { roadmaps: RoadmapEntry[]; selectedIdx: number; onSelect: (i: number) => void }) {
  return (
    <div className="relative overflow-x-auto scrollbar-hide">
      {/* Gray baseline line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-secondary" />
      <div className="flex min-w-max">
        {roadmaps.map((r, i) => {
          const active = i === selectedIdx;
          return (
            <button key={r.id} onClick={() => onSelect(i)}
              className="relative shrink-0 px-4 py-3 rounded-tl-[12px] rounded-tr-[12px] text-[16px] font-medium transition-colors text-left overflow-hidden"
              style={{ maxWidth: 130, minWidth: 90,
                background: active ? '#f9ffe5' : '#fff',
                color: '#131313' }}>
              {/* Active bottom border overrides gray line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: active ? '#8cb200' : '#f2f2f2' }} />
              <ProfileMarqueeText text={r.roadmap.skill || `Roadmap ${i + 1}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProfileRoadmapDetail({ entry, streakDays }: { entry: RoadmapEntry; streakDays: number }) {
  const phases = entry.roadmap.phases ?? [];
  const allSteps = phases.flatMap(p => p.steps);
  const total = allSteps.length;
  const completed = allSteps.filter(s => entry.progress[s.id]).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const xpEarned = completed * XP_PER_STEP;
  const phasesCompleted = phases.filter(p => p.steps.length > 0 && p.steps.every(s => entry.progress[s.id])).length;
  const typeLabel = (entry.roadmap as RoadmapEntry['roadmap'] & { ytCreator?: string }).ytCreator
    ? 'YouTube Roadmap' : entry.roadmap.mode === 'sprint' ? 'Sprint' : 'Full Roadmap';
  const achievements = useMemo(
    () => computeAchievements(entry.roadmap, entry.progress, streakDays),
    [entry.roadmap, entry.progress, streakDays]
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Type + steps */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
            <Play size={12} className="text-white" fill="white" />
          </div>
          <span className="text-[14px] font-medium text-foreground">{typeLabel}</span>
        </div>
        <span className="text-[13px] text-muted-foreground">— {total} Steps</span>
      </div>

      {/* Circular progress */}
      <div className="flex flex-col items-center gap-1">
        <ProfileCircularProgress pct={pct} />
        <span className="text-[13px] text-muted-foreground font-medium">Roadmap Progress</span>
      </div>

      {/* Info cards */}
      <div className="flex gap-3 items-stretch">
        <div className="flex-1 bg-card rounded-[12px] flex flex-col items-center gap-2 py-3 px-2">
          <ProfilePhaseBars completed={phasesCompleted} />
          <span className="text-[13px] text-foreground text-center leading-tight">
            {phasesCompleted} Phase{phasesCompleted !== 1 ? 's' : ''} Completed
          </span>
        </div>
        <div className="w-[2px] bg-secondary rounded-full self-stretch shrink-0" />
        <div className="flex-1 bg-card rounded-[12px] flex flex-col items-center gap-2 py-3 px-2">
          <Zap size={20} className="text-foreground" />
          <span className="text-[13px] text-foreground text-center leading-tight">{xpEarned} XP Earned</span>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[16px] font-normal text-muted-foreground">Achievement</span>
          <div className="text-[16px] font-normal text-muted-foreground overflow-hidden" style={{ maxWidth: 140 }}>
            <ProfileMarqueeText text={entry.roadmap.skill || 'Roadmap'} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map(a => <AchievementBadge key={a.id} a={a} />)}
        </div>
      </div>
    </div>
  );
}

function ProfileView({ entry, onGoRoadmap }: { entry: RoadmapEntry; onGoRoadmap: () => void }) {
  const navigate = useNavigate();
  const {
    state, user, avatarSvg, username, currentStreak, quizXp, recentStreakDays, streakStatus, pinRoadmap,
  } = useApp()!;

  const roadmap = entry.roadmap;
  const allSteps = roadmap.phases.flatMap(p => p.steps);
  const completedCount = allSteps.filter(s => entry.progress[s.id]).length;
  const streak = currentStreak ?? 0;

  const { current: unlock, dismiss } = useAchievementUnlocks(entry.id,
    useMemo(() => computeAchievements(roadmap, entry.progress, streak), [roadmap, entry.progress, streak])
  );

  const realRoadmaps = sortedRoadmaps(state.roadmaps).filter(r => !r.preview);
  const [selectedRoadmapIdx, setSelectedRoadmapIdx] = useState(() => {
    const i = realRoadmaps.findIndex(r => r.id === entry.id);
    return i >= 0 ? i : 0;
  });

  const selectedEntry = realRoadmaps[Math.min(selectedRoadmapIdx, realRoadmaps.length - 1)] ?? entry;

  // Total completed steps across ALL roadmaps — used for level and XP so that
  // completing steps in any roadmap advances the user's account-level progress,
  // not just the currently-pinned one (which is what the old per-entry count did).
  const totalCompletedCount = useMemo(
    () => realRoadmaps.reduce((sum, r) => {
      const steps = r.roadmap.phases.flatMap(p => p.steps);
      return sum + steps.filter(s => r.progress[s.id]).length;
    }, 0),
    [realRoadmaps],
  );

  const { level, intoLevel, toNext, pct } = xpModel(totalCompletedCount, quizXp);

  const todayXp = (() => {
    const key = localDateStr(new Date());
    return recentStreakDays?.[key] === 'completed'
      ? Math.min(PROFILE_DAILY_GOAL, quizXp + totalCompletedCount * XP_PER_STEP)
      : 0;
  })();
  const weekTotal = quizXp + totalCompletedCount * XP_PER_STEP;

  const displayName = user?.name || username || 'You';
  const initial = displayName.slice(0, 1).toUpperCase();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollRef} className="flex flex-col h-full overflow-y-auto scrollbar-hide">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 shrink-0 flex items-center justify-between">
        <span className="text-[20px] font-medium text-foreground" style={{ fontWeight: 510 }}>Profile</span>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/friends')}
            className="w-9 h-9 bg-background rounded-[12px] flex items-center justify-center">
            <UserPlus size={18} className="text-foreground" />
          </button>
          <button onClick={() => navigate('/settings')}
            className="w-9 h-9 bg-background rounded-[12px] flex items-center justify-center">
            <Settings size={18} className="text-foreground" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-4 pb-8 [&>*]:shrink-0">

        {/* ── Avatar + PRO SKILL ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-[65px] h-[65px] rounded-full bg-[#F7D67C] flex items-center justify-center overflow-hidden shrink-0">
              {avatarSvg ? (
                <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                  dangerouslySetInnerHTML={{ __html: avatarSvg }} />
              ) : (
                <span className="text-[26px] font-bold text-foreground">{initial}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-medium text-foreground">{displayName}</span>
              <span className="text-[14px] text-primary">@{username || displayName.toLowerCase()}</span>
            </div>
          </div>
          <ProfileProSkillBadge userId={user?.id ?? 'anon'} />
        </div>

        {/* Divider */}
        <div className="bg-secondary h-[2px] w-full" />

        {/* ── Level bar ── */}
        <ProfileLevelBar intoLevel={intoLevel} toNext={toNext} level={level} pct={pct} />

        {/* ── Streak ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[20px] font-medium text-foreground" style={{ fontWeight: 510 }}>Streak</span>
            <div className="flex items-center gap-1.5">
              <div className="bg-background rounded-[12px] p-2">
                <Flame size={20} className="text-foreground" />
              </div>
              <span className="text-[20px] font-medium text-foreground">{streak}</span>
            </div>
          </div>
          {/* Streak bar — #f9ffe5 card with decorative pattern + week strip */}
          <div className="bg-accent rounded-[12px] relative overflow-hidden" style={{ height: 112 }}>
            <DesignStreakPattern />
            <div className="absolute inset-0 flex items-center px-4">
              <WeekCheckStrip
                recentStreakDays={recentStreakDays}
                freezeActiveToday={!!streakStatus?.freezeActiveToday}
              />
            </div>
          </div>
        </div>

        {/* ── XP Progress chart ── */}
        <ProfileXPChart
          recentStreakDays={recentStreakDays}
          todayXp={todayXp}
          chartTodayXp={Math.min(300, totalCompletedCount * XP_PER_STEP + quizXp)}
          weekTotal={weekTotal}
        />

        {/* ── Roadmaps section ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[20px] font-medium text-foreground" style={{ fontWeight: 510 }}>Roadmaps</span>
            <span className="text-[20px] font-medium text-primary">{realRoadmaps.length}</span>
          </div>
          {realRoadmaps.length > 0 ? (
            <>
              <ProfileRoadmapTabs roadmaps={realRoadmaps} selectedIdx={selectedRoadmapIdx} onSelect={i => {
                setSelectedRoadmapIdx(i);
                if (realRoadmaps[i]?.id !== entry.id) pinRoadmap(realRoadmaps[i].id);
              }} />
              <div className="bg-background rounded-[16px] p-4">
                <ProfileRoadmapDetail entry={selectedEntry} streakDays={streak} />
              </div>
            </>
          ) : (
            <p className="text-[14px] text-muted-foreground">No roadmaps yet — create one from the Roadmap tab.</p>
          )}
        </div>

        {/* ── Friends ── */}
        <FriendsPreviewRow />

        {/* ── YouTube link ── */}
        <PasteYouTube />
      </div>

      {unlock && <AchievementUnlock a={unlock} onDismiss={dismiss} />}
    </div>
  );
}

function PasteYouTube() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const valid = isYouTube(url.trim());

  function watch() {
    if (!valid) return;
    navigate(`/watch?url=${encodeURIComponent(url.trim())}&title=${encodeURIComponent('Pasted video')}`);
  }

  return (
    <div className="bg-card rounded-[16px] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Play size={15} className="text-primary" />
        <p className="text-[16px] font-medium text-foreground">Paste YouTube Video Link</p>
      </div>
      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="https://youtube.com/watch?v=…"
        className="w-full h-11 px-3.5 text-sm bg-background rounded-[16px] focus:outline-none mb-2 text-foreground placeholder-[rgba(19,25,39,0.5)]"
      />
      <p className="text-[13px] text-muted-foreground mb-3">Videos with captions/transcripts work best.</p>
      <button
        onClick={watch}
        disabled={!valid}
        className="w-full h-11 rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-2 bg-primary text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#7aa000]"
      >
        <Play size={14} fill="#131927" /> Watch Video
      </button>
    </div>
  );
}

// ─── Inspire tab ──────────────────────────────────────────────────────────────
//
// STATUS (as of this edit): youtube-shorts-search has been deleted — see
// INSPIRE_SHORTS_REMOVAL_HANDOFF.md for why (repeated production 502s
// across four debugging rounds, root cause never fully confirmed against
// real deploy logs, cut because Shorts discovery isn't core to Navigator).
// Tiers 1/2 (skill-based + related-skill Shorts search) are removed along
// with it. The feed currently runs on tier 3 ONLY: discover[]-based
// fallback, resolved via the shared resolveVideoUrl -> youtube-search path
// (same resolver ResourceActions' "Watch Video" pill uses). This is a
// TEMPORARY state, not the final design — a youtube-search-based
// replacement for tiers 1/2 is planned but not yet built. Do not assume
// "discover-only" is the intended end state if you're reading this later;
// check whether that replacement landed before treating this comment as
// current.
//
// No orientation filtering anywhere in this feed anymore (explicit product
// decision): a landscape video is allowed and renders letterboxed inside
// the vertical feed frame rather than being filtered out. "Some video"
// beats "no video," and Shorts-only orientation is no longer a requirement.
//
// If a user has zero roadmaps at all, there is nothing to build tier 3 from
// (no discover[] to fall back to) — this shows the same empty state Main()
// already shows for the no-roadmaps case (state.roadmaps.length === 0), so
// InspireView doesn't need its own separate empty state for that specific
// situation.
//
// CONTROLS — unchanged from the Shorts-era version: no fullscreen toggle,
// no +/-5s skip buttons, no time readout. Just tap-anywhere play/pause and
// one-way tap-to-unmute, closer to real Shorts/TikTok. The tap-capture
// layer is still required even with fewer buttons — it's not a workaround
// for a specific control, it's the fix for YouTube's cross-origin iframe
// swallowing clicks before they ever reach this component (see
// FeedPlayerCard's own comment).

// ── Shared YouTube IFrame API loader (queue, not single-callback) ──────────
// UNCHANGED from the previous version — still needed for the same reason
// (a feed mounts several player instances close together; Watch.tsx's
// single-callback assumption doesn't hold here).
const ytReadyQueue: Array<() => void> = [];
function loadYouTubeIframeApi(onReady: () => void) {
  if (window.YT?.Player) {
    onReady();
    return;
  }
  ytReadyQueue.push(onReady);
  if (!document.getElementById('yt-iframe-api')) {
    const tag = document.createElement('script');
    tag.id = 'yt-iframe-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }
  const existing: (() => void) | undefined = window.onYouTubeIframeAPIReady;
  if (!existing) {
    window.onYouTubeIframeAPIReady = () => {
      while (ytReadyQueue.length) ytReadyQueue.shift()?.();
    };
  }
}

// UNCHANGED — still needed for the tier-3 discover[] fallback path, which
// still resolves via resolveVideoUrl and gets back a URL, not a bare ID.
// Tier 1/2 (youtube-shorts-search) returns a bare videoId directly, so this
// isn't needed on that path at all.
function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1) || null;
    if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2] || null;
    if (u.searchParams.has('v')) return u.searchParams.get('v');
    return null;
  } catch {
    return null;
  }
}

// Shape for tier-3's discover[]-fallback pool, BEFORE resolution — this is
// the same unresolved-search-query shape the old feed used exclusively.
// Kept only for that fallback tier now; tiers 1/2 never produce this shape
// since youtube-shorts-search returns already-resolved video IDs directly.
interface InspireCard {
  key: string;
  title: string;
  url: string; // unresolved discover[] search-query URL
}

interface ShortsCard {
  key: string;
  videoId: string;
  title: string;
  channel: string | null;
  source: 'shorts' | 'discover'; // which tier this came from, for debugging/telemetry only
}

function fmtChannel(channel: string | null): string {
  return channel ?? '';
}

// ── One feed slot: mounts/destroys its own player ──────────────────────────
// Simplified from the previous version per explicit product decision: no
// fullscreen, no skip buttons, no time readout, no cardWrapperRef (that ref
// existed solely for the fullscreen target, which no longer exists here).
// `active` = this is the currently-centered card (should be playing).
// `shouldMount` = within the prefetch window (current + next 1, unchanged).
function FeedPlayerCard({
  card,
  active,
  shouldMount,
  registerRef,
  onReload,
}: {
  card: ShortsCard;
  active: boolean;
  shouldMount: boolean;
  registerRef: (el: HTMLDivElement | null) => void;
  onReload: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayerLike | null>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Paused-progress readout ("1:32 / 4:07" + tap-to-seek bar). Only
  // snapshotted at the moments playback actually stops (see the two
  // snapshotPlaybackTime() call sites below) — polling on an interval would
  // be pointless work for a number that isn't changing while paused.
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reads current position + duration from the live player into state.
  // Called on every pause (both the `active`-driven auto-pause below and
  // handleTap's manual pause) and after every seek, so the readout never
  // shows a stale number. NOTE: if a future pause path gets added (e.g.
  // auto-pause on some other trigger), it needs to call this too — nothing
  // enforces that mechanically.
  function snapshotPlaybackTime() {
    const player = playerRef.current;
    if (!player?.getCurrentTime) return;
    const t = player.getCurrentTime();
    if (typeof t === 'number') setCurrentTime(t);
    const d = player.getDuration?.();
    if (typeof d === 'number' && d > 0) setDuration(d);
  }

  // requestFullscreen() is a Promise that silently rejects on a number of
  // real-world conditions this component can't control from here: not
  // called from a direct user gesture, the surrounding iframe (Figma Make
  // preview) missing `allow="fullscreen"`, or an OS/browser permission
  // policy block. Without listening for the actual DOM event, the icon
  // (and this component generally) has no way to know a tap "did nothing"
  // vs. "worked, then the user pressed Esc a second later" — both look
  // identical from inside handleFullscreen alone. document.fullscreenElement
  // is the source of truth; this only tracks whether THIS card's own
  // wrapper is the fullscreen element, so a different card (or nothing)
  // being fullscreen correctly reads as false here.
  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current?.parentElement);
    }
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Mount/destroy the actual YT.Player as shouldMount toggles. card.videoId
  // is already a real, confirmed ID by the time this component sees it
  // (tiers 1/2 return one directly; tier 3 has already run
  // extractYouTubeId before constructing the card) — there is no separate
  // "resolve the query" effect here anymore, unlike the previous version,
  // because resolution now happens once, up front, when the card list is
  // built, not lazily per-card on mount.
  useEffect(() => {
    if (!shouldMount || !containerRef.current) return;
    let cancelled = false;

    // Resume from wherever this card was last left, per
    // lastPlaybackPositionCache's own header comment above (module-scope,
    // keyed on card.key, session-only). A missing entry (first-ever mount
    // of this card) falls through to undefined -> YouTube's own default of
    // starting at 0, so no separate "first play" branch is needed.
    const resumeAt = lastPlaybackPositionCache.get(card.key);

    loadYouTubeIframeApi(() => {
      if (cancelled || !containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: card.videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          controls: 0, rel: 0, modestbranding: 1, playsinline: 1,
          iv_load_policy: 3, disablekb: 1, fs: 0, loop: 1,
          playlist: card.videoId,
          mute: 1, // always boot muted — autoplay-with-sound is blocked without a prior gesture
          origin: window.location.origin,
          ...(resumeAt ? { start: Math.floor(resumeAt) } : {}),
        },
        events: {
          onReady: () => setReady(true),
        },
      });
    });

    return () => {
      cancelled = true;
      // Must read getCurrentTime() BEFORE destroy() — once the player is
      // torn down there's nothing left to ask. This fires on every
      // shouldMount:true->false transition (card leaves the prefetch
      // window) AND on unmount (tab switch away from Inspire, since
      // Main() conditionally renders InspireView rather than hiding it),
      // which is the exact case this cache exists to survive.
      const seconds = playerRef.current?.getCurrentTime?.();
      if (typeof seconds === 'number' && seconds > 0) {
        lastPlaybackPositionCache.set(card.key, seconds);
      }
      playerRef.current?.destroy?.();
      playerRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldMount, card.videoId]);

  // Play/pause follows `active`, independent of mount timing.
  useEffect(() => {
    if (!ready || !playerRef.current) return;
    if (active) {
      playerRef.current.playVideo?.();
      setPlaying(true);
    } else {
      playerRef.current.pauseVideo?.();
      snapshotPlaybackTime();
    }
  }, [active, ready]);

  useEffect(() => {
    if (!ready || !playerRef.current) return;
    if (muted) playerRef.current.mute?.();
    else playerRef.current.unMute?.();
  }, [muted, ready]);

  // Tap-anywhere handles BOTH unmute (one-way, per product decision — same
  // as before) AND play/pause toggle now, since there's no longer a
  // dedicated center button. First tap while muted: unmutes AND toggles
  // play state, matching real Shorts/TikTok's tap-anywhere convention
  // exactly (a single gesture does both jobs there too).
  function handleTap() {
    if (muted) setMuted(false);
    if (!playerRef.current) return;
    if (playing) {
      playerRef.current.pauseVideo?.();
      snapshotPlaybackTime();
    } else {
      playerRef.current.playVideo?.();
    }
    setPlaying(p => !p);
  }

  // Native share sheet with the plain YouTube watch URL. navigator.share is
  // unavailable in some in-app/webview browsers, so falls back to clipboard
  // copy rather than silently failing — this.card.videoId is always a real
  // resolved ID by the time FeedPlayerCard renders it (see the mount-effect
  // comment above), so no extra validation needed here.
  async function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    const url = `https://youtube.com/watch?v=${card.videoId}`;
    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {
        // User cancelled the share sheet, or the call rejected for a
        // platform reason — either way there's nothing to recover, this
        // isn't an error state worth surfacing.
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // Clipboard API can also be blocked in some webviews; there's no
        // further fallback worth building for this edge of an edge case.
      }
    }
  }

  // Fullscreens the card's own container (not the iframe directly — the
  // iframe is cross-origin, so calling requestFullscreen on it isn't
  // reliably controllable from here anyway, and fullscreening the
  // container keeps our own overlay UI visible on top of the video).
  // Toggles: exits if this card is already fullscreen, requests otherwise
  // — without this, the only way out was a system-level Esc/back gesture
  // with no in-UI affordance at all. The .catch is deliberate, not
  // decorative: a rejected requestFullscreen() (most commonly a sandboxed
  // iframe missing `allow="fullscreen"`, which is exactly the Figma Make
  // preview environment this app runs in) previously failed with zero
  // signal — tap did nothing, no error, no state change. Logged rather
  // than surfaced via toast for now, same silent-but-at-least-debuggable
  // treatment as handleShare's failure paths already get.
  function handleFullscreen(e: React.MouseEvent) {
    e.stopPropagation();
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
      return;
    }
    containerRef.current?.parentElement?.requestFullscreen?.().catch((err: unknown) => {
      console.error('[Inspire] requestFullscreen rejected — likely missing allow="fullscreen" on the embedding iframe:', err);
    });
  }

  function handleReloadClick(e: React.MouseEvent) {
    e.stopPropagation();
    onReload();
  }

  // ±5s skip. Clamps the lower bound to 0 so rewinding near the start
  // doesn't send a negative time to seekTo (undefined behavior on
  // YouTube's end). Upper bound is clamped to getDuration() when the API
  // exposes it; if it doesn't (older iframe API versions can omit it
  // before onReady settles fully), we skip the upper clamp entirely and
  // let YouTube's own seekTo handle an out-of-range value rather than
  // guessing a duration — same "don't invent a number" logic as the
  // resumeAt fallback above.
  function handleSeek(delta: number, e: React.MouseEvent) {
    e.stopPropagation();
    const player = playerRef.current;
    if (!player?.getCurrentTime || !player.seekTo) return;
    const current = player.getCurrentTime();
    let target = current + delta;
    if (target < 0) target = 0;
    const dur = player.getDuration?.();
    if (typeof dur === 'number' && dur > 0 && target > dur) {
      target = dur;
    }
    player.seekTo(target, true);
    setCurrentTime(target);
  }

  // Tap-to-seek on the progress bar itself. Computes the target fraction
  // from where the tap landed relative to the bar's own width — same
  // stopPropagation requirement as every other overlay control, so tapping
  // the bar doesn't also toggle play/pause via the outer div's onClick.
  function handleBarSeek(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const player = playerRef.current;
    if (!player?.seekTo || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const target = fraction * duration;
    player.seekTo(target, true);
    setCurrentTime(target);
  }

  return (
    <div
      ref={registerRef}
      data-card-key={card.key}
      className="relative w-full h-full snap-start shrink-0 bg-black overflow-hidden"
    >
      <div ref={containerRef} className="absolute inset-0" />

      {/* Loading state */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#131313] pointer-events-none">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Tap-capture layer — still required even with fewer controls. The
          embedded iframe renders its own native overlay UI (title, channel
          avatar, YouTube logo) INSIDE its own cross-origin document, which a
          parent page can never intercept clicks on by design. This full-size
          div sits above the iframe so every tap lands here first. */}
      {ready && (
        <div className="absolute inset-0" onClick={handleTap}>
          {/* Center transport row, shown paused-only (same condition as
              before) — replaces the old solo play icon with a real
              back-5s / play / forward-5s row, per the reference screenshot
              (three buttons, center of screen, not stacked on the right
              edge like Share/Reload/Fullscreen). The center play element
              is still just visual feedback, not its own tap target beyond
              what handleTap already covers on the outer layer — but the
              two skip buttons DO need their own stopPropagation, same as
              every other overlay button, so tapping them doesn't also
              toggle play/pause via the outer div's onClick. */}
          {!playing && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-5">
              <button
                onClick={(e) => handleSeek(-5, e)}
                aria-label="Back 5 seconds"
                className="w-11 h-11 rounded-full bg-black/40 flex items-center justify-center"
              >
                <SkipBack size={19} className="text-white" />
              </button>
              <div className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center pointer-events-none">
                <Play size={22} className="text-white ml-0.5" fill="white" />
              </div>
              <button
                onClick={(e) => handleSeek(5, e)}
                aria-label="Forward 5 seconds"
                className="w-11 h-11 rounded-full bg-black/40 flex items-center justify-center"
              >
                <SkipForward size={19} className="text-white" />
              </button>
            </div>
          )}

          {/* Share / Reload / Fullscreen column — right edge, paused-only,
              per the confirmed decision (not always-visible), WITH ONE
              EXCEPTION: also shown while this card is the fullscreen
              element, regardless of play state. Without that exception,
              tapping Fullscreen while playing hides the only in-UI way to
              exit the instant the column's own !playing condition goes
              false again — trapping the user with nothing but a system
              Esc/back gesture to get out. Reload here is the SAME action
              as the tab-level "start over": it clears the module-level
              Inspire cache and re-fetches the whole feed, not just this
              one video — see onReload/handleReload in InspireView. Each
              button stops propagation so tapping an icon doesn't also
              fall through to handleTap's play/pause toggle. */}
          {(!playing || isFullscreen) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
              <button
                onClick={handleShare}
                aria-label="Share"
                className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center"
              >
                <Share2 size={17} className="text-white" />
              </button>
              <button
                onClick={handleReloadClick}
                aria-label="Reload feed"
                className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center"
              >
                <RotateCw size={17} className="text-white" />
              </button>
              <button
                onClick={handleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center"
              >
                {isFullscreen
                  ? <Minimize size={17} className="text-white" />
                  : <Maximize size={17} className="text-white" />}
              </button>
            </div>
          )}

          {muted && (
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center pointer-events-none">
              <VolumeX size={15} className="text-white" />
            </div>
          )}

          {/* Paused-progress readout: elapsed/duration + tap-to-seek bar.
              Gated on duration > 0 specifically (not just !playing) because
              getDuration() can briefly return 0/undefined right after
              onReady fires, before YouTube's metadata is fully loaded —
              rendering off a real duration avoids a flash of a zero-width
              or NaN-width bar that then jumps once the real value lands. */}
          {!playing && duration > 0 && (
            <div className="absolute bottom-12 left-4 right-4">
              <div
                onClick={handleBarSeek}
                className="h-1.5 w-full rounded-full bg-background/25 cursor-pointer"
              >
                <div
                  className="h-full rounded-full bg-background"
                  style={{ width: `${Math.min(100, (currentTime / duration) * 100)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] font-medium text-white/80 tabular-nums">
                {fmtVideoTime(currentTime)} / {fmtVideoTime(duration)}
              </p>
            </div>
          )}

          {/* Channel name only — no video title shown, matching the
              previous version's "no caption clutter" decision, extended
              here since these are now confirmed-real Shorts with a real
              channel name available. */}
          {card.channel && (
            <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
              <p className="text-[12px] font-semibold text-white/90 truncate">
                {fmtChannel(card.channel)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface YTPlayerLike {
  playVideo?(): void;
  pauseVideo?(): void;
  mute?(): void;
  unMute?(): void;
  destroy?(): void;
  getCurrentTime?(): number;
  // seekTo/getDuration added for the ±5s skip buttons. allowSeekAhead=true
  // is required on seekTo whenever the target time isn't already buffered
  // (YouTube's own API requirement) — always passing true is correct here
  // since we have no way to know what's buffered from this wrapper.
  seekTo?(seconds: number, allowSeekAhead: boolean): void;
  getDuration?(): number;
}

// activeIndex now lives in the PARENT (InspireView), not here — it needs to
// be visible outside this component so InspireView's fetch logic can react
// to "user scrolled near the end" and trigger a top-up page fetch. This
// component still owns the actual IntersectionObserver (the DOM refs it
// needs are local), it just reports up via onActiveIndexChange instead of
// calling its own setState.
function InspireFeedView({
  cards,
  activeIndex,
  onActiveIndexChange,
  onReload,
}: {
  cards: ShortsCard[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onReload: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // globalThis.Map, not bare Map — lucide-react's Map icon (imported above
  // for the Roadmap nav tab) shadows the global Map constructor throughout
  // this file. Same fix as elsewhere in this project wherever the two
  // collide.
  const cardRefs = useRef<globalThis.Map<string, HTMLDivElement>>(new globalThis.Map());

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      entries => {
        let best: { key: string; ratio: number } | null = null;
        entries.forEach(e => {
          const key = (e.target as HTMLElement).dataset.cardKey;
          if (!key) return;
          if (e.isIntersecting && (!best || e.intersectionRatio > best.ratio)) {
            best = { key, ratio: e.intersectionRatio };
          }
        });
        if (best) {
          const idx = cards.findIndex(c => c.key === best!.key);
          if (idx !== -1) onActiveIndexChange(idx);
        }
      },
      { root, threshold: [0.6] },
    );
    cardRefs.current.forEach(el => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  return (
    <div className="relative h-full">
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
      >
        {cards.map((card, i) => (
          <div key={card.key} className="h-full w-full snap-start">
            <FeedPlayerCard
              card={card}
              active={i === activeIndex}
              shouldMount={i >= activeIndex && i <= activeIndex + 1}
              registerRef={el => {
                if (el) cardRefs.current.set(card.key, el);
                else cardRefs.current.delete(card.key);
              }}
              onReload={onReload}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Builds the feed's card list by walking the fallback chain described in
// this block's header comment. Runs once per distinct set of roadmaps (not
// on every render) — see InspireView's useEffect below for how this is
// invoked and cached in component state.
//
// `roadmapRefs` pairs each distinct skill with the entryId it came from —
// needed (not just the bare skill string) because tier 2 now calls
// ensureRelatedSkills(entryId), which reads/backfills/persists
// roadmap.skill_web.adjacent for that SPECIFIC roadmap entry, not a
// standalone lookup keyed on the skill name alone.
// Tier 1 helper — one youtube-feed-search call per roadmap skill (or, when
// pageToken is passed, the NEXT page for a skill already in progress).
// Isolated in its own try/catch (rather than letting a single failure
// reject the Promise.all it's called from) so one skill's quota error or
// timeout doesn't wipe out cards already found for every other skill in a
// multi-roadmap feed. Mirrors the caller contract documented in
// youtube-feed-search/index.ts: legitimate "found nothing" comes back as
// `{ results: [], nextPageToken }` with a 200, so only a thrown error
// (network failure, non-2xx) needs catching here — an empty array is not a
// failure case. On any failure, nextPageToken comes back null so the
// caller's cursor gets marked exhausted rather than retried forever against
// a source that's actually broken.
async function fetchFeedCandidates(
  query: string,
  pageToken?: string,
): Promise<{
  results: { videoId: string; title: string; channel: string | null }[];
  nextPageToken: string | null;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('youtube-feed-search', {
      body: { query, maxResults: 8, ...(pageToken ? { pageToken } : {}) },
    });
    if (error || !Array.isArray(data?.results)) return { results: [], nextPageToken: null };
    return {
      results: data.results.map((r: any) => ({
        videoId: r.videoId as string,
        title: (r.title as string) ?? query,
        channel: (r.channel as string | null) ?? null,
      })),
      nextPageToken: typeof data?.nextPageToken === 'string' ? data.nextPageToken : null,
    };
  } catch {
    return { results: [], nextPageToken: null };
  }
}

// One pagination cursor per distinct roadmap skill. exhausted=true once
// YouTube's nextPageToken has come back null for that skill (or a call for
// it failed outright — see fetchFeedCandidates) — caller stops requesting
// further pages for that skill once exhausted.
interface SkillCursor {
  entryId: string;
  skill: string;
  pageToken: string | null;
  exhausted: boolean;
}

interface ShortsFeedResult {
  cards: ShortsCard[];
  cursors: SkillCursor[];
}

async function buildShortsFeed(
  roadmapRefs: { entryId: string; skill: string }[],
  discoverFallback: InspireCard[],
  ensureRelatedSkills: (entryId: string) => Promise<string[]>,
  // Called once per skill, as soon as THAT skill's search resolves — not
  // batched until every skill has answered. This is what makes the first
  // cards appear as fast as the fastest skill's call, instead of the whole
  // feed waiting on the slowest one. Optional so existing callers that
  // don't care about streaming (there are none left after this change, but
  // keeping it optional avoids forcing every future caller to supply a
  // no-op) still work.
  onSkillResolved?: (newCards: ShortsCard[], cursor: SkillCursor) => void,
): Promise<ShortsFeedResult> {
  const cards: ShortsCard[] = [];
  const seen = new Set<string>();

  function addResults(
    results: { videoId: string; title: string; channel: string | null }[],
    keyPrefix: string,
  ): ShortsCard[] {
    const added: ShortsCard[] = [];
    results.forEach((r, i) => {
      if (seen.has(r.videoId)) return; // dedupe across skills/related queries
      seen.add(r.videoId);
      const card: ShortsCard = { key: `${keyPrefix}-${r.videoId}-${i}`, videoId: r.videoId, title: r.title, channel: r.channel, source: 'shorts' };
      cards.push(card);
      added.push(card);
    });
    return added;
  }

  // Tier 2 (related-skill search via ensureRelatedSkills) is NOT built yet
  // this pass — deliberately deferred so Tier 1 + pagination can be verified
  // working in isolation first. ensureRelatedSkills is real (context.tsx),
  // not a stub, but wiring it in is a separate follow-up. Left unused here
  // on purpose.
  void ensureRelatedSkills;

  // Tier 1: skill-based search via youtube-feed-search, one call per
  // distinct roadmap skill (page 1 — no pageToken on the initial load).
  // Each call isolated via fetchFeedCandidates so one skill's failure
  // doesn't sink the others. Each skill's cards + cursor are reported via
  // onSkillResolved THE MOMENT that skill answers, rather than gathered
  // into one array and reported only once every skill has answered — this
  // is the whole point of this pass: the caller can render fast skills'
  // cards immediately instead of waiting on the slowest one.
  const cursors: SkillCursor[] = [];

  if (roadmapRefs.length > 0) {
    await Promise.all(
      roadmapRefs.map(async (ref) => {
        const r = await fetchFeedCandidates(ref.skill);
        const cursor: SkillCursor = {
          entryId: ref.entryId,
          skill: ref.skill,
          pageToken: r.nextPageToken,
          exhausted: r.nextPageToken === null,
        };
        cursors.push(cursor);
        const added = addResults(r.results, `tier1-${ref.entryId}`);
        onSkillResolved?.(added, cursor);
      }),
    );
  }

  // Tier 3: discover[]-based fallback. Gated behind Tier 1 (Option A —
  // cheapest, matches "fallback" literally): only runs if Tier 1 came back
  // completely empty, since Tier 3 costs its own round of resolveVideoUrl
  // calls and there's no reason to pay that cost on every load once a real
  // search tier exists. Necessarily waits for the FULL Tier 1 sweep above
  // (via the Promise.all it's gated on) rather than streaming — there's no
  // way to know "Tier 1 came back completely empty" until every skill has
  // individually answered, and firing Tier 3 speculatively before that
  // would risk discover-fallback cards getting bumped once a late Tier 1
  // result arrives, which is worse than a slightly slower first paint in
  // the all-empty case. No orientation filtering: per explicit product
  // decision (INSPIRE_SHORTS_REMOVAL_HANDOFF.md), a landscape video is
  // allowed and renders letterboxed inside the vertical feed frame rather
  // than being filtered out — "some video" beats "no video," and Shorts-only
  // orientation is no longer a requirement anywhere in this feed.
  if (cards.length === 0 && discoverFallback.length > 0) {
    const resolved = await Promise.all(
      discoverFallback.map(async (dc) => {
        const r = await resolveVideoUrl(dc.url, dc.title);
        const videoId = extractYouTubeId(r.url);
        if (!videoId) return null;
        return { key: `discover-${dc.key}`, videoId, title: r.title, channel: null, source: 'discover' as const };
      }),
    );
    const addedDiscover: ShortsCard[] = [];
    resolved.forEach((c) => {
      if (c && !seen.has(c.videoId)) {
        seen.add(c.videoId);
        cards.push(c);
        addedDiscover.push(c);
      }
    });
    // Tier 3 has no per-skill cursor concept (it's not a paginated search),
    // so there's nothing meaningful to report via onSkillResolved here —
    // the caller gets these cards through the final returned `cards` array
    // instead, same as before this change.
    void addedDiscover;
  }

  return { cards, cursors };
}

// Top-up fetch for infinite scroll: requests the NEXT page for every
// not-yet-exhausted skill cursor, in parallel, same isolation/dedupe
// principles as the initial load. Deliberately separate from
// buildShortsFeed rather than a mode flag on it — the initial load also
// runs Tier 3 and constructs fresh cursors from scratch; a top-up never
// touches Tier 3 (already gated off once any card exists) and only ever
// advances cursors that already exist. Forcing both shapes into one
// function via branches would be harder to read than two small functions.
async function fetchNextPage(
  cursors: SkillCursor[],
  existingKeys: Set<string>,
): Promise<{ newCards: ShortsCard[]; updatedCursors: SkillCursor[] }> {
  const active = cursors.filter((c) => !c.exhausted);
  if (active.length === 0) return { newCards: [], updatedCursors: cursors };

  const seen = new Set(existingKeys);
  const newCards: ShortsCard[] = [];

  const results = await Promise.all(
    active.map((c) => fetchFeedCandidates(c.skill, c.pageToken ?? undefined)),
  );

  const updatedByEntryId = new globalThis.Map<string, SkillCursor>();
  active.forEach((cursor, i) => {
    const r = results[i];
    r.results.forEach((item, j) => {
      if (seen.has(item.videoId)) return;
      seen.add(item.videoId);
      newCards.push({
        key: `tier1-${cursor.entryId}-${item.videoId}-${j}-p${cursor.pageToken ?? '1'}`,
        videoId: item.videoId,
        title: item.title,
        channel: item.channel,
        source: 'shorts',
      });
    });
    updatedByEntryId.set(cursor.entryId, {
      ...cursor,
      pageToken: r.nextPageToken,
      exhausted: r.nextPageToken === null,
    });
  });

  const updatedCursors = cursors.map((c) => updatedByEntryId.get(c.entryId) ?? c);
  return { newCards, updatedCursors };
}

// ─── Inspire feed cache (survives tab-switch, not page reload) ────────────
//
// InspireView is conditionally rendered ({tab === 'inspire' && <InspireView
// />} in Main()), same as every other tab — switching away fully unmounts
// it, switching back mounts a brand new instance with fresh useState calls.
// That's correct behavior for the video PLAYER (we want it torn down when
// you leave, not playing audio behind another tab), but it was also wiping
// the fetched cards / scroll position / pagination cursors, forcing a full
// re-fetch every single time you tabbed back in. That's the "still a bit
// slower" complaint after the streaming fix — streaming made the FIRST
// load faster, but every RETURN visit was still paying full first-load
// cost for no reason.
//
// Fix: a plain module-level variable, not component state. It lives above
// any single component instance, so remounting InspireView doesn't touch
// it — but it's still just an in-memory JS value, so a real page
// reload/app relaunch clears it naturally without any extra code, which
// matches "just switching tabs" as confirmed, not "close and reopen the
// app."
//
// Keyed by a signature of the current roadmap set (not a fixed single
// slot) so that adding/deleting a roadmap between visits correctly
// invalidates the cache instead of showing a feed that no longer matches
// what roadmaps currently exist. Signature is intentionally cheap (sorted
// entryIds joined) — this only needs to detect "the roadmap SET changed",
// not deep-compare roadmap contents.
interface InspireCacheEntry {
  cards: ShortsCard[];
  cursors: SkillCursor[];
  activeIndex: number;
  settled: boolean;
}
let inspireCache: { key: string; entry: InspireCacheEntry } | null = null;

function inspireCacheKey(roadmapRefs: { entryId: string; skill: string }[]): string {
  return roadmapRefs.map(r => r.entryId).sort().join(',');
}

function InspireView() {
  const { state, ensureRelatedSkills } = useApp();

  // ALL of the user's roadmaps now, not just activeEntry — this is the core
  // change from the old Inspire, which only ever read the single active/
  // pinned roadmap. Deduped by skill name (case-insensitive) since a user
  // could plausibly have two roadmaps for very similarly-named skills.
  // Paired with entryId (not just the bare skill string) because tier 2
  // needs ensureRelatedSkills(entryId) to read/backfill/persist
  // skill_web.adjacent for that SPECIFIC roadmap — see buildShortsFeed.
  const roadmapRefs = useMemo(() => {
    const seen = new Set<string>();
    const result: { entryId: string; skill: string }[] = [];
    sortedRoadmaps(state.roadmaps).forEach(entry => {
      const skill = entry.roadmap.skill?.trim();
      if (!skill) return;
      const key = skill.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      result.push({ entryId: entry.id, skill });
    });
    return result;
  }, [state.roadmaps]);

  // discover[] fallback pool — flattened across ALL roadmaps now (not just
  // the active one), since tier 3 only fires when skill-search has already
  // failed entirely; pooling every roadmap's discover[] gives that fallback
  // the best chance of finding SOMETHING rather than narrowing it to
  // whichever roadmap happens to be pinned.
  const discoverFallback = useMemo<InspireCard[]>(() => {
    const seen = new Set<string>();
    const result: InspireCard[] = [];
    state.roadmaps.forEach(entry => {
      const steps = entry.roadmap.phases.flatMap(p => p.steps);
      steps.forEach(step => {
        (step.discover ?? []).forEach((resource, i) => {
          if (!resource.url || !resource.title) return;
          const key = `${step.id}-${i}`;
          if (seen.has(key)) return;
          seen.add(key);
          result.push({ key, title: resource.title, url: resource.url });
        });
      });
    });
    return result;
  }, [state.roadmaps]);

  // Cache key for the CURRENT roadmap set — recomputed each render (cheap:
  // just a sorted join), used both to read on mount and to write on settle.
  const cacheKey = useMemo(() => inspireCacheKey(roadmapRefs), [roadmapRefs]);

  // Read-through on mount: if a cache entry exists for this exact roadmap
  // set, seed state from it instead of starting at null/0. This is the
  // actual fix for "still a bit slower on return visits" — the cache
  // object existed before this but nothing ever read it back out.
  const seedFromCache = inspireCache?.key === cacheKey ? inspireCache.entry : null;

  const [cards, setCards] = useState<ShortsCard[] | null>(seedFromCache?.cards ?? null); // null = still loading
  // Tracks whether the FULL buildShortsFeed call (all skills + Tier 3) has
  // finished, as distinct from `cards` itself. Needed because cards can
  // legitimately be `[]` mid-flight now (one fast skill answered empty
  // while others are still in-flight) without that meaning "confirmed
  // nothing exists" — only settled=true means the pipeline is actually done
  // and an empty `cards` is a real empty state, not a race between skills.
  const [settled, setSettled] = useState(seedFromCache?.settled ?? false);
  const [activeIndex, setActiveIndex] = useState(seedFromCache?.activeIndex ?? 0);
  // Ref, not state — cursor updates shouldn't themselves trigger a
  // re-render; only `cards` changing should. Read/written inside the
  // near-end effect below.
  const cursorsRef = useRef<SkillCursor[]>(seedFromCache?.cursors ?? []);
  // Guards against firing a second top-up fetch while one is already in
  // flight for the same scroll position (the effect below can otherwise
  // re-fire on every activeIndex tick while waiting on the network).
  const fetchingMoreRef = useRef(false);
  // Bumped by handleReload to force the fetch effect below to re-run even
  // though roadmapRefs/discoverFallback/ensureRelatedSkills haven't
  // changed — those three are the effect's real dependencies, but a manual
  // reload needs a way to say "run again anyway, ignore the cache."
  const [reloadTick, setReloadTick] = useState(0);

  // Write-through: whenever cards/settled/activeIndex/cursors change for
  // this roadmap set, mirror them into the module cache so the NEXT mount
  // (tab switch back in) can seed from it instead of re-fetching. Doesn't
  // fire while cards is still null — no point caching "still loading."
  useEffect(() => {
    if (cards === null) return;
    inspireCache = {
      key: cacheKey,
      entry: { cards, cursors: cursorsRef.current, activeIndex, settled },
    };
  }, [cacheKey, cards, activeIndex, settled]);

  useEffect(() => {
    let cancelled = false;

    // Skip straight past the loading state if we seeded from a cache hit
    // for THIS key on THIS mount — re-fetching from scratch here would
    // defeat the entire point of the cache. Only applies on the initial
    // run (reloadTick === 0); a manual reload (tick > 0) always refetches,
    // which is exactly what "reload" is supposed to do.
    if (reloadTick === 0 && inspireCache?.key === cacheKey) {
      return;
    }

    // A real reload (tick > 0), or a genuine cache miss: clear whatever
    // stale entry might exist for this key and start over.
    if (inspireCache?.key === cacheKey) inspireCache = null;
    setCards(null);
    setSettled(false);
    setActiveIndex(0);
    cursorsRef.current = [];
    if (roadmapRefs.length === 0 && discoverFallback.length === 0) {
      setCards([]);
      setSettled(true);
      return;
    }
    buildShortsFeed(
      roadmapRefs,
      discoverFallback,
      ensureRelatedSkills,
      // Streams each skill's cards in as soon as THAT skill resolves,
      // instead of waiting for every skill (including the slowest one) to
      // finish before anything renders. First call flips `cards` from null
      // (spinner) to a real array; subsequent calls append. Cursor is
      // recorded immediately too, so a fast top-up scroll right after
      // initial load has an accurate cursor for this skill even before the
      // OTHER skills (and Tier 3) have finished settling.
      (newCards, cursor) => {
        if (cancelled) return;
        cursorsRef.current = [...cursorsRef.current.filter(c => c.entryId !== cursor.entryId), cursor];
        if (newCards.length > 0) {
          setCards(prev => (prev ? [...prev, ...newCards] : newCards));
        } else {
          // This skill resolved but found nothing — still need to flip
          // cards out of the `null`/loading state if it's the first skill
          // to answer, otherwise the spinner stays up even though we now
          // have a real (if empty-so-far) answer for at least one skill.
          setCards(prev => prev ?? []);
        }
      },
    ).then(result => {
      if (cancelled) return;
      // Final settle: covers Tier 3 (which only ever appears here, since it
      // has no per-skill streaming concept) and is also the safety net if
      // roadmapRefs was empty so onSkillResolved never fired at all.
      setCards(prev => {
        if (!prev) return result.cards;
        // Tier 1 cards already streamed in above — only append whatever's
        // in result.cards that ISN'T already present (i.e. Tier 3's
        // cards, or the empty-array case where prev and result.cards
        // are the same set).
        const already = new Set(prev.map(c => c.videoId));
        const extra = result.cards.filter(c => !already.has(c.videoId));
        return extra.length > 0 ? [...prev, ...extra] : prev;
      });
      cursorsRef.current = result.cursors;
      // This was the actual gap: without this, `settled` only ever flipped
      // true on the early-return "nothing to fetch" path above, never after
      // a real buildShortsFeed call. Result: the empty-state screen below
      // couldn't be gated by `settled` at all (see the other half of this
      // fix in the render branch) because settled would never become true
      // for any real load.
      setSettled(true);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmapRefs, discoverFallback, ensureRelatedSkills, reloadTick]);

  // Passed down to FeedPlayerCard (via InspireFeedView) for the paused-state
  // reload icon. Clears the cache entry for THIS key and bumps reloadTick
  // to force the fetch effect above to re-run even though its other deps
  // are unchanged — same "start over" job described in the Option A/B
  // conversation, just invoked from the video overlay instead of a
  // standalone button.
  const handleReload = useCallback(() => {
    if (inspireCache?.key === cacheKey) inspireCache = null;
    setReloadTick(t => t + 1);
  }, [cacheKey]);

  // Infinite scroll top-up: once the active card is within the last 3 cards
  // of the current list (i.e. 2 cards still ahead), fetch the next page for
  // every skill whose cursor isn't exhausted yet. Reacts to
  // activeIndex/cards changing rather than scroll position directly —
  // InspireFeedView already derives activeIndex from its
  // IntersectionObserver, so this reuses that instead of adding a second,
  // separate scroll listener.
  useEffect(() => {
    if (!cards || cards.length === 0) return;
    const nearEnd = activeIndex >= cards.length - 3;
    if (!nearEnd) return;
    if (fetchingMoreRef.current) return;
    const hasActiveCursor = cursorsRef.current.some(c => !c.exhausted);
    if (!hasActiveCursor) return; // every skill's queryspace is exhausted — nothing left to top up with (this pass; Tier 2 fallback is a follow-up)

    fetchingMoreRef.current = true;
    const existingKeys = new Set(cards.map(c => c.videoId));
    fetchNextPage(cursorsRef.current, existingKeys).then(({ newCards, updatedCursors }) => {
      cursorsRef.current = updatedCursors;
      fetchingMoreRef.current = false;
      if (newCards.length > 0) {
        setCards(prev => (prev ? [...prev, ...newCards] : newCards));
      }
    });
  }, [activeIndex, cards]);

  const handleActiveIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (cards === null) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  // Gated on `settled`, not just cards.length === 0. With streaming,
  // `cards` legitimately passes through [] the instant the FIRST skill to
  // resolve comes back empty — other skills (and Tier 3) may still be
  // in-flight and could still produce cards. Rendering the empty state on
  // cards.length === 0 alone would flash "No videos yet" mid-load. Only
  // settled === true means the whole pipeline (all skills + Tier 3) is
  // actually done and an empty array is a confirmed empty result, not a
  // race between skills.
  if (cards.length === 0 && !settled) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4">
          <Play size={22} className="text-primary" />
        </div>
        <p className="text-sm font-semibold text-foreground mb-1">No videos yet</p>
        <p className="text-xs text-muted-foreground max-w-[260px]">
          We couldn't find any short videos for your roadmaps right now. Try again later.
        </p>
      </div>
    );
  }

  return (
    <InspireFeedView
      cards={cards}
      activeIndex={activeIndex}
      onActiveIndexChange={handleActiveIndexChange}
      onReload={handleReload}
    />
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────


export function Main() {
  const navigate = useNavigate();
  const { state, activeEntry, currentStreak, streakStatus, roadmapsHydrated } = useApp();
  const [tab, setTab] = useState<Tab>('today');
  const { desktop, setMode } = useViewMode();

  // Fires the celebration whenever the real streak count increases past the
  // highest value we've shown a celebration for. Depends on currentStreak
  // (not a mount-only effect) because currentStreak starts null and only
  // resolves after the async hydration fetch in context.tsx — a mount-only
  // check would compare against 0 before the real number ever arrives and
  // could miss a returning user's actual streak entirely. Guards on
  // `currentStreak != null` so it never fires off a not-yet-loaded 0.
  //
  // NOTE on overlap with StreakInterruptModal: SESSION_HANDOFF_3.md §0.9
  // claims these two are "confirmed by construction" to never coexist,
  // reasoning that a streak only increases as a *result* of resolving a
  // pending miss. That's true of the eventual state, but both this effect
  // and the modal's own internal state derive from the same completion
  // event on independent timers (this watches currentStreak, the modal
  // watches streakStatus.hasPendingMiss via its own effect) — nothing
  // actually prevents both from being true in the same render pass, e.g.
  // if a completion resolves a miss and bumps the streak in one
  // round-trip and both context values land before the next paint.
  // recordTaskCompletion() in context.tsx confirms this isn't
  // hypothetical: setCurrentStreak() commits a full render (with two
  // intervening awaits) before setStreakStatus() does.
  //
  // StreakInterruptModal's own comment block says it doesn't need Main()
  // to branch around it, since it self-covers at z-[60] same as
  // StreakCelebration. That's true for simple stacking, but doesn't
  // resolve the race above: (1) the `if (showStreak) return` a few lines
  // down is an early return, not a stacking context — if it fires while
  // hasPendingMiss is still stale-true, it unmounts the modal outright,
  // it doesn't just draw over it; (2) even without the early return, two
  // same-z-index opaque full-screens (StreakCelebration's translucent
  // dark overlay vs. this modal's solid white) would resolve purely by
  // DOM order, not by any actual decision about which should win. So this
  // guard stays: hasPendingMiss must be false before showStreak is
  // allowed to fire at all, which is what keeps the early return below
  // from ever unmounting the modal mid-flow.
  const [showStreak, setShowStreak] = useState(false);
  useEffect(() => {
    if (currentStreak == null) return;
    if (streakStatus?.hasPendingMiss) return; // let the interrupt modal own the screen first
    let last = 0;
    try { last = Number(localStorage.getItem('nav_last_streak') ?? '0'); } catch {}
    if (currentStreak > last && currentStreak > 0) {
      setShowStreak(true);
      try { localStorage.setItem('nav_last_streak', String(currentStreak)); } catch {}
    }
  }, [currentStreak, streakStatus?.hasPendingMiss]);

  // Daily reminder notification — checks on mount and every minute.
  // Fires at most once per day (guarded by nav_notification_last_shown).
  useEffect(() => {
    function checkReminder() {
      try {
        const time24 = localStorage.getItem('nav_notification_time');
        if (!time24 || Notification.permission !== 'granted') return;
        const today = new Date().toISOString().slice(0, 10);
        if (localStorage.getItem('nav_notification_last_shown') === today) return;
        const [h, m] = time24.split(':').map(Number);
        const now = new Date();
        if (now.getHours() * 60 + now.getMinutes() >= h * 60 + m) {
          new Notification('Navigator', {
            body: "Time to learn — keep that streak alive 🔥",
            icon: '/favicon.svg',
          });
          localStorage.setItem('nav_notification_last_shown', today);
        }
      } catch { /* Notification API not available */ }
    }
    checkReminder();
    const t = setInterval(checkReminder, 60_000);
    return () => clearInterval(t);
  }, []);

  const NAV = [
    { id: 'today' as Tab,   Icon: Zap,           label: 'Today'   },
    { id: 'inspire' as Tab, Icon: Compass,       label: 'Inspire' },
    { id: 'roadmap' as Tab, Icon: Map,           label: 'Roadmap' },
    { id: 'chat' as Tab,    Icon: MessageCircle, label: 'Chat'    },
    { id: 'profile' as Tab, Icon: UserIcon,      label: 'Profile' },
  ];

  // Roadmaps still being fetched — show the preloader instead of flashing
  // "No roadmap loaded" for a user who does have roadmaps.
  if (!roadmapsHydrated && (state.roadmaps.length === 0 || !activeEntry)) {
    return (
      <div className="relative h-full w-full">
        <NaviPreloader label="Loading your roadmaps" />
      </div>
    );
  }

  if (state.roadmaps.length === 0 || !activeEntry) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">No roadmap loaded.</p>
        <button onClick={() => navigate('/start')} className="px-6 py-2.5 bg-primary text-foreground text-sm font-semibold rounded-full">
          Start over
        </button>
      </div>
    );
  }

  if (showStreak) {
    return <StreakCelebration days={currentStreak ?? 0} onContinue={() => { setShowStreak(false); setTab('today'); }} />;
  }

  const tabContent = (
    <>
      {tab === 'today'   && <TodayView entry={activeEntry} />}
      {tab === 'roadmap' && <RoadmapListView />}
      {tab === 'chat'    && <Chat />}
      {tab === 'inspire' && <InspireView />}
      {tab === 'profile' && <ProfileView entry={activeEntry} onGoRoadmap={() => setTab('roadmap')} />}
    </>
  );

  // ── Desktop view: left sidebar + centered content column ────────────────
  // The tab screens are still the same components, so each sits in a column
  // of readable width (narrower for the vertical Inspire feed).
  if (desktop) {
    return (
      <div className="flex h-full w-full">
        <aside className="w-[220px] shrink-0 h-full border-r border-border bg-background flex flex-col px-3 py-5">
          <p className="text-[18px] font-bold text-foreground px-3 mb-6">Navigator</p>
          <nav className="flex flex-col gap-1">
            {NAV.map(({ id, Icon, label }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${active ? 'bg-accent' : 'hover:bg-muted'}`}
                >
                  <Icon size={19} style={{ color: active ? '#85a60c' : '#9ea2ae' }} />
                  <span className="text-[14px] font-semibold" style={{ color: active ? '#85a60c' : '#9ea2ae' }}>{label}</span>
                </button>
              );
            })}
          </nav>
          <button
            onClick={() => setMode('mobile')}
            className="mt-auto flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-left"
          >
            <Smartphone size={19} className="text-muted-foreground" />
            <span className="text-[14px] font-semibold text-muted-foreground">Mobile view</span>
          </button>
        </aside>

        <main className="flex-1 min-w-0 h-full flex justify-center bg-muted/30">
          <div
            className={`relative h-full w-full bg-background ${tab === 'inspire' ? 'max-w-[440px]' : 'max-w-[720px]'}`}
          >
            {tabContent}
          </div>
        </main>

        <StreakInterruptModal onGoToToday={() => setTab('today')} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="h-14 shrink-0" />

      <div className="flex-1 min-h-0 overflow-hidden relative">
        {tabContent}
      </div>

      {/* Mounted unconditionally, per the component's own integration
          contract: it renders null until streakStatus.hasPendingMiss is
          true, then covers the viewport itself (fixed inset-0 z-[60], no
          Dialog/portal — see its file header for why that's correct given
          Layout.tsx's transformed route wrapper). It does NOT require a
          `showStreak`-style early return here to stack correctly. It DOES
          still depend on the `if (streakStatus?.hasPendingMiss) return`
          guard inside the showStreak effect above — see that comment for
          why the two are still coupled despite this component not asking
          for it. */}
      <StreakInterruptModal onGoToToday={() => setTab('today')} />

      {/* Bottom Nav (no FAB) */}
      <div className="shrink-0 h-[82px] bg-background border-t border-border flex items-center pb-3 px-4">
        {NAV.map(({ id, Icon, label }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 flex flex-col items-center gap-1 pt-1"
            >
              <Icon size={20} style={{ color: active ? '#85a60c' : '#9ea2ae' }} className="transition-colors" />
              <span className="text-[10px] font-semibold transition-colors" style={{ color: active ? '#85a60c' : '#9ea2ae' }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
