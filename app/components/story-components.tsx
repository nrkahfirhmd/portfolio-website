import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Children } from "react";
import Image from "next/image";
import { getProject } from "@/lib/content";
import { Chip } from "./chip";

// The MDX component map. Two kinds of entries:
//  - lowercase keys override the HTML that markdown compiles to (`##` -> h2, …)
//  - Capitalized keys are the bare tags a story can use with no import
//    (<ArticleHeader />, <Kicker>, <Figure />, <Points><Point/></Points>).
// Both `/work/[slug]` (real render) and `/preview` (browser eval) use this map,
// so the two can never drift.

const statusTone = {
  live: "accent",
  "coming-soon": "ink",
  archive: "accent-soft",
} as const;

/**
 * Story title block. `slug` is looked up in the project registry and **throws**
 * on an unknown value — in the preview that lands as an error message, not a
 * crash. Keeps the header identical to the typed data everywhere it appears.
 */
export function ArticleHeader({ slug }: { slug: string }) {
  const project = getProject(slug);
  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-mono text-heading font-medium text-ink">
          {project.name}
        </h1>
        <Chip tone={statusTone[project.status]}>{project.status}</Chip>
      </div>
      <p className="font-mono text-tagline text-ink-muted">{project.tagline}</p>
      <p className="font-mono text-caption uppercase tracking-wider text-ink-faint">
        {project.period}
      </p>
    </header>
  );
}

/** Eyebrow label above a section — the `~$ command` motif from the rest of the site. */
export function Kicker({ children }: { children: ReactNode }) {
  // Eyebrow above a section heading. No `~$` — that motif is the heading's, and
  // sharing it made the two indistinguishable. A short accent rule + tighter
  // tracking + smaller size mark it as subordinate. `.story-kicker` lets the
  // prose CSS pull it tight to the heading it introduces.
  return (
    <p className="story-kicker flex items-center gap-3 font-mono text-caption font-semibold uppercase tracking-[0.25em] text-accent">
      <span aria-hidden="true" className="h-px w-6 bg-accent" />
      {children}
    </p>
  );
}

/** An image (or a captioned placeholder). `src` optional so a story can leave a slot. */
export function Figure({
  src,
  alt = "",
  caption,
}: {
  src?: string;
  alt?: string;
  caption?: string;
}) {
  return (
    <figure className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-lg border border-border">
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={1600}
            height={900}
            className="h-auto w-full"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-surface-sunken font-mono text-caption text-ink-faint">
            {caption ?? "figure"}
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="font-mono text-caption text-ink-faint">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

// Full class strings so Tailwind's scanner sees them — no dynamic construction.
const gridCols = (n: number) =>
  ({
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
  })[Math.min(Math.max(n, 1), 4)] ?? "sm:grid-cols-3";

/** Notion-style column grid; column count follows the number of <Point> children. */
export function Points({ children }: { children: ReactNode }) {
  return (
    <div className={`grid grid-cols-1 gap-3 ${gridCols(Children.count(children))}`}>
      {children}
    </div>
  );
}

export function Point({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3 font-mono text-label text-ink-muted">
      {title ? (
        <p className="mb-1 font-medium text-ink">
          <span aria-hidden="true" className="mr-2 text-accent">
            —
          </span>
          {title}
        </p>
      ) : null}
      {children}
    </div>
  );
}

/** Stat cards — hairline-separated grid, mono values. */
export function Stats({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <dl
      className={`grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border ${gridCols(items.length)}`}
    >
      {items.map((item) => (
        <div key={item.label} className="bg-surface px-4 py-3">
          <dt className="font-mono text-caption uppercase tracking-wider text-ink-faint">
            {item.label}
          </dt>
          <dd className="mt-1 font-mono text-body font-medium text-ink">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <aside className="rounded-lg border border-border bg-accent-soft px-4 py-3 font-mono text-body text-ink">
      {children}
    </aside>
  );
}

// --- markdown element overrides ---------------------------------------------

function Heading2({ children, ...props }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      {...props}
      className="font-mono text-label font-medium uppercase tracking-wider text-ink"
    >
      <span aria-hidden="true" className="mr-2 text-accent">
        ~$
      </span>
      {children}
    </h2>
  );
}

function Paragraph(props: ComponentPropsWithoutRef<"p">) {
  return <p {...props} className="font-mono text-body leading-relaxed text-ink-muted" />;
}

function Blockquote({ children }: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote className="border-l-2 border-accent pl-4 font-flourish text-tagline text-ink italic">
      {children}
    </blockquote>
  );
}

function Anchor({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
      className="text-accent underline underline-offset-4 transition-colors duration-150 hover:text-accent-hover"
    />
  );
}

function Hr() {
  return <hr className="border-border" />;
}

function List(props: ComponentPropsWithoutRef<"ul">) {
  return <ul {...props} className="flex flex-col gap-2 font-mono text-body text-ink-muted" />;
}

function ListItem({ children, ...props }: ComponentPropsWithoutRef<"li">) {
  return (
    <li {...props} className="pl-4 -indent-4">
      <span aria-hidden="true" className="mr-2 text-accent">
        -
      </span>
      {children}
    </li>
  );
}

function InlineCode(props: ComponentPropsWithoutRef<"code">) {
  return (
    <code
      {...props}
      className="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-label text-ink"
    />
  );
}

export const storyComponents = {
  h2: Heading2,
  p: Paragraph,
  blockquote: Blockquote,
  a: Anchor,
  hr: Hr,
  ul: List,
  li: ListItem,
  code: InlineCode,
  ArticleHeader,
  Kicker,
  Figure,
  Points,
  Point,
  Stats,
  Callout,
};
