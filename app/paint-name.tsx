"use client";

import { useEffect, useRef, useState } from "react";

/** Radius of one brush dab, px. */
const DAB_RADIUS = 34;
/** ponytail: FIFO cap doubles as the eraser — old dabs drop off so the paint
 * fades behind you and the effect stays replayable. Raise for longer trails. */
const MAX_DABS = 45;

type Dab = { x: number; y: number };

/** The name, paintable with the cursor. Each pointer move drops a green dab
 * that is clipped to the glyphs, so hovering brushes accent onto the letters
 * instead of recoloring the whole word at once. Inert under reduced-motion. */
export function PaintName({ children }: { children: string }) {
  const [dabs, setDabs] = useState<Dab[]>([]);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  function paint(e: React.PointerEvent<HTMLHeadingElement>) {
    if (reduced.current) return;
    const box = e.currentTarget.getBoundingClientRect();
    const dab = { x: e.clientX - box.left, y: e.clientY - box.top };
    setDabs((prev) => [...prev, dab].slice(-MAX_DABS));
  }

  const backgroundImage = [
    ...dabs.map(
      (d) =>
        `radial-gradient(circle ${DAB_RADIUS}px at ${d.x}px ${d.y}px, var(--color-accent) 0 55%, transparent 100%)`,
    ),
    // Bottom layer: the unpainted ink the dabs sit on.
    "linear-gradient(var(--color-ink) 0 100%)",
  ].join(", ");

  return (
    <h1
      className="name"
      data-enter
      style={{ "--i": 2, backgroundImage } as React.CSSProperties}
      onPointerMove={paint}
    >
      {children}
    </h1>
  );
}
