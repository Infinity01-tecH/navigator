import { useEffect, useRef, useState } from 'react';
import { Footprints, Flag, Flame, Target, Hammer, Zap, Share2 } from 'lucide-react';
import { pushAchievements } from '../../lib/sync';

// ─── Tiers ────────────────────────────────────────────────────────────────────
export type Tier = 'bronze' | 'silver' | 'gold' | 'legendary';

const TIER: Record<Tier, { ring: string; fill: string; chip: string; label: string }> = {
  bronze:    { ring: '#cd7f32', fill: '#f7ecd9', chip: '#8a5a24', label: 'Bronze' },
  silver:    { ring: '#9aa3af', fill: '#eef1f5', chip: '#5a6472', label: 'Silver' },
  gold:      { ring: '#f5b301', fill: '#fff5d6', chip: '#8a6a00', label: 'Gold' },
  legendary: { ring: '#8b5cf6', fill: '#f0e9ff', chip: '#5b34c4', label: 'Legendary' },
};

// ─── Definitions ────────────────────────────────────────────────────────────────
export interface AchievementDef {
  id: string;
  label: string;
  description: string;
  tier: Tier;
  Icon: typeof Footprints;
  milestone?: boolean; // more elaborate unlock animation
}

const DEFS: AchievementDef[] = [
  { id: 'first_steps',     label: 'First Steps',     description: 'Complete your very first step.',        tier: 'bronze',    Icon: Footprints },
  { id: 'phase_1',         label: 'Phase 1 Done',    description: 'Finish every step in Phase 1.',         tier: 'silver',    Icon: Flag },
  { id: 'week_warrior',    label: 'Week Warrior',    description: 'Keep a 7-day learning streak.',         tier: 'silver',    Icon: Flame },
  { id: 'deep_diver',      label: 'Deep Diver',      description: 'Complete 10 steps overall.',            tier: 'gold',      Icon: Target },
  { id: 'project_builder', label: 'Project Builder', description: 'Finish all build/project steps.',       tier: 'gold',      Icon: Hammer },
  { id: 'speed_runner',    label: 'Speed Runner',    description: 'Complete 15 steps overall.',            tier: 'legendary', Icon: Zap, milestone: true },
];

export interface AchievementState extends AchievementDef {
  current: number;
  target: number;
  earned: boolean;
  pct: number;
}

// Minimal shape computeAchievements actually needs. Deliberately NOT the
// full `Roadmap` type from generateRoadmap.ts — this also has to accept a
// streak partner's stripped roadmap payload (Main.tsx's PartnerRoadmap.data),
// which only ever carries id/type per step (learn/practice/inspire are
// never sent to that tier). Both RoadmapStep and PartnerStep satisfy this
// structurally, so neither caller needs a cast.
export interface AchievableRoadmap {
  phases: { steps: { id: string; type: string }[] }[];
}

export function computeAchievements(
  roadmap: AchievableRoadmap | null,
  progress: Record<string, boolean>,
  streakDays: number,
): AchievementState[] {
  const phases = roadmap?.phases ?? [];
  const allSteps = phases.flatMap(p => p.steps);
  const completed = allSteps.filter(s => progress[s.id]).length;
  const phase1 = phases[0]?.steps ?? [];
  const phase1Done = phase1.filter(s => progress[s.id]).length;
  const buildSteps = allSteps.filter(s => s.type === 'build');
  const buildDone = buildSteps.filter(s => progress[s.id]).length;

  const raw: Record<string, [number, number]> = {
    first_steps:     [Math.min(completed, 1), 1],
    phase_1:         [phase1Done, Math.max(phase1.length, 1)],
    week_warrior:    [Math.min(streakDays, 7), 7],
    deep_diver:      [Math.min(completed, 10), 10],
    project_builder: [buildDone, Math.max(buildSteps.length, 1)],
    speed_runner:    [Math.min(completed, 15), 15],
  };

  return DEFS.map(def => {
    const [current, target] = raw[def.id];
    const earned = current >= target;
    return { ...def, current, target, earned, pct: Math.round((current / target) * 100) };
  });
}

