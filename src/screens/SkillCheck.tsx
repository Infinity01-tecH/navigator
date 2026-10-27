import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../lib/context';
import backSvg from '../imports/BackIconBtn/svg-asr2mlrdv9';
import {
  generateSkillCheckQuiz,
  draftSkillCheckQuiz,
  type SkillCheckSet,
  type SkillCheckLevel,
} from '../lib/generateRoadmap';

const LEVEL_TO_KEY: Record<number, SkillCheckLevel> = {
  2: 'intermediate',
  3: 'advanced',
  4: 'expert',
};
const LEVEL_LABEL: Record<number, string> = {
  1: 'Know the basics',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
};

const OPT_LETTERS = ['A', 'B', 'C', 'D'];

type Stage = 'loading' | 'calibration' | 'gate' | 'deep';

const PASS_RATIO = 2 / 3;

export function SkillCheck() {
  const navigate = useNavigate();
  const { state, set, user } = useApp();

  const [stage, setStage] = useState<Stage>('loading');
  const [quiz, setQuiz] = useState<SkillCheckSet | null>(null);
  const [calibrationIndex, setCalibrationIndex] = useState(0);
  const [calibrationPicked, setCalibrationPicked] = useState<number | null>(null);
  const [calibrationCorrectCount, setCalibrationCorrectCount] = useState(0);
  const [deepIndex, setDeepIndex] = useState(0);
  const [deepPicked, setDeepPicked] = useState<number | null>(null);
  const [deepCorrectCount, setDeepCorrectCount] = useState(0);

  const skill = state.skill || state.roadmapSkill;
  const pickedLevel = state.level ?? 2;

  useEffect(() => {
    let cancelled = false;
    const levelKey = LEVEL_TO_KEY[pickedLevel] ?? 'intermediate';

    // No session → use the static fallback immediately (no network call, no error log)
    if (!user) {
      setQuiz(draftSkillCheckQuiz(skill));
      setStage('calibration');
      return;
    }

    generateSkillCheckQuiz(skill, levelKey)
      .then(q => {
        if (cancelled) return;
        setQuiz(q);
        setStage('calibration');
      })
      .catch(() => {
        if (cancelled) return;
        setQuiz(draftSkillCheckQuiz(skill));
        setStage('calibration');
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish(finalLevel: number) {
    set({ resolvedLevel: finalLevel });
    navigate(state.mode === 'full' ? '/time' : '/generating');
  }

  function handleCalibrationAnswer(idx: number) {
    if (!quiz || calibrationPicked !== null) return;
    setCalibrationPicked(idx);
    const q = quiz.calibration[calibrationIndex];
    const correct = idx === q.correct_index;
    const nextCount = correct ? calibrationCorrectCount + 1 : calibrationCorrectCount;
    if (correct) setCalibrationCorrectCount(nextCount);

    window.setTimeout(() => {
      const isLast = calibrationIndex === quiz.calibration.length - 1;
      if (!isLast) {
        setCalibrationIndex(calibrationIndex + 1);
        setCalibrationPicked(null);
        return;
      }
      const ratio = nextCount / quiz.calibration.length;
      if (ratio < PASS_RATIO) {
        finish(Math.max(1, pickedLevel - 1));
        return;
      }
      setStage('gate');
    }, 900);
  }

  function handleGateAnswer(builtProjects: boolean) {
    if (!builtProjects) {
      finish(pickedLevel);
      return;
    }
    if (!quiz || quiz.deep.length === 0) {
      finish(pickedLevel);
      return;
    }
    setStage('deep');
  }

  function handleDeepAnswer(idx: number) {
    if (!quiz || deepPicked !== null) return;
    setDeepPicked(idx);
    const q = quiz.deep[deepIndex];
    const correct = idx === q.correct_index;
    const nextCount = correct ? deepCorrectCount + 1 : deepCorrectCount;
    if (correct) setDeepCorrectCount(nextCount);

    window.setTimeout(() => {
      const isLast = deepIndex === quiz.deep.length - 1;
      if (!isLast) {
        setDeepIndex(deepIndex + 1);
        setDeepPicked(null);
        return;
      }
      const ratio = nextCount / quiz.deep.length;
      const finalLevel = ratio >= PASS_RATIO ? Math.min(4, pickedLevel + 1) : pickedLevel;
      finish(finalLevel);
    }, 900);
  }

  const calibLen = quiz?.calibration.length ?? 1;
  const totalStages = quiz && quiz.deep.length > 0 ? calibLen + 1 + quiz.deep.length : calibLen;
  const stageIndex =
    stage === 'calibration' ? calibrationIndex
    : stage === 'gate' ? calibLen
    : stage === 'deep' ? calibLen + 1 + deepIndex
    : 0;

  const progressPct = stage === 'loading' ? 0 : ((stageIndex + 1) / totalStages) * 100;

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Back + theme header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1 shrink-0">
        <button
          onClick={() => navigate('/gap')}
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

      {/* Scrollable content */}
      <div className="flex flex-col flex-1 px-5 pb-8 gap-5 overflow-y-auto">
        {/* Progress bar */}
        <div className="bg-card h-[12px] rounded-[100px] overflow-hidden shrink-0">
          <div
            className="bg-primary h-full rounded-[100px] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Label */}
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[1px] shrink-0">
          Quick check
        </p>

        {/* Loading */}
        {stage === 'loading' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <style>{`@keyframes sc-spin { to { transform: rotate(360deg); } }`}</style>
            <div
              className="w-9 h-9 rounded-full border-2 border-border border-t-[#8cb200]"
              style={{ animation: 'sc-spin 0.8s linear infinite' }}
            />
            <p className="text-[16px] text-muted-foreground">Putting together a couple of questions…</p>
          </div>
        )}

        {/* Calibration */}
        {stage === 'calibration' && quiz && quiz.calibration[calibrationIndex] && (
          <>
            <div className="flex flex-col gap-3 shrink-0">
              <h2 className="text-[24px] font-bold text-foreground leading-[32px] tracking-[-0.072px]">
                {quiz.calibration[calibrationIndex].question}
              </h2>
              <p className="text-[16px] text-foreground leading-[20px] tracking-[-0.048px]">
                You said {LEVEL_LABEL[pickedLevel] ?? 'Intermediate'} in {skill || 'this skill'} — let's make sure your roadmap starts in the right place.
              </p>
            </div>
            <div className="flex flex-col gap-[10px] shrink-0">
              {quiz.calibration[calibrationIndex].options.map((opt, idx) => (
                <QuizOption
                  key={idx}
                  text={opt}
                  letter={OPT_LETTERS[idx] ?? String(idx)}
                  picked={calibrationPicked}
                  idx={idx}
                  correctIdx={quiz.calibration[calibrationIndex].correct_index}
                  onPick={handleCalibrationAnswer}
                />
              ))}
            </div>
          </>
        )}

        {/* Gate */}
        {stage === 'gate' && (
          <>
            <div className="flex flex-col gap-3 shrink-0">
              <h2 className="text-[24px] font-bold text-foreground leading-[32px] tracking-[-0.072px]">
                Have you built real projects with {skill || 'this'}?
              </h2>
              <p className="text-[16px] text-foreground leading-[20px] tracking-[-0.048px]">
                Not tutorials — something you shipped, shared, or used for real.
              </p>
            </div>
            <div className="flex flex-col gap-[10px] shrink-0">
              {[
                { label: 'Yes, real projects', desc: "I've shipped something real" },
                { label: 'Not yet', desc: 'Mostly tutorials and learning' },
              ].map(({ label, desc }, i) => (
                <button
                  key={i}
                  onClick={() => handleGateAnswer(i === 0)}
                  className="flex items-center gap-[16px] p-[16px] rounded-[16px] bg-card text-left transition-all duration-150 active:bg-accent"
                >
                  <div className="flex items-center justify-center rounded-[16px] shrink-0 size-[36px] bg-muted">
                    <span className="text-[14px] font-bold text-muted-foreground">{i}</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[18px] font-[510] text-foreground leading-[24px] tracking-[-0.054px]">
                      {label}
                    </span>
                    <span className="text-[12px] font-medium text-muted-foreground mt-[2px]">{desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Deep */}
        {stage === 'deep' && quiz && quiz.deep[deepIndex] && (
          <>
            <div className="flex flex-col gap-3 shrink-0">
              <h2 className="text-[24px] font-bold text-foreground leading-[32px] tracking-[-0.072px]">
                {quiz.deep[deepIndex].question}
              </h2>
              <p className="text-[16px] text-foreground leading-[20px] tracking-[-0.048px]">
                One more round to fine-tune your starting point.
              </p>
            </div>
            <div className="flex flex-col gap-[10px] shrink-0">
              {quiz.deep[deepIndex].options.map((opt, idx) => (
                <QuizOption
                  key={idx}
                  text={opt}
                  letter={OPT_LETTERS[idx] ?? String(idx)}
                  picked={deepPicked}
                  idx={idx}
                  correctIdx={quiz.deep[deepIndex].correct_index}
                  onPick={handleDeepAnswer}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function QuizOption({
  text, letter, picked, idx, correctIdx, onPick,
}: {
  text: string;
  letter: string;
  picked: number | null;
  idx: number;
  correctIdx: number;
  onPick: (idx: number) => void;
}) {
  const isCorrect = idx === correctIdx;
  const isWrongPick = picked !== null && idx === picked && !isCorrect;
  const isOther = picked !== null && !isCorrect && idx !== picked;

  const cardBg =
    picked === null ? 'bg-card'
    : isCorrect ? 'bg-accent'
    : isWrongPick ? 'bg-[#fdeeeb]'
    : 'bg-card';

  const badgeBg =
    picked === null ? 'bg-muted'
    : isCorrect ? 'bg-primary/30'
    : isWrongPick ? 'bg-[#e0533d]/20'
    : 'bg-muted';

  const badgeText =
    picked === null ? 'text-muted-foreground'
    : isCorrect ? 'text-accent-foreground'
    : isWrongPick ? 'text-[#e0533d]'
    : 'text-muted-foreground';

  const labelText =
    picked === null ? 'text-foreground'
    : isCorrect ? 'text-foreground font-semibold'
    : isWrongPick ? 'text-[#e0533d]'
    : 'text-muted-foreground';

  return (
    <button
      onClick={() => picked === null && onPick(idx)}
      disabled={picked !== null}
      className={`flex items-center gap-[16px] p-[16px] rounded-[16px] text-left transition-all duration-150 ${cardBg} ${isOther ? 'opacity-40' : ''}`}
    >
      <div className={`flex items-center justify-center rounded-[16px] shrink-0 size-[36px] transition-colors ${badgeBg}`}>
        <span className={`text-[14px] font-bold transition-colors ${badgeText}`}>{letter}</span>
      </div>
      <span className={`text-[18px] leading-[24px] tracking-[-0.054px] transition-colors font-[510] ${labelText}`}>
        {text}
      </span>
    </button>
  );
}
