import Image from "next/image";
import type { ArticleBlock } from "@/lib/content";

function Paragraph({ text }: { text: string }) {
  return <p className="font-mono text-body leading-relaxed text-ink-muted">{text}</p>;
}

function Heading({ text }: { text: string }) {
  return (
    <h2 className="font-mono text-label font-medium uppercase tracking-wider text-ink">
      <span aria-hidden="true" className="mr-2 text-accent">
        ~$
      </span>
      {text}
    </h2>
  );
}

function Quote({ text }: { text: string }) {
  return (
    <blockquote className="border-l-2 border-accent pl-4 font-flourish italic text-tagline text-ink">
      {text}
    </blockquote>
  );
}

function Callout({ text }: { text: string }) {
  return (
    <aside className="rounded-lg border border-border bg-accent-soft px-4 py-3 font-mono text-body text-ink">
      {text}
    </aside>
  );
}

function Divider() {
  return <hr className="border-border" />;
}

function Stats({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
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

function ImageBlock({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-lg border border-border">
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={900}
          className="h-auto w-full"
        />
      </div>
      {caption ? (
        <figcaption className="font-mono text-caption text-ink-faint">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Columns({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={item}
          className="rounded-lg border border-border bg-surface px-4 py-3 font-mono text-label text-ink-muted"
        >
          <span aria-hidden="true" className="mr-2 text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          {item}
        </div>
      ))}
    </div>
  );
}

export function ArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <article className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return <Paragraph key={index} text={block.text} />;
          case "heading":
            return <Heading key={index} text={block.text} />;
          case "quote":
            return <Quote key={index} text={block.text} />;
          case "callout":
            return <Callout key={index} text={block.text} />;
          case "divider":
            return <Divider key={index} />;
          case "stats":
            return <Stats key={index} items={block.items} />;
          case "columns":
            return <Columns key={index} items={block.items} />;
          case "image":
            return (
              <ImageBlock
                key={index}
                src={block.src}
                alt={block.alt}
                caption={block.caption}
              />
            );
        }
      })}
    </article>
  );
}
