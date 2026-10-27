import { useEffect, useRef } from 'react';

// Premium, relaxed momentum scrolling for a specific scroll container — without
// hijacking the browser's scroll model.
//
// We deliberately do NOT use a scroll-jacking library here. Those libraries
// replace native scrolling wholesale, and when the container has many direct
// children (no single inner "content" wrapper) their scroll-distance math
// collapses to zero and the page stops scrolling entirely.
//
// Instead we leave native scrolling fully in place — so touch devices keep
// their built-in inertial momentum, and scrolling can never break — and only
// add a gentle easing layer for desktop mouse-wheel input, which is the only
// place the native feel is abrupt. Each wheel tick nudges a target position and
// a rAF loop glides scrollTop toward it, giving the calm, weighted "expensive"
// feel. Respects prefers-reduced-motion by staying out of the way entirely.
export function useSmoothScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // iOS-style momentum for any native (touch) scrolling that does happen.
    (el.style as CSSStyleDeclaration & { webkitOverflowScrolling?: string }).webkitOverflowScrolling = 'touch';

    // Accessibility: never smooth-hijack wheel input for reduced-motion users.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Pointer/touch devices already have great native momentum — only ease the
    // mouse wheel, and only on devices that actually use one.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let target = el.scrollTop;
    let raf = 0;
    let animating = false;

    const tick = () => {
      const current = el.scrollTop;
      const diff = target - current;
      if (Math.abs(diff) < 0.5) {
        el.scrollTop = target;
        animating = false;
        raf = 0;
        return;
      }
      
      // lerp: smaller factor = longer, more relaxed glide
      let step = diff * 0.12;
      // enforce a minimum step size so we don't get stuck in subpixel rounding traps on some OSs/browsers
      if (Math.abs(step) < 1) {
        step = Math.sign(step);
      }
      
      el.scrollTop = current + step;
      
      // If we didn't actually move (e.g. hit the physical scroll boundary or unscrollable container),
      // stop animating to prevent infinite loops burning CPU.
      if (el.scrollTop === current) {
        // Only stop if we really tried to move and couldn't
        if (Math.abs(diff) > 1) {
          animating = false;
          raf = 0;
          return;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      // Let horizontal / zoom / modified gestures behave natively.
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return; // nothing to scroll — let the event bubble

      // Normalize line/page delta modes to pixels.
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1;
      const delta = e.deltaY * unit;

      // If we're at an edge and pushing further, don't swallow the event — let
      // it bubble so parent containers / overscroll behave normally.
      const atTop = el.scrollTop <= 0 && delta < 0;
      const atBottom = el.scrollTop >= maxScroll && delta > 0;
      if (atTop || atBottom) return;

      e.preventDefault();
      // Re-sync target if the user scrolled by other means since last tick.
      if (!animating) target = el.scrollTop;
      target = Math.max(0, Math.min(maxScroll, target + delta));
      if (!animating) {
        animating = true;
        raf = requestAnimationFrame(tick);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', onWheel);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
