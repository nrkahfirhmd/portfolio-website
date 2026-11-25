import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PERSON, PROJECTS, STAGES, STORY_REPOS, STORY_SLUGS } from "@/content/site";
import { shelve, stageBySlug } from "@/app/games/games";
import { StageHeader } from "@/app/games/stage-header";
import { PageTransition } from "@/app/page-transition";
import { SiteFooter } from "@/app/site-footer";
import { SiteHeader } from "@/app/site-header";
import { SOCIALS } from "@/app/socials";
import { ArticleHeader } from "@/app/software/story-components";
import { StoryPager } from "@/app/story/components";
import { StoryNav } from "@/app/story/story-nav";
import "@/app/games/games.css";
import "@/app/home.css";
import "@/app/story/story.css";

/** One page per software project (the write-up only where one exists) and per game devlog. */
export function generateStaticParams() {
  return [...PROJECTS.map((p) => p.slug), ...STORY_SLUGS].map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/work/article/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  const stage = STAGES.find((s) => s.slug === slug);
  const entry = project ? { name: project.name, description: project.body ?? project.tagline } : stage ? { name: stage.name, description: stage.blurb } : null;
  if (!entry) return {};
  return {
    title: `${PERSON.shortName} | ${entry.name}`,
    description: entry.description,
    alternates: { canonical: `/work/article/${slug}` },
  };
}

type Neighbour = { href: string; name: string; desc?: string };

export default async function ArticlePage({ params }: PageProps<"/work/article/[slug]">) {
  const { slug } = await params;
  const isProject = PROJECTS.some((p) => p.slug === slug);
  if (!isProject && !STORY_SLUGS.has(slug)) notFound();

  // MDX picks up its components from mdx-components.tsx.
  const Story = isProject
    ? STORY_REPOS.has(slug)
      ? (await import(`@/content/software/${slug}.mdx`)).default
      : null
    : (await import(`@/content/games/${slug}.mdx`)).default;

  let prev: Neighbour | undefined;
  let next: Neighbour | undefined;
  if (isProject) {
    const i = PROJECTS.findIndex((p) => p.slug === slug);
    const toLink = (p: (typeof PROJECTS)[number]): Neighbour => ({ href: `/work/article/${p.slug}`, name: p.name, desc: p.tagline });
    prev = i > 0 ? toLink(PROJECTS[i - 1]) : undefined;
    next = i < PROJECTS.length - 1 ? toLink(PROJECTS[i + 1]) : undefined;
  } else {
    const stories = shelve(STAGES).filter((s) => STORY_SLUGS.has(s.slug));
    const i = stories.findIndex((s) => s.slug === slug);
    const toLink = (s: (typeof stories)[number]): Neighbour => ({ href: `/work/article/${s.slug}`, name: s.name, desc: s.genre ?? s.award });
    prev = i > 0 ? toLink(stories[i - 1]) : undefined;
    next = i >= 0 && i < stories.length - 1 ? toLink(stories[i + 1]) : undefined;
  }

  return (
    <PageTransition>
      <div className="home-gallery st-page">
        <SiteHeader active="/work" />

        <main className="st-main">
          <div className="st-container">
            <Link href="/work" className="st-crumb" transitionTypes={["nav-back"]}>
              <span aria-hidden="true">&larr;</span>
              <span>Back to Work</span>
            </Link>

            {isProject ? <ArticleHeader slug={slug} /> : <StageHeader slug={stageBySlug(slug).slug} />}

            {Story ? (
              <div className="story-grid">
                <StoryNav />
                <article className="prose">
                  <Story />
                </article>
              </div>
            ) : (
              <section className="story-soon" aria-labelledby="story-soon-heading">
                <h2 id="story-soon-heading">Full write-up in progress</h2>
                <p>The project overview and links above are live while the full engineering write-up is being prepared.</p>
              </section>
            )}

            <footer className="story-footer">
              <StoryPager prev={prev} next={next} />
            </footer>

            <div className="st-back-wrap">
              <Link href="/work" className="st-crumb" transitionTypes={["nav-back"]}>
                <span aria-hidden="true">&larr;</span>
                <span>Back to Work</span>
              </Link>
            </div>
          </div>
        </main>

        <SiteFooter
          openToWork={PERSON.openToWork}
          socials={SOCIALS.map((s) => ({ label: s.label, href: s.href, d: s.d }))}
        />
      </div>
    </PageTransition>
  );
}
