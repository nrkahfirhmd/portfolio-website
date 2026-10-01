import { PROJECTS } from "@/content/site";

// Project data lives in content/site.ts; this file is the shape and lookups.
export { CURRENT, PROJECTS, STORY_REPOS } from "@/content/site";

export type Project = {
  /** GitHub repo name under PERSON.github. Also the React key. */
  repo: string;
  name: string;
  /** One line under the name: what it is. */
  tagline: string;
  /** A short paragraph on the project page. Plain facts, no metrics. */
  body: string;
  /** Human period, e.g. "Aug 2026" or "Dec 2025 – Feb 2026". */
  period: string;
  /** Context shown beside the date, e.g. "hackathon". */
  tags?: string[];
  live?: string;
  languages: Record<string, number>;
  /** Tile image on /software, in public/. Width and height are the file's
   * own, so the masonry keeps its aspect ratio. Without one the tile shows
   * the system diagram. */
  cover?: { src: string; width: number; height: number };
  /** How the pieces connect, drawn as a diagram. Only parts the body (or the
   * story) actually names — no invented components. `x`/`y` are grid cells. */
  system: {
    nodes: { id: string; label: string; sub?: string; x: number; y: number }[];
    edges: [from: string, to: string][];
  };
};

/** Throws on an unknown repo — in the MDX preview that lands as an error
 * message rather than a crash. */
export function projectByRepo(repo: string): Project {
  const found = PROJECTS.find((p) => p.repo === repo);
  if (!found) throw new Error(`Unknown project repo: "${repo}"`);
  return found;
}
