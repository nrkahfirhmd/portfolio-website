"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  getFinePointerServerSnapshot,
  getFinePointerSnapshot,
  subscribeFinePointer,
} from "./fine-pointer";

/** Elements the dot grows over — the same set that gets a focus ring. */
const INTERACTIVE = "a, button, input, summary, [tabindex]";
/** Follow tightness per frame — how much of the remaining gap to the real
 * pointer the dot closes each tick. Lower drifts and floats more; higher
 * snaps closer to instant. 0.2 reads as a trailing circle, not a lagging one. */
const FOLLOW = 0.2;
/** Below this many px of remaining gap, treat the dot as arrived and stop
 * scheduling frames — an idle cursor shouldn't cost a rAF tick forever. */
const SETTLE_EPSILON = 0.05;

/**
 * A circle that replaces the OS cursor and inverts, via
 * `backdrop-filter: invert(1)`, whatever's actually behind it — see home.css
 * for why that's the right tool here rather than mix-blend-mode plus a
 * chosen fill colour: a black fill under difference blending is a
 * mathematical no-op, not just a bad look, so this needed a mechanism with
 * no fill colour to get wrong in the first place.
 *
 * Two nested elements, two different kinds of motion that would otherwise
 * fight if they shared one `transform`:
 * - `.cursor-wrap` (outer) owns position. Every frame it eases toward the raw
 *   pointer coordinate — the "cursor-follow" motion — driven by rAF, not a
 *   CSS transition, because the target itself moves every frame and a CSS
 *   transition would restart its curve on every single pointermove instead
 *   of producing one continuous trail.
 * - `.cursor-dot` (inner) owns scale. It has nothing to do with position, so
 *   it's free to use a real CSS transition on `--motion-playful` /
 *   `--motion-ease-playful` — the site's spring/overshoot pair, already
 *   named for exactly this in the design system's motion table ("cursor-
 *   follow settle") — for the pop when it grows over a link and the settle
 *   back down when it leaves.
 *
 * The native cursor is hidden globally (`[data-cursor-hidden] *` in
 * home.css) while this is mounted, with one deliberate exception: the
 * clock's editable city field keeps its real text beam, because a circle
 * gives no feedback about where a caret would land in text.
 *
 * Skips fine-pointer and reduced-motion checks the same way CursorParallax
 * does in spirit: no dot on touch devices (nothing to trail, and nothing to
 * hide), and no motion effect for visitors who asked not to have one — they
 * keep the native cursor, never left with neither. Live-subscribed rather
 * than checked once, so it also reverts if reduced-motion turns on
 * mid-session instead of stranding the visitor cursorless.
 */
export function CursorDot() {
  const wrap = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const enabled = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot,
  );

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
      // Squared-distance check avoids a sqrt every frame for a plain
      // threshold compare.
      if (dx * dx + dy * dy > SETTLE_EPSILON * SETTLE_EPSILON) {
        raf = requestAnimationFrame(tick);
      }
    }

    const move = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!armed) {
        // First move of the session: snap rather than glide in from centre,
        // and only then reveal — nobody should see it travel from nowhere.
        pos.x = e.clientX;
        pos.y = e.clientY;
        armed = true;
        w!.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        w!.style.opacity = "1";
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const over = (e: PointerEvent) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) {
        d!.classList.add("cursor-dot--active");
      }
    };
    const out = (e: PointerEvent) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) {
        d!.classList.remove("cursor-dot--active");
      }
    };
    // Leaving the whole viewport (into the OS chrome) has no target to check
    // against INTERACTIVE, so hide the dot outright rather than leave it
    // stranded at the last known position.
    const leave = () => {
      w!.style.opacity = "0";
    };

    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerover", over, { passive: true });
    addEventListener("pointerout", out, { passive: true });
    addEventListener("pointerleave", leave, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      removeEventListener("pointerover", over);
      removeEventListener("pointerout", out);
      removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={wrap} className="cursor-wrap" aria-hidden="true">
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
