"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The accent cursor. A green dot that follows the pointer and expands into a
 * labelled pill over anything carrying `data-cursor`.
 *
 * The native cursor is hidden from JS rather than from CSS, so a failed or
 * disabled script leaves the normal pointer intact instead of no pointer at
 * all. Coarse pointers never mount it.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  // Two primitive states rather than one object: setState bails out on an
  // identical primitive, so crossing between a card's children does not
  // re-render on every pointerover.
  const [label, setLabel] = useState<string | null>(null);
  const [icon, setIcon] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = root.current;
    if (!el) return;

    document.documentElement.classList.add("has-custom-cursor");

    let x = 0;
    let y = 0;
    let frame = 0;

    // ponytail: the position follows the pointer directly rather than easing
    // toward it. Add a lerp here if the settle in --motion-playful is wanted.
    const flush = () => {
      frame = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      setVisible(true);
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const hit = target?.closest?.("[data-cursor]");
      setLabel(hit?.getAttribute("data-cursor") ?? null);
      setIcon(hit?.getAttribute("data-cursor-icon") ?? null);
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="cursor-root"
      data-visible={visible}
      data-expanded={label !== null}
    >
      <div className="cursor-body">
        <span className="cursor-label">
          {icon === "eye" ? <EyeIcon /> : icon === "arrow" ? <ArrowIcon /> : null}
          {label}
        </span>
      </div>
    </div>
  );
}

const svg = {
  viewBox: "0 0 24 24",
  width: 14,
  height: 14,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function EyeIcon() {
  return (
    <svg {...svg} className="shrink-0">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg {...svg} className="shrink-0">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
