import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PERSON, PROJECTS, STORY_REPOS } from "@/content/site";
import { PageTransition } from "../../../page-transition";
import { SiteFooter } from "../../../site-footer";
import { WorkWithMeButton } from "../../../work-with-me";
import { SOCIALS } from "../../../socials";
import { StoryPager } from "../../../story/components";
import { StoryNav } from "../../../story/story-nav";
import { ArticleHeader } from "../../story-components";
import "../../../home.css";
import "../../../story/story.css";

const NAV_LINKS = [
  { label: "Work", href: "/work", active: true },
  { label: "About Me", href: "/about", active: false },
  { label: "My Journey", href: "/journey", active: false },
  { label: "Side Quests", href: "/side-quests", active: false },
] as const;

/** Every tile links here, so every project gets a page; the long-form story only where one exists. */
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/software/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${PERSON.shortName} | ${project.name}`,
    description: project.body ?? project.tagline,
  };
}

export default async function StoryPage({ params }: PageProps<"/software/work/[slug]">) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const prevProject = index > 0 ? PROJECTS[index - 1] : undefined;
  const nextProject = index < PROJECTS.length - 1 ? PROJECTS[index + 1] : undefined;

  // MDX picks up its components from mdx-components.tsx.
  const Story = STORY_REPOS.has(slug)
    ? (await import(`@/content/software/${slug}.mdx`)).default
    : null;

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
