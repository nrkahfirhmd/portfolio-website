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

/** Only repos with a story get a page; anything else 404s. */
export function generateStaticParams() {
  return [...STORY_REPOS].map((slug) => ({ slug }));
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
  if (!STORY_REPOS.has(slug)) notFound();

  const { default: Story } = await import(`@/content/software/${slug}.mdx`);

  return (
    <main className="sw">
      <CursorDot />
      <MagneticGrid />

      <header className="sw-bar">
        <Link href="/software" className="sw-home">
          kv<span aria-hidden="true">/</span>software
        </Link>
        <nav aria-label="Sections" className="sw-nav">
          <Link href="/software#log">Log</Link>
          <Link href="/software#contact">Contact</Link>
        </nav>
      </header>

      <ArticleHeader slug={slug} />

      <div className="story-grid">
        <StoryNav />
        <article className="prose">
          <Story components={storyComponents} />
        </article>
      </div>

      <Link className="back story-back" href="/software#log">
        <BackArrow />
        Back to the log
      </Link>
    </main>
  );
}
