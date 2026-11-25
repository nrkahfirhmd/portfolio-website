import type { SceneId } from "./timeline";
import { WALKERS } from "./walkers";

type Render = (t: number) => void;

const clamp = (x: number) => Math.min(1, Math.max(0, x));
/** 0..1 as t crosses a..b, eased at both ends. */
const ramp = (t: number, a: number, b: number) => {
  const x = clamp((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

/** The scooter rides the route; the pin, which the note becomes, is where friends think it is. */
function omawe(el: HTMLElement): Render {
  const ride = (t: number) => 0.05 + 0.92 * ramp(t, 1.7, 9.8);
  const stale = 3.5;
  const maps = [...el.querySelectorAll<SVGSVGElement>(".fm-map-svg")].map((svg) => {
    const route = svg.querySelector<SVGPathElement>("[data-route]")!;
    return {
      route,
      length: route.getTotalLength(),
      done: svg.querySelector<SVGPathElement>("[data-done]")!,
      gap: svg.querySelector<SVGPathElement>("[data-gap]")!,
      scooter: svg.querySelector<SVGGElement>("[data-scooter]")!,
      marker: svg.querySelector<SVGGElement>("[data-marker]")!,
    };
  });
  return (t) => {
    const at = ride(t);
    const seen = t < stale ? at : ride(stale) + (at - ride(stale)) * ramp(t, 8.35, 8.9);
    for (const m of maps) {
      const here = m.route.getPointAtLength(at * m.length);
      const ahead = m.route.getPointAtLength(Math.min(1, at + 0.01) * m.length);
      const there = m.route.getPointAtLength(seen * m.length);
      const lean = Math.max(-14, Math.min(14, (Math.atan2(ahead.y - here.y, ahead.x - here.x) * 180) / Math.PI / 3));
      m.scooter.setAttribute("transform", `translate(${here.x.toFixed(1)} ${here.y.toFixed(1)}) rotate(${lean.toFixed(1)})`);
      m.marker.setAttribute("transform", `translate(${there.x.toFixed(1)} ${there.y.toFixed(1)})`);
      m.marker.toggleAttribute("data-stale", at - seen > 0.02);
      m.done.style.strokeDasharray = `${seen * m.length} ${m.length}`;
      m.gap.style.strokeDasharray = `0 ${seen * m.length} ${Math.max(0, at - seen) * m.length} ${m.length}`;
    }
  };
}

/** Everyone crosses at their own speed, so the sentence is hard to match while you scroll. */
function bodyCount(el: HTMLElement): Render {
  const people = [...el.querySelectorAll<HTMLElement>(".fm-walker")];
  return (t) => {
    people.forEach((p, i) => {
      const { lane, phase, speed, target } = WALKERS[i];
      // Depth: 0 at the far kerb, 1 at the near one.
      const z = target ? 0.06 + t * 0.047 : (phase + (t + 1) * speed * 0.6) % 1.15;
      const y = 30 + 68 * (0.55 * z * z + 0.45 * z);
      const x = lane * (13 + 33 * z);
      const step = Math.abs(Math.sin((t * speed * 8 + i) * Math.PI)) * (0.4 + z);
      p.style.transform = `translate(${x.toFixed(2)}cqw, ${(y - step).toFixed(2)}cqh) scale(${(0.4 + 0.85 * z).toFixed(3)})`;
      p.style.zIndex = String(Math.round(z * 100));
      p.style.opacity = String(clamp(z * 12));
    });
  };
}

/** Hand total, as the cards land and the King is shredded. */
function whitejack(el: HTMLElement): Render {
  const total = el.querySelector<HTMLElement>("[data-total]")!;
  return (t) => {
    const value = t < 4.4 ? 0 : t < 4.7 ? 10 : t < 5 ? 20 : t < 8.75 ? 31 : 21;
    total.textContent = String(value);
    total.dataset.hand = value > 21 ? "bust" : value === 21 ? "won" : "open";
  };
}

/** 10:00 down to under 0:15. */
function coretax(el: HTMLElement): Render {
  const clock = el.querySelector<HTMLElement>("[data-clock]")!;
  return (t) => {
    const s = Math.round(600 - 585 * ramp(t, 3, 4.4));
    clock.textContent = s <= 15 ? "<0:15" : `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };
}

/** Where the note is on its way from Bandung to Bali. */
function map(el: HTMLElement): Render {
  const route = el.querySelector<SVGPathElement>(".mp-route")!;
  const head = el.querySelector<SVGElement>("[data-head]")!;
  const length = route.getTotalLength();
  return (t) => {
    const p = route.getPointAtLength(ramp(t, 2.25, 3.7) * length);
    head.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
  };
}

export const RENDERS: Partial<Record<SceneId, (el: HTMLElement) => Render>> = {
  omawe,
  bodyCount,
  whitejack,
  coretax,
  map,
};
