import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PERSON, STAGES, STORY_SLUGS } from "@/content/site";
import { PageTransition } from "../../../page-transition";
import { SiteFooter } from "../../../site-footer";
import { WorkWithMeButton } from "../../../work-with-me";
import { SOCIALS } from "../../../socials";
import { StoryPager } from "../../../story/components";
import { StoryNav } from "../../../story/story-nav";
import { shelve } from "../../games";
import { StageHeader } from "../../stage-header";
import "../../../home.css";
import "../../../story/story.css";

const NAV_LINKS = [
  { label: "Work", href: "/work", active: true },
  { label: "About Me", href: "/about", active: false },
  { label: "My Journey", href: "/journey", active: false },
  { label: "Side Quests", href: "/side-quests", active: false },
] as const;

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
  return {
    title: `${PERSON.shortName} | ${stage.name}`,
    description: stage.blurb,
  };
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
    <PageTransition>
      <div className="home-gallery st-page">
        <header className="gh-header">
          <Link
            href="/"
            className="gh-brand"
            transitionTypes={["nav-back"]}
            aria-label={`${PERSON.name}, home`}
          >
            <span className="gh-mark" aria-hidden="true">
              <Image
                src="/kv_avatar.svg"
                alt=""
                width={44}
                height={44}
                className="gh-avatar"
                priority
              />
            </span>
            <span className="gh-identity">
              <span className="gh-name">{PERSON.name.toLowerCase()}</span>
              <span className="gh-role">Software Engineer</span>
            </span>
          </Link>

          <nav className="gh-nav" aria-label="Primary">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                transitionTypes={["nav-back"]}
                className="gh-nav-link"
                data-active={item.active || undefined}
                aria-current={item.active ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <WorkWithMeButton />
        </header>

        <main className="st-main">
          <div className="st-container">
            <Link href="/work" className="st-crumb" transitionTypes={["nav-back"]}>
              <span aria-hidden="true">&larr;</span>
              <span>Back to Work</span>
            </Link>

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
          name={PERSON.name}
          openToWork={PERSON.openToWork}
          socials={SOCIALS.map((s) => ({ label: s.label, href: s.href, d: s.d }))}
        />
      </div>
    </PageTransition>
  );
}
