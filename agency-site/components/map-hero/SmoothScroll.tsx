"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Inertia scrolling for the whole page (wheel and trackpad). Mount once, anywhere.
 * Skipped for visitors who prefer reduced motion; touch devices keep native scrolling.
 */
export function SmoothScroll({ lerp = 0.085, anchorOffset = -64 }: { lerp?: number; anchorOffset?: number }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp, wheelMultiplier: 0.9, anchors: { offset: anchorOffset } });
    let raf = 0;
    const tick = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [lerp, anchorOffset]);
  return null;
}
