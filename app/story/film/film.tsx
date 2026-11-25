"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { createBloom } from "./bloom";
import { createNarrator, layoutBox } from "./narrator";
import { RENDERS } from "./renders";
import { PACE, SCENES, SLIDE, TOTAL, type SceneId } from "./timeline";

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
/** Seconds of film over which the opening portrait turns to colour. */
const BLOOM = [0.75, 1.9] as const;

/** Sends each word of Prabu's "sorted" line to its place in the trays. */
function sortWords(stage: HTMLElement) {
  const trays = stage.querySelector<HTMLElement>(".pr-trays");
  if (!trays) return;
  const box = layoutBox(trays, stage);
  const cols = 3;
  const words = [...stage.querySelectorAll<HTMLElement>(".nr-sorts .nr-i")];
  const rows = Math.ceil(words.length / cols);
  words.forEach((word, i) => {
    const from = layoutBox(word.parentElement!, stage);
    const x = box.x + (box.w / cols) * ((i % cols) + 0.5);
    const y = box.y + box.h - (box.h / rows) * 0.92 * (Math.floor(i / cols) + 0.6);
    word.style.setProperty("--dx", `${(x - from.x - from.w / 2).toFixed(1)}px`);
    word.style.setProperty("--dy", `${(y - from.y - from.h / 2).toFixed(1)}px`);
    word.style.setProperty("--fit", Math.min(0.56, ((box.w / cols) * 0.62) / from.w).toFixed(3));
  });
}

/**
 * Plays the film by scroll, one to one: no smoothing, so it stops when the hand stops.
 * All choreography is paused CSS animations, where 1s is one second of film; this only sets
 * their currentTime (and runs RENDERS for what CSS can't do). Scenes pin, then scroll away.
 * Reduced motion and no-JS get film.css's stacked page of finished scenes instead.
 */
export function Film({ children, notes }: { children: ReactNode; notes: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const motion = matchMedia("(prefers-reduced-motion: no-preference)");
    const overlay = stage.querySelector<HTMLElement>("[data-overlay]")!;
    const note = overlay.querySelector<HTMLElement>("[data-narrator]")!;
    const canvas = stage.querySelector<HTMLCanvasElement>("[data-bloom]")!;
    const scenes = [...stage.querySelectorAll<HTMLElement>("[data-scene]")].map((el) => {
      const id = el.dataset.scene as SceneId;
      return {
        el,
        ...SCENES[id],
        render: RENDERS[id]?.(el),
        moves: [] as Animation[],
        clips: [] as Animation[],
        at: NaN,
      };
    });
    const lens = scenes.find((s) => s.el.dataset.scene === "small")!;
    const narrator = createNarrator(stage, note, (id) => SCENES[id as SceneId].start + SCENES[id as SceneId].delay);
    let overlayClips: Animation[] = [];
    let bloom: ((progress: number) => void) | undefined;
    let raf = 0;

    // Media queries swap keyframes, so the animation objects are re-read after a resize.
    const collect = () => {
      const read = (el: HTMLElement) => el.getAnimations({ subtree: true }).filter((a) => a instanceof CSSAnimation);
      for (const s of scenes) {
        const all = read(s.el);
        const moves = (a: Animation) => (a.effect as KeyframeEffect).target === s.el;
        s.moves = all.filter(moves);
        s.clips = all.filter((a) => !moves(a));
        s.at = NaN;
      }
      overlayClips = read(overlay);
      narrator.measure();
      sortWords(stage);
    };

    const show = (t: number) => {
      for (const s of scenes) {
        const local = t - s.start;
        const at = clamp(local, 0, s.length);
        const last = s.start + s.length >= TOTAL - 1e-6;
        s.el.toggleAttribute("data-off", (local <= 0 && s.start > 0) || (local >= s.length && !last));
        if (at === s.at) continue;
        s.at = at;
        for (const move of s.moves) move.currentTime = at * 1000;
        for (const clip of s.clips) clip.currentTime = (at - s.delay) * 1000;
        s.render?.(at - s.delay);
      }
      for (const clip of overlayClips) clip.currentTime = t * 1000;
      bloom?.((t - BLOOM[0]) / (BLOOM[1] - BLOOM[0]));
      // The header takes its colour from the scene under it.
      const front = scenes.findLast((s) => t >= s.start + (s.enter === SLIDE ? SLIDE * 0.95 : s.enter)) ?? scenes[0];
      stage.dataset.tone = front.el.dataset.tone;
      track.toggleAttribute(
        "data-moving",
        scenes.some((s) => s.exit && t > s.start + s.length - s.exit * 0.94 && t < s.start + s.length - s.exit * 0.08),
      );
      const at = narrator.show(t);
      // The next scene is seen through the note's lens until it fills the screen.
      const through = t - lens.start < lens.enter && at;
      lens.el.style.clipPath = through ? `circle(${at.size / 2}px at ${at.x}px ${at.y}px)` : "";
    };

    const frame = () => {
      raf = 0;
      const { top, bottom } = track.getBoundingClientRect();
      track.toggleAttribute("data-past", bottom < innerHeight - 1);
      // The stage has no height while a navigation is still loading its styles.
      if (stage.clientHeight) show(clamp(-top / (stage.clientHeight * PACE), 0, TOTAL));
    };
    const play = () => {
      if (motion.matches && !raf) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      collect();
      if (motion.matches) {
        bloom ??= createBloom(canvas, canvas.dataset.bloom!);
        stage.dataset.narrated = "";
        frame();
      } else {
        delete stage.dataset.narrated;
        for (const s of scenes) s.render?.(s.length);
      }
    };
    start();
    document.fonts.ready.then(start);

    const resize = new ResizeObserver(start);
    resize.observe(stage);
    addEventListener("scroll", play, { passive: true });
    motion.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      removeEventListener("scroll", play);
      motion.removeEventListener("change", start);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      className="fm-track"
      style={
        {
          "--screens": (TOTAL * PACE).toFixed(3),
        } as CSSProperties
      }
    >
      <div ref={stageRef} className="fm-stage" data-tone="ink">
        {children}
        <div data-overlay="" className="fm-overlay" aria-hidden="true">
          {notes}
        </div>
      </div>
    </div>
  );
}
