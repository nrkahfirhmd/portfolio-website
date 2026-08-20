import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { projectBySlug } from "./app/projects";

/**
 * Globally available inside every .mdx story, so a story file never imports
 * anything to get its own header or a pull quote.
 *
 * Prose elements (p, h2, blockquote, pre…) are deliberately NOT mapped here —
 * they are styled once by `.prose` in globals.css, which keeps the article
 * typography in the same place as the rest of the design system.
 */
const components = {
  ArticleHeader,
  Aside,
  Kicker,
  Points,
  Point,
  Figure,
  Gallery,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}

function ArticleHeader({ slug }: { slug: string }) {
  const project = projectBySlug(slug);

  return (
    <header className="not-prose mb-stack-lg">
      <Link
        href="/#work"
        className="text-caption font-medium tracking-wider uppercase text-ink-muted hover:text-accent transition-colors duration-150"
      >
        ← Selected work
      </Link>

      <h1 className="mt-stack-sm text-[clamp(2.25rem,6vw,var(--primitive-fontSize-5xl))] leading-[1.05] font-bold tracking-tight">
        {project.name}
      </h1>

      <p className="mt-stack-sm text-tagline text-ink-muted">{project.deck}</p>

      <dl className="mt-stack grid grid-cols-2 sm:grid-cols-3 gap-stack-xs text-label">
        <Meta term="Role" value={project.role} />
        <Meta term="When" value={project.period} />
        <Meta term="Stack" value={project.tags.join(" · ")} />
      </dl>

      {project.live ? (
        <a
          href={project.live}
          data-cursor="See the project"
          data-cursor-icon="arrow"
          className="mt-stack inline-flex items-center gap-2 rounded-full border border-accent px-4 py-2 text-label font-medium text-accent hover:bg-accent-soft hover:text-accent-active transition-colors duration-150"
        >
          See the project
          <span aria-hidden>↗</span>
        </a>
      ) : null}

      <hr className="mt-stack-lg border-border" />
    </header>
  );
}

function Meta({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-caption font-medium tracking-wider uppercase text-ink-muted">
        {term}
      </dt>
      <dd className="mt-1 text-ink">{value}</dd>
    </div>
  );
}

/** A sunken sidenote. Borderless, same as the stack panel: nothing to click. */
function Aside({ children }: { children: React.ReactNode }) {
  return (
    <aside className="panel not-prose my-stack p-gutter text-label text-ink-muted">
      {children}
    </aside>
  );
}

/** Section label sitting above a heading. Optional — a `## heading` alone is
 *  the default; reach for this when a section needs naming as well as titling. */
function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="kicker not-prose mt-stack-lg text-caption font-medium tracking-wider uppercase text-ink-muted">
      {children}
    </p>
  );
}

/**
 * A row of short parallel points — the workhorse block of a case study.
 * Column count comes from `auto-fit`, not a prop: two children make two
 * columns, four make four, and the same markup collapses on a narrow screen.
 */
function Points({ children }: { children: React.ReactNode }) {
  return <div className="points not-prose my-stack">{children}</div>;
}

function Point({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-tagline font-medium tracking-tight">{title}</h4>
      <div className="mt-stack-xs text-label text-ink-muted">{children}</div>
    </div>
  );
}

/**
 * A media block. With no `src` it renders the empty sunken frame, which is the
 * useful state while a story is still being written.
 */
function Figure({
  src,
  alt = "",
  caption,
  ratio = "16 / 9",
}: {
  src?: string;
  alt?: string;
  caption?: string;
  ratio?: string;
}) {
  return (
    <figure className="not-prose my-stack">
      <div
        className="panel relative overflow-hidden"
        style={{ aspectRatio: ratio }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 64rem) 44rem, 100vw"
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-caption tracking-wider uppercase text-ink-faint">
            Figure
          </span>
        )}
      </div>

      {caption ? (
        <figcaption className="mt-stack-xs text-caption text-ink-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Two or more figures side by side. Same auto-fit rule as <Points>. */
function Gallery({ children }: { children: React.ReactNode }) {
  return <div className="gallery not-prose my-stack">{children}</div>;
}
