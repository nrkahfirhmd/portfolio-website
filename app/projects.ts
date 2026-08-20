// TODO(kv): placeholder content. One record per project, read by both the bento
// grid on the home page and the <ArticleHeader> at the top of each story, so a
// name or tag is only ever edited here.

import type { SimpleIcon } from "simple-icons";
import {
  siClaude,
  siDocker,
  siFastapi,
  siGo,
  siLanggraph,
  siOpentelemetry,
  siPostgresql,
  siPytorch,
  siPython,
  siRedis,
  siTemporal,
  siTypescript,
} from "simple-icons";

// The gateway is a separate deployment, so this is an absolute URL rather than
// a route in this app.
export const GATEWAY_URL = "https://example.com";

export const CURRENT = {
  role: "iOS Applied AI Engineer",
  company: "Apple Developer Academy",
  companyUrl: "https://developeracademy.apps.binus.ac.id/bali/",
  // TODO(kv): flip when true. Drives the "Open to work" badge in the intro.
  openToWork: true,
};

export type Project = {
  slug: string;
  name: string;
  /** The standfirst under the title on the story page. */
  deck: string;
  role: string;
  period: string;
  tags: string[];
  /** Absolute URL to the running thing, when there is one to point at. */
  live?: string;
  /**
   * false when there's no write-up — just a live thing to point at. The card
   * then links straight to `live` (required in that case) instead of
   * /work/[slug], with "See the project" instead of "Read the story".
   * Omit for the normal case: the card goes to the story.
   */
  hasArticle?: boolean;
  /**
   * Card thumbnail. A path under /public (e.g. "/work/retrieval-engine.png")
   * or a remote URL — a remote host must be added to `images.remotePatterns`
   * in next.config.ts first, or next/image will refuse to load it. Omit for a
   * text-only card, which is still the default look.
   */
  image?: string;
  imageAlt?: string;
  /** Tailwind span classes for this tile's slot in the bento grid. */
  span: string;
  featured?: boolean;
  comingSoon?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "retrieval-engine",
    name: "Retrieval Engine",
    deck: "What it takes to make retrieval-augmented generation stop confidently inventing things: not a better prompt, but a better index.",
    role: "Design and implementation",
    period: "2025",
    tags: ["Python", "pgvector", "FastAPI", "Reranking"],
    live: "https://example.com",
    span: "md:col-span-2 lg:row-span-2",
    featured: true,
  },
  {
    slug: "agent-orchestrator",
    name: "Agent Orchestrator",
    deck: "Agents fail halfway. The interesting engineering is everything that happens after that.",
    role: "Backend and workflow design",
    period: "2025",
    tags: ["TypeScript", "Claude API", "Temporal"],
    span: "md:col-span-2",
  },
  {
    slug: "eval-harness",
    name: "Eval Harness",
    deck: "An LLM judge you have not calibrated is a random number generator with good manners.",
    role: "Evaluation design",
    period: "2024 — 2025",
    tags: ["Python", "LLM-as-judge"],
    span: "",
  },
  {
    slug: "doc-parser",
    name: "Doc Parser",
    deck: "PDFs have no reading order. Recovering one is most of the work, and nobody thanks you for it.",
    role: "Research and prototype",
    period: "In progress",
    tags: ["Python", "Vision"],
    span: "",
    comingSoon: true,
  },
  {
    slug: "inference-gateway",
    name: "Inference Gateway",
    deck: "You cannot optimise a number nobody owns. This is the story of making LLM spend attributable.",
    role: "Design and implementation",
    period: "2024",
    tags: ["Go", "Redis", "OpenTelemetry"],
    span: "md:col-span-2",
    hasArticle: false,
    live: "https://example.com"
  },
];

export function projectBySlug(slug: string): Project {
  const found = PROJECTS.find((project) => project.slug === slug);
  if (!found) throw new Error(`Unknown project slug: ${slug}`);
  return found;
}

// Rendered monochrome in currentColor, never in brand colour — a dozen brand
// palettes would break the ink-and-one-accent rule the whole page runs on.
export const STACK: { name: string; icon: SimpleIcon }[] = [
  { name: "Python", icon: siPython },
  { name: "TypeScript", icon: siTypescript },
  { name: "Go", icon: siGo },
  { name: "PyTorch", icon: siPytorch },
  { name: "Claude API", icon: siClaude },
  { name: "LangGraph", icon: siLanggraph },
  { name: "FastAPI", icon: siFastapi },
  { name: "Postgres", icon: siPostgresql },
  { name: "Redis", icon: siRedis },
  { name: "Temporal", icon: siTemporal },
  { name: "Docker", icon: siDocker },
  { name: "OpenTelemetry", icon: siOpentelemetry },
];

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/nrkahfirhmd" },
  { label: "LinkedIn", href: "https://linkedin.com/in/nrkahfirhmd" },
  { label: "Email", href: "mailto:nurkahfirahmada@gmail.com" },
] as const;
