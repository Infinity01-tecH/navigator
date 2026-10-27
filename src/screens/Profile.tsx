import { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSmoothScroll } from '../lib/useSmoothScroll';
import {
  ArrowLeft, Flame, Zap, Map, Users, Settings, UserPlus,
  Play, ChevronRight, Check, Star, Edit2, Youtube,
} from 'lucide-react';
import { useApp, localDateStr } from '../lib/context';
import { supabase } from '../lib/supabase';
import { kvGet } from '../lib/roadmapStore';
import { PartnerTodaysPlan, xpModel } from './Main';
import type { PartnerRoadmap, PartnerPhase } from './Main';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { computeAchievements, AchievementBadge } from '../app/components/achievements';
import type { AchievementState } from '../app/components/achievements';
import type { RoadmapEntry } from '../lib/context';

const XP_PER_STEP = 50;
const DAILY_GOAL_XP = 200;

// ─── Types ───────────────────────────────────────────────────────────────────

type ProfileTier = 'self' | 'friend' | 'streak_partner' | 'stranger';

interface ProfileRoadmap {
  id: string;
  skill: string;
  data?: { phases: PartnerPhase[] } | null;
  progress?: Record<string, boolean> | null;
}

interface ProfileViewRow {
  tier: ProfileTier;
  username: string | null;
  display_name: string | null;
  avatar_config: unknown;
  current_streak: number | null;
  completed_steps: number | null;
  roadmaps: ProfileRoadmap[] | null;
  streak_log: Record<string, string> | null;
  notes: unknown;
  // Optional fields (require Supabase columns: profiles.bio, profiles.pro_skill)
  bio?: string | null;
  pro_skill?: string | null;
}

type LoadState = 'loading' | 'ready' | 'unavailable' | 'error';

// ─── PRO SKILL storage (localStorage) ───────────────────────────────────────

function loadProSkill(userId: string): string {
  try { return localStorage.getItem(`pro_skill_${userId}`) ?? ''; } catch { return ''; }
}
function saveProSkill(userId: string, skill: string) {
  try { localStorage.setItem(`pro_skill_${userId}`, skill); } catch { /* ignore */ }
}

// ─── Marquee text ─────────────────────────────────────────────────────────────

function MarqueeText({ text, className = '' }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const c = containerRef.current;
    const t = textRef.current;
    if (c && t) setOverflows(t.scrollWidth > c.clientWidth);
  }, [text]);

  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap ${className}`}>
      {overflows ? (
        <span
          ref={textRef}
          className="inline-block"
          style={{ animation: 'marquee 5s linear infinite' }}
        >
          {text}&nbsp;&nbsp;&nbsp;&nbsp;{text}
        </span>
      ) : (
        <span ref={textRef}>{text}</span>
      )}
      <style>{`@keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  );
}

// ─── Circular progress indicator ─────────────────────────────────────────────

function CircularProgress({ pct }: { pct: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  const dashOffset = circ - (animPct / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 110, height: 110 }}>
      <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="55" cy="55" r={r} fill="none" stroke="#e5e7ea" strokeWidth="8" />
        <circle
          cx="55" cy="55" r={r} fill="none" stroke="#8cb200" strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[22px] font-bold text-foreground">{pct}%</span>
      </div>
    </div>
  );
}

// ─── Phase bars (network-strength icon) ──────────────────────────────────────

function PhaseBars({ completed, total = 4 }: { completed: number; total?: number }) {
  return (
    <div className="flex items-end gap-[3px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-[2px]"
          style={{
            width: 5,
            height: 6 + i * 4,
            background: i < completed ? '#131313' : '#d1d5db',
          }}
        />
      ))}
    </div>
  );
}

// ─── Week strip (compact, for profile) ───────────────────────────────────────

