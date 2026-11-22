import type { Metadata } from "next";
import { PERSON, PROJECTS, STAGES, STORY_REPOS, STORY_SLUGS, STUDIO } from "@/content/site";
import { shelve } from "../games/games";
import { PageTransition } from "../page-transition";
import { SOCIALS } from "../socials";
import { WorkGrid, type UnifiedWorkItem, type WorkCategory } from "./work-grid";
import "../home.css";
import "../software/project-lists.css";
import "./work.css";

export const metadata: Metadata = {
  title: `${PERSON.shortName} | Work`,
  description:
    "Selected software engineering and game development work by Kahfi Rahmada.",
};

function classifySoftware(
  slug: string,
  platform?: "web" | "mobile",
  stack: string[] = [],
): WorkCategory[] {
  const cats = new Set<WorkCategory>();
  const stackLower = stack.map((s) => s.toLowerCase());

  if (platform === "mobile" || slug === "agriclime") cats.add("mobile");
  if (platform === "web" || slug === "dekorin") cats.add("web");
  if (
    stackLower.some((s) =>
      ["gemini", "langchain", "tensorflow", "keras", "lightgbm", "apple foundation models"].includes(s),
    ) ||
    slug === "sobat-warung"
  ) {
    cats.add("ai-data");
  }
  if (slug === "coretax-scraper" || slug === "mpi-k8s-performance" || slug === "bitd-dashboard") {
    cats.add("systems");
  }
  if (cats.size === 0) cats.add("web");
  return Array.from(cats);
}

function buildUnifiedWork(): UnifiedWorkItem[] {
  const softwareItems: UnifiedWorkItem[] = PROJECTS.map((p) => ({
    id: `sw-${p.slug}`,
    slug: p.slug,
    name: p.name,
    when: p.period,
    shape: p.platform === "mobile" ? "tall" : p.platform === "web" ? "wide" : "square",
    backdrop: p.cover,
    screen: p.screen,
    logo: p.logo ?? p.cover,
    categories: classifySoftware(p.slug, p.platform, p.stack),
    href: STORY_REPOS.has(p.slug) ? `/software/work/${p.slug}` : (p.live ?? "/software"),
    external: !STORY_REPOS.has(p.slug) && Boolean(p.live),
  }));

  const gameItems: UnifiedWorkItem[] = shelve(STAGES).map((s) => {
    const devlog = STORY_SLUGS.has(s.slug);
    return {
      id: `gd-${s.id}`,
      slug: s.slug,
      name: s.locked ? "Coming soon" : s.name,
      when: s.year ?? s.status,
      shape: s.wide ? "wide" : "square",
      backdrop: s.bg ?? s.cover,
      screen: s.screen ?? s.video ?? s.cover,
      logo: s.logo ?? s.cover,
      categories: ["games"],
      href: devlog ? `/games/stage/${s.slug}` : (s.play ?? STUDIO.url),
      external: !devlog,
      play: s.play,
      locked: s.locked,
    };
  });

  return [...softwareItems, ...gameItems];
}

export default function WorkPage() {
  const items = buildUnifiedWork();

  return (
    <PageTransition>
      <WorkGrid
        name={PERSON.name}
        roleSubtitle="Software Engineer"
        openToWork={PERSON.openToWork}
        items={items}
        socials={SOCIALS.map((s) => ({ label: s.label, href: s.href, d: s.d }))}
      />
    </PageTransition>
  );
}
