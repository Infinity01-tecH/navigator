import { useLocation, Outlet, useNavigate, Link } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { AppProvider, useApp } from '../lib/context';
import { NaviPreloader } from '../components/NaviPreloader';
import { Sparkles, X, Monitor } from 'lucide-react';
import { useViewMode } from '../lib/viewMode';

// ── Motivational quote pool ─────────────────────────────────────────────────
// 30 short, skill-learning-relevant quotes. One is picked at random on every
// real app mount (not on every route change — see MotivationToast below) and
// shown as a dismissible, auto-fading bubble. Never the same quote twice in a
// row, so a reload doesn't just repeat what the user already saw.
const QUOTES = [
  'Small daily progress beats occasional bursts of intensity.',
  "You don't have to be great to start, but you have to start to be great.",
  'Consistency turns effort into skill, and skill into identity.',
  'The expert in anything was once a beginner.',
  'Progress is progress, no matter how slow.',
  'Discipline is choosing what you want most over what you want now.',
  "Every skill you'll ever have starts as something you're bad at.",
  'Motivation gets you started. Habit keeps you going.',
  'The best time to learn this was a year ago. The next best time is today.',
  "Don't watch the clock; do what it does — keep going.",
  'One percent better every day compounds faster than you think.',
  'Mastery is just a long series of small wins.',
  'You are what you repeatedly do.',
  "The only way to learn is by doing — reading about it isn't enough.",
  'A little progress each day adds up to big results.',
  "It's not about having time, it's about making time.",
  'Show up today. That is the whole secret.',
  'Skills are built in the boring, unglamorous repetitions.',
  "The pain of discipline weighs ounces; the pain of regret weighs tons.",
  'Nobody who ever gave their best regretted it.',
  'Learning is a skill in itself — and it gets easier with practice.',
  'Your future self is built by what you practice today.',
  "Don't wait for motivation. Start, and motivation will follow.",
  'Every step you complete is proof you can keep going.',
  'Growth lives outside your comfort zone, one rep at a time.',
  'The gap between where you are and where you want to be is called practice.',
  'Momentum is built by finishing, not by starting.',
  'You will not always be motivated, so you must learn to be disciplined.',
  'Great things take time — keep showing up.',
  "Today's effort is tomorrow's ability.",
];

function pickQuote(last: string | null): string {
  if (QUOTES.length <= 1) return QUOTES[0];
  let pick = last;
  while (pick === last) pick = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  return pick as string;
}