function ProfileWeekStrip({ streakLog }: { streakLog: Record<string, string> | null }) {
  const days = useMemo(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const key = localDateStr(d);
      const status = streakLog?.[key] ?? null;
      return { label: ['Mo','Tu','We','Th','Fr','Sa','Su'][i], key, status };
    });
  }, [streakLog]);

  return (
    <div className="flex items-start justify-between w-full">
      {days.map(({ label, key, status }) => {
        const done = status === 'completed';
        const today = localDateStr(new Date()) === key;
        return (
          <div key={key} className="flex flex-col items-center gap-1">
            <div
              className={`flex items-center justify-center rounded-[10px] p-2 ${
                done ? 'bg-primary' : today ? 'bg-secondary border border-primary' : 'bg-card'
              }`}
              style={{ width: 40, height: 40 }}
            >
              {done ? (
                <Check size={18} className="text-white" strokeWidth={3} />
              ) : (
                <Check size={18} className="text-muted-foreground" strokeWidth={2} />
              )}
            </div>
            <span className={`text-[13px] font-semibold ${done ? 'text-foreground' : 'text-muted-foreground'}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── XP Progress Chart ────────────────────────────────────────────────────────

function XPProgressChart({
  streakLog, totalXp, todayXp,
}: { streakLog: Record<string, string> | null; totalXp: number; todayXp: number }) {
  // Build last-7-days data
  const data = useMemo(() => {
    const today = new Date();
    const labels = ['Mo','Tu','We','Th','Fr','Sa','Su'];
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const key = localDateStr(d);
      const status = streakLog?.[key] ?? null;
      const isToday = localDateStr(today) === key;
      let xp = 0;
      if (isToday) xp = todayXp;
      else if (status === 'completed') xp = DAILY_GOAL_XP;
      else if (status === 'grace') xp = Math.round(DAILY_GOAL_XP * 0.4);
      return { day: labels[i], xp };
    });
    return days;
  }, [streakLog, totalXp, todayXp]);

  const weekTotal = data.reduce((s, d) => s + d.xp, 0);
  const todayProgress = data.find(d => d.xp === todayXp)?.xp ?? todayXp;
  const todayPct = Math.min(100, Math.round((todayProgress / DAILY_GOAL_XP) * 100));
  const maxY = Math.max(DAILY_GOAL_XP, Math.max(...data.map(d => d.xp)));
  const yMax = Math.ceil(maxY / 50) * 50 + 50;
  const yTicks = Array.from({ length: yMax / 50 + 1 }, (_, i) => i * 50);

  return (
    <div className="bg-card rounded-[15px] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[20px] font-bold text-foreground">XP Progress</span>
        <span className="text-[14px] font-semibold text-primary">Total: {weekTotal}XP</span>
      </div>

      {/* Daily Goal row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="shrink-0">
          <svg width="48" height="56" viewBox="0 0 60 66" fill="none">
            <path d="M30 4 L52 20 L44 56 L16 56 L8 20 Z" stroke="#8CB200" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M30 56 L30 28 M30 28 L20 38 M30 28 L40 38" stroke="#8CB200" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[14px] text-muted-foreground font-medium mb-1">Daily Goal</p>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 h-[8px] bg-secondary rounded-full overflow-hidden" style={{ maxWidth: 134 }}>
              <div
                className="absolute h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${todayPct}%` }}
              />
              {todayPct > 0 && (
                <div
                  className="absolute -translate-y-1/2 bg-primary text-white text-[6px] font-bold px-1 rounded"
                  style={{ left: Math.max(0, Math.min(todayPct, 80)) + '%', top: '50%', transform: 'translate(-50%,-50%)' }}
                >
                  {todayPct}%
                </div>
              )}
            </div>
            <span className="text-[13px] text-muted-foreground whitespace-nowrap">{todayXp}/{DAILY_GOAL_XP} XP</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8cb200" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#8cb200" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 2" stroke="#dedede" strokeOpacity={0.5} vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#cccac9', fontFamily: 'system-ui' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              ticks={yTicks}
              domain={[0, yMax]}
              tick={{ fontSize: 12, fill: '#cccac9', fontFamily: 'system-ui' }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7ea', background: '#fff' }}
              formatter={(v: number) => [`${v} XP`, 'XP']}
            />
            <Area
              type="monotone"
              dataKey="xp"
              stroke="#8cb200"
              fill="url(#xpGrad)"
              strokeWidth={2}
              dot={{ fill: '#ffffff', stroke: '#8cb200', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 5, fill: '#8cb200' }}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Roadmap tab button ───────────────────────────────────────────────────────

function RoadmapTab({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-full border text-[14px] font-medium transition-colors whitespace-nowrap overflow-hidden`}
      style={{
        maxWidth: 120,
        borderColor: active ? '#8cb200' : '#e5e7ea',
        background: active ? '#f9ffe5' : '#fff',
        color: active ? '#131313' : '#9ea2ae',
      }}
    >
      <MarqueeText text={label} />
    </button>
  );
}

// ─── Roadmap detail panel ─────────────────────────────────────────────────────

function RoadmapDetail({ entry, streakDays }: { entry: RoadmapEntry; streakDays: number }) {
  const roadmap = entry.roadmap;
  const phases = roadmap.phases ?? [];
  const allSteps = phases.flatMap(p => p.steps);
  const total = allSteps.length;
  const completed = allSteps.filter(s => entry.progress[s.id]).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const xpEarned = completed * XP_PER_STEP;

  // Phases completed: all steps in a phase done
  const phasesCompleted = phases.filter(p =>
    p.steps.length > 0 && p.steps.every(s => entry.progress[s.id])
  ).length;

  // Roadmap type label
  const typeLabel = roadmap.mode === 'sprint'
    ? 'Sprint'
    : roadmap.ytCreator
      ? 'YouTube Roadmap'
      : 'Full Roadmap';

  // Achievements for this entry
  const achievements = useMemo(
    () => computeAchievements(roadmap as Parameters<typeof computeAchievements>[0], entry.progress ?? {}, streakDays),
    [roadmap, entry.progress, streakDays]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Type + step count row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
            <Play size={12} className="text-white" fill="white" />
          </div>
          <span className="text-[14px] text-foreground font-medium">{typeLabel}</span>
        </div>
        <span className="text-[13px] text-muted-foreground">—&nbsp;&nbsp;{total} Steps</span>
      </div>

      {/* Circular progress */}
      <div className="flex flex-col items-center gap-1">
        <CircularProgress pct={pct} />
        <span className="text-[13px] text-muted-foreground font-medium">Roadmap Progress</span>
      </div>

      {/* Info cards: Phases + XP */}
      <div className="flex gap-3">
        <div className="flex-1 bg-card rounded-[12px] flex flex-col items-center gap-2 py-3 px-4">
          <PhaseBars completed={phasesCompleted} />
          <span className="text-[13px] text-foreground text-center">
            {phasesCompleted} Phase{phasesCompleted !== 1 ? 's' : ''} Completed
          </span>
        </div>
        <div className="w-[2px] bg-secondary rounded-full self-stretch shrink-0" />
        <div className="flex-1 bg-card rounded-[12px] flex flex-col items-center gap-2 py-3 px-4">
          <Zap size={20} className="text-foreground" />
          <span className="text-[13px] text-foreground text-center">{xpEarned} XP Earned</span>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[16px] font-normal text-muted-foreground">Achievement</span>
          <span className="text-[16px] font-normal text-muted-foreground overflow-hidden" style={{ maxWidth: 140 }}>
            <MarqueeText text={roadmap.skill || 'Roadmap'} />
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map(a => (
            <AchievementBadge key={a.id} a={a} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Roadmaps section (self-only) ─────────────────────────────────────────────

function RoadmapsSection({ roadmaps, streakDays }: { roadmaps: RoadmapEntry[]; streakDays: number }) {
  const real = roadmaps.filter(r => !r.preview);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);

  const selected = real[Math.min(selectedIdx, real.length - 1)] ?? null;

  if (real.length === 0) {
    return (
      <p className="text-[14px] text-muted-foreground">No roadmaps yet. Create one from the Roadmap tab.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Title + count */}
      <div className="flex items-center justify-between">
        <span className="text-[20px] font-medium text-foreground" style={{ fontWeight: 510 }}>Roadmaps</span>
        <span className="text-primary text-[20px] font-medium">{real.length}</span>
      </div>

      {/* Horizontal scrolling tabs */}
      <div
        ref={tabsRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
      >
        {real.map((entry, i) => (
          <RoadmapTab
            key={entry.id}
            label={entry.roadmap.skill || `Roadmap ${i + 1}`}
            active={i === selectedIdx}
            onClick={() => setSelectedIdx(i)}
          />
        ))}
      </div>

      {/* Selected roadmap detail */}
      {selected && (
        <div className="bg-background border border-border rounded-[16px] p-4">
          <RoadmapDetail entry={selected} streakDays={streakDays} />
        </div>
      )}
    </div>
  );
}

// ─── Level progress bar ───────────────────────────────────────────────────────

const LEVEL_NAMES = ['Navigator','Apprentice','Scholar','Expert','Master','Legend'];

function LevelBar({ completedSteps, quizXp }: { completedSteps: number; quizXp: number }) {
  const { xp, level, intoLevel, toNext, pct } = xpModel(completedSteps, quizXp);
  const levelName = LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
  const [animPct, setAnimPct] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="bg-accent rounded-[16px] px-4 py-3 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-[18px] font-medium text-accent-foreground">
          Level {level} · {levelName}
        </span>
        <span className="text-[12px] text-primary">{intoLevel} / {toNext} XP</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="relative h-[10px] bg-card rounded-full overflow-visible">
          <div
            className="absolute h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${animPct}%` }}
          />
          {animPct > 0 && (
            <div
              className="absolute -translate-y-1/2 bg-primary text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-[4px] whitespace-nowrap"
              style={{ left: Math.max(10, Math.min(animPct - 5, 80)) + '%', top: '50%' }}
            >
              {Math.round(animPct)}%
            </div>
          )}
        </div>
        <span className="text-[11px] text-primary">{toNext - intoLevel} XP to Level {level + 1}</span>
      </div>
    </div>
  );
}

// ─── PRO SKILL badge + editor ─────────────────────────────────────────────────

function ProSkillBadge({ userId }: { userId: string }) {
  const [skill, setSkill] = useState(() =>
    userId === 'dev-bypass' ? 'Web Development' : loadProSkill(userId)
  );
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(skill);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  function commit() {
    const val = draft.trim();
    setSkill(val);
    if (userId !== 'dev-bypass') saveProSkill(userId, val);
    setEditing(false);
  }

  if (editing) {
    return (
      <form
        onSubmit={e => { e.preventDefault(); commit(); }}
        className="flex items-center gap-1"
      >
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          className="text-[13px] font-semibold border border-primary rounded-[10px] px-2 py-0.5 outline-none bg-accent text-foreground"
          placeholder="Your pro skill"
          maxLength={30}
          style={{ width: 140 }}
        />
      </form>
    );
  }

  return (
    <button
      onClick={() => { setDraft(skill); setEditing(true); }}
      className="flex items-center gap-1 bg-accent px-3 py-[3px] rounded-[12px]"
      title="Tap to set your PRO Skill"
    >
      {skill ? (
        <span className="text-[14px] font-semibold text-foreground">{skill}</span>
      ) : (
        <span className="text-[13px] text-muted-foreground">Set PRO Skill</span>
      )}
      <Edit2 size={11} className="text-primary shrink-0" />
    </button>
  );
}

// ─── Self-profile view ────────────────────────────────────────────────────────

function SelfProfile({ profile }: { profile: ProfileViewRow }) {
  const {
    user, state, currentStreak, recentStreakDays, quizXp,
  } = useApp()!;

  const name = profile.display_name || profile.username || user?.name || 'You';
  const username = profile.username || user?.name?.toLowerCase().replace(/\s/g, '') || '';
  const initial = name.slice(0, 1).toUpperCase();

  const completedSteps = profile.completed_steps ?? 0;
  const streak = currentStreak ?? profile.current_streak ?? 0;
  const streakLog = recentStreakDays ?? profile.streak_log ?? {};

  // Load bio from user_kv (same cross-device store as avatar)
  const [bio, setBio] = useState('');
  useEffect(() => {
    if (!user || user.id === 'dev-bypass') return;
    kvGet<string>('bio').then(v => { if (v) setBio(v); });
  }, [user?.id]);

  // Build this week's XP for chart
  const todayXp = (() => {
    const today = localDateStr(new Date());
    const todayStatus = streakLog[today];
    if (!todayStatus) return 0;
    if (todayStatus === 'completed') return Math.min(DAILY_GOAL_XP, quizXp > 0 ? quizXp : DAILY_GOAL_XP);
    return 0;
  })();

  const roadmaps = state.roadmaps.filter(r => !r.preview);

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Avatar + name + PRO SKILL */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-[65px] h-[65px] rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-[26px] font-bold text-foreground">{initial}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-medium text-foreground">{name}</span>
            <span className="text-[14px] text-primary">@{username}</span>
            {bio && (
              <span className="text-[12px] text-muted-foreground mt-0.5 line-clamp-2 leading-snug max-w-[180px]">{bio}</span>
            )}
          </div>
        </div>
        <ProSkillBadge userId={user?.id ?? 'anon'} />
      </div>

      {/* Level bar */}
      <LevelBar completedSteps={completedSteps} quizXp={quizXp} />

      {/* Streak */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[20px] font-medium text-foreground" style={{ fontWeight: 510 }}>Streak</span>
          <div className="flex items-center gap-1">
            <div className="bg-accent rounded-[12px] p-[6px]">
              <Flame size={20} className="text-foreground" />
            </div>
            <span className="text-[20px] font-medium text-foreground">{streak}</span>
          </div>
        </div>
        <div className="bg-accent rounded-[12px] px-4 py-5 overflow-hidden relative" style={{ minHeight: 112 }}>
          {/* Decorative N-patterns */}
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-24 flex flex-col gap-8 items-end justify-center pr-2">
              {[0,1,2].map(i => (
                <svg key={i} width="60" height="16" viewBox="0 0 60 16" fill="none">
                  <path d="M0 8 Q10 2 20 8 Q30 14 40 8 Q50 2 60 8" stroke="#8CB200" strokeWidth="2.5" fill="none"/>
                </svg>
              ))}
            </div>
          </div>
          <ProfileWeekStrip streakLog={streakLog} />
        </div>
      </div>

      {/* XP Progress chart */}
      <XPProgressChart
        streakLog={streakLog}
        totalXp={quizXp + completedSteps * XP_PER_STEP}
        todayXp={todayXp}
      />

      {/* Roadmaps section */}
      <RoadmapsSection roadmaps={roadmaps} streakDays={streak} />
    </div>
  );
}

// ─── Stranger compact preview card ────────────────────────────────────────────

function StrangerCard({
  profile, name, initial,
}: { profile: ProfileViewRow; name: string; initial: string }) {
  const navigate = useNavigate();

  return (
    <div className="pt-4 pb-6 flex flex-col gap-4">
      <div className="border border-border rounded-[20px] px-4 py-4 flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0 text-xl font-bold text-foreground">
          {initial}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-foreground truncate">{name}</p>
          {profile.username && (
            <p className="text-[13px] text-primary truncate">@{profile.username}</p>
          )}
          {profile.bio && (
            <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-2 leading-snug">{profile.bio}</p>
          )}
          {profile.pro_skill && (
            <div className="inline-flex items-center gap-1 bg-accent px-2 py-0.5 rounded-[8px] mt-1">
              <Star size={10} className="text-primary" />
              <span className="text-[11px] font-semibold text-foreground">{profile.pro_skill}</span>
            </div>
          )}
        </div>

        {/* Add friend */}
        <button
          onClick={() => navigate('/friends')}
          className="shrink-0 h-9 px-3 rounded-[12px] bg-primary flex items-center gap-1.5 text-white text-[13px] font-semibold"
          aria-label="Add friend"
        >
          <Users size={13} />
          Add
        </button>
      </div>

      <p className="text-[13px] text-muted-foreground text-center">
        Connect with {name} to see their full profile.
      </p>
    </div>
  );
}

// ─── Roadmap detail for other-user (friend = no achievements, streak = with) ───

function OtherRoadmapCard({
  r, showAchievements,
}: { r: ProfileRoadmap; showAchievements: boolean }) {
  const phases: PartnerPhase[] = r.data?.phases ?? [];
  const allSteps = phases.flatMap(p => p.steps);
  const total = allSteps.length;
  const completed = allSteps.filter(s => r.progress?.[s.id]).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const xpEarned = completed * XP_PER_STEP;
  const phasesCompleted = phases.filter(p =>
    p.steps.length > 0 && p.steps.every(s => r.progress?.[s.id])
  ).length;

  const achievements = useMemo(
    () => showAchievements && r.data && r.progress
      ? computeAchievements(r.data as any, r.progress ?? {}, 0)
      : [],
    [r.data, r.progress, showAchievements]
  );

  return (
    <div className="border border-border rounded-[16px] p-4 flex flex-col gap-4">
      <p className="text-[15px] font-semibold text-foreground">{r.skill}</p>

      {/* Progress ring */}
      <div className="flex items-center gap-4">
        <CircularProgress pct={pct} />
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2">
            <PhaseBars completed={phasesCompleted} />
            <span className="text-[12px] text-muted-foreground">{phasesCompleted} phase{phasesCompleted !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={13} className="text-primary" />
            <span className="text-[13px] font-semibold text-foreground">{xpEarned} XP</span>
          </div>
          <span className="text-[12px] text-muted-foreground">{total} steps total</span>
        </div>
      </div>

      {/* Achievements (streak partner only) */}
      {showAchievements && achievements.length > 0 && (
        <div>
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Achievements</p>
          <div className="grid grid-cols-3 gap-2">
            {achievements.map(a => (
              <AchievementBadge key={a.id} a={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Roadmap tabs for other profiles ─────────────────────────────────────────

function OtherRoadmapTabs({
  roadmaps, showAchievements,
}: { roadmaps: ProfileRoadmap[]; showAchievements: boolean }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const real = roadmaps.filter(r => r.data && r.progress);
  const selected = real[Math.min(selectedIdx, real.length - 1)] ?? null;

  if (real.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {real.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {real.map((r, i) => (
            <RoadmapTab
              key={r.id}
              label={r.skill || `Roadmap ${i + 1}`}
              active={i === selectedIdx}
              onClick={() => setSelectedIdx(i)}
            />
          ))}
        </div>
      )}
      {selected && (
        <OtherRoadmapCard r={selected} showAchievements={showAchievements} />
      )}
    </div>
  );
}

// ─── Other-user profile (friend / streak_partner / stranger) ──────────────────

function OtherProfile({ profile, name, initial }: { profile: ProfileViewRow; name: string; initial: string }) {
  const isStranger = profile.tier === 'stranger';
  const isStreakPartner = profile.tier === 'streak_partner';
  const isFriend = profile.tier === 'friend';
  const { xp, level } = xpModel(profile.completed_steps ?? 0);

  // Stranger: compact preview card only
  if (isStranger) {
    return <StrangerCard profile={profile} name={name} initial={initial} />;
  }

  const roadmaps = profile.roadmaps ?? [];
  const hasRoadmaps = roadmaps.length > 0;

  return (
    <div className="pt-2 flex flex-col gap-5 pb-6">
      {/* Avatar + name + partnership badge */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-foreground shrink-0">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-[16px] font-semibold text-foreground truncate">{name}</p>
            {isStreakPartner && (
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
                style={{ color: '#8a6a00', background: '#fff5d6', border: '1px solid #ffaa00' }}
              >
                <Flame size={9} style={{ color: '#ffaa00' }} /> Partner
              </span>
            )}
          </div>
          {profile.username && (
            <p className="text-[13px] font-medium text-primary truncate">@{profile.username}</p>
          )}
          {profile.bio && (
            <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-2 leading-snug">{profile.bio}</p>
          )}
          {profile.pro_skill && (
            <div className="inline-flex items-center gap-1 bg-accent px-2 py-0.5 rounded-[8px] mt-1">
              <Star size={10} className="text-primary" />
              <span className="text-[11px] font-semibold text-foreground">{profile.pro_skill}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats: Streak + XP + Level */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="border border-border rounded-[16px] p-3">
          <div className="flex items-center gap-1 mb-1">
            <Flame size={12} className="text-[#ffaa00]" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Streak</span>
          </div>
          <p className="text-[15px] font-bold text-foreground">
            {profile.current_streak ?? 0}
            <span className="text-[10px] font-medium text-muted-foreground ml-0.5">d</span>
          </p>
        </div>
        <div className="border border-border rounded-[16px] p-3">
          <div className="flex items-center gap-1 mb-1">
            <Zap size={12} className="text-primary" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">XP</span>
          </div>
          <p className="text-[15px] font-bold text-foreground">{xp}</p>
        </div>
        <div className="border border-border rounded-[16px] p-3">
          <div className="flex items-center gap-1 mb-1">
            <Star size={12} className="text-primary" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Level</span>
          </div>
          <p className="text-[15px] font-bold text-foreground">{level}</p>
        </div>
      </div>

      {/* XP progress chart — streak partner only */}
      {isStreakPartner && (
        <XPProgressChart
          streakLog={profile.streak_log}
          totalXp={xp}
          todayXp={0}
        />
      )}

      {/* Roadmaps */}
      {hasRoadmaps ? (
        <>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest -mb-2">Roadmaps</p>
          <OtherRoadmapTabs
            roadmaps={roadmaps}
            showAchievements={isStreakPartner}
          />
          {/* Daily task — streak partner only */}
          {isStreakPartner && (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Today's Plan</p>
              {roadmaps.map(r => {
                if (!r.data || !r.progress) return null;
                const roadmap: PartnerRoadmap = { id: r.id, skill: r.skill, data: r.data, progress: r.progress };
                return (
                  <div key={r.id} className="border border-primary rounded-2xl p-3.5" style={{ background: '#F8FDE7' }}>
                    <PartnerTodaysPlan roadmap={roadmap} withDivider={false} />
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          {isFriend ? `${name} hasn't shared any roadmaps yet.` : 'No roadmaps visible yet.'}
        </p>
      )}
    </div>
  );
}

// ─── States ───────────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="pt-2">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-[22px] bg-muted animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-32 bg-muted rounded animate-pulse" />
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="h-16 bg-muted rounded-2xl animate-pulse mb-3" />
      <div className="h-16 bg-muted rounded-2xl animate-pulse" />
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-16">
      <p className="text-sm font-semibold text-foreground">Couldn't load this profile</p>
      <p className="text-xs text-muted-foreground mt-1.5 max-w-[260px]">
        Something went wrong on our end — try again in a moment.
      </p>
    </div>
  );
}

function UnavailableState() {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-16">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <Users size={20} className="text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold text-foreground">This profile isn't available</p>
      <p className="text-xs text-muted-foreground mt-1.5 max-w-[260px]">
        It may not exist, or the owner hasn't made it visible.
      </p>
    </div>
  );
}

// ─── Main Profile screen ───────────────────────────────────────────────────────

export function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const smoothRef = useSmoothScroll<HTMLDivElement>();
  const { user } = useApp()!;

  const isSelf = !!user && !!id && (id === user.id || id === 'dev-bypass');

  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [profile, setProfile] = useState<ProfileViewRow | null>(null);

  useEffect(() => {
    if (!id) { setLoadState('unavailable'); return; }

    // For dev bypass, synthesise a self-profile without hitting Supabase
    if (id === 'dev-bypass' || (user?.id === 'dev-bypass' && id === user.id)) {
      setProfile({
        tier: 'self',
        username: 'demo',
        display_name: 'Divine',
        avatar_config: null,
        current_streak: 3,
        completed_steps: 0,
        roadmaps: [],
        streak_log: (() => {
          const log: Record<string, string> = {};
          const today = new Date();
          for (let i = 0; i < 3; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            log[localDateStr(d)] = 'completed';
          }
          return log;
        })(),
        notes: null,
      });
      setLoadState('ready');
      return;
    }

    let active = true;
    setLoadState('loading');
    setProfile(null);

    supabase
      .rpc('get_profile_view', { p_target_id: id })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) { setLoadState('error'); return; }

        const row = (Array.isArray(data) ? data[0] : data) as ProfileViewRow | undefined;

        if (!row || (row.tier === 'stranger' && !row.username && !row.display_name)) {
          setLoadState('unavailable');
          return;
        }

        setProfile(row);
        setLoadState('ready');
      });

    return () => { active = false; };
  }, [id, user?.id]);

  const name = profile?.display_name || profile?.username || 'Navigator user';
  const initial = name.slice(0, 1).toUpperCase();

  const isSelfView = profile?.tier === 'self' || isSelf;

  return (
    <div className="flex flex-col h-full">
      <div className="h-14 shrink-0" />

      {/* Header */}
      <div className="px-4 pb-3 shrink-0 flex items-center justify-between">
        {isSelfView ? (
          <>
            <p className="text-[20px] font-medium text-foreground" style={{ fontWeight: 510 }}>Profile</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/friends')}
                className="w-9 h-9 bg-background rounded-[12px] flex items-center justify-center border border-border"
                aria-label="Add friend"
              >
                <UserPlus size={18} className="text-foreground" />
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="w-9 h-9 bg-background rounded-[12px] flex items-center justify-center border border-border"
                aria-label="Settings"
              >
                <Settings size={18} className="text-foreground" />
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate(-1)}
              className="-ml-1 p-2 flex items-center justify-center"
              aria-label="Back"
            >
              <ArrowLeft size={24} strokeWidth={2.6} className="text-foreground" />
            </button>
            <h1 className="text-[20px] font-semibold text-foreground">
              {loadState === 'ready' ? name : 'Profile'}
            </h1>
            <div className="w-9" />
          </>
        )}
      </div>

      <div ref={smoothRef} className="flex-1 min-h-0 overflow-y-auto px-4 scrollbar-hide">
        {loadState === 'loading' && <LoadingState />}
        {loadState === 'error' && <ErrorState />}
        {loadState === 'unavailable' && <UnavailableState />}
        {loadState === 'ready' && profile && (
          isSelfView
            ? <SelfProfile profile={profile} />
            : <OtherProfile profile={profile} name={name} initial={initial} />
        )}
      </div>
    </div>
  );
}
