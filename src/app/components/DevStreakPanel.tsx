// DevStreakPanel.tsx
//
// DEV-ONLY streak + projection testing shortcuts. Every action is a keyboard
// combo — the panel itself is now a read-only status/legend display, not a
// set of buttons. Toggle visibility with Ctrl+Shift+D; every other combo
// works whether the panel is open or not, since the whole point is punching
// in states without breaking flow to click anything.
//
// ── FULL SHORTCUT LIST ─────────────────────────────────────────────────────
//   Ctrl+Shift+D        Toggle this panel's visibility
//   Ctrl+Shift+1        Set streak to 1
//   Ctrl+Shift+7        Set streak to 7
//   Ctrl+Shift+3        Set streak to 30
//   Ctrl+Shift+2        Set streak to 200
//   Ctrl+Shift+F        Today = Frozen (fire in ice, 3 days remaining)
//   Ctrl+Shift+G        Today = Grace (missed, not broken)
//   Ctrl+Shift+X        Today = Broken
//   Ctrl+Shift+M        Trigger pending miss → opens StreakInterruptModal
//   Ctrl+Shift+P        Cycle projection simulation: real → +5d → +15d →
//                        +30d → real. Simulates "today" being N days later
//                        against the ACTIVE roadmap's real completed_steps —
//                        see the note below, this is not a faked number.
//   Ctrl+Shift+R        Reset — re-syncs streak from the real backend and
//                        drops the projection simulation back to real
//                        "today" (clears every override, both kinds)
//
// ── WHY PROJECTION IS DIFFERENT FROM THE OTHER SHORTCUTS ───────────────────
// Every combo above except P overrides client-render state directly and
// never touches Supabase (see the footer disclaimer in this panel's JSX).
// P does not work that way: it makes a real, read-only call to
// project_roadmap_finish_date() with a simulated `today` date, while the
// roadmap's real `created_at` and real `completed_steps` (from actual
// progress) stay untouched. That's deliberate — completed_steps can't be
// faked client-side without lying to yourself about what the backlog
// formula would really compute, so this exercises the actual SQL math
// instead of a display-only mock. It's still cheap and still dev-gated, but
// it is not purely in-memory the way the streak overrides are.
//
// ── ONE KNOWN BROWSER COLLISION, HANDLED ───────────────────────────────────
// Ctrl+Shift+B is Chrome's native bookmarks-bar toggle — that's a
// browser-chrome-level binding, not a page default action, so
// e.preventDefault() in a keydown listener can't reliably suppress it.
// Broken-state was moved to Ctrl+Shift+X instead of fighting that. Same risk
// exists for any Ctrl+Shift+ combo in principle; the combos chosen here were
// checked against Chrome/Firefox/Edge's common reserved lists and don't
// collide, but a different browser or an extension could still claim one —
// if a combo silently does nothing, that's the first thing to suspect.
//
// ── WHY THIS IS SAFE TO LEAVE MOUNTED ────────────────────────────────────
// Two independent gates, not one:
//   1. This component checks import.meta.env.DEV and renders null / attaches
//      no listener at all in a production build.
//   2. devOverrideStreak() / devSimulateProjection() in context.tsx ALSO
//      check import.meta.env.DEV and no-op if somehow called anyway.
//
// ── INTEGRATION ────────────────────────────────────────────────────────────
// Mount once, unconditionally, anywhere inside Main()'s returned JSX:
//   <DevStreakPanel />
//
// ── DELETION CHECKLIST (when you're done testing) ─────────────────────────
// 1. Delete this file.
// 2. Remove the <DevStreakPanel/> line from Main.tsx.
// 3. Search "DEV-ONLY" in context.tsx and remove those blocks + the two type
//    entries (devOverrideStreak, devSimulateProjection) + the two
//    context-value entries — all one contiguous search.

import { useEffect, useState } from 'react';
import { Flame, Snowflake, TrendingUp } from 'lucide-react';
import { useApp } from '../../lib/context';

const DEV = import.meta.env.DEV;

// Cycle order for Ctrl+Shift+P. 0 means "real today" — the reset case.
const PROJECTION_OFFSETS = [0, 5, 15, 30];

// One shared table so the on-screen legend and the actual key-handler can't
// drift apart — the combo list in the header comment above is documentation
// for humans, this is the single source of truth the code actually runs off.
// e.code is used here, not e.key — e.key reports what character the key
// combination actually produces, and Shift+digit produces a symbol on a
// standard layout (Shift+1 → "!", Shift+3 → "#", etc.), not the digit
// itself. That's exactly why Ctrl+Shift+1/2/3/7 weren't firing: the old
// version compared against e.key.toLowerCase() === '1', which never matches
// "!". e.code reports the physical key pressed (e.g. "Digit1") regardless
// of what Shift turns it into, so it stays correct across layouts.
const SHORTCUTS: { combo: string; code: string; label: string; run: (devOverrideStreak: any) => void }[] = [
  { combo: 'Ctrl+Shift+1', code: 'Digit1', label: 'Streak = 1',   run: o => o({ streak: 1 }) },
  { combo: 'Ctrl+Shift+7', code: 'Digit7', label: 'Streak = 7',   run: o => o({ streak: 7 }) },
  { combo: 'Ctrl+Shift+3', code: 'Digit3', label: 'Streak = 30',  run: o => o({ streak: 30 }) },
  { combo: 'Ctrl+Shift+2', code: 'Digit2', label: 'Streak = 200', run: o => o({ streak: 200 }) },
  { combo: 'Ctrl+Shift+F', code: 'KeyF', label: 'Today = Frozen',  run: o => o({ frozen: true, freezeDaysRemaining: 3 }) },
  { combo: 'Ctrl+Shift+G', code: 'KeyG', label: 'Today = Grace',   run: o => o({ grace: true, frozen: false }) },
  { combo: 'Ctrl+Shift+X', code: 'KeyX', label: 'Today = Broken',  run: o => o({ broken: true, frozen: false }) },
  { combo: 'Ctrl+Shift+M', code: 'KeyM', label: 'Trigger pending miss', run: o => o({ pendingMiss: true, frozen: false }) },
];

