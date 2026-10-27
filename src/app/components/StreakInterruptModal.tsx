// StreakInterruptModal.tsx
//
// The two-choice interrupt for a pending streak miss. Reads `streakStatus`,
// `currentStreak`, and `activateFreeze` straight from useApp() — no data
// props needed, only a navigation callback.
//
// ── INTEGRATION ──────────────────────────────────────────────────────────
// Drop this at src/app/components/StreakInterruptModal.tsx (sibling to
// RichEditor.tsx / achievements.tsx). Mount it once, as a sibling anywhere
// inside Main()'s returned JSX — it manages its own visibility and stacks
// via z-[60], exactly like <StreakCelebration/> already does:
//
//   <StreakInterruptModal onGoToToday={() => setTab('today')} />
//
// It renders nothing until there's an actual pending miss, and it does NOT
// navigate or own tab state itself — "Do Today's Task" only calls the
// onGoToToday callback you pass in, so it stays decoupled from however
// Main.tsx's tabs actually work under the hood. Unlike StreakCelebration,
// this does NOT need an early-return gate in Main() itself — it's a normal
// mounted sibling that renders null until streakStatus.hasPendingMiss is
// true, then covers the viewport itself. (StreakCelebration's early-return
// is there because it also *replaces* the tab shell/nav bar entirely before
// they'd otherwise render; this component achieves the same visual result
// by covering them with a z-[60] opaque layer instead, without requiring
// Main()'s control flow to change.)
//
// ── FULL-SCREEN, NOT A DIALOG ────────────────────────────────────────────
// Originally built on Radix Dialog (portal to document.body) on the theory
// that Layout.tsx's Framer Motion route wrapper — which applies a
// `transform` — creates a new containing block for `position: fixed`
// descendants, clipping/mispositioning a hand-rolled fixed overlay.
//
// That reasoning doesn't hold here, and building on it would have made this
// the one full-screen moment in the app that doesn't match the others:
// the transformed `motion.div` is itself `absolute inset-0` inside a
// 390px-wide, `h-screen` shell (Layout.tsx). A `fixed inset-0` descendant
// contained by that transform resolves to exactly that same 390px/h-screen
// box — which on a real device *is* the viewport, and on a wider preview
// is the mechanism correctly keeping the app's UI scoped to the phone
// frame instead of sprawling across the window. StreakCelebration already
// relies on this (same `fixed inset-0`, no portal) with no reported issue.
// Portaling past it would have made this component's backdrop cover the
// full window on wide viewports while StreakCelebration's doesn't —  a
// real, checkable visual inconsistency between two moments meant to read
// as the same pattern. So: no Dialog, no portal, same `fixed inset-0`
// mechanism as StreakCelebration.
//
// Known cost of dropping Dialog, stated plainly rather than glossed over:
// no focus trap and no Escape-to-close. Escape/click-outside dismissal is
// arguably wrong for this component anyway — it's a forced two-choice
// interrupt, not a casually-dismissible popover, and StreakCelebration
// itself has no dismiss path except its own explicit "Continue" button.
// The focus-trap loss is real, though: the bottom nav underneath is
// visually covered but still mounted, so a keyboard user tabbing through
// this screen can reach it. Not fixed here — flagging it as a known,
// shared gap with StreakCelebration (same issue, pre-existing, not
// introduced by this component) rather than quietly building a one-off
// hand-rolled focus trap that no other full-screen moment in the app has.
//
// ── COLOR CORRECTIONS FROM THE DIALOG VERSION ────────────────────────────
// The Dialog version used `#e8f4ff` for the freeze icon tile and a lime
// flame icon for the choice-step. Neither matches an existing token:
//   - Frozen/freeze blue here is now the *exact* pair StreakStrip already
//     uses for a frozen day (`STREAK_DOT.frozen` in Main.tsx: bg `#e6f4ff`,
//     border `#a8d4ff`, icon `#0095ff`) — so the icon in this modal and a
//     frozen cell in the strip below both read as the same color, not two
//     close-but-different blues.
//   - The flame icon is now `#ffaa00` (STREAK_DOT.completed / the exact
//     color StreakCelebration's own flame uses), not the app's generic
//     lime accent. Streak = fire = orange is already the established
//     color language everywhere else this app shows a streak; the lime
//     flame in the old version was the one place that broke it.
//
// ── NOT HANDLED HERE (flagging, not guessing) ────────────────────────────
// Remaining monthly freeze quota isn't shown before the attempt — there's
// no field for it on StreakStatus yet. If activate_freeze() rejects for
// quota exhaustion, the real server message surfaces in the error box
// below the slider; nothing is pre-checked or guessed client-side.

import { useEffect, useRef, useState } from 'react';
import { Flame, Snowflake, ArrowLeft } from 'lucide-react';
import { useApp } from '../../lib/context';

interface StreakInterruptModalProps {
  onGoToToday: () => void;
}

type Step = 'choice' | 'freeze' | 'success';

function extractErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === 'string' && msg.trim()) return msg;
  }
  return "Couldn't activate the freeze. Try again.";
}

