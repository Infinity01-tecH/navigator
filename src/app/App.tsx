import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { router } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SplashScreen } from '../screens/SplashScreen';
import { LoadingQuote } from '../screens/LoadingQuote';

type Phase = 'splash' | 'quote' | 'app';

const FADE = { duration: 0.35, ease: [0.4, 0, 0.2, 1] } as const;

export default function App() {
  const [phase, setPhase] = useState<Phase>('splash');

  // Apply dark mode class on mount from persisted preference
  useEffect(() => {
    try {
      const dark = localStorage.getItem('nav_dark_mode') === '1';
      document.documentElement.classList.toggle('dark', dark);
    } catch { /* ignore */ }
  }, []);

  return (
    <ErrorBoundary>
      {/*
        Full-viewport shell for the pre-router splash flow. Once the app
        phase mounts, RouterProvider → Layout takes over its own 390px
        max-width container; this wrapper just ensures the splash/quote
        screens always fill the full viewport.
      */}
      <div className="fixed inset-0 bg-background">
        <AnimatePresence mode="wait">
          {phase === 'splash' && (
            <motion.div
              key="splash"
              className="absolute inset-0"
              exit={{ opacity: 0 }}
              transition={FADE}
            >
              <SplashScreen onDone={() => setPhase('quote')} />
            </motion.div>
          )}

          {phase === 'quote' && (
            <motion.div
              key="quote"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={FADE}
            >
              <LoadingQuote onDone={() => setPhase('app')} />
            </motion.div>
          )}

          {phase === 'app' && (
            <motion.div
              key="app"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={FADE}
            >
              <RouterProvider router={router} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