// Ambient, dismissible quote bubble shown once per real app load. Mirrors the
// Generating.tsx tooltip's visual language (notif-pop entrance, speech-bubble
// shape, shadow) per DESIGN-SYSTEM.md §7.4/§8 rather than inventing a new
// pattern — this is the only other place in the app that shows an unprompted
// ambient message, so it should look like a sibling of that, not a stranger.
// Deliberately NOT built on the splash/gate pattern: it must never block
// interaction or delay route rendering, so it renders as an overlay on top of
// whatever screen is already mounting.
function MotivationToast() {
  const [quote] = useState(() => pickQuote(null));
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  function dismiss() {
    if (closing) return;
    setClosing(true);
    setTimeout(() => setVisible(false), 300); // matches notif-pop-out-style exit
  }

  useEffect(() => {
    const t = setTimeout(dismiss, 6000); // auto-dismiss if the user ignores it
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      className="absolute left-0 right-0 z-40 flex justify-center px-4"
      style={{ top: 14, pointerEvents: 'none' }}
    >
      <div
        className="flex items-start gap-2 bg-background border border-border rounded-2xl pl-3.5 pr-2.5 py-2.5 max-w-full"
        style={{
          boxShadow: '0 8px 20px rgba(19,25,39,0.10)',
          pointerEvents: 'auto',
          animation: closing
            ? 'motiv-pop-out 0.3s ease both'
            : 'notif-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
      >
        <style>{`
          @keyframes motiv-pop-out {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to   { opacity: 0; transform: translateY(-10px) scale(0.92); }
          }
        `}</style>
        <Sparkles size={14} className="text-primary shrink-0 mt-0.5" />
        <p className="text-[12px] font-semibold text-foreground leading-snug">
          {quote}
        </p>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-muted-foreground transition-colors -mr-1"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

function AnimatedOutlet() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-0"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

// Minimal splash shown only while we're waiting to find out whether a signed-in
// user has roadmaps. Deliberately reuses the same logo treatment as Generating.tsx
// so it doesn't read as a separate, unfamiliar loading state — see DESIGN-SYSTEM.md
// §4 for the pulsing-icon pattern this borrows from. No spinning ring here on
// purpose: that animation reads as "long operation in progress" (Generating.tsx
// waits 30-90s), and this gate should resolve in well under a second — a busier
// animation would oversell how long the wait actually is.
function HydrationSplash() {
  return (
    <div className="relative h-full w-full">
      <NaviPreloader label="Loading" />
    </div>
  );
}

// Sits inside AppProvider (needs useApp) and above the router outlet. Decides,
// before anything paints, whether to show a splash, silently redirect a
// returning user straight to /main, or just render the requested route.
//
// This replaces the old approach of letting Start.tsx render first and then
// redirecting away from it in an effect — that meant a returning user briefly
// saw the full Start screen (skill input, mode picker, everything) before
// getting yanked to /main. Gating here means Start never mounts at all for
// that case.
function HydrationGate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, authReady, roadmapsHydrated, state } = useApp();

  const guest = authReady && !user;
  const waitingOnHydration = !guest && !roadmapsHydrated;

  // Fires exactly once per real app load — the moment we stop showing the
  // splash — regardless of how many route changes happen after that. A ref
  // (not state) so re-renders from routing never re-arm it.
  const hasShownQuote = useRef(false);
  const [showQuote, setShowQuote] = useState(false);
  const appIsReady = authReady && !waitingOnHydration;
  useEffect(() => {
    if (appIsReady && !hasShownQuote.current) {
      hasShownQuote.current = true;
      setShowQuote(true);
    }
  }, [appIsReady]);

  const persistedRoadmaps = state.roadmaps.filter(r => !r.preview);
  const shouldAutoRedirect =
    roadmapsHydrated &&
    !!user &&
    persistedRoadmaps.length > 0 &&
    location.pathname === '/' &&
    !location.state?.skipAutoRedirect;

  useEffect(() => {
    if (shouldAutoRedirect) navigate('/main', { replace: true });
  }, [shouldAutoRedirect, navigate]);

  // Not signed in yet (authReady false) or actively hydrating a signed-in
  // user's roadmaps: hold on the splash rather than flashing Start.
  if (!authReady || waitingOnHydration) return <HydrationSplash />;

  // Redirect decided above — hold the splash one more tick rather than letting
  // Start flash in while the navigate() from the effect above is in flight.
  if (shouldAutoRedirect) return <HydrationSplash />;

  return (
    <>
      <AnimatedOutlet />
      {/* The quote bubble is for the signed-in app, not for visitors on a public portfolio. */}
      {showQuote && !location.pathname.startsWith('/u/') && <MotivationToast />}
    </>
  );
}

export function Layout() {
  const { desktop, canDesktop, setMode } = useViewMode();
  const { pathname } = useLocation();
  // The DEV link is hidden. It appears after pressing the "7" key 7 times in a
  // row (on a computer) or tapping the version card in Settings 7 times (on a
  // phone). It stays visible until the page reloads.
  const [devVisible, setDevVisible] = useState(false);
  useEffect(() => {
    let streak = 0;
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === '7') {
        streak += 1;
        if (streak >= 7) { setDevVisible(true); streak = 0; }
      } else {
        streak = 0;
      }
    }
    const show = () => setDevVisible(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('nav-show-dev', show);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('nav-show-dev', show);
    };
  }, []);
  // Desktop view only widens the main app (/main). Onboarding, settings, etc.
  // stay in the centered phone-width column, which looks right on a big screen.
  // Public portfolio pages (/u/<handle>) always use the full width: visitors
  // have no desktop/mobile setting, and the page centres its own content.
  const wide = (desktop && pathname === '/main') || pathname.startsWith('/u/');
  return (
    <AppProvider>
      <div
        className="bg-background w-full min-h-screen"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <div className={`relative w-full mx-auto h-screen overflow-hidden ${wide ? '' : 'max-w-[412px]'}`}>
          <HydrationGate />
          {canDesktop && !desktop && pathname === '/main' && (
            <button
              onClick={() => setMode('desktop')}
              className="fixed bottom-3 left-3 z-50 flex items-center gap-1.5 bg-background border border-border rounded-[8px] px-2.5 py-1 shadow-sm"
              aria-label="Switch to desktop view"
            >
              <Monitor size={13} className="text-foreground" />
              <span className="text-[11px] font-bold text-foreground tracking-wider">Desktop view</span>
            </button>
          )}
          {devVisible && (
            <Link
              to="/dev"
              className="absolute bottom-3 right-3 z-50 bg-primary rounded-[8px] px-2.5 py-1 shadow-sm"
              aria-label="Dev navigator"
            >
              <span className="text-[11px] font-bold text-foreground tracking-wider">DEV</span>
            </Link>
          )}
        </div>
      </div>
    </AppProvider>
  );
}
