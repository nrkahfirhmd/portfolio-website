"use client";

import { useEffect, useRef, useState } from "react";

type Item = { id: string; text: string };

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The section rail beside a story (plus a collapsible jump menu on narrow screens), built from `##` headings. */
export function StoryNav() {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const mobileRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>("article.prose > h2"),
    );
    if (!headings.length) return;

    for (const heading of headings) {
      if (!heading.id) heading.id = slugify(heading.textContent ?? "");
    }

    // Active: the last heading past the line, or the final one at the very bottom.
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
    const frame = requestAnimationFrame(sync);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", sync);
    };
  }, []);

  if (!items.length) return <div aria-hidden="true" />;

  const closeMobile = () => {
    if (mobileRef.current) mobileRef.current.open = false;
  };

  return (
    <>
      <details ref={mobileRef} className="story-mobile-toc">
        <summary>
          <span>On this page ({items.length} sections)</span>
          <span className="story-mobile-toc-icon" aria-hidden="true">
            +
          </span>
        </summary>
        <ul>
          {items.map(({ id, text }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                onClick={closeMobile}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </details>

      <nav aria-label="On this page" className="story-nav">
        <p className="story-nav-label">On this page</p>
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
    </>
  );
}
