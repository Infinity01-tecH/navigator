import { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../lib/context';
import backSvg from '../imports/BackIconBtn/svg-asr2mlrdv9';

const HOURS_VALUES = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];
const DAYS_VALUES = [1, 2, 3, 4, 5, 6, 7];

const CELL_W = 72;  // fixed width of each scroll cell
const GAP = 20;
const CELL = CELL_W + GAP; // 92px per cell for scroll math

function estimateWeeks(hpd: number, dpw: number) {
  const totalHours = 62;
  const weeklyHours = hpd * dpw;
  if (weeklyHours === 0) return '—';
  const weeks = Math.ceil(totalHours / weeklyHours);
  return weeks <= 4 ? `${weeks}–${weeks + 1} weeks` : weeks <= 8 ? `${weeks}–${weeks + 2} weeks` : `${weeks}+ weeks`;
}

function formatHours(v: number) {
  return String(v);
}

interface PickerProps {
  values: number[];
  selected: number;
  onChange: (v: number) => void;
  label: string;
  format: (v: number) => string;
}

function HorizontalPicker({ values, selected, onChange, label, format }: PickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedIdx = values.indexOf(selected);
  const [scrollPos, setScrollPos] = useState(() => selectedIdx * CELL);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = selectedIdx * CELL;
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
          maskImage:
            'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
        }}
      >
        {values.map((v, i) => {
          const dist = Math.abs(i - centerFloat);
          const isCenter = dist < 0.5;
          const isFar = dist >= 1.5;
          const cardSize = isCenter ? 72 : 56;

          return (
            // Outer cell: fixed width so scroll math stays regular (scrollLeft = i * CELL)
            <div
              key={v}
              className="flex-none flex items-center justify-center"
              style={{ width: CELL_W, scrollSnapAlign: 'center' }}
            >
              {/* Inner card: grows/shrinks with CSS transition */}
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
                  {format(v)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p
        className="text-[14px] text-foreground text-center -mt-1"
        style={{ fontWeight: 590 }}
      >
        {label}
      </p>
    </div>
  );
}

export function Time() {
  const navigate = useNavigate();
  const { state, set } = useApp();
  const { hoursPerDay: hpd, daysPerWeek: dpw } = state;
  const [submitting, setSubmitting] = useState(false);

  const weeklyH = +(hpd * dpw).toFixed(1);
  const totalSessions = Math.ceil(62 / hpd);

  const handleBuild = () => {
    if (submitting) return;
    setSubmitting(true);
    navigate('/generating');
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background">
      {/* Header row — back + theme */}
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
      <div className="flex flex-col flex-1 px-6 pb-8 gap-6 overflow-y-auto">
        {/* Title block */}
        <div className="flex flex-col gap-2 pt-2">
          <h2
            className="text-[32px] leading-[40px] text-foreground"
            style={{ fontWeight: 590, letterSpacing: '-0.096px' }}
          >
            How much time can you commit
          </h2>
          <p
            className="text-[18px] text-foreground"
            style={{ fontWeight: 510 }}
          >
            We will calibrate the roadmap to fit your actual life.
          </p>
        </div>

        {/* Pickers */}
        <div className="flex flex-col gap-6 -mx-6">
          <HorizontalPicker
            values={HOURS_VALUES}
            selected={hpd}
            onChange={v => set({ hoursPerDay: v })}
            label="Hours per day"
            format={formatHours}
          />
          <HorizontalPicker
            values={DAYS_VALUES}
            selected={dpw}
            onChange={v => set({ daysPerWeek: v })}
            label="Days per week"
            format={String}
          />
        </div>

        {/* Timeline estimate card */}
        <div className="bg-card rounded-[16px] px-[16px] py-[12px] flex flex-col gap-[10px]">
          <p
            className="text-[14px] text-muted-foreground"
            style={{ fontWeight: 590 }}
          >
            Timeline Estimate
          </p>
          {[
            { label: 'Weekly learning time', val: `${weeklyH}h` },
            { label: 'Estimated completion', val: estimateWeeks(hpd, dpw) },
            { label: 'Total sessions', val: `~${totalSessions} sessions` },
          ].map(({ label, val }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[14px] text-muted-foreground">{label}</span>
              <span
                className="text-[14px] text-foreground"
                style={{ fontWeight: 590 }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleBuild}
          disabled={submitting}
          className="w-full h-[55px] rounded-full flex items-center justify-center text-[16px] font-semibold text-foreground mt-auto transition-opacity"
          style={{
            background: '#8cb200',
            opacity: submitting ? 0.4 : 1,
          }}
        >
          {submitting ? 'Building…' : 'Build My Roadmap'}
        </button>
      </div>
    </div>
  );
}
