import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PERSON, PROJECTS, STORY_REPOS } from "@/content/site";
import { BackLink, PageShell } from "../../../page-shell";
import { StoryNav } from "../../../story/story-nav";
import { ArticleHeader } from "../../story-components";
import "../../software.css";
import "../../../story/story.css";

/** Every tile links here, so every project gets a page; the long-form story only where one exists. */
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/software/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: `${PERSON.shortName} — ${project.name}`, description: project.body ?? project.tagline };
}

export default async function StoryPage({ params }: PageProps<"/software/work/[slug]">) {
  const { slug } = await params;
  if (!PROJECTS.some((p) => p.slug === slug)) notFound();

  // MDX picks up its components from mdx-components.tsx.
  const Story = STORY_REPOS.has(slug) ? (await import(`@/content/software/${slug}.mdx`)).default : null;

  return (
    <PageShell section="software" up="/software">
      <ArticleHeader slug={slug} />

      {Story ? (
        <div className="story-grid">
          <StoryNav />
          <article className="prose">
            <Story />
          </article>
        </div>
      ) : (
        <p className="story-soon">The full write-up is on its way.</p>
      )}

      <BackLink href="/software#work" className="page-back">
        Back to the work
      </BackLink>
    </PageShell>
  );
}
