// Mobile / Desktop view switch.
// - 'mobile'  : the phone-sized frame (default, what the app has always been).
// - 'desktop' : sidebar + wide content area. Only applies when the browser
//   window is at least MIN_DESKTOP_WIDTH wide; on a phone it is ignored, so a
//   saved "desktop" choice can never break the phone layout.
// The choice is remembered per device in localStorage (try/catch: storage can
// be blocked), and every component using the hook updates instantly.
import { useEffect, useState } from 'react';

export type ViewMode = 'mobile' | 'desktop';

const KEY = 'nav_view_mode';
const EVT = 'nav-view-mode-change';
export const MIN_DESKTOP_WIDTH = 900;

let memMode: ViewMode = 'mobile'; // fallback when localStorage is unavailable

function read(): ViewMode {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'desktop' || v === 'mobile') return v;
  } catch { /* storage blocked */ }
  return memMode;
}

export function setViewMode(mode: ViewMode) {
  memMode = mode;
  try { localStorage.setItem(KEY, mode); } catch { /* storage blocked */ }
  window.dispatchEvent(new Event(EVT));
}

export function useViewMode() {
  const [mode, setMode] = useState<ViewMode>(read);
  const [width, setWidth] = useState(() => (typeof window === 'undefined' ? 0 : window.innerWidth));

  useEffect(() => {
    const sync = () => setMode(read());
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener(EVT, sync);
    window.addEventListener('storage', sync);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener('storage', sync);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const canDesktop = width >= MIN_DESKTOP_WIDTH;
  return { mode, canDesktop, desktop: mode === 'desktop' && canDesktop, setMode: setViewMode };
}
