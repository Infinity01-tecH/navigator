import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../lib/context';
import backSvg from '../imports/BackIconBtn/svg-asr2mlrdv9';
import ytSvg from '../imports/SetupNavigatorPwaProject-3/svg-nupu4r7fj9';

export function YouTube() {
  const navigate = useNavigate();
  const { state, set } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const canBuild = state.ytAiPick || state.ytCreator.trim().length > 0;

  const handleBuild = () => {
    if (submitting || !canBuild) return;
    setSubmitting(true);
    navigate('/gap');
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      {/* Back + theme header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1 shrink-0">
        <button
          onClick={() => navigate('/')}
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
      <div className="flex flex-col flex-1 px-5 pb-8 gap-6 overflow-y-auto">

        {/* YouTube-Based badge + headings */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-[6px]">
            <div
              className="flex items-center justify-center shrink-0 p-[10px]"
              style={{ background: '#8cb200', borderRadius: 17 }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d={ytSvg.p35f45400}
                  stroke="#131927"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.667"
                />
              </svg>
            </div>
            <span className="text-[24px] font-bold text-foreground tracking-[-0.072px]">
              YouTube-Based
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h2
              className="text-[32px] leading-[40px] text-foreground"
              style={{ fontWeight: 590, letterSpacing: '-0.096px' }}
            >
              Set up your sources
            </h2>
            <p className="text-[16px] text-foreground leading-[20px] tracking-[-0.048px]">
              {"We'll build your roadmap around YouTube creators whose style matches how you learn."}
            </p>
          </div>
        </div>

        {/* Creator source picker */}
        <div className="flex flex-col gap-3">
          <p className="text-[18px] text-foreground leading-[24px]" style={{ fontWeight: 510 }}>
            Creator source
          </p>

          {/* Growing-card toggle — selected card is visually larger */}
          <div className="flex gap-2 items-end">
            {([
              { key: 'single' as const, label: 'One Creator', sub: 'Deep dive with one voice' },
              { key: 'multi'  as const, label: 'Multiple',    sub: 'Curated from several'    },
            ]).map(({ key, label, sub }) => {
              const active = state.ytSource === key;
              return (
                <button
                  key={key}
                  onClick={() => set({ ytSource: key })}
                  className="flex flex-col justify-center text-left rounded-[18px] transition-all duration-150"
                  style={{
                    flex: active ? 3 : 2,
                    height: active ? 78 : 60,
                    padding: active ? 16 : 12,
                    background: active ? '#f9ffe5' : '#f8f8f8',
                  }}
                >
                  <span
                    className="font-semibold leading-snug text-foreground transition-all duration-150"
                    style={{ fontSize: active ? 16 : 12 }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-muted-foreground font-medium mt-0.5 transition-all duration-150"
                    style={{ fontSize: active ? 12 : 9.5 }}
                  >
                    {sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Let AI choose toggle row */}
        <div className="flex items-center justify-between bg-card rounded-[16px] p-[14px]">
          <div className="flex items-center gap-3">
            {/* Sparkle icon */}
            <div className="flex items-center justify-center rounded-[16px] shrink-0 size-[32px] bg-accent">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d={ytSvg.p18b8da80}
                  stroke="#6D717F"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.249"
                />
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-foreground leading-5">Let AI choose</p>
              <p className="text-[11px] text-muted-foreground leading-[16px]">Best creators for your level</p>
            </div>
          </div>
          {/* Toggle switch */}
          <button
            onClick={() => set({ ytAiPick: !state.ytAiPick })}
            className="relative shrink-0 w-[44px] h-[24px] rounded-full transition-colors duration-200"
            style={{ background: state.ytAiPick ? '#8cb200' : '#d2d5db' }}
            aria-label="Toggle AI pick"
          >
            <span
              className="absolute top-[2px] w-[20px] h-[20px] bg-background rounded-full shadow-sm transition-all duration-200"
              style={{ left: state.ytAiPick ? '22px' : '2px' }}
            />
          </button>
        </div>

        {/* Creator name input — hidden when AI is picking */}
        {!state.ytAiPick && (
          <div className="flex flex-col gap-2">
            <label
              className="text-[16px] text-foreground leading-5 tracking-[-0.064px]"
              style={{ fontWeight: 590 }}
            >
              Creator name
            </label>
            <input
              value={state.ytCreator}
              onChange={e => set({ ytCreator: e.target.value })}
              placeholder="e.g. Fireship, Kevin Powell, The Primeagen"
              className="w-full h-[48px] px-[16px] bg-card rounded-[16px] text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleBuild}
          disabled={!canBuild || submitting}
          className="w-full h-[56px] rounded-full text-[16px] font-semibold text-foreground mt-auto transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          style={{ background: '#8cb200' }}
        >
          {submitting ? 'Starting…' : 'Build YouTube Roadmap'}
        </button>
      </div>
    </div>
  );
}