// Same pattern as Time.tsx's track(): gradient fill up to the current value.
function trackGradient(value: number, min: number, max: number): string {
  const pct = ((value - min) / (max - min)) * 100;
  return `linear-gradient(to right, #c8f135 ${pct}%, #e5e7ea ${pct}%)`;
}

// Shared icon-circle shell for all three steps — same 96px white-circle +
// shadow container StreakCelebration's own flame uses, just re-skinned per
// step so the three moments in this modal read as siblings of each other.
function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-24 h-24 rounded-full bg-background shadow-lg flex items-center justify-center mb-6">
      {children}
    </div>
  );
}

// ─── Fire-to-blue freeze-activation morph ─────────────────────────────────
// The one piece of the streak feature flagged across §0.7/§0.8/§0.9/§0.10 as
// genuinely unbuilt: the actual moment of watching the flame turn blue when
// a freeze activates, not just the static end states (flame in `choice`,
// snowflake wherever a frozen day already renders elsewhere in the app).
//
// One-shot, not infinite — this has to finish and settle on the snowflake,
// unlike flameFlicker/emberRise in achievements.tsx which loop for as long
// as their screen is up. Timing/feel intentionally borrowed from that file
// rather than invented fresh: flameFlicker's 1.1s ease-in-out scale+opacity
// wobble is reused verbatim for the flame's exit half, so a flame animating
// in this modal and a flame animating in StreakCelebration read as the same
// material, not two different animation vocabularies for the same icon.
//
// Sequence: flame flickers in place (~350ms) → crosses over into the
// snowflake via an opacity/scale swap (~450ms) while a blue radial wash
// sweeps the icon circle behind it, selling "freezing" rather than just
// "one icon replaced by another" → settles on the snowflake, static, which
// is what was already there before this change (IconCircle + Snowflake in
// the success step). Total ~800ms — in the same order as StreakCelebration's
// capped 1.1s count-up, not a competing multi-second set piece.
const MORPH_FLAME_MS = 350;
const MORPH_CROSSOVER_MS = 450;

function FreezeMorphIcon() {
  const [phase, setPhase] = useState<'flame' | 'crossing' | 'frozen'>('flame');

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase('crossing'), MORPH_FLAME_MS);
    const t2 = window.setTimeout(() => setPhase('frozen'), MORPH_FLAME_MS + MORPH_CROSSOVER_MS);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, []);

  const flameOut = phase !== 'flame';
  const snowIn = phase !== 'flame';

  return (
    <div className="relative w-24 h-24 mb-6">
      {/* Blue wash — behind both icons, sweeps in only during the crossover
          beat so it reads as "the freeze taking hold," not a permanent tint
          on the flame phase or a lingering effect after settling. */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, #e6f4ff 0%, rgba(230,244,255,0) 70%)',
          opacity: phase === 'crossing' ? 1 : 0,
          transition: `opacity ${MORPH_CROSSOVER_MS}ms ease-out`,
        }}
      />
      <div className="relative w-24 h-24 rounded-full bg-background shadow-lg flex items-center justify-center overflow-hidden">
        <Flame
          size={44}
          className="text-[#ffaa00] absolute"
          style={{
            opacity: flameOut ? 0 : 1,
            transform: flameOut ? 'scale(0.5) rotate(-8deg)' : 'scale(1)',
            transition: `opacity ${MORPH_CROSSOVER_MS}ms ease-in, transform ${MORPH_CROSSOVER_MS}ms ease-in`,
            animation: phase === 'flame' ? 'freezeFlameFlicker 1.1s ease-in-out infinite' : undefined,
          }}
        />
        <Snowflake
          size={44}
          className="text-[#0095ff] absolute"
          style={{
            opacity: snowIn ? 1 : 0,
            transform: snowIn ? 'scale(1)' : 'scale(0.5) rotate(8deg)',
            transition: `opacity ${MORPH_CROSSOVER_MS}ms ease-out, transform ${MORPH_CROSSOVER_MS}ms ease-out`,
          }}
        />
      </div>
      <style>{`
        @keyframes freezeFlameFlicker {
          0%, 100% { transform: scale(1); opacity: 1; }
          20%      { transform: scale(1.05); opacity: 0.92; }
          45%      { transform: scale(0.97); opacity: 1; }
          70%      { transform: scale(1.08); opacity: 0.95; }
        }
      `}</style>
    </div>
  );
}

