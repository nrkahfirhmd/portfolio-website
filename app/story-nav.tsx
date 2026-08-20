"use client";

import { useEffect, useState } from "react";

type Item = { id: string; text: string };

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * The section rail beside a story. Built from the article's own `## headings`
 * after mount, so an MDX file never declares its table of contents — it just
 * writes headings.
 */
export function StoryNav() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>("article.prose > h2"),
    );

    if (!headings.length) return;

    // Assigned synchronously so an anchor works even before the first frame.
    for (const heading of headings) {
      if (!heading.id) heading.id = slugify(heading.textContent ?? "");
    }

    // Deterministic rather than "whichever entry an observer handed back": the
    // active section is the last heading whose top has passed the navbar.
    const sync = () => {
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= 140) current = heading.id;
      }

      // At the bottom of the page the final heading may still sit below the
      // line and would never light up. If the reader cannot scroll any
      // further, the last section is the one they are looking at.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = headings[headings.length - 1].id;
      setItems(
        headings.map((heading) => ({
          id: heading.id,
          text: heading.textContent ?? "",
        })),
      );
      setActive(current);
    };

    // Reading a handful of rects per scroll event is cheaper than the rAF
    // bookkeeping that would throttle it — and it cannot stall if the browser
    // stops handing out frames.
    window.addEventListener("scroll", sync, { passive: true });

    // The first pass reads layout, so it waits for a frame rather than running
    // in the effect body.
    const frame = requestAnimationFrame(sync);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", sync);
    };
  }, []);

  if (!items.length) return null;

  return (
    <nav
      aria-label="Sections"
      className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto"
    >
      <ul className="space-y-2 text-label">
        {items.map(({ id, text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              className={
                active === id
                  ? "text-ink font-medium"
                  : "text-ink-muted hover:text-accent transition-colors duration-150"
              }
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
