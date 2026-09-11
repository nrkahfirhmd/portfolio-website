/**
 * The three destination portfolios. Single source of truth for both the landing
 * page and the placeholder destination routes, so a slug can never drift.
 *
 * When a portfolio ships: set `live: true` and point `href` at it. The "soon"
 * chip and the placeholder page both key off `live`.
 */
export type Gateway = {
  slug: string;
  name: string;
  desc: string;
  /** What the visitor gets there, shown on the placeholder page. */
  blurb: string;
  live: boolean;
};

export const GATEWAYS: Gateway[] = [
  {
    slug: "ai",
    name: "AI",
    desc: "Models, agents, and the engineering that makes them useful.",
    blurb:
      "Applied models, agent systems, and the unglamorous plumbing that turns a demo into something people can actually rely on.",
    live: false,
  },
  {
    slug: "games",
    name: "Game Dev",
    desc: "Designing systems, mechanics, and moments worth playing.",
    blurb:
      "Systems-driven games, the tools built to make them, and physics toys that exist mostly because they were fun to write.",
    live: false,
  },
  {
    slug: "systems",
    name: "Systems Engineering",
    desc: "Infrastructure, performance, and systems built to stay up.",
    blurb:
      "Infrastructure, performance work, and the kind of engineering whose success looks like nothing happening at 3am.",
    live: false,
  },
];
