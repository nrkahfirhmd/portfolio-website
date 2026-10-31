import Image from "next/image";
import { Children, type ComponentPropsWithoutRef, type ReactNode } from "react";

// Story blocks shared by every section: lowercase keys restyle markdown's HTML, Capitalized ones are tags a story can use without importing.

/** An image with a caption; renders nothing until it has a `src`, so a story can hold its slot early. */
export function Figure({
  src,
  alt = "",
  caption,
}: {
  src?: string;
  alt?: string;
  caption?: string;
}) {
  if (!src) return null;
  return (
    <figure className="st-figure">
      {/* The reading column is at most 42rem (story.css .prose), so no screen needs more than ~2x that. */}
      <Image src={src} alt={alt} width={1600} height={900} sizes="(max-width: 42rem) 100vw, 42rem" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/** One column per <Point> child (max 4); one column on phones. */
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

/** Label/value grid; only for numbers you can stand behind. */
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

/** A left-to-right chain of steps (top-to-bottom on phones): pipelines, system parts, states. */
export function Flow({
  steps,
  caption,
}: {
  steps: { title: string; body?: string }[];
  caption?: string;
}) {
  return (
    <figure className="st-figure">
      <ol className="st-flow" style={{ "--steps": steps.length } as React.CSSProperties}>
        {steps.map((step) => (
          <li key={step.title}>
            <p className="st-flow-title">{step.title}</p>
            {step.body ? <p className="st-flow-body">{step.body}</p> : null}
          </li>
        ))}
      </ol>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
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
  Flow,
};
