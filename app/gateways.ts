/**
 * The two destination portfolios. Single source of truth for both the landing
 * page and the placeholder destination routes, so a slug can never drift.
 *
 * When a portfolio ships: set `live: true` and give it its own static route
 * at app/<slug>/. The "soon" chip and the placeholder page both key off `live`.
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
    slug: "software",
    name: "Software Engineering",
    desc: "AI systems, infrastructure, and software built to stay up.",
    blurb:
      "Applied models, agent systems, and infrastructure work — the unglamorous engineering that turns a demo into something people can rely on at 3am.",
    live: true,
  },
  {
    slug: "games",
    name: "Game Development",
    desc: "Designing systems, mechanics, and moments worth playing.",
    blurb:
      "Systems-driven games, the tools built to make them, and physics toys that exist mostly because they were fun to write.",
    live: true,
  },
];
