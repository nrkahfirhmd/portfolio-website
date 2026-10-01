// Entries in the /games library, oldest to newest. Facts come
// from the itch.io pages (Batang Kayu Studio) and the public GitHub repos.
// TODO(kv): fill the gaps marked below — your role on Body Count, what
// CoralScape AR and Green Sapphire actually are, and years where missing.
//
// The last stage can be `locked`: the next thing in development, shown as a
// sealed node rather than a card with nothing in it.

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
  /** GitHub repo under nrkahfirhmd. */
  repo?: string;
  locked?: boolean;
};

export const STUDIO = {
  name: "Batang Kayu Studio",
  url: "https://batangkayu.itch.io",
};

export const STAGES: Stage[] = [
  {
    id: "1-1",
    slug: "coralscape-ar",
    name: "CoralScape AR",
    blurb: "An augmented-reality coral reef built in Unity, with custom shaders doing the underwater look.",
    engine: "Unity",
    platforms: "Mobile AR",
    status: "Cleared",
    year: "2025",
    repo: "coralscape-ar",
  },
  {
    id: "1-2",
    slug: "warnet",
    name: "WarNet",
    blurb:
      "A 2D comedy stealth sim set in an early-2000s Indonesian internet café. Sneak an enormous download to 100% before your session runs out, without the operator catching on.",
    genre: "Stealth / survival",
    engine: "Unity",
    platforms: "Browser, Windows, macOS",
    role: "Game designer",
    jam: "GameSeed",
    status: "In development",
    cover: "https://img.itch.zone/aW1nLzI4MjY5NjExLnBuZw==/original/BZF7%2BY.png",
    play: "https://batangkayu.itch.io/237-warnet-tunggu-aku-buat-game-nanti-pc",
  },
  {
    id: "1-3",
    slug: "body-count",
    name: "Body Count: Shibuya Crossing",
    blurb:
      "A crowd-spotting puzzle on Shibuya's rush-hour crossing. Read the target's hair, shirt, pants, and bag, tap the one person who matches, and hit each wave's score before your catches run out.",
    genre: "Puzzle",
    engine: "Unity",
    platforms: "Browser, macOS, iOS (TestFlight)",
    jam: "Theme: Compact",
    status: "In development",
    year: "2026",
    cover: "https://img.itch.zone/aW1nLzMwMjk0Mzc3LnBuZw==/original/IZKj17.png",
    play: "https://batangkayu.itch.io/body-count-shibuya-crossing",
  },
  {
    id: "1-4",
    slug: "green-sapphire",
    name: "Project Green Sapphire",
    blurb: "A Godot project in active development. Details stay under wraps until there's something to play.",
    engine: "Godot",
    status: "In progress",
    year: "2026",
    repo: "project-green-sapphire",
  },
  {
    id: "1-5",
    slug: "next",
    name: "???",
    blurb: "The next level is still being built. Follow the studio on itch.io to catch it the day it opens.",
    status: "Locked",
    locked: true,
  },
];

/** Library order: the newest stage with cover art takes the big slot, then the
 * rest newest-first, and the locked teaser always sits at the end. */
export function shelve(stages: Stage[]) {
  const open = stages.filter((s) => !s.locked).reverse();
  const featured = open.find((s) => s.cover) ?? open[0];
  return [featured, ...open.filter((s) => s !== featured), ...stages.filter((s) => s.locked)].filter(Boolean);
}

/** Stages with a devlog at `content/games/<slug>.mdx`. */
export const STORY_SLUGS = new Set<string>(["coralscape-ar", "warnet", "body-count", "green-sapphire"]);

/** Throws on an unknown slug — in the MDX preview that lands as an error
 * message rather than a crash. */
export function stageBySlug(slug: string): Stage {
  const found = STAGES.find((s) => s.slug === slug);
  if (!found) throw new Error(`Unknown stage slug: "${slug}"`);
  return found;
}
