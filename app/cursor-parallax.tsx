"use client";

import { useEffect } from "react";

/**
 * Publishes pointer position to the document root as --mx / --my in the range
 * -1..1. Renders nothing, so the rest of the page stays a server component.
 * Does not attach at all under prefers-reduced-motion.
 */
export function CursorParallax() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const root = document.documentElement;
    // ponytail: writes 2 custom properties per move, no rAF batch — one element
    // reads them. Batch into rAF if that count grows.
    const move = (e: PointerEvent) => {
      const mx = (e.clientX / innerWidth - 0.5) * 2;
      const my = (e.clientY / innerHeight - 0.5) * 2;
      root.style.setProperty("--mx", mx.toFixed(3));
      root.style.setProperty("--my", my.toFixed(3));
    };

    addEventListener("pointermove", move, { passive: true });
    return () => {
      removeEventListener("pointermove", move);
      root.style.removeProperty("--mx");
      root.style.removeProperty("--my");
    };
  }, []);

  return null;
}
