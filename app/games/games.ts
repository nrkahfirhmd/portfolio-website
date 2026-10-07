import { STAGES } from "@/content/site";

/** One library entry on /games. */
export type Stage = {
  /** Defaults to "game"; anything else gets a kind chip on its tile. */
  kind?: "game" | "art" | "video" | "music";
  id: string;
  /** URL segment of its devlog: /games/stage/<slug>. */
  slug: string;
  name: string;
  blurb: string;
  genre?: string;
  engine?: string;
  platforms?: string;
  role?: string;
  /** Jam or event it was made for. */
  jam?: string;
  status: string;
  year?: string;
  /** Front art (the piece, poster, or album art); remote hosts must be allowed in next.config.ts. */
  cover?: string;
  /** Blurred backdrop; falls back to the cover. */
  bg?: string;
  /** Video in public/; plays on a wide tile's screen. */
  video?: string;
  /** Two cells wide, the front shown on a screen. */
  wide?: boolean;
  /** Wide tiles: video or image on the screen instead of the cover. */
  screen?: string;
  /** Square tiles: logo in front instead of the cover. */
  logo?: string;
  /** Audio in public/, played from the tile. */
  audio?: string;
  /** A playable build. */
  play?: string;
  /** GitHub repo under PERSON.github. */
  repo?: string;
  locked?: boolean;
};

/** Library order: newest first, the newest with cover art leading, locked teasers last. */
export function shelve(stages: Stage[]) {
  const open = stages.filter((s) => !s.locked).reverse();
  const featured = open.find((s) => s.cover) ?? open[0];
  return [featured, ...open.filter((s) => s !== featured), ...stages.filter((s) => s.locked)].filter(Boolean);
}

/** Throws on an unknown slug; the MDX preview shows that as an error, not a crash. */
export function stageBySlug(slug: string): Stage {
  const found = STAGES.find((s) => s.slug === slug);
  if (!found) throw new Error(`Unknown stage slug: "${slug}"`);
  return found;
}
