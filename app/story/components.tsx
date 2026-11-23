import Image from "next/image";
import Link from "next/link";
import { Children, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { VideoPlayer } from "./video-player";

// Story blocks shared by every section: lowercase keys restyle markdown's HTML, Capitalized ones are tags a story can use without importing.

const isVideoSrc = (src: string) => /\.(mp4|webm|mov)(#.*)?$/i.test(src);

/** An image with a caption; renders nothing until it has a `src`, so a story can hold its slot early. */
export function Figure({
  src,
  alt = "",
  caption,
  size,
  wide,
}: {
  src?: string;
  alt?: string;
  caption?: string;
  size?: "phone";
  wide?: boolean;
}) {
  if (!src) return null;
  const phone = size === "phone";
  const cls = [
    "st-figure",
    phone && "st-figure--phone",
    wide && !phone && "st-wide",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <figure className={cls}>
      <Image
        src={src}
        alt={alt}
        width={phone ? 600 : 1600}
        height={phone ? 1300 : 900}
        loading="eager"
        sizes={
          phone
            ? "18rem"
            : wide
              ? "(max-width: 54rem) 100vw, 54rem"
              : "(max-width: 42rem) 100vw, 42rem"
        }
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/** A demo video block with portfolio-native smoked-glass controls; renders nothing until `src` is provided. */
export function Video({
  src,
  poster,
  caption,
  size,
  wide,
}: {
  src?: string;
  poster?: string;
  caption?: string;
  size?: "phone";
  wide?: boolean;
}) {
  if (!src) return null;
  const phone = size === "phone";
  const cls = [
    "st-figure",
    phone && "st-figure--phone",
    wide && !phone && "st-wide",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <figure className={cls}>
      <VideoPlayer
        src={src}
        poster={poster}
        label={caption ?? "Project demo video"}
        variant={phone ? "mobile" : "default"}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

type CompareSide = {
  label: string;
  note?: string;
  src?: string;
  alt?: string;
  text?: string;
};

/** Side-by-side Before/After comparison card (stacks on narrow viewports). */
export function Compare({
  before,
  after,
  caption,
  wide = true,
}: {
  before: CompareSide;
  after: CompareSide;
  caption?: string;
  wide?: boolean;
}) {
  const renderPanel = (side: CompareSide, isAfter: boolean) => (
    <div className={isAfter ? "st-compare-panel st-compare-panel--after" : "st-compare-panel"}>
      <div className="st-compare-head">
        <span>{side.label}</span>
        {side.note ? <span className="st-compare-note">{side.note}</span> : null}
      </div>
      <div className="st-compare-body">
        {side.src ? (
          isVideoSrc(side.src) ? (
            <VideoPlayer src={side.src} label={side.alt ?? side.label} />
          ) : (
            <Image
              src={side.src}
              alt={side.alt ?? side.label}
              width={1200}
              height={750}
              sizes="(max-width: 640px) 100vw, 27rem"
            />
          )
        ) : null}
        {side.text ? <p className="st-compare-text">{side.text}</p> : null}
      </div>
    </div>
  );

  return (
    <figure className={wide ? "st-figure st-wide" : "st-figure"}>
      <div className="st-compare">
        {renderPanel(before, false)}
        {renderPanel(after, true)}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/** One column per <Point> child (max 4); one column on phones. */
export function Points({ children }: { children: ReactNode }) {
  const cols = Math.min(Math.max(Children.count(children), 1), 4);
  return (
    <div className="st-points st-wide" style={{ "--cols": cols } as React.CSSProperties}>
      {children}
    </div>
  );
}

export function Point({
  title,
  accent,
  children,
}: {
  title?: string;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={accent ? "st-point st-point--accent" : "st-point"}>
      {title ? <p className="st-point-title">{title}</p> : null}
      {children}
    </div>
  );
}

/** Two-column key/detail rows to vary rhythm from card grids. */
export function CraftList({ children }: { children: ReactNode }) {
  return <ul className="st-craft">{children}</ul>;
}

export function CraftItem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="st-craft-item">
      <h3 className="st-craft-key">{title}</h3>
      <div className="st-craft-val">{children}</div>
    </li>
  );
}

/** Label/value grid; only for numbers you can stand behind. */
export function Stats({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl
      className="st-stats st-wide"
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
  loop,
}: {
  steps: { title: string; body?: string }[];
  caption?: string;
  loop?: boolean;
}) {
  return (
    <figure className="st-figure st-wide">
      <ol className="st-flow" style={{ "--steps": steps.length } as React.CSSProperties}>
        {steps.map((step) => (
          <li key={step.title}>
            <p className="st-flow-title">{step.title}</p>
            {step.body ? <p className="st-flow-body">{step.body}</p> : null}
          </li>
        ))}
      </ol>
      {loop && (
        <svg className="st-flow-loop" viewBox="0 0 400 28" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 350 2 V 16 H 50 V 4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <path d="M 45 9 L 50 3 L 55 9" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

// --- shared case-study chrome (headers & footer pager) ----------------------

/** Structured 4-cell metadata strip in the case-study hero; skips empty items. */
export function StoryMetaGrid({ items }: { items: { label: string; value?: string }[] }) {
  const filled = items.filter((item): item is { label: string; value: string } => Boolean(item.value));
  if (!filled.length) return null;
  return (
    <dl
      className="story-meta-grid"
      style={{ "--cols": Math.min(filled.length, 4) } as React.CSSProperties}
    >
      {filled.map((item) => (
        <div key={item.label} className="story-meta-cell">
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Full-width hero media stage above the article; supports video recordings and cover/screen images. */
export function HeroMedia({
  src,
  alt,
  kind = "web",
}: {
  src?: string;
  alt: string;
  kind?: "mobile" | "web";
}) {
  if (!src) return null;
  const video = isVideoSrc(src);
  const mobile = kind === "mobile";
  return (
    <figure className={mobile ? "story-hero-stage story-hero-stage--mobile" : "story-hero-stage"}>
      <div className="story-hero-frame">
        {video ? (
          <VideoPlayer
            src={src}
            label={alt}
            variant={mobile ? "mobile" : "default"}
            className="story-hero-player"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={mobile ? 600 : 1600}
            height={mobile ? 1300 : 900}
            sizes={mobile ? "18rem" : "(max-width: 72rem) 100vw, 64rem"}
            loading="eager"
            fetchPriority="high"
          />
        )}
      </div>
    </figure>
  );
}

type PagerItem = {
  href: string;
  name: string;
  desc?: string;
};

/** Continuous discovery footer: links to the previous and next project in the same section. */
export function StoryPager({ prev, next }: { prev?: PagerItem; next?: PagerItem }) {
  if (!prev && !next) return null;
  return (
    <nav className="story-pager" aria-label="More projects">
      {prev ? (
        <Link className="story-pager-card" href={prev.href} transitionTypes={["nav-back"]}>
          <span className="story-pager-dir">← Previous</span>
          <span className="story-pager-name">{prev.name}</span>
          {prev.desc ? <span className="story-pager-desc">{prev.desc}</span> : null}
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {next ? (
        <Link
          className="story-pager-card story-pager-card--next"
          href={next.href}
          transitionTypes={["nav-forward"]}
        >
          <span className="story-pager-dir">Next →</span>
          <span className="story-pager-name">{next.name}</span>
          {next.desc ? <span className="story-pager-desc">{next.desc}</span> : null}
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
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
  Video,
  Compare,
  Points,
  Point,
  CraftList,
  CraftItem,
  Stats,
  Callout,
  Flow,
};
