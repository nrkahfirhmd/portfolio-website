/** Scene lengths in seconds of film. Scroll plays the film: PACE screens per second. */
export const PACE = 0.52;
/** One screen of scroll: how long a scene that scrolls in, rather than opening over the last one, takes. */
export const SLIDE = 1 / PACE;

interface Entry {
  /** Seconds it overlaps the previous scene: SLIDE to scroll in after it, less to sit behind it. */
  enter: number;
  /** Seconds before its own animations start, so they don't play off screen. */
  delay: number;
  /** Its animations, start to finish, with time to read. */
  content: number;
}

const ENTRIES = {
  hello: { enter: 0, delay: 0, content: 5.2 },
  small: { enter: 0.75, delay: 0, content: 11 },
  prabu: { enter: 0, delay: 0, content: 10.4 },
  omawe: { enter: SLIDE, delay: 0.9, content: 10.5 },
  bodyCount: { enter: 0.6, delay: 0.5, content: 13 },
  yourSpace: { enter: 0.7, delay: 0.5, content: 11 },
  whitejack: { enter: 0.6, delay: 0.4, content: 11.5 },
  coretax: { enter: 0.6, delay: 0.5, content: 5.4 },
  map: { enter: 0.7, delay: 0.5, content: 8.2 },
  next: { enter: 0.7, delay: 0.5, content: 6.1 },
  notes: { enter: 0.6, delay: 0.1, content: 5.2 },
} satisfies Record<string, Entry>;

export type SceneId = keyof typeof ENTRIES;

export interface Slot extends Entry {
  start: number;
  length: number;
  /** Seconds it takes to scroll away; 0 when the next scene is already behind it. */
  exit: number;
}

export function schedule<K extends string>(entries: Record<K, Entry>) {
  const ids = Object.keys(entries) as K[];
  const scenes = {} as Record<K, Slot>;
  let start = 0;
  ids.forEach((id, i) => {
    const entry = entries[id];
    const overlap = i + 1 < ids.length ? entries[ids[i + 1]].enter : 0;
    const length = entry.delay + entry.content + (overlap === SLIDE ? SLIDE : 0);
    scenes[id] = { ...entry, start, length, exit: overlap === SLIDE ? SLIDE : 0 };
    start += length - overlap;
  });
  return { scenes, total: start };
}

export const { scenes: SCENES, total: TOTAL } = schedule<SceneId>(ENTRIES);
