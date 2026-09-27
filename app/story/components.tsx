import Image from "next/image";
import { Children, type ComponentPropsWithoutRef, type ReactNode } from "react";

// The story building blocks every section shares. Two kinds of entries:
//  - lowercase keys override the HTML that markdown compiles to (`##` -> h2, …)
//  - Capitalized keys are the bare tags a story can use with no import
//    (<Figure />, <Points><Point/></Points>, <Stats />, <Callout>).
// Each section adds its own header component on top (see
// app/software/story-components.tsx, app/games/stage-header.tsx); the root
// mdx-components.tsx merges them all. Styles live in story.css.
//
// Same set as the sibling portfolios minus <Kicker>: it's an eyebrow label
// above a heading, which this site doesn't do. A story pasted over from a
// sibling that uses one will say so in the preview's error strip.

/** An image, or a captioned placeholder — `src` is optional so a story can
 * leave a slot for a screenshot that doesn't exist yet. */
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
    <figure className="st-figure">
      {src ? (
        <Image src={src} alt={alt} width={1600} height={900} />
      ) : (
        <div className="st-figure-empty">{caption ?? "figure"}</div>
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/** Column grid; column count follows the number of <Point> children, capped
 * at 4. Collapses to one column on phones. */
export function Points({ children }: { children: ReactNode }) {
  const cols = Math.min(Math.max(Children.count(children), 1), 4);
  return (
    <div className="st-points" style={{ "--cols": cols } as React.CSSProperties}>
      {children}
    </div>
  );
}

export function Point({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="st-point">
      {title ? <p className="st-point-title">{title}</p> : null}
      {children}
    </div>
  );
}

/** Label/value grid with hairline dividers. Only for numbers you can stand
 * behind — no invented metrics. */
export function Stats({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl
      className="st-stats"
      style={{ "--cols": Math.min(Math.max(items.length, 1), 4) } as React.CSSProperties}
    >
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return <aside className="st-callout">{children}</aside>;
}

// --- markdown element overrides ---------------------------------------------

function Heading2({ children, ...props }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 {...props} className="st-h2">
      {children}
    </h2>
  );
}

function Heading3(props: ComponentPropsWithoutRef<"h3">) {
  return <h3 {...props} className="st-h3" />;
}

function Blockquote({ children }: ComponentPropsWithoutRef<"blockquote">) {
  return <blockquote className="st-quote">{children}</blockquote>;
}

function Anchor({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
      className="st-link"
    />
  );
}

function InlineCode(props: ComponentPropsWithoutRef<"code">) {
  return <code {...props} className="st-code" />;
}

export const baseComponents = {
  h2: Heading2,
  h3: Heading3,
  blockquote: Blockquote,
  a: Anchor,
  code: InlineCode,
  Figure,
  Points,
  Point,
  Stats,
  Callout,
};
