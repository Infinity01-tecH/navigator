import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { generateStepQuiz, draftStepQuiz, QUIZ_PASS_THRESHOLD, type QuizQuestion } from '../lib/generateRoadmap';
import type { RoadmapResource, RoadmapStep } from '../lib/generateRoadmap';
import { QuizResult } from '../app/components/QuizResult';

// ─── localStorage cache ──────────────────────────────────────────────────────
// Mirrors nav_topic_notes' pattern, with one deliberate difference: keyed by
// `${entryId}:${stepId}`, not stepId alone. Step IDs are assigned per-roadmap
// generation (see generateRoadmap.ts) and are not guaranteed globally unique —
// two different roadmaps can very plausibly produce the same step.id (e.g. if
// IDs are positional, "phase1-step1" in an Observation roadmap collides with
// "phase1-step1" in an unrelated one generated earlier). A stepId-only key
// means the SECOND roadmap's Step 1 silently reads back the FIRST roadmap's
// cached quiz — different skill, different content, same slot. Prefixing
// with entryId (RoadmapEntry.id, unique per roadmap — see context.tsx) closes
// that off entirely, independent of whatever step.id turns out to be.
const CACHE_KEY = 'nav_step_quizzes';

function cacheKey(entryId: string, stepId: string): string {
  return `${entryId}:${stepId}`;
}

function readCache(): Record<string, QuizQuestion[]> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCache(key: string, questions: QuizQuestion[]) {
  try {
    const all = readCache();
    all[key] = questions;
    localStorage.setItem(CACHE_KEY, JSON.stringify(all));
  } catch {
    // best-effort cache — a failed write just means regenerating next time, not a broken quiz
  }
}

interface QuizModalProps {
  skill: string;
  entryId: string; // RoadmapEntry.id — namespaces the quiz cache per-roadmap, see cacheKey() above
  step: RoadmapStep;
  onPass: () => void;   // caller fires toggleStep from here — modal never touches progress state itself
  onClose: () => void;  // X button — abort, nothing persisted, checkbox stays unchecked
}

type Phase = 'loading' | 'answering' | 'result' | 'error';

export function QuizModal({ skill, entryId, step, onPass, onClose }: QuizModalProps) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [attempt, setAttempt] = useState(1);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const key = cacheKey(entryId, step.id);
      const cached = readCache()[key];
      if (cached && cached.length > 0) {
        setQuestions(cached);
        setAnswers(new Array(cached.length).fill(null));
        setPhase('answering');
        return;
      }

      const resourceTitles = [...(step.learn ?? []), ...(step.practice ?? []), ...(step.inspire ?? [])]
        .map(r => r.title)
        .filter(Boolean)
        .slice(0, 5);

      try {
        const qs = await generateStepQuiz(skill, step.title, step.note, resourceTitles);
        if (cancelled) return;
        writeCache(key, qs);
        setQuestions(qs);
        setAnswers(new Array(qs.length).fill(null));
        setPhase('answering');
      } catch {
        // Deliberately-easy fallback per product decision: AI failure must
        // never turn a hard gate into a hard block. Still gates (still
        // requires clicking through correctly), just trivially so.
        if (cancelled) return;
        const qs = draftStepQuiz(step.title, step.type);
        setUsedFallback(true);
        writeCache(key, qs); // cache the fallback too — don't hammer groq-proxy on every retry while it's down
        setQuestions(qs);
        setAnswers(new Array(qs.length).fill(null));
        setPhase('answering');
      }
    }

    load();
    return () => { cancelled = true; };
    // entryId + step.id only — regenerating on every keystroke-adjacent re-render would defeat the cache
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryId, step.id]);

  function submit() {
    setPhase('result');
  }

  function retry() {
    setAnswers(new Array(questions.length).fill(null));
    setAttempt(a => a + 1);
    setPhase('answering');
  }

  const score = questions.length > 0
    ? answers.filter((a, i) => a === questions[i].correct_index).length / questions.length
    : 0;
  const passed = phase === 'result' && score >= QUIZ_PASS_THRESHOLD;
  const allAnswered = answers.length > 0 && answers.every(a => a !== null);

  if (phase === 'result') {
    return (
      <div className="fixed inset-0 z-50">
        <QuizResult
          correct={Math.round(score * questions.length)}
          total={questions.length}
          passThreshold={QUIZ_PASS_THRESHOLD}
          onPrimaryAction={passed ? onPass : retry}
          primaryLabel={passed ? 'Nice — step complete' : 'Try Again'}
          review={questions.map((q, i) => ({
            question: q.question,
            correct: answers[i] === q.correct_index,
            explanation: q.explanation,
          }))}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative w-full max-w-[420px] bg-background rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto scrollbar-hide"
        style={{ animation: 'sheetUp 0.25s ease' }}
      >
        <style>{`@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

        {/* Header row — X is the only dismiss path, deliberately no backdrop-click-to-close
            (this is a hard gate; a silent second exit would defeat it) */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-foreground">Quick check</p>
          <button
            onClick={onClose}
            aria-label="Close quiz"
            className="w-8 h-8 -mr-1.5 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-4 truncate">{step.title}</p>

        {phase === 'loading' && (
          <div className="py-10 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-border border-t-[#8cb200] rounded-full animate-spin" />
            <p className="text-xs text-muted-foreground">Building your quiz…</p>
          </div>
        )}

        {phase === 'answering' && (
          <>
            {usedFallback && attempt === 1 && (
              <div className="mb-3 px-3 py-2 rounded-xl bg-card">
                <p className="text-[11px] text-muted-foreground">Couldn't reach the quiz generator — showing a quick fallback check instead.</p>
              </div>
            )}

            <div className="space-y-4">
              {questions.map((q, qi) => (
                <div key={qi}>
                  <p className="text-[16px] font-bold text-foreground leading-[22px] mb-3">{qi + 1}. {q.question}</p>
                  <div className="flex flex-col gap-[8px]">
                    {q.options.map((opt, oi) => {
                      const sel = answers[qi] === oi;
                      return (
                        <button
                          key={oi}
                          onClick={() => setAnswers(a => a.map((v, i) => (i === qi ? oi : v)))}
                          className={`flex items-center gap-[14px] p-[14px] rounded-[16px] text-left transition-all duration-150 ${sel ? 'bg-accent' : 'bg-card'}`}
                        >
                          <div className={`flex items-center justify-center rounded-[12px] shrink-0 size-[32px] transition-colors ${sel ? 'bg-primary/30' : 'bg-muted'}`}>
                            <span className={`text-[13px] font-bold transition-colors ${sel ? 'text-accent-foreground' : 'text-muted-foreground'}`}>
                              {['A','B','C','D'][oi] ?? String(oi)}
                            </span>
                          </div>
                          <span className={`text-[15px] leading-[21px] tracking-[-0.04px] font-[510] transition-colors ${sel ? 'text-foreground' : 'text-foreground'}`}>
                            {opt}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <button
                onClick={submit}
                disabled={!allAnswered}
                className="w-full h-[56px] bg-primary text-foreground text-[16px] font-semibold rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
