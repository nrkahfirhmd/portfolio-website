"use client";

import { type ReactNode, useEffect, useRef } from "react";

/** Masonry on 1px grid rows: each tile spans its own height. Without JS it's a plain grid. */
export function Masonry({ className, children }: { className: string; children: ReactNode }) {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const tiles = [...el.children] as HTMLElement[];
    const fit = () => {
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      for (const t of tiles) {
        t.style.setProperty("--span", String(Math.ceil(t.getBoundingClientRect().height + gap)));
      }
    };
    el.dataset.masonry = "";
    fit();
    const ro = new ResizeObserver(fit);
    for (const t of tiles) ro.observe(t);
    return () => {
      ro.disconnect();
      delete el.dataset.masonry;
    };
  }, []);

  return (
    <div ref={grid} className={className}>
      {children}
    </div>
  );
}
