import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../lib/context';
import { QUESTIONS } from '../data';
import backSvg from '../imports/BackIconBtn/svg-asr2mlrdv9';

export function Fingerprint() {
  const navigate = useNavigate();
  const { state, set } = useApp();
  const [qIdx, setQIdx] = useState(0);
  const total = QUESTIONS.length;
  const q = QUESTIONS[qIdx];
  const selected = state.answers[q.key];

  function pick(letter: string) {
    set({ answers: { ...state.answers, [q.key]: letter } });
  }

  function next() {
    if (qIdx < total - 1) setQIdx(i => i + 1);
    else navigate('/gap');
  }

  function back() {
    if (qIdx > 0) setQIdx(i => i - 1);
    else navigate(-1);
  }

  const progressPct = ((qIdx + 1) / total) * 100;

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Back + theme header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1 shrink-0">
        <button
          onClick={back}
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
          Learning fingerprint · {qIdx + 1} of {total}
        </p>

        {/* Question heading */}
        <div className="flex flex-col gap-3 shrink-0">
          <h2 className="text-[24px] font-bold text-foreground leading-[32px] tracking-[-0.072px]">
            {q.q}
          </h2>
          <p className="text-[16px] text-foreground leading-[20px] tracking-[-0.048px]">
            Choose the answer that feels most natural to you.
          </p>
        </div>

        {/* Option cards */}
        <div className="flex flex-col gap-[10px] shrink-0">
          {q.opts.map((opt, i) => {
            const active = selected === opt.l;
            return (
              <button
                key={opt.l}
                onClick={() => pick(opt.l)}
                className={`flex items-center gap-[16px] p-[16px] rounded-[16px] text-left transition-all duration-150 ${
                  active
                    ? 'bg-accent'
                    : 'bg-card'
                }`}
              >
                {/* Badge */}
                <div
                  className={`flex items-center justify-center rounded-[16px] shrink-0 size-[36px] transition-colors ${
                    active ? 'bg-primary/30' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`text-[14px] font-bold transition-colors ${
                      active ? 'text-accent-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {i}
                  </span>
                </div>

                {/* Label */}
                <span
                  className={`text-[18px] leading-[24px] tracking-[-0.054px] transition-colors ${
                    active ? 'font-semibold text-foreground' : 'font-[510] text-foreground'
                  }`}
                >
                  {opt.t}
                </span>
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <button
          onClick={next}
          disabled={!selected}
          className="w-full h-[52px] bg-primary rounded-full text-[14px] font-semibold text-foreground mt-auto transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          {qIdx < total - 1 ? 'Continue' : 'Finish'}
        </button>
      </div>
    </div>
  );
}