// ─── Badge — design-faithful circular medallion ──────────────────────────────────
export function AchievementBadge({ a }: { a: AchievementState }) {
  const { Icon } = a;
  const gradId = `ach-grad-${a.id}`;

  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-[16px] bg-card text-center">
      {/* Circular gradient medallion */}
      <div className="relative flex items-center justify-center shrink-0" style={{ width: 53, height: 53 }}>
        <svg width="53" height="53" viewBox="0 0 52.875 52.875" className="absolute inset-0" fill="none">
          <defs>
            <linearGradient id={gradId} x1="46.665" y1="10.615" x2="8.165" y2="41.615" gradientUnits="userSpaceOnUse">
              {a.earned ? (
                <>
                  <stop stopColor="#8CB200" />
                  <stop offset="1" stopColor="#CDFF14" />
                </>
              ) : (
                <>
                  <stop stopColor="#ABA9A9" />
                  <stop offset="1" stopColor="white" />
                </>
              )}
            </linearGradient>
          </defs>
          <path
            d="M26.4458 48.8247C38.8043 48.8247 48.8229 38.8061 48.8229 26.4475C48.8229 14.089 38.8043 4.07038 26.4458 4.07038C14.0872 4.07038 4.06864 14.089 4.06864 26.4475C4.06864 38.8061 14.0872 48.8247 26.4458 48.8247Z"
            fill={`url(#${gradId})`}
          />
        </svg>
        <div className="relative z-10 flex items-center justify-center">
          <Icon size={22} color={a.earned ? '#F9FFE6' : '#A7ABB4'} />
        </div>
      </div>

      {/* Label */}
      <span className="text-[10px] font-bold text-muted-foreground leading-tight">
        {a.label}
      </span>

      {/* Progress counter (locked badges) */}
      {!a.earned && a.target > 1 && (
        <span className="text-[9px] font-semibold text-muted-foreground -mt-1">
          {a.current}/{a.target}
        </span>
      )}
    </div>
  );
}

// ─── Unlock overlay (queued, one at a time) ──────────────────────────────────────
export function AchievementUnlock({ a, onDismiss }: { a: AchievementState; onDismiss: () => void }) {
  const t = TIER[a.tier];
  const { Icon } = a;
  const confetti = Array.from({ length: 24 });

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center px-8 text-center" style={{ background: 'rgba(19,25,39,0.55)' }}>
      <style>{`
        @keyframes badgePop { 0% { transform: scale(0.3); opacity: 0; } 60% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes confettiFall { to { transform: translateY(420px) rotate(360deg); opacity: 0; } }
      `}</style>

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((_, i) => {
          const colors = [t.ring, '#c8f135', '#0095ff', '#ffaa00'];
          return (
            <span
              key={i}
              className="absolute top-[-20px] w-2 h-3 rounded-sm"
              style={{
                left: `${(i * 4.1) % 100}%`,
                background: colors[i % colors.length],
                animation: `confettiFall ${1.6 + (i % 5) * 0.25}s linear ${(i % 7) * 0.12}s infinite`,
              }}
            />
          );
        })}
      </div>

      <div
        className="w-24 h-24 rounded-[28px] flex items-center justify-center mb-5"
        style={{ background: t.fill, border: `3px solid ${t.ring}`, animation: 'badgePop 0.6s ease', boxShadow: `0 8px 30px ${t.ring}66` }}
      >
        <Icon size={44} style={{ color: t.ring }} />
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-1">
        {a.milestone ? 'Milestone Unlocked!' : 'Achievement Unlocked!'}
      </p>
      <h2 className="text-2xl font-bold text-white mb-1">{a.label}</h2>
      <p className="text-sm text-white/80 max-w-[260px] mb-7">{a.description}</p>

      <div className="flex flex-col gap-2 w-full max-w-[280px]">
        <button
          onClick={onDismiss}
          className="w-full h-12 rounded-full text-sm font-bold text-foreground bg-primary hover:bg-primary transition-colors"
        >
          Nice!
        </button>
        <button
          onClick={() => { navigator.share?.({ title: 'Navigator', text: `I just unlocked "${a.label}" on Navigator! 🎉` }).catch(() => {}); }}
          className="w-full h-11 rounded-full text-sm font-semibold text-white/90 hover:bg-background/10 transition-colors flex items-center justify-center gap-2"
        >
          <Share2 size={15} /> Share
        </button>
      </div>
    </div>
  );
}

// ─── Streak celebration (on app open when streak increased) ──────────────────────
// Full-screen takeover pattern, kept as-is per product decision (not converted to
// a banner). Two things fixed here vs. the original: (1) the count-up used to be
// unbounded — 90ms per tick meant a 200-day streak took 18s of blocking animation
// for exactly the most loyal users; now capped to ~1.1s total regardless of streak
// length, stepping in bigger increments for large counts so it still reads as
// "counting up fast" rather than freezing then jumping. (2) flameBounce was a
// single icon bobbing up/down — not real fire motion. Added a flicker (scale +
// opacity variance, since real flame doesn't move uniformly) plus a handful of
// rising/fading ember particles, matching the spirit of AchievementUnlock's
// confetti above rather than inventing a third animation language in this file.
const STREAK_ANIM_MS = 1100;

