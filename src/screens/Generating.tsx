import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../lib/context';
import { generateRoadmap, buildPlaceholderRoadmap } from '../lib/generateRoadmap';
import { Clock, ChevronDown, Trophy } from 'lucide-react';
import { NAV_LOGO_PATH, NAV_LOGO_VIEWBOX } from '../lib/navLogo';
import { tryAcquireGenerationLock, releaseGenerationLock, type GenerationType } from '../lib/generationLock';
import { NaviPreloader } from '../components/NaviPreloader';

// Tooltip cycle timing (ms). Both the "give it 3 minutes" pill and the
// "hang in there" reassurance bubble use the same visible/gap timing —
// first appearance after TIP_FIRST_DELAY_MS, each stays up for
// TIP_VISIBLE_MS, pops down, waits TIP_GAP_MS, then the next one appears —
// repeating forever until generation finishes/unmounts.
const TIP_FIRST_DELAY_MS = 15000; // 15s before the first popup
const TIP_VISIBLE_MS = 35000;     // 35s visible
const TIP_GAP_MS = 15000;         // 15s between pop-down and next pop-up
const TIP_POP_OUT_MS = 350;

// How long the front end will wait for a generation to complete before
// giving up and showing the failure state, independent of whatever the
// underlying network request is still doing. This is only a backstop for a
// request that never produces any signal at all (e.g. the device losing
// network mid-request, which can leave a fetch "blocked" for 2+ minutes
// before the browser itself times out DNS resolution). Real backend
// failures (bad response, edge function error, etc.) throw immediately on
// their own and are never affected by this — this timer only fires when
// nothing has happened yet.
const GENERATION_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes

