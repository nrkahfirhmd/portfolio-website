import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CursorDot } from "../../../cursor-dot";
import { MagneticGrid } from "../../../magnetic-grid";
import { BackArrow } from "../../parts";
import { PROJECTS, STORY_REPOS } from "../../projects";
import { ArticleHeader, storyComponents } from "../../story-components";
import { StoryNav } from "../../../story/story-nav";
import "../../../home.css";
import "../../software.css";
import "../../../story/story.css";

/** Every project gets a page, since every tile on /software links here. The
 * header carries the details; the long-form story only where one exists. */
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.repo }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/software/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.repo === slug);
  if (!project) return {};
  return { title: `${project.name} — Kv`, description: project.body };
}

export default async function StoryPage({
  params,
}: PageProps<"/software/work/[slug]">) {
  const { slug } = await params;
  if (!PROJECTS.some((p) => p.repo === slug)) notFound();

  const Story = STORY_REPOS.has(slug)
    ? (await import(`@/content/software/${slug}.mdx`)).default
    : null;

  return (
    <main className="sw">
      <CursorDot />
      <MagneticGrid />

      <header className="sw-bar">
        <Link href="/software" className="sw-home">
          kv<span aria-hidden="true">/</span>software
        </Link>
      </header>

      <ArticleHeader slug={slug} />

      {Story ? (
        <div className="story-grid">
          <StoryNav />
          <article className="prose">
            <Story components={storyComponents} />
          </article>
        </div>
      ) : (
        <p className="story-soon">The full write-up is on its way.</p>
      )}

      <Link className="back story-back" href="/software#work">
        <BackArrow />
        Back to the work
      </Link>
    </main>
  );
}
