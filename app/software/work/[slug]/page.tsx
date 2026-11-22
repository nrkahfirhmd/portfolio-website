import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PERSON, PROJECTS, STORY_REPOS } from "@/content/site";
import { BackLink, PageShell } from "../../../page-shell";
import { StoryPager } from "../../../story/components";
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
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const prevProject = index > 0 ? PROJECTS[index - 1] : undefined;
  const nextProject = index < PROJECTS.length - 1 ? PROJECTS[index + 1] : undefined;

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
        <section className="story-soon" aria-labelledby="story-soon-heading">
          <h2 id="story-soon-heading">Full write-up in progress</h2>
          <p>The project overview and links above are live while the full engineering write-up is being prepared.</p>
        </section>
      )}

      <footer className="story-footer">
        <StoryPager
          prev={
            prevProject
              ? { href: `/software/work/${prevProject.slug}`, name: prevProject.name, desc: prevProject.tagline }
              : undefined
          }
          next={
            nextProject
              ? { href: `/software/work/${nextProject.slug}`, name: nextProject.name, desc: nextProject.tagline }
              : undefined
          }
        />
        <BackLink href="/software#work" className="story-footer-back">
          Back to all software
        </BackLink>
      </footer>
    </PageShell>
  );
}
