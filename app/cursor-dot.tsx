"use client";

import { useEffect, useRef } from "react";
import { useFinePointer } from "./fine-pointer";

/** Elements the dot shrinks over: the ones that get a focus ring. */
const INTERACTIVE = "a, button, input, summary, [tabindex]";
/** Elements that swap the dot for a pill with an eye and this attribute's text. */
const LABELLED = "[data-cursor-label]";
/** Share of the remaining gap to the pointer closed per frame. */
const FOLLOW = 0.2;
/** Gap in px under which the dot counts as arrived and stops scheduling frames. */
const SETTLE_EPSILON = 0.05;

/**
 * A dot that replaces the OS cursor and inverts what's behind it. The wrapper
 * owns position (eased every frame by rAF); the inner dot owns scale (a CSS
 * spring), so the two motions never share a transform.
 */
export function CursorDot() {
  const wrap = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const enabled = useFinePointer();

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.dataset.cursorHidden = "";
    return () => {
      delete document.documentElement.dataset.cursorHidden;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const w = wrap.current;
    const d = dot.current;
    if (!w || !d) return;

    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const pos = { ...target };
    let armed = false;
    let raf = 0;

    function tick() {
      raf = 0;
      pos.x += (target.x - pos.x) * FOLLOW;
      pos.y += (target.y - pos.y) * FOLLOW;
      w!.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      if (dx * dx + dy * dy > SETTLE_EPSILON * SETTLE_EPSILON) {
        raf = requestAnimationFrame(tick);
      }
    }

    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!armed) {
        // First move: snap and reveal, rather than glide in from the centre.
        pos.x = e.clientX;
        pos.y = e.clientY;
        armed = true;
        w!.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        w!.style.opacity = "1";
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as Element;
      const labelled = t?.closest?.<HTMLElement>(LABELLED);
      if (labelled && label.current) label.current.textContent = labelled.dataset.cursorLabel ?? "";
      w!.classList.toggle("cursor-wrap--label", !!labelled);
      d!.classList.toggle("cursor-dot--active", !labelled && !!t?.closest?.(INTERACTIVE));
    };
    // Leaving the window gives no target to test, so hide rather than strand the dot.
    const leave = () => {
      w!.style.opacity = "0";
    };

    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerover", over, { passive: true });
    addEventListener("pointerleave", leave, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      removeEventListener("pointerover", over);
      removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={wrap} className="cursor-wrap" aria-hidden="true">
      <div ref={dot} className="cursor-dot" />
      <div className="cursor-label">
        <svg viewBox="0 0 24 24">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span ref={label} />
      </div>
    </div>
  );
}
