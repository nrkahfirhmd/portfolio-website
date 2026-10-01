import { STAGES } from "@/content/site";

// Library data lives in content/site.ts; this file is the shape and lookups.
export { STAGES, STORY_SLUGS, STUDIO } from "@/content/site";

export type Stage = {
  /** What the entry is. Defaults to "game"; anything else gets a chip
   * saying so in the library. */
  kind?: "game" | "art" | "video" | "music";
  /** "1-1", "1-2", … — printed on the node and the stage card. */
  id: string;
  /** URL segment for the stage's devlog, /games/stage/<slug>. */
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
  /** Cover art; for art pieces the piece itself, for video the poster, for
   * music the album art. Remote hosts must be allowed in next.config.ts. */
  cover?: string;
  /** A video file (e.g. in public/), previewed on its tile. */
  video?: string;
  /** An audio file (e.g. in public/music/), played from its tile. */
  audio?: string;
  /** Primary action — a playable build. */
  play?: string;
  /** GitHub repo under PERSON.github. */
  repo?: string;
  locked?: boolean;
};

/** Library order: the newest stage with cover art takes the big slot, then the
 * rest newest-first, and the locked teaser always sits at the end. */
export function shelve(stages: Stage[]) {
  const open = stages.filter((s) => !s.locked).reverse();
  const featured = open.find((s) => s.cover) ?? open[0];
  return [featured, ...open.filter((s) => s !== featured), ...stages.filter((s) => s.locked)].filter(Boolean);
}

/** Throws on an unknown slug — in the MDX preview that lands as an error
 * message rather than a crash. */
export function stageBySlug(slug: string): Stage {
  const found = STAGES.find((s) => s.slug === slug);
  if (!found) throw new Error(`Unknown stage slug: "${slug}"`);
  return found;
}