export function StreakInterruptModal({ onGoToToday }: StreakInterruptModalProps) {
  const { streakStatus, currentStreak, activateFreeze } = useApp();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('choice');
  const [days, setDays] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guards against re-opening every render after the user has already acted
  // once this mount. Without this: "Do Today's Task" closes the overlay and
  // calls onGoToToday(), but streakStatus.hasPendingMiss stays true until an
  // actual completion lands server-side — so the very next render would
  // satisfy "hasPendingMiss is true" again and pop the screen right back
  // up, one tab-switch after the user just closed it.
  const shownOnceRef = useRef(false);

  useEffect(() => {
    if (streakStatus?.hasPendingMiss && !shownOnceRef.current) {
      shownOnceRef.current = true;
      setStep('choice');
      setError(null);
      setOpen(true);
    }
  }, [streakStatus?.hasPendingMiss]);

  // No portal, no exit animation to preserve — unlike the Dialog version,
  // there's no reason to stay mounted-but-hidden. `open` is the only gate.
  if (!open) return null;

  function handleDoTask() {
    setOpen(false);
    onGoToToday();
  }

  async function handleConfirmFreeze() {
    setSubmitting(true);
    setError(null);
    try {
      await activateFreeze(days);
      setStep('success');
      window.setTimeout(() => setOpen(false), 1400);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-6"
      style={{ background: 'rgba(19,25,39,0.55)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-interrupt-title"
      aria-describedby="streak-interrupt-desc"
    >
      <div className="relative w-full max-w-[340px] bg-background rounded-2xl px-6 pt-8 pb-6 text-center">
        {step === 'freeze' && (
          <button
            onClick={() => { setStep('choice'); setError(null); }}
            disabled={submitting}
            aria-label="Back"
            className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center
                       rounded-full hover:bg-muted transition-colors disabled:opacity-40"
          >
            <ArrowLeft size={22} strokeWidth={2.6} className="text-foreground" />
          </button>
        )}

        {step === 'choice' && (
          <div className="flex flex-col items-center">
            {/* Flame + streak number, side by side rather than the old
                free-standing icon circle — the number is the actual stake
                being communicated here, so it sits next to the flame
                instead of being buried in the paragraph below. */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-14 h-14 rounded-full bg-[#fff4e0] flex items-center justify-center">
                <Flame size={28} className="text-[#ffaa00]" />
              </div>
              {currentStreak ? (
                <span className="text-3xl font-bold text-foreground">{currentStreak}</span>
              ) : null}
            </div>

            <h2 id="streak-interrupt-title" className="text-xl font-bold text-foreground mb-2">
              Freeze streak?
            </h2>
            <p id="streak-interrupt-desc" className="text-[13px] text-muted-foreground max-w-[260px] mb-6 leading-relaxed">
              {currentStreak
                ? `You're on a ${currentStreak}-day streak, but haven't logged a task recently.`
                : "You haven't logged a task recently."}{' '}
              Freeze it to hold your spot, or do today's task to keep it going.
            </p>

            <button
              onClick={() => setStep('freeze')}
              className="w-full h-12 text-white text-sm font-semibold rounded-full
                         transition-all"
              style={{ background: 'linear-gradient(to right, #0095ff, #0077cc)' }}
            >
              Freeze Streak
            </button>

            <button
              onClick={handleDoTask}
              className="mt-4 text-sm font-semibold text-accent-foreground underline underline-offset-2
                         hover:text-accent-foreground transition-colors"
            >
              Do today's task instead
            </button>
          </div>
        )}

        {step === 'freeze' && (
          <div className="flex flex-col items-center">
            <IconCircle>
              <Snowflake size={44} className="text-[#0095ff]" />
            </IconCircle>

            <h2 id="streak-interrupt-title" className="text-xl font-bold text-foreground mb-2">
              Choose your freeze length
            </h2>
            <p id="streak-interrupt-desc" className="text-[13px] text-muted-foreground max-w-[260px] mb-6">
              A freeze holds your streak in place without logging a task.
            </p>

            <div className="w-full">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Freeze length
                </span>
                <span className="text-2xl font-bold text-foreground">
                  {days}{' '}
                  <span className="text-sm font-medium text-muted-foreground">
                    day{days === 1 ? '' : 's'}
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={days}
                onChange={e => setDays(Number(e.target.value))}
                aria-label="Freeze length in days"
                style={{
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  height: 6,
                  borderRadius: 3,
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  background: trackGradient(days, 1, 10),
                }}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5">
                <span>1 day</span>
                <span>10 days</span>
              </div>

              {error && (
                <p className="text-[13px] text-[#e0533d] bg-[#fdeeeb] rounded-xl px-3 py-2 mt-3">
                  {error}
                </p>
              )}

              <button
                onClick={handleConfirmFreeze}
                disabled={submitting}
                className="w-full h-12 mt-5 bg-primary text-foreground text-sm font-semibold
                           rounded-full hover:bg-primary transition-all
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Activating…' : `Activate ${days}-Day Freeze`}
              </button>
            </div>

            <style>{`
              input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 22px; height: 22px;
                border-radius: 50%;
                background: #c8f135;
                border: 2px solid #fff;
                box-shadow: 0 1px 4px rgba(19,25,39,0.2);
                cursor: pointer;
              }
              input[type=range]::-moz-range-thumb {
                width: 22px; height: 22px;
                border-radius: 50%;
                background: #c8f135;
                border: 2px solid #fff;
                box-shadow: 0 1px 4px rgba(19,25,39,0.2);
                cursor: pointer;
              }
            `}</style>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center">
            <FreezeMorphIcon />

            <h2 id="streak-interrupt-title" className="text-xl font-bold text-foreground mb-2">
              Freeze activated
            </h2>
            <p id="streak-interrupt-desc" className="text-[13px] text-muted-foreground max-w-[260px]">
              Your streak is safe for the next {days} day{days === 1 ? '' : 's'}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