/** Races a promise against a timeout. If the timeout wins, rejects with a
 *  generic timeout error — the underlying promise is left to resolve or
 *  reject on its own in the background (harmless; its result is unused).
 *  If the real promise settles first (success OR failure), that result
 *  wins immediately — this never delays a real error. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Generation is taking longer than expected.'));
    }, ms);
    promise.then(
      (val) => { clearTimeout(timer); resolve(val); },
      (err) => { clearTimeout(timer); reject(err); },
    );
  });
}

type TipKind = 'give-it-3' | 'hang-in-there';

function NavLogo({ size }: { size: number }) {
  return (
    <svg viewBox={NAV_LOGO_VIEWBOX} width={size} height={size} fill="none">
      <path clipRule="evenodd" d={NAV_LOGO_PATH} fill="#131927" fillRule="evenodd" />
    </svg>
  );
}

export function Generating() {
  const navigate = useNavigate();
  const { state, addRoadmap, user, authReady } = useApp();
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  // Tooltip cycle: which tip (if any) is currently mounted, whether it's
  // playing its pop-out (exit) animation, and — for the first "give it 3
  // minutes" pill only — whether the user has expanded it via the chevron.
  const [activeTip, setActiveTip] = useState<TipKind | null>(null);
  const [tipClosing, setTipClosing] = useState(false);
  const [tipExpanded, setTipExpanded] = useState(false);
  // Guards against double-generation (§6): React 18 double-invokes effects and a
  // re-mount would otherwise fire two full generations → two roadmap inserts
  // (~2s apart) and a duplicate roadmap. We only ever run once per retryKey.
  const startedKey = useRef<number>(-1);

  // The reassurance tooltip first appears TIP_FIRST_DELAY_MS (15s) in — right
  // as a user might start losing patience — and pops/dangles like an
  // arriving push notification (§1.2). First appearance is the "give it 3
  // minutes" pill; every appearance after that is the "hang in there" bubble.
  // Both stay visible for TIP_VISIBLE_MS (35s), pop down, then the cycle
  // waits TIP_GAP_MS (15s) before the next one — repeating indefinitely
  // until generation finishes/unmounts.
  useEffect(() => {
    setActiveTip(null);
    setTipClosing(false);
    setTipExpanded(false);

    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    function showTip(kind: TipKind) {
      if (cancelled) return;
      setActiveTip(kind);
      setTipClosing(false);
      setTipExpanded(false);

      // Stay visible, then play pop-out, then unmount and schedule the next one.
      timers.push(setTimeout(() => {
        if (cancelled) return;
        setTipClosing(true);
        timers.push(setTimeout(() => {
          if (cancelled) return;
          setActiveTip(null);
          setTipClosing(false);
          timers.push(setTimeout(() => showTip('hang-in-there'), TIP_GAP_MS));
        }, TIP_POP_OUT_MS));
      }, TIP_VISIBLE_MS));
    }

    timers.push(setTimeout(() => showTip('give-it-3'), TIP_FIRST_DELAY_MS));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [retryKey]);

  // Fire on mount and on every retry
  useEffect(() => {
    // Wait until we know whether there's a session; otherwise a refresh on
    // this screen briefly looks like a guest and would get the placeholder.
    if (!authReady) return;
    // Skip the duplicate invocation from StrictMode / re-mount for this key.
    if (startedKey.current === retryKey) return;
    startedKey.current = retryKey;

    // Cross-instance guard (§6 hardening): the ref guard above only protects
    // a single mounted instance of this component. If a second instance of
    // Generating ever mounts in parallel (double-tap that slipped past a
    // button's own guard, a stray remount, back/forward nav, etc.), it would
    // get its own fresh ref and — without this — would kick off a second,
    // fully independent generation (its own AI call, its own DB insert).
    // This lock is shared across instances/tabs via localStorage and closes
    // that gap. If we don't get it, another generation of this type is
    // already in flight — silently do nothing and let that one finish and
    // navigate for both.
    const lockType: GenerationType = state.mode === 'sprint' ? 'sprint'
      : state.mode === 'youtube' ? 'youtube'
      : 'roadmap';
    if (!tryAcquireGenerationLock(lockType)) return;

    setError(null);
    setIsAuthError(false);
    setLimitMessage(null);

    async function run() {
      try {
        // `state.free` defaults to true in context.tsx and nothing flips it after
        // sign-in, so a real signed-in user was still getting the instant
        // placeholder. Use the actual session instead: only guests and the
        // demo bypass user (no real JWT, so the edge function would reject
        // them) get the preview roadmap.
        const usePreview = !user || user.id === 'dev-bypass';
        if (usePreview) {
          const roadmap = buildPlaceholderRoadmap(
            state.skill || state.roadmapSkill,
            state.learningType,
            state.hoursPerDay,
            state.mode,
          );
          // Preview roadmaps are ephemeral — not persisted.
          await addRoadmap(roadmap, { preview: true });
          navigate('/main');
        } else {
          const roadmap = await withTimeout(
            generateRoadmap(
              state.skill || state.roadmapSkill,
              state.answers,
              state.resolvedLevel ?? state.level,
              state.hoursPerDay,
              state.daysPerWeek,
              state.mode,
              state.sprintDays,
              state.sprintGoal,
              state.learningType,
              state.ytSource,
              state.ytCreator,
              state.ytAiPick,
            ),
            GENERATION_TIMEOUT_MS,
          );
          // Fresh generation is added as a new pinned roadmap and persisted to
          // Supabase so a refresh (or another device) restores it.
          await addRoadmap(roadmap);
          navigate('/main');
        }
      } catch (e: any) {
        const msg: string = e?.message || 'Generation failed. Please try again.';
        // Only match our own throw — GitHub Models errors also say "Unauthorized"
        // (invalid API key) and must NOT be misclassified as a session error.
        const authFail = msg === 'Not authenticated';
        setIsAuthError(authFail);
        // Roadmap limit (from the proxy or the DB trigger): show a friendly
        // message instead of "Generation failed / Try again".
        const limitIdx = msg.indexOf('ROADMAP_LIMIT_');
        if (limitIdx !== -1) {
          setLimitMessage(msg.slice(msg.indexOf(':', limitIdx) + 1).trim());
        }
        setError(msg);

        // Dev-only diagnostics — console.error only, never surfaced in the UI.
        console.error('[Generating] Generation failed:', {
          type: lockType,
          mode: state.mode,
          retryAttempt: retryKey,
          error: e,
        });
      } finally {
        // Release as soon as this attempt is done (success or failure) so a
        // "Try again" tap — or a legitimate next generation — isn't blocked.
        // LOCK_MAX_AGE_MS in generationLock.ts is only a backstop for the
        // case where this finally never runs (tab crash mid-generation).
        releaseGenerationLock(lockType);
      }
    }

    run();
  }, [retryKey, authReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Error state ───────────────────────────────────────────────────────────────
  if (error && limitMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-5">
          <NavLogo size={30} />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">Roadmap limit reached</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{limitMessage}</p>
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={() => navigate('/main')}
            className="w-full h-12 bg-primary text-foreground text-sm font-semibold rounded-full hover:bg-primary transition-all"
          >
            Go to my roadmaps
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full h-12 border border-border text-muted-foreground text-sm font-semibold rounded-full hover:bg-muted transition-all"
          >
            Back to start
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-5">
          <NavLogo size={30} />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">
          {isAuthError ? 'Sign in required' : 'Generation failed'}
        </h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {isAuthError
            ? 'You need to be signed in to generate a roadmap.'
            : "We couldn't finish building your roadmap. This can happen with a slow or interrupted connection. Please try again."}
        </p>
        <div className="flex flex-col gap-2 w-full">
          {isAuthError ? (
            <button
              onClick={() => navigate('/auth?next=/generating')}
              className="w-full h-12 bg-primary text-foreground text-sm font-semibold rounded-full hover:bg-primary transition-all"
            >
              Log in
            </button>
          ) : (
            <button
              onClick={() => setRetryKey(k => k + 1)}
              className="w-full h-12 bg-primary text-foreground text-sm font-semibold rounded-full hover:bg-primary transition-all"
            >
              Try again
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="w-full h-12 border border-border text-muted-foreground text-sm font-semibold rounded-full hover:bg-muted transition-all"
          >
            Back to start
          </button>
        </div>
      </div>
    );
  }

  // ── Loading state ─────────────────────────────────────────────────────────────
  return (
    <div className="relative h-full">
      <style>{`
        @keyframes notif-pop {
          0%   { opacity: 0; transform: translateY(-14px) scale(0.7); }
          55%  { opacity: 1; transform: translateY(4px) scale(1.04); }
          75%  { transform: translateY(-2px) scale(0.99); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes notif-dangle {
          0%, 100% { transform: rotate(-2.5deg); }
          50%      { transform: rotate(2.5deg); }
        }
        @keyframes notif-pop-out {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-14px) scale(0.7); }
        }
        @keyframes tip-expand {
          from { opacity: 0; max-height: 0; }
          to   { opacity: 1; max-height: 160px; }
        }
      `}</style>

      {/* Four-panel animated preloader */}
      <NaviPreloader skill={state.roadmapSkill || state.skill} />

      {/* Reassurance tooltip — floats above the preloader */}
      {activeTip && (
        <div className="absolute inset-x-0 bottom-10 flex justify-center pointer-events-none z-10">
          <div
            className="pointer-events-auto relative flex flex-col items-center"
            style={{
              transformOrigin: 'top center',
              animation: tipClosing
                ? `notif-pop-out ${TIP_POP_OUT_MS}ms ease-in both`
                : 'notif-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
            }}
          >
            <div style={tipClosing ? undefined : { animation: 'notif-dangle 1.6s ease-in-out 0.6s infinite' }}>
              <div className="relative bg-background border border-border rounded-2xl px-3.5 py-2 shadow-[0_8px_20px_rgba(19,25,39,0.10)]">
                {activeTip === 'give-it-3' ? (
                  <button
                    type="button"
                    onClick={() => setTipExpanded(v => !v)}
                    className="flex items-center gap-1.5"
                  >
                    <Clock size={14} className="text-accent-foreground shrink-0" />
                    <span className="text-[12px] font-semibold text-foreground whitespace-nowrap">Give it about 3 minutes</span>
                    <ChevronDown
                      size={14}
                      className="text-muted-foreground shrink-0"
                      style={{ transition: 'transform 0.25s ease', transform: tipExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#ffaa00]/15 flex items-center justify-center shrink-0">
                      <Trophy size={12} className="text-[#ffaa00]" />
                    </div>
                    <span className="text-[12px] font-semibold text-foreground whitespace-nowrap">Hang in there, Champ!</span>
                  </div>
                )}
                {activeTip === 'give-it-3' && tipExpanded && (
                  <div className="overflow-hidden" style={{ animation: 'tip-expand 0.3s ease both' }}>
                    <p className="text-[12px] text-muted-foreground leading-relaxed pt-2 text-left w-[220px]">
                      We're researching real resources, sequencing every phase, and tailoring this to you.
                      Great roadmaps are worth the wait, so please keep the app open so nothing is lost. The
                      result will be detailed enough to actually follow.
                    </p>
                  </div>
                )}
                <div
                  className="absolute left-1/2 -bottom-[6px] w-3 h-3 bg-background border-b border-r border-border"
                  style={{ transform: 'translateX(-50%) rotate(45deg)' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}