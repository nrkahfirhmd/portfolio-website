"use client";

import { useEffect, useState } from "react";

type Item = { id: string; text: string };

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * The section rail beside a story, ported from the AI portfolio. Built from
 * the article's own `## headings` after mount, so an MDX file never declares
 * its table of contents — it just writes headings.
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

    // The active section is the last heading whose top has passed the line.
    // At the very bottom the final heading may never cross it, so it wins
    // outright once the reader can't scroll further.
    const sync = () => {
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= 140) current = heading.id;
      }
      const atBottom =
        innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) current = headings[headings.length - 1].id;
      setItems(headings.map((h) => ({ id: h.id, text: h.textContent ?? "" })));
      setActive(current);
    };

    addEventListener("scroll", sync, { passive: true });
    // The first pass reads layout, so it waits for a frame.
    const frame = requestAnimationFrame(sync);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", sync);
    };
  }, []);

  if (!items.length) return <div aria-hidden="true" />;

  return (
    <nav aria-label="On this page" className="story-nav">
      <ul>
        {items.map(({ id, text }) => (
          <li key={id}>
            <a href={`#${id}`} aria-current={active === id ? "true" : undefined}>
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
