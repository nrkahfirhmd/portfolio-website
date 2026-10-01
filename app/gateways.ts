/**
 * The two destination portfolios; the entries live in content/site.ts. Shared
 * by the landing page and the placeholder routes, so a slug can never drift.
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

export { GATEWAYS } from "@/content/site";