function StreakEmbers() {
  const embers = Array.from({ length: 10 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {embers.map((_, i) => {
        const left = 30 + ((i * 37) % 40); // cluster roughly under/around the flame icon
        const delay = (i % 5) * 0.35;
        const duration = 1.8 + (i % 4) * 0.3;
        const size = i % 3 === 0 ? 4 : 3;
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              bottom: '46%',
              width: size,
              height: size,
              background: i % 2 === 0 ? '#ffaa00' : '#ffcf70',
              animation: `emberRise ${duration}s ease-out ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

export function StreakCelebration({ days, onContinue }: { days: number; onContinue: () => void }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (days <= 0) { setShown(0); return; }
    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / STREAK_ANIM_MS);
      // Ease-out: fast climb early, settles into the exact final number rather
      // than a linear crawl — reads well whether days is 3 or 300.
      const eased = 1 - Math.pow(1 - progress, 2);
      setShown(Math.round(eased * days));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [days]);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center px-8 text-center"
      style={{ background: 'linear-gradient(160deg, #FFF7E6 0%, #F8FDE7 100%)' }}>
      <style>{`
        @keyframes flameFlicker {
          0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
          20%      { transform: translateY(-2px) scale(1.05); opacity: 0.92; }
          45%      { transform: translateY(-7px) scale(0.97); opacity: 1; }
          70%      { transform: translateY(-3px) scale(1.08); opacity: 0.95; }
        }
        @keyframes emberRise {
          0%   { transform: translateY(0) scale(1); opacity: 0.9; }
          100% { transform: translateY(-70px) scale(0.3); opacity: 0; }
        }
      `}</style>
      <div className="relative w-24 h-24 mb-6">
        <StreakEmbers />
        <div
          className="relative w-24 h-24 rounded-full bg-background shadow-lg flex items-center justify-center"
          style={{ animation: 'flameFlicker 1.1s ease-in-out infinite' }}
        >
          <Flame size={48} className="text-[#ffaa00]" />
        </div>
      </div>
      <p className="text-6xl font-bold text-foreground mb-1">{shown}</p>
      <p className="text-sm font-semibold text-[#9a7b2e] mb-1">day streak 🔥</p>
      <p className="text-sm text-muted-foreground max-w-[260px] mb-8">You're on fire — showing up every day is how it compounds. Keep going!</p>
      <button
        onClick={onContinue}
        className="w-full max-w-[280px] h-12 rounded-full text-sm font-bold text-foreground bg-primary hover:bg-primary transition-colors"
      >
        Continue
      </button>
    </div>
  );
}

// ─── Unlock detection hook ───────────────────────────────────────────────────────
// Achievements are scoped per roadmap: the earned set is keyed by the roadmap's
// entry id (`nav_earned_ach_<entryId>`), so Reset/Delete of one roadmap only
// clears its own achievements. Each unlock fires its overlay exactly once, and
// multiple unlocks queue one at a time. Earned sets sync cross-device.
export function useAchievementUnlocks(entryId: string | null, achievements: AchievementState[]) {
  const [queue, setQueue] = useState<AchievementState[]>([]);
  const initializedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!entryId) return;
    const key = `nav_earned_ach_${entryId}`;

    let prev: string[] = [];
    try { prev = JSON.parse(localStorage.getItem(key) ?? '[]'); } catch {}
    const earnedNow = achievements.filter(a => a.earned).map(a => a.id);

    // Reset the baseline whenever the active roadmap changes — don't replay one
    // roadmap's history against another's.
    if (initializedFor.current !== entryId) {
      initializedFor.current = entryId;
      setQueue([]);
      try { localStorage.setItem(key, JSON.stringify(earnedNow)); } catch {}
      pushAchievements();
      return;
    }

    const fresh = achievements.filter(a => a.earned && !prev.includes(a.id));
    if (fresh.length > 0) {
      setQueue(q => [...q, ...fresh]);
      try { localStorage.setItem(key, JSON.stringify(earnedNow)); } catch {}
      pushAchievements();
    }
  }, [entryId, achievements]);

  const current = queue[0] ?? null;
  const dismiss = () => setQueue(q => q.slice(1));
  return { current, dismiss };
}
