"use client";

import { useEffect, useRef } from "react";
import { useFinePointer } from "./fine-pointer";

/** Must match the cutting mat's spacing in globals.css. */
const SPACING = 24;
/** Reach of the field, px. */
const RADIUS = 190;
/** Peak displacement at the field's centre, px. */
const PULL = 17;
/** Polyline step for bent lines: small enough to read as a curve. */
const SAMPLE = 8;
/** Per-frame easing toward the pointer, like the cursor dot. */
const FOLLOW = 0.18;
/** Below this, a value counts as arrived and frames stop. */
const EPSILON = 0.01;

/** Pulls one point toward the pointer, with squared falloff so the field's rim never shows as a ring. */
function warp(x: number, y: number, cx: number, cy: number, power: number, out: { x: number; y: number }) {
  const dx = cx - x;
  const dy = cy - y;
  const d2 = dx * dx + dy * dy;
  if (d2 > RADIUS * RADIUS) {
    out.x = x;
    out.y = y;
    return out;
  }
  const d = Math.sqrt(d2) || 1; // `|| 1`: the exact centre would divide by zero.
  const falloff = 1 - d / RADIUS;
  const amount = PULL * falloff * falloff * power;
  out.x = x + (dx / d) * amount;
  out.y = y + (dy / d) * amount;
  return out;
}

/**
 * The cutting-mat grid on a canvas, bent around the pointer. A CSS background
 * can't be dented locally, so while mounted this sets data-grid-canvas and
 * globals.css drops the CSS mat; touch and reduced-motion keep the CSS one.
 */
export function MagneticGrid() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const enabled = useFinePointer();

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

    // Resolve the mat's color-mix() line colour to plain rgba via a probe element.
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;width:0;height:0;visibility:hidden;color:var(--mat-fine)";
    document.body.appendChild(probe);
    const line = getComputedStyle(probe).color;
    probe.remove();

    let w = 0;
    let h = 0;
    // Pointer parked off-screen so the first paint is the plain mat.
    const s = { x: -9999, y: -9999, tx: -9999, ty: -9999, p: 0, tp: 0 };
    const pt = { x: 0, y: 0 };
    let raf = 0;

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      ctx!.strokeStyle = line;
      ctx!.lineWidth = 1;
      const { x: cx, y: cy, p } = s;

      // A line farther than RADIUS from the pointer can't bend: one segment.
      for (let x = 0; x <= w; x += SPACING) {
        ctx!.beginPath();
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
      const dpr = Math.min(devicePixelRatio || 1, 2); // 3x buys nothing on 1px lines.
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
      // First move: snap the field to the pointer and fade its power in.
      if (s.tp === 0) {
        s.x = e.clientX;
        s.y = e.clientY;
      }
      s.tx = e.clientX;
      s.ty = e.clientY;
      s.tp = 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    // Relax in place on exit, or the dent stays wherever the pointer left.
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
