import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CursorDot } from "../../../cursor-dot";
import { MagneticGrid } from "../../../magnetic-grid";
import { BackArrow } from "../../../software/parts";
import { StoryNav } from "../../../story/story-nav";
import { STAGES, STORY_SLUGS } from "../../games";
import { StageHeader } from "../../stage-header";
import { baseComponents } from "../../../story/components";
import "../../../home.css";
import "../../../story/story.css";
import "../../games.css";

/** Only stages with a devlog get a page; anything else 404s. */
export function generateStaticParams() {
  return [...STORY_SLUGS].map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/games/stage/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const stage = STAGES.find((s) => s.slug === slug);
  if (!stage) return {};
  return { title: `${stage.name} devlog — Kv`, description: stage.blurb };
}

export default async function StagePage({
  params,
}: PageProps<"/games/stage/[slug]">) {
  const { slug } = await params;
  if (!STORY_SLUGS.has(slug)) notFound();

  const { default: Story } = await import(`@/content/games/${slug}.mdx`);

  return (
    <main className="gd gd-story">
      <CursorDot />
      <MagneticGrid />

      <header className="gd-bar">
        <Link href="/games" className="gd-home">
          kv<span aria-hidden="true">/</span>games
        </Link>
        <nav aria-label="Sections" className="gd-nav">
          <Link href="/games#levels">Levels</Link>
          <Link href="/games#contact">Contact</Link>
        </nav>
      </header>

      <StageHeader slug={slug} />

      <div className="story-grid">
        <StoryNav />
        <article className="prose">
          <Story components={{ ...baseComponents, StageHeader }} />
        </article>
      </div>

      <Link className="back story-back" href="/games#levels">
        <BackArrow />
        Back to level select
      </Link>
    </main>
  );
}
