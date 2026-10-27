import { useNavigate } from 'react-router';
import { useApp } from '../lib/context';
import backSvg from '../imports/BackIconBtn/svg-asr2mlrdv9';

const LEVELS = [
  { n: 0, label: 'Complete beginner',    desc: "Haven't touched it yet" },
  { n: 1, label: 'Know the basics',      desc: 'Familiar with fundamentals' },
  { n: 2, label: 'Intermediate',         desc: 'Built a few projects' },
  { n: 3, label: 'Advanced',             desc: 'Comfortable with complex patterns' },
  { n: 4, label: 'Expert',               desc: 'Could teach this to others' },
];

export function Gap() {
  const navigate = useNavigate();
  const { state, set } = useApp();

  function back() {
    if (state.mode === 'sprint') navigate('/sprint');
    else if (state.mode === 'youtube') navigate('/youtube');
    else navigate('/fingerprint');
  }

  function next() {
    const passesGate = state.level !== null && state.level >= 2;
    if (passesGate) {
      navigate('/skillcheck');
      return;
    }
    navigate(state.mode === 'full' ? '/time' : '/generating');
  }

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
        {/* Label */}
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[1px] shrink-0">
          Skill level
        </p>

        {/* Heading + description */}
        <div className="flex flex-col gap-3 shrink-0">
          <h2 className="text-[24px] font-bold text-foreground leading-[32px] tracking-[-0.072px]">
            Where are you right now?
          </h2>
          <p className="text-[16px] text-foreground leading-[20px] tracking-[-0.048px]">
            This helps us calibrate how much ground your roadmap needs to cover.
          </p>
        </div>

        {/* Level cards */}
        <div className="flex flex-col gap-[10px] shrink-0">
          {LEVELS.map(({ n, label, desc }) => {
            const sel = state.level === n;
            return (
              <button
                key={n}
                onClick={() => set({ level: n })}
                className={`flex items-center gap-[16px] p-[16px] rounded-[16px] text-left transition-all duration-150 ${
                  sel ? 'bg-accent' : 'bg-card'
                }`}
              >
                {/* Badge */}
                <div
                  className={`flex items-center justify-center rounded-[16px] shrink-0 size-[36px] transition-colors ${
                    sel ? 'bg-primary/30' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`text-[14px] font-bold transition-colors ${
                      sel ? 'text-accent-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {n}
                  </span>
                </div>

                {/* Text */}
                <div className="flex flex-col items-start">
                  <span
                    className={`text-[18px] leading-[24px] tracking-[-0.054px] transition-colors ${
                      sel ? 'font-semibold text-foreground' : 'font-[510] text-foreground'
                    }`}
                  >
                    {label}
                  </span>
                  <span className="text-[12px] font-medium text-muted-foreground mt-[2px]">
                    {desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <button
          onClick={next}
          disabled={state.level === null}
          className="w-full h-[52px] bg-primary rounded-full text-[14px] font-semibold text-foreground mt-auto transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
