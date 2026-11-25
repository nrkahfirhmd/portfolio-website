/**
 * The yellow note that tells the story. It stops wherever the DOM says: every [data-note] is
 * a place to be at data-at (seconds into its scene), a word to land on or a spot to fill.
 */

/** Seconds the note takes to reach a word, and to reach anywhere else. */
const HOP = 0.1;
const GLIDE = 0.34;

interface Pose {
  x: number;
  y: number;
  size: number;
  /** Corner radius, as a share of the size. */
  round: number;
  turn: number;
}

interface Stop extends Pose {
  el: HTMLElement | SVGElement;
  word: boolean;
  /** Moves by itself (the bus), so it is measured every frame. */
  live: boolean;
  /** Drops in from above instead of travelling from the last stop. */
  drop: boolean;
  face: string;
  at: number;
  until: number;
  travel: number;
}

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);
const mix = (a: number, b: number, u: number) => a + (b - a) * u;

/** Where an element is laid out on the stage, whatever its animations are doing to it. */
export function layoutBox(el: HTMLElement, stage: HTMLElement) {
  let x = 0;
  let y = 0;
  for (let node: HTMLElement | null = el; node && node !== stage; node = node.offsetParent as HTMLElement | null) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function pose(el: HTMLElement | SVGElement, stage: HTMLElement, word: boolean, live: boolean): Pose {
  const turn = Number(el.dataset.turn ?? 0);
  const round = Number(el.dataset.round ?? 0.02);
  let box;
  if (live || !(el instanceof HTMLElement)) {
    const rect = el.getBoundingClientRect();
    const origin = stage.getBoundingClientRect();
    box = { x: rect.left - origin.left, y: rect.top - origin.top, w: rect.width, h: rect.height };
  } else box = layoutBox(el, stage);
  const x = box.x + box.w / 2;
  const size = el.dataset.size ? Number(el.dataset.size) * Math.min(stage.clientWidth, stage.clientHeight) : box.w;
  if (!word) return { x, y: box.y + box.h / 2, size, round, turn };
  // Sits on the letters, a third of their size.
  const em = parseFloat(getComputedStyle(el).fontSize);
  return { x, y: box.y + em * 0.08, size: Math.max(14, em * 0.36), round, turn };
}

export function createNarrator(stage: HTMLElement, note: HTMLElement, sceneStart: (id: string) => number) {
  const els = [...stage.querySelectorAll<HTMLElement | SVGElement>("[data-note]")];
  let stops: Stop[] = [];

  const measure = () => {
    let words = 0;
    stops = els
      // One of each wide/tall pair is display: none.
      .filter((el) => el.getClientRects().length > 0)
      .map((el) => {
        const word = el.dataset.note === "word";
        const live = "live" in el.dataset;
        const from = sceneStart(el.closest<HTMLElement>("[data-scene]")!.dataset.scene!);
        const at = from + Number(el.dataset.at);
        const until = el.dataset.until ? from + Number(el.dataset.until) : at + (word ? 0.02 : 0.1);
        const p = pose(el, stage, word, live);
        if (word) p.turn = words++ % 2 ? 9 : -7;
        return {
          ...p,
          el,
          word,
          live,
          drop: "drop" in el.dataset,
          face: el.dataset.face ?? "",
          at,
          until,
          travel: Number(el.dataset.travel ?? (word ? HOP : GLIDE)),
        };
      })
      .sort((a, b) => a.at - b.at);
  };

  const at = (stop: Stop): Pose => (stop.live ? pose(stop.el, stage, stop.word, true) : stop);

  /** The note at `t`, or null while it is away. */
  const find = (t: number): (Pose & { face: string; squash: number; lift: number }) | null => {
    let i = -1;
    while (i + 1 < stops.length && stops[i + 1].at <= t) i++;
    const here = stops[i];
    const next = stops[i + 1];
    const leaves = next ? Math.max(here ? here.until : -Infinity, next.at - next.travel) : Infinity;
    if (here && t <= leaves) {
      if (next?.drop && t > here.until) return null;
      // Lands with a squash that shakes out.
      const since = t - here.at;
      const squash = here.size > 160 || (here.round >= 0.5 && here.size > 60) ? 0 : 0.34 * Math.exp(-since / 0.035) * Math.cos(since * 42);
      return { ...at(here), face: here.face, squash, lift: 0 };
    }
    if (!next) return null;
    const u = clamp((t - leaves) / (next.at - leaves));
    const to = at(next);
    const from: Pose = next.drop || !here ? { ...to, y: -to.size, turn: to.turn - 50 } : at(here);
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    const ease = next.word && next.travel <= 0.2 ? u : smooth(u);
    const reach = next.drop ? 0 : Math.min(stage.clientHeight * 0.2, 10 + distance * (next.word ? 0.3 : 0.16));
    return {
      x: mix(from.x, to.x, ease),
      y: next.drop ? mix(from.y, to.y, u * u) : mix(from.y, to.y, ease) - Math.sin(u * Math.PI) * reach,
      size: mix(from.size, to.size, ease),
      round: mix(from.round, to.round, ease),
      turn: mix(from.turn, to.turn, ease) + Math.sin(u * Math.PI) * (next.word ? 14 : 8),
      face: "keep" in next.el.dataset && here ? here.face : next.face,
      squash: -0.12 * Math.sin(u * Math.PI) * (next.word ? 1 : 0),
      lift: Math.sin(u * Math.PI),
    };
  };

  const show = (t: number) => {
    const now = find(t);
    note.toggleAttribute("data-away", !now);
    if (!now) return null;
    const { x, y, size, round, turn, face, squash, lift } = now;
    note.style.width = note.style.height = `${size.toFixed(2)}px`;
    note.style.transform = `translate(${(x - size / 2).toFixed(2)}px, ${(y - size / 2).toFixed(2)}px) rotate(${turn.toFixed(2)}deg) scale(${(1 + squash).toFixed(3)}, ${(1 - squash).toFixed(3)})`;
    note.style.borderRadius = `${(round * size).toFixed(1)}px`;
    note.style.setProperty("--lift", lift.toFixed(3));
    if (note.dataset.face !== face) note.dataset.face = face;
    return { x, y, size };
  };

  return { measure, show };
}
