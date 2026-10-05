"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * Left-to-right masonry. The grid runs on 1px rows and each tile spans as
 * many as its own height, so auto-placement drops every tile into the
 * shortest gap, dense, so later tiles back-fill holes without ever changing
 * size. Until this runs (or without JS) the grid is an ordinary one with
 * aligned rows, so nothing is ever hidden.
 */
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
    // Tiles change height when the column width changes or fonts land.
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
