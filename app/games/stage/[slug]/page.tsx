import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PERSON, STAGES, STORY_SLUGS } from "@/content/site";
import { BackLink, PageShell } from "../../../page-shell";
import { StoryPager } from "../../../story/components";
import { StoryNav } from "../../../story/story-nav";
import { shelve } from "../../games";
import { StageHeader } from "../../stage-header";
import "../../../story/story.css";
import "../../games.css";

/** Only stages with a devlog get a page; anything else 404s. */
export function generateStaticParams() {
  return [...STORY_SLUGS].map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/games/stage/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const stage = STAGES.find((s) => s.slug === slug);
  if (!stage) return {};
  return { title: `${PERSON.shortName} — ${stage.name}`, description: stage.blurb };
}

export default async function StagePage({ params }: PageProps<"/games/stage/[slug]">) {
  const { slug } = await params;
  if (!STORY_SLUGS.has(slug)) notFound();

  const playableStories = shelve(STAGES).filter((s) => STORY_SLUGS.has(s.slug));
  const index = playableStories.findIndex((s) => s.slug === slug);
  const prevStage = index > 0 ? playableStories[index - 1] : undefined;
  const nextStage = index >= 0 && index < playableStories.length - 1 ? playableStories[index + 1] : undefined;

  // MDX picks up its components from mdx-components.tsx.
  const { default: Story } = await import(`@/content/games/${slug}.mdx`);

  return (
    <PageShell section="games" up="/games">
      <StageHeader slug={slug} />

      <div className="story-grid">
        <StoryNav />
        <article className="prose">
          <Story />
        </article>
      </div>

      <footer className="story-footer">
        <StoryPager
          prev={
            prevStage
              ? { href: `/games/stage/${prevStage.slug}`, name: prevStage.name, desc: prevStage.genre ?? prevStage.award }
              : undefined
          }
          next={
            nextStage
              ? { href: `/games/stage/${nextStage.slug}`, name: nextStage.name, desc: nextStage.genre ?? nextStage.award }
              : undefined
          }
        />
        <BackLink href="/games#library" className="story-footer-back">
          Back to all games
        </BackLink>
      </footer>
    </PageShell>
  );
}
