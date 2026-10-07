import { PROJECTS } from "@/content/site";

/** One /software project. Only `slug` and `name` are required; the rest shows once filled in. */
export type Project = {
  /** URL segment: /software/work/<slug>. */
  slug: string;
  name: string;
  /** Tile shape: "mobile" is a tall phone screen, "web" a wide browser window; omit for a square logo tile. */
  platform?: "mobile" | "web";
  /** GitHub repo under PERSON.github; adds a Source link. */
  repo?: string;
  tagline?: string;
  body?: string;
  /** e.g. "Aug 2026" or "Dec 2025 – Feb 2026". */
  period?: string;
  tags?: string[];
  live?: string;
  stack?: string[];
  role?: string;
  /** Backdrop image in public/, shown blurred behind the screen or logo. */
  cover?: string;
  /** Mobile/web tiles: video (plays on the device) or image in public/. */
  screen?: string;
  /** Square tiles: logo in front of the backdrop (transparent PNG works best). */
  logo?: string;
};

/** Throws on an unknown slug; the MDX preview shows that as an error, not a crash. */
export function projectBySlug(slug: string): Project {
  const found = PROJECTS.find((p) => p.slug === slug);
  if (!found) throw new Error(`Unknown project slug: "${slug}"`);
  return found;
}
