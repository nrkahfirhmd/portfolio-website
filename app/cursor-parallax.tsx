"use client";

import { useEffect } from "react";

/** Publishes the pointer to :root as --mx / --my (-1..1); off under reduced motion. */
export function CursorParallax() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const root = document.documentElement;
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
