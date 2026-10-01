import { PROJECTS } from "@/content/site";

// Project data lives in content/site.ts; this file is the shape and lookups.
export { CURRENT, PROJECTS, STORY_REPOS } from "@/content/site";

// Only `slug` and `name` are required, so a project can go up before its
// details are written; everything else shows once it's filled in.
export type Project = {
  /** URL segment, /software/work/<slug>. Also the React key. */
  slug: string;
  name: string;
  /** GitHub repo name under PERSON.github; adds a Source link. */
  repo?: string;
  /** One line under the name: what it is. */
  tagline?: string;
  /** A short paragraph on the project page. Plain facts, no metrics. */
  body?: string;
  /** Human period, e.g. "Aug 2026" or "Dec 2025 – Feb 2026". */
  period?: string;
  /** Context shown beside the date, e.g. "hackathon". */
  tags?: string[];
  live?: string;
  /** Main languages and frameworks, in the order to show them. */
  stack?: string[];
  /** Your part in it, e.g. "Project Manager, team of 5". */
  role?: string;
  /** Tile image on /software, in public/. Width and height are the file's
   * own, so the masonry keeps its aspect ratio. Without one the tile shows
   * the system diagram, or a plain placeholder. */
  cover?: { src: string; width: number; height: number };
  /** How the pieces connect, drawn as a diagram. Only parts the body (or the
   * story) actually names — no invented components. `x`/`y` are grid cells. */
  system?: {
    nodes: { id: string; label: string; sub?: string; x: number; y: number }[];
    edges: [from: string, to: string][];
  };
};

/** Throws on an unknown repo — in the MDX preview that lands as an error
 * message rather than a crash. */
export function projectBySlug(slug: string): Project {
  const found = PROJECTS.find((p) => p.slug === slug);
  if (!found) throw new Error(`Unknown project slug: "${slug}"`);
  return found;
}
