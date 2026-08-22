"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/** Dab radius in CSS px. */
const BRUSH = 22;
/** Fraction of mask alpha erased per frame — the stroke heals behind you.
 * `destination-out` is multiplicative, not subtractive, so this is a decay
 * rate: alpha *= (1 - HEAL) each frame. */
const HEAL = 0.05;
/** Frames of pure healing, with no new dabs, before the loop stops and hard
 * clears. Measured: at HEAL the mask is down to ~4% opacity by frame 60. */
const IDLE_FRAMES = 90;

/**
 * Brush-to-reveal on the portrait: dragging over the photo paints away the
 * top layer to show the image underneath, then it heals closed again.
 *
 * Two canvases rather than one, because "show image A only where brushed" is
 * a masking problem and a single canvas can't both accumulate soft brush
 * strokes and hold the artwork:
 * - an offscreen mask canvas accumulates the strokes as soft radial dabs,
 *   and is the only thing that persists between frames;
 * - the visible canvas is rebuilt each frame — draw the art, then
 *   `destination-in` the mask, which keeps art pixels only where the mask
 *   has alpha. Soft mask edges become soft brush edges for free.
 *
 * The reveal heals instead of persisting. That's deliberate: this is a
 * decorative easter egg on a recruiter-facing page, and a permanent smear
 * across the portrait after one careless swipe is a worse default than a
 * reveal that closes itself. It also matches the self-healing cutting mat
 * the rest of the page is built on.
 *
 * The art loads through next/image rather than `new Image('/spiderman.png')`
 * so it gets the framework's optimisation — 5.6MB raw becomes ~96KB — using
 * the public API rather than a hardcoded /_next/image URL.
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

    /** The art pre-scaled to the canvas's device size. Downscaling a 2048px
     * source on every frame is real work; doing it once per resize is not. */
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
      // Every canvas this sizes has to be in the comparison, not just the
      // visible one. `view` is a shared DOM element that something else may
      // already have sized correctly (a remount, HMR, React's dev double
      // effect); checking it alone let this early-return while the private
      // mask was still at its 300x150 default, which paints the mask
      // stretched and misaligned over the photo.
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

    /** Dabs along the whole segment since the last point. A pointermove can
     * jump tens of px between events, and stamping only at the endpoints
     * leaves a dotted line instead of a stroke. */
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
      // Retry here rather than trusting the `load` event to have fired at the
      // right moment: if the image was already cached the event never fires
      // again, and if it lands mid-resize the prescale can be thrown away.
      // Checking at the point of use makes the ordering irrelevant.
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
      // Heal: scale the whole mask's alpha down a little every frame.
      mctx!.globalCompositeOperation = "destination-out";
      mctx!.fillStyle = `rgba(0,0,0,${HEAL})`;
      mctx!.fillRect(0, 0, rect.width, rect.height);
      mctx!.globalCompositeOperation = "source-over";
      paint();

      if (++idle < IDLE_FRAMES) {
        raf = requestAnimationFrame(loop);
        return;
      }
      // Multiplicative decay never actually reaches zero, and at 8 bits it
      // doesn't even get close: once alpha * (1 - HEAL) rounds back to the
      // same integer the fade stalls outright (measured: it sticks at ~9/255
      // and stays there forever). Left alone that's a permanent ghost of the
      // reveal. The fade is imperceptible well before this point, so finish
      // the job honestly with a hard clear.
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
    // Dropping the last point on exit stops the next entry from drawing a
    // straight line across the photo from wherever the pointer left.
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
      {/* Source pixels only — never shown directly, read into the canvas.
          Kept in the DOM (rather than `new Image()`) so next/image serves an
          optimised, correctly-sized variant. */}
      <Image
        ref={art}
        className="brush-source"
        src={src}
        alt=""
        aria-hidden="true"
        width={384}
        height={384}
        // Eager, because this is a 1px transparent element: lazy loading is
        // driven by viewport heuristics that a zero-area, invisible image
        // cannot be relied on to satisfy, and it was in fact never loading.
        // The optimised variant is ~96KB, which is the price of the reveal
        // working the first time someone tries it.
        loading="eager"
      />
      <canvas ref={canvas} className="brush-canvas" aria-hidden="true" />
    </>
  );
}