export function DevStreakPanel() {
  const [open, setOpen] = useState(false);
  const [lastFired, setLastFired] = useState<string | null>(null);
  const [projectionOffsetIdx, setProjectionOffsetIdx] = useState(0);

  // Hooks run unconditionally; the DEV bail-out happens at the return only.
  const app = DEV ? useApp() : null;

  useEffect(() => {
    if (!DEV || !app) return;
    function onKeyDown(e: KeyboardEvent) {
      if (!e.ctrlKey || !e.shiftKey) return;

      // D and R are letters, unaffected by the Shift-symbol issue above, but
      // switched to e.code too for consistency — one rule for every combo
      // in this file, not two different systems depending on the key.
      if (e.code === 'KeyD') {
        e.preventDefault();
        setOpen(o => !o);
        return;
      }

      if (e.code === 'KeyR') {
        e.preventDefault();
        app!.devOverrideStreak({ reset: true }); // re-syncs streak from real backend, clears every streak override
        app!.devSimulateProjection(0);           // drops projection sim back to real "today"
        setProjectionOffsetIdx(0);
        setLastFired('Ctrl+Shift+R — reset to real state');
        return;
      }

      if (e.code === 'KeyP') {
        e.preventDefault();
        const nextIdx = (projectionOffsetIdx + 1) % PROJECTION_OFFSETS.length;
        const offset = PROJECTION_OFFSETS[nextIdx];
        setProjectionOffsetIdx(nextIdx);
        app!.devSimulateProjection(offset);
        setLastFired(offset === 0 ? 'Ctrl+Shift+P — projection: real today' : `Ctrl+Shift+P — projection: +${offset}d simulated`);
        return;
      }

      const match = SHORTCUTS.find(s => s.code === e.code);
      if (match) {
        e.preventDefault();
        match.run(app!.devOverrideStreak);
        setLastFired(`${match.combo} — ${match.label}`);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [app, projectionOffsetIdx]);

  if (!DEV || !app || !open) return null;
  const { currentStreak, streakStatus, projection } = app;
  const activeOffset = PROJECTION_OFFSETS[projectionOffsetIdx];

  return (
    <div
      className="fixed bottom-24 right-4 z-[70] w-[270px] bg-background rounded-2xl border border-border shadow-[0_8px_24px_rgba(19,25,39,0.18)] overflow-hidden"
      role="status"
      aria-label="Streak and projection testing shortcuts (dev only)"
    >
      <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-card">
        <Flame size={13} className="text-[#ffaa00]" />
        <span className="text-[11px] font-bold text-white uppercase tracking-wider">Streak Dev Shortcuts</span>
      </div>

      <div className="p-3 flex flex-col gap-2.5">
        <div className="flex flex-col gap-1">
          {SHORTCUTS.map(s => (
            <div key={s.combo} className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">{s.label}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">{s.combo}</kbd>
            </div>
          ))}
          <div className="flex items-center justify-between text-[11px] pt-1 mt-1 border-t border-border">
            <span className="text-muted-foreground">Cycle projection sim</span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">Ctrl+Shift+P</kbd>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Reset overrides</span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">Ctrl+Shift+R</kbd>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Toggle this panel</span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">Ctrl+Shift+D</kbd>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Streak: <span className="font-semibold text-foreground">{currentStreak ?? '—'}</span>
            {'  ·  '}
            Frozen today: <span className="font-semibold text-foreground">{streakStatus?.freezeActiveToday ? 'yes' : 'no'}</span>
          </p>
          {lastFired && (
            <p className="text-[10px] text-primary font-medium mt-1">Last: {lastFired}</p>
          )}
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp size={11} className="text-[#0095ff]" />
            <span className="text-[10px] font-semibold text-foreground uppercase tracking-wide">Projection sim</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Simulated offset: <span className="font-semibold text-foreground">{activeOffset === 0 ? 'real today' : `+${activeOffset}d`}</span>
          </p>
          {projection ? (
            <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">
              Backlog: <span className="font-semibold text-foreground">{projection.backlog}</span>
              {'  ·  '}
              Pushed: <span className="font-semibold text-foreground">{projection.pushed_days}d</span>
              {'  ·  '}
              Finish: <span className="font-semibold text-foreground">{projection.projected_finish_date}</span>
            </p>
          ) : (
            <p className="text-[10px] text-muted-foreground mt-0.5">No projection loaded — needs an active, non-preview roadmap.</p>
          )}
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-[9px] text-muted-foreground flex items-center gap-1">
            <Snowflake size={9} /> Streak overrides: in-memory only, nothing written. Projection sim: real read-only Supabase call with a simulated date — see file header.
          </p>
        </div>
      </div>
    </div>
  );
}
