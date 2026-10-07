"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/** Dab radius in CSS px. */
const BRUSH = 22;
/** Mask alpha erased per frame. destination-out is multiplicative: alpha *= (1 - HEAL). */
const HEAL = 0.05;
/** Healing frames without new dabs before the loop stops and hard-clears (~4% opacity by frame 60). */
const IDLE_FRAMES = 90;

/**
 * Brush over the portrait to reveal the other image, which heals closed again.
 * An offscreen mask canvas accumulates soft dabs; the visible canvas redraws
 * the art each frame and keeps it only where the mask has alpha (destination-in).
 */
export function BrushReveal({ src }: { src: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const art = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const view = canvas.current;
    const ctx = view?.getContext("2d");
    if (!view || !ctx) return;

    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d");
    if (!mctx) return;

    /** The art pre-scaled once per resize, not on every frame. */
    let scaled: HTMLCanvasElement | null = null;
    let raf = 0;
    let idle = 0;
    let last: { x: number; y: number } | null = null;

    function prescale() {
      const img = art.current;
      if (!img?.complete || !img.naturalWidth || !mask.width) {
        scaled = null;
        return;
      }
      scaled = document.createElement("canvas");
      scaled.width = mask.width;
      scaled.height = mask.height;
      scaled.getContext("2d")?.drawImage(img, 0, 0, scaled.width, scaled.height);
    }

    function size() {
      const rect = view!.getBoundingClientRect();
      if (!rect.width) return;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      // Compare the private mask too: `view` may already be sized (remount, HMR) while the mask is still 300x150.
      if (
        w === view!.width &&
        h === view!.height &&
        w === mask.width &&
        h === mask.height
      ) {
        return;
      }
      view!.width = w;
      view!.height = h;
      mask.width = w;
      mask.height = h;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      mctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      prescale();
    }

    /** One soft dab into the mask. */
    function dab(x: number, y: number) {
      const g = mctx!.createRadialGradient(x, y, 0, x, y, BRUSH);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(0.5, "rgba(0,0,0,0.85)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      mctx!.fillStyle = g;
      mctx!.fillRect(x - BRUSH, y - BRUSH, BRUSH * 2, BRUSH * 2);
    }

    /** Dabs along the whole segment since the last point, so fast moves stroke instead of dotting. */
    function stroke(x: number, y: number) {
      const from = last ?? { x, y };
      const dx = x - from.x;
      const dy = y - from.y;
      const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / (BRUSH / 3)));
      for (let i = 1; i <= steps; i++) {
        dab(from.x + (dx * i) / steps, from.y + (dy * i) / steps);
      }
      last = { x, y };
    }

    function paint() {
      const rect = view!.getBoundingClientRect();
      ctx!.clearRect(0, 0, rect.width, rect.height);
      // Retry at the point of use: a cached image never fires `load` again.
      if (!scaled) prescale();
      if (!scaled) return;
      ctx!.drawImage(scaled, 0, 0, rect.width, rect.height);
      ctx!.globalCompositeOperation = "destination-in";
      ctx!.drawImage(mask, 0, 0, rect.width, rect.height);
      ctx!.globalCompositeOperation = "source-over";
    }

    function loop() {
      raf = 0;
      const rect = view!.getBoundingClientRect();
      mctx!.globalCompositeOperation = "destination-out";
      mctx!.fillStyle = `rgba(0,0,0,${HEAL})`;
      mctx!.fillRect(0, 0, rect.width, rect.height);
      mctx!.globalCompositeOperation = "source-over";
      paint();

      if (++idle < IDLE_FRAMES) {
        raf = requestAnimationFrame(loop);
        return;
      }
      // 8-bit alpha stalls around 9/255 instead of reaching zero, so finish with a hard clear.
      mctx!.clearRect(0, 0, rect.width, rect.height);
      paint();
    }

    function wake() {
      idle = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    }

    const move = (e: PointerEvent) => {
      const rect = view!.getBoundingClientRect();
      size();
      stroke(e.clientX - rect.left, e.clientY - rect.top);
      wake();
    };
    // Forget the last point on exit, or the next entry draws a line from where it left.
    const leave = () => {
      last = null;
    };

    size();
    const img = art.current;
    img?.addEventListener("load", prescale);
    const ro = new ResizeObserver(() => {
      size();
      paint();
    });
    ro.observe(view);
    view.addEventListener("pointermove", move, { passive: true });
    view.addEventListener("pointerleave", leave, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      img?.removeEventListener("load", prescale);
      view.removeEventListener("pointermove", move);
      view.removeEventListener("pointerleave", leave);
    };
  }, [src]);

  return (
    <>
      {/* Source pixels for the canvas, via next/image for an optimised variant. */}
      <Image
        ref={art}
        className="brush-source"
        src={src}
        alt=""
        aria-hidden="true"
        width={384}
        height={384}
        // Eager: a 1px invisible image never satisfies lazy loading.
        loading="eager"
      />
      <canvas ref={canvas} className="brush-canvas" aria-hidden="true" />
    </>
  );
}
