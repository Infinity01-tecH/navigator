import { useEffect, useState } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

// ─── Shared quiz results page ────────────────────────────────────────────────
// Full-screen takeover, matching QuizInterrupt's existing shell pattern
// (absolute inset-0 z-50 inside the app's 390px frame — see DESIGN-SYSTEM.md
// §9.3). Used by both QuizModal (roadmap step quiz, was a bottom sheet with
// an inline result block) and QuizInterrupt (YouTube chapter quiz, previously
// had no pass screen at all and a bespoke inline fail state). One component,
// two call sites — the ring and copy logic shouldn't drift into two versions.
//
// Ring visual reuses the SAME stroke-dashoffset technique as AchievementBadge
// (see HANDOFF.md §12 / DESIGN-SYSTEM.md §1.5 tier colors) rather than
// inventing a new progress-ring pattern for this one screen.
//
// Deliberately dumb: this component only ever displays a score and hands
// control back via one explicit button. It doesn't know about retry logic,
// XP, or chapter/step semantics — those stay owned by the caller.

const RING_SIZE = 132;
const RING_STROKE = 10;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export interface QuizReviewItem {
  question: string;
  correct: boolean;
  explanation?: string;
}

interface QuizResultProps {
  correct: number;
  total: number;
  passThreshold: number; // e.g. 0.7 — matches QUIZ_PASS_THRESHOLD / QuizInterrupt's 70% bar
  onPrimaryAction: () => void; // "Continue" on pass, "Try Again" on fail
  primaryLabel?: string; // override, e.g. QuizInterrupt uses "Continue" not "Nice — step complete"
  onSecondaryAction?: () => void; // optional second option (e.g. "Rewatch chapter")
  secondaryLabel?: string;
  onSkip?: () => void; // bare escape hatch — no XP/penalty logic, caller decides what "skip" means
  // Optional per-question breakdown, shown collapsed under the ring — fail
  // state only (a passed quiz doesn't need a review). Caller-supplied so
  // QuizInterrupt isn't forced to assemble one if it doesn't have explanations
  // readily on hand for the whole set.
  review?: QuizReviewItem[];
}

export function QuizResult({
  correct, total, passThreshold, onPrimaryAction, primaryLabel,
  onSecondaryAction, secondaryLabel, onSkip, review,
}: QuizResultProps) {
  const pct = total > 0 ? correct / total : 0;
  const passed = pct >= passThreshold;
  const [reviewOpen, setReviewOpen] = useState(false);

  // Ring fills from 0 on mount to the real score — a static pre-filled ring
  // reads as inert; animating it in gives the number somewhere to land.
  const [animatedPct, setAnimatedPct] = useState(0);
  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimatedPct(pct));
    return () => cancelAnimationFrame(t);
  }, [pct]);

  const offset = RING_CIRCUMFERENCE * (1 - animatedPct);
  const ringColor = passed ? '#c8f135' : '#e0533d';
  const ringTrack = '#f3f4f6';

  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center px-6 text-center" style={{ paddingTop: 32, paddingBottom: 16 }}>
        <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
          <svg width={RING_SIZE} height={RING_SIZE} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS}
              fill="none" stroke={ringTrack} strokeWidth={RING_STROKE}
            />
            <circle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS}
              fill="none" stroke={ringColor} strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.34,1.2,0.64,1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{correct}/{total}</span>
          </div>
        </div>

        <div className="mt-6 shrink-0">
          {passed ? (
            <>
              <p className="text-lg font-bold text-foreground mb-1.5">Nailed it 🎉</p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
                You got {correct} out of {total} — that's a pass.
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-foreground mb-1.5">Oh no, you didn't get it</p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
                {correct} out of {total} — you need {Math.round(passThreshold * 100)}% to pass. Give it another go.
              </p>
            </>
          )}
        </div>

        {!passed && review && review.length > 0 && (
          <div className="w-full mt-5 text-left shrink-0">
            <button
              onClick={() => setReviewOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-[16px] bg-card"
            >
              <span className="text-xs font-semibold text-foreground">Review your answers</span>
              <ChevronDown
                size={15} className="text-muted-foreground transition-transform"
                style={{ transform: reviewOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            {reviewOpen && (
              <div className="mt-2 flex flex-col gap-2">
                {review.map((item, i) => (
                  <div key={i} className={`px-3.5 py-3 rounded-[16px] ${item.correct ? 'bg-accent' : 'bg-card'}`}>
                    <div className="flex items-start gap-2">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: item.correct ? '#c8f135' : '#fdeeeb' }}
                      >
                        {item.correct
                          ? <Check size={10} className="text-foreground" />
                          : <X size={10} className="text-[#e0533d]" />}
                      </div>
                      <p className="text-[13px] font-medium text-foreground leading-snug">{item.question}</p>
                    </div>
                    {item.explanation && (
                      <p className="text-[11px] text-muted-foreground mt-1.5 ml-6 leading-relaxed">{item.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full flex flex-col gap-2.5 px-6 shrink-0" style={{ paddingBottom: 24 }}>
        <button
          onClick={onPrimaryAction}
          className="w-full h-[56px] bg-primary text-foreground text-[16px] font-semibold rounded-full transition-all"
        >
          {primaryLabel ?? (passed ? 'Continue' : 'Try Again')}
        </button>
        {onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="w-full h-[56px] bg-card text-foreground text-[16px] font-semibold rounded-full transition-all"
          >
            {secondaryLabel}
          </button>
        )}
        {!passed && onSkip && (
          <button
            onClick={onSkip}
            className="w-full h-10 text-muted-foreground text-xs font-semibold rounded-full transition-all hover:text-muted-foreground"
          >
            Skip this question →
          </button>
        )}
      </div>
    </div>
  );
}
