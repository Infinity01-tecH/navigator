import { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../lib/context';
import backSvg from '../imports/BackIconBtn/svg-asr2mlrdv9';
import sprintSvg from '../imports/SetupNavigatorPwaProject-2/svg-pfkvgqwnnf';

const DURATION_VALUES = [3, 5, 7, 14, 21, 30];

// ── Drum picker (same UX as Time.tsx) ──────────────────────────────────────
const CELL_W = 72;
const GAP = 20;
const CELL = CELL_W + GAP;

interface PickerProps {
  values: number[];
  selected: number;
  onChange: (v: number) => void;
  label: string;
}

function HorizontalPicker({ values, selected, onChange, label }: PickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedIdx = values.indexOf(selected);
  const defaultIdx = selectedIdx >= 0 ? selectedIdx : 2; // 7 days default
  const [scrollPos, setScrollPos] = useState(() => defaultIdx * CELL);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = defaultIdx * CELL;
    // Auto-select centered value on mount when state has no valid preset
    if (selectedIdx < 0 && values[defaultIdx] !== undefined) {
      onChange(values[defaultIdx]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const sl = e.currentTarget.scrollLeft;
      setScrollPos(sl);
      const rawIdx = sl / CELL;
      const idx = Math.round(rawIdx);
      const clamped = Math.max(0, Math.min(idx, values.length - 1));
      if (Math.abs(rawIdx - idx) < 0.18 && values[clamped] !== selected) {
        if (navigator.vibrate) navigator.vibrate(6);
        onChange(values[clamped]);
      }
    },
    [selected, onChange, values]
  );

  function tapItem(i: number) {
    onChange(values[i]);
    scrollRef.current?.scrollTo({ left: i * CELL, behavior: 'smooth' });
  }

  const centerFloat = scrollPos / CELL;

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto scrollbar-hide"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
          paddingLeft: `calc(50% - ${CELL_W / 2}px)`,
          paddingRight: `calc(50% - ${CELL_W / 2}px)`,
          paddingTop: 8,
          paddingBottom: 8,
          gap: GAP,
          maskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
        }}
      >
        {values.map((v, i) => {
          const dist = Math.abs(i - centerFloat);
          const isCenter = dist < 0.5;
          const isFar = dist >= 1.5;
          const cardSize = isCenter ? 72 : 56;

          return (
            <div
              key={v}
              className="flex-none flex items-center justify-center"
              style={{ width: CELL_W, scrollSnapAlign: 'center' }}
            >
              <div
                onClick={() => tapItem(i)}
                className="flex items-center justify-center rounded-[12px] cursor-pointer select-none"
                style={{
                  width: cardSize,
                  height: cardSize,
                  background: isCenter ? '#f9ffe5' : '#f8f8f8',
                  opacity: isFar ? 0.4 : 1,
                  transition: 'width 0.15s ease, height 0.15s ease, background 0.15s ease, opacity 0.15s ease',
                }}
              >
                <span
                  className="font-bold text-foreground text-center leading-none"
                  style={{
                    fontSize: isCenter ? 40 : 24,
                    transition: 'font-size 0.15s ease',
                  }}
                >
                  {v}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[14px] text-foreground text-center -mt-1" style={{ fontWeight: 590 }}>
        {label}
      </p>
    </div>
  );
}

// ── Screen ──────────────────────────────────────────────────────────────────
export function Sprint() {
  const navigate = useNavigate();
  const { state, set } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const canBuild = state.sprintDays > 0 && state.sprintGoal.trim().length > 0;

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

        {/* Sprint Blueprint badge + title */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-[6px]">
            <div
              className="flex items-center justify-center shrink-0 p-[10px]"
              style={{ background: '#8cb200', borderRadius: 17 }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d={sprintSvg.p2fe5f600}
                  stroke="#131927"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.666"
                />
              </svg>
            </div>
            <span
              className="text-[24px] text-foreground tracking-[-0.072px]"
              style={{ fontWeight: 'bold' }}
            >
              Sprint Blueprint
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h2
              className="text-[32px] leading-[40px] text-foreground"
              style={{ fontWeight: 590, letterSpacing: '-0.096px' }}
            >
              Define your sprint
            </h2>
            <p className="text-[18px] text-foreground leading-[24px]" style={{ fontWeight: 510 }}>
              An intensive short-term plan focused on one concrete outcome.
            </p>
          </div>
        </div>

        {/* Duration drum picker */}
        <div className="-mx-5">
          <HorizontalPicker
            values={DURATION_VALUES}
            selected={state.sprintDays}
            onChange={v => set({ sprintDays: v })}
            label="Duration (days)"
          />
        </div>

        {/* Custom days input */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={365}
            value={state.sprintDays || ''}
            onChange={e => {
              const v = parseInt(e.target.value);
              if (!isNaN(v) && v > 0) set({ sprintDays: v });
            }}
            className="bg-card rounded-[16px] px-[12px] h-[40px] w-[96px] text-[14px] text-foreground focus:outline-none"
          />
          <span className="text-[14px] text-muted-foreground">custom days</span>
        </div>

        {/* Goal */}
        <div className="flex flex-col gap-2">
          <label className="text-[18px] text-foreground leading-[24px]" style={{ fontWeight: 510 }}>
            What do you want to achieve?
          </label>
          <textarea
            rows={5}
            value={state.sprintGoal}
            onChange={e => set({ sprintGoal: e.target.value })}
            placeholder="e.g. Build and deploy a working REST API with Node.js and Express by the end of the sprint."
            className="bg-card rounded-[16px] px-[16px] py-[12px] text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none resize-none leading-[22px] w-full"
          />
        </div>

        {/* CTA */}
        <button
          onClick={handleBuild}
          disabled={!canBuild || submitting}
          className="w-full h-[56px] rounded-full text-[16px] font-semibold text-foreground mt-auto transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          style={{ background: '#8cb200' }}
        >
          {submitting ? 'Starting…' : 'Build Sprint Blueprint'}
        </button>
      </div>
    </div>
  );
}
