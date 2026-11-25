"use client";

import Link from "next/link";
import { useState } from "react";
import type { SocialLinkItem } from "../gallery-home";
import { AutoplayToggle } from "../games/cart-media";
import { SharedTitle } from "../page-transition";
import { SiteFooter } from "../site-footer";
import { Masonry } from "../software/masonry";
import { Showcase, type Shape } from "../software/project-lists";
import { SiteHeader } from "@/app/site-header";

export type WorkCategory = "web" | "mobile" | "games" | "ai-data" | "systems";
type FilterKey = "all" | WorkCategory;

export interface UnifiedWorkItem {
  id: string;
  slug: string;
  name: string;
  when?: string;
  shape: Shape;
  backdrop?: string;
  screen?: string;
  logo?: string;
  categories: WorkCategory[];
  href: string;
  external?: boolean;
  play?: string;
  locked?: boolean;
}

interface WorkGridProps {
  openToWork: boolean;
  items: UnifiedWorkItem[];
  socials: SocialLinkItem[];
}

const SIDEBAR_CATEGORIES: { id: FilterKey; label: string }[] = [
  { id: "all", label: "All Works" },
  { id: "web", label: "Web Apps" },
  { id: "mobile", label: "Mobile / iOS" },
  { id: "games", label: "Games" },
  { id: "ai-data", label: "AI & Data" },
  { id: "systems", label: "Systems & Automation" },
];

export function WorkGrid({
  openToWork,
  items,
  socials,
}: WorkGridProps) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered =
    filter === "all" ? items : items.filter((item) => item.categories.includes(filter));

  return (
    <div className="home-gallery wk-page">
      <SiteHeader active="/work" />

      <main className="wk-shell">
        <h1 className="sr-only">Work Archive</h1>

        <aside className="wk-sidebar" aria-label="Project categories">
          <ul className="wk-cat-list" role="tablist" aria-orientation="vertical">
            {SIDEBAR_CATEGORIES.map((cat) => {
              const isActive = filter === cat.id;
              return (
                <li key={cat.id} role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    data-active={isActive || undefined}
                    className="wk-cat-btn"
                    onClick={() => setFilter(cat.id)}
                  >
                    <span>{cat.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="wk-sidebar-toggle">
            <AutoplayToggle />
          </div>
        </aside>

        <section className="wk-catalogue" aria-label="Project catalogue">
          {filtered.length === 0 ? (
            <p className="wk-empty">No projects in this category yet.</p>
          ) : (
            <Masonry key={filter} className="bento">
              {filtered.map((item) => (
                <article
                  key={item.id}
                  className="tile"
                  data-shape={item.shape !== "square" ? item.shape : undefined}
                  data-locked={item.locked || undefined}
                >
                  <Showcase
                    name={item.name}
                    shape={item.shape}
                    backdrop={item.backdrop}
                    screen={item.screen}
                    logo={item.logo}
                  />
                  {item.external ? (
                    <a
                      className="tile-link"
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.name}
                    />
                  ) : (
                    <Link
                      className="tile-link"
                      href={item.href}
                      transitionTypes={["nav-forward"]}
                      aria-label={item.name}
                    />
                  )}
                  <span className="tile-caption" aria-hidden={!item.play || undefined}>
                    <SharedTitle name={`title-${item.slug}`}>
                      <span className="tile-name">{item.name}</span>
                    </SharedTitle>
                    {item.when && <span className="tile-when">{item.when}</span>}
                    {item.play && (
                      <span className="tile-actions">
                        <a
                          className="tile-btn"
                          href={item.play}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
                          </svg>
                          Play
                          <span className="sr-only"> {item.name}</span>
                        </a>
                      </span>
                    )}
                  </span>
                </article>
              ))}
            </Masonry>
          )}
        </section>
      </main>

      <SiteFooter openToWork={openToWork} socials={socials} />
    </div>
  );
}
