"use client";

import { useEffect, useRef, useState } from "react";

/** Radius of one brush dab, px. */
const DAB_RADIUS = 34;
/** FIFO cap that doubles as the eraser: old dabs drop off behind you. */
const MAX_DABS = 45;

type Dab = { x: number; y: number };

/** The name, painted green dab by dab under the cursor (clipped to the glyphs); inert under reduced motion. */
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
