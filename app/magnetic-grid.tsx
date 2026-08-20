"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  getFinePointerServerSnapshot,
  getFinePointerSnapshot,
  subscribeFinePointer,
} from "./fine-pointer";

/** Must match the cutting mat in globals.css — this canvas redraws that same
 * grid, so a mismatch here shows up as the mat visibly changing on mount. */
const SPACING = 24;
/** How far the field reaches, px. */
const RADIUS = 190;
/** Peak displacement at the centre of the field, px. */
const PULL = 17;
/** Polyline step for lines passing through the field. Small enough that the
 * bend reads as a curve rather than a chain of visible facets. */
const SAMPLE = 8;
/** Per-frame easing toward the pointer, matching the cursor dot's feel. */
const FOLLOW = 0.18;
/** Below this, treat a value as arrived and stop scheduling frames. */
const EPSILON = 0.01;

/**
 * Warps one point toward the pointer, falling off to nothing at RADIUS.
 * Squared falloff so the very centre moves a lot and the rim barely moves —
 * a linear falloff makes the edge of the field a visible hard ring.
 */
function warp(
  x: number,
  y: number,
  cx: number,
  cy: number,
  power: number,
  out: { x: number; y: number },
) {
  const dx = cx - x;
  const dy = cy - y;
  const d2 = dx * dx + dy * dy;
  if (d2 > RADIUS * RADIUS) {
    out.x = x;
    out.y = y;
    return out;
  }
  // `|| 1` guards the exact-centre case, where d is 0 and the unit vector
  // would be NaN.
  const d = Math.sqrt(d2) || 1;
  const falloff = 1 - d / RADIUS;
  const amount = PULL * falloff * falloff * power;
  out.x = x + (dx / d) * amount;
  out.y = y + (dy / d) * amount;
  return out;
}

/**
 * The cutting-mat grid, redrawn on a canvas so it can bend around the pointer
 * like a field line around a magnet.
 *
 * The mat is normally a pair of `repeating-linear-gradient`s on `body`, which
 * cannot be distorted locally — a CSS background can be moved or scaled as a
 * whole, but not dented in one spot. So while this is mounted it sets
 * `data-grid-canvas` on <html>, globals.css drops the CSS copy, and this
 * canvas becomes the single source of the grid. Unmounting hands it straight
 * back, which is also the fallback for touch devices and reduced-motion:
 * those never mount this at all and simply keep the CSS mat.
 *
 * Drawing is cheap because straightness is the common case: a line further
 * than RADIUS from the pointer cannot bend anywhere along its length, so it
 * is stroked as a single segment. Only the ~16 lines per axis actually
 * crossing the field get sampled into polylines.
 */
export function MagneticGrid() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const enabled = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot,
  );

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.dataset.gridCanvas = "";
    return () => {
      delete document.documentElement.dataset.gridCanvas;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;

    // Read the mat's own line colour rather than restating it: --mat-fine is
    // a color-mix() off the live accent, and a probe element is the reliable
    // way to get it resolved to a plain rgba() the canvas can use.
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:absolute;width:0;height:0;visibility:hidden;color:var(--mat-fine)";
    document.body.appendChild(probe);
    const line = getComputedStyle(probe).color;
    probe.remove();

    let w = 0;
    let h = 0;
    // Pointer parked off-screen initially so the first paint is a plain,
    // undistorted grid — identical to the CSS mat it just replaced.
    const s = { x: -9999, y: -9999, tx: -9999, ty: -9999, p: 0, tp: 0 };
    const pt = { x: 0, y: 0 };
    let raf = 0;

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      ctx!.strokeStyle = line;
      ctx!.lineWidth = 1;
      const { x: cx, y: cy, p } = s;

      for (let x = 0; x <= w; x += SPACING) {
        ctx!.beginPath();
        // No point on this line is within reach, so it cannot bend: one
        // segment instead of h/SAMPLE of them.
        if (Math.abs(x - cx) > RADIUS || p <= 0) {
          ctx!.moveTo(x + 0.5, 0);
          ctx!.lineTo(x + 0.5, h);
        } else {
          for (let y = 0; y <= h; y += SAMPLE) {
            warp(x, y, cx, cy, p, pt);
            if (y === 0) ctx!.moveTo(pt.x + 0.5, pt.y);
            else ctx!.lineTo(pt.x + 0.5, pt.y);
          }
        }
        ctx!.stroke();
      }

      for (let y = 0; y <= h; y += SPACING) {
        ctx!.beginPath();
        if (Math.abs(y - cy) > RADIUS || p <= 0) {
          ctx!.moveTo(0, y + 0.5);
          ctx!.lineTo(w, y + 0.5);
        } else {
          for (let x = 0; x <= w; x += SAMPLE) {
            warp(x, y, cx, cy, p, pt);
            if (x === 0) ctx!.moveTo(pt.x, pt.y + 0.5);
            else ctx!.lineTo(pt.x, pt.y + 0.5);
          }
        }
        ctx!.stroke();
      }
    }

    function tick() {
      raf = 0;
      s.x += (s.tx - s.x) * FOLLOW;
      s.y += (s.ty - s.y) * FOLLOW;
      s.p += (s.tp - s.p) * FOLLOW;
      draw();
      const dx = s.tx - s.x;
      const dy = s.ty - s.y;
      const dp = s.tp - s.p;
      if (dx * dx + dy * dy > EPSILON || Math.abs(dp) > EPSILON) {
        raf = requestAnimationFrame(tick);
      }
    }

    function resize() {
      // Capped: a 3x display would triple the pixel count for no visible gain
      // on 1px hairlines.
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth;
      h = innerHeight;
      el!.width = Math.round(w * dpr);
      el!.height = Math.round(h * dpr);
      el!.style.width = `${w}px`;
      el!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    const move = (e: PointerEvent) => {
      // Snap position on the first move so the field appears where the
      // pointer already is, then let `power` fade it in from nothing —
      // easing position instead would drag a dent across the whole grid.
      if (s.tp === 0) {
        s.x = e.clientX;
        s.y = e.clientY;
      }
      s.tx = e.clientX;
      s.ty = e.clientY;
      s.tp = 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    // Without this the grid would keep a permanent dent wherever the pointer
    // happened to exit, since no further pointermove events arrive to relax
    // it. Easing power to 0 relaxes in place rather than dragging the dent
    // off-screen.
    const leave = () => {
      s.tp = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    resize();
    addEventListener("resize", resize, { passive: true });
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerleave", leave, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", move);
      removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return <canvas ref={canvas} className="grid-canvas" aria-hidden="true" />;
}
