"use client";

import { useState, type ReactNode } from "react";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "work", label: "Career" },
  { id: "education", label: "Education" },
  { id: "award", label: "Awards" },
] as const;

/** Work's sidebar-and-content shell; the sidebar filters the server-rendered sections by CSS. */
export function JourneyShell({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  return (
    <main className="wk-shell jr-shell">
      <aside className="wk-sidebar" aria-label="Journey sections">
        <ul className="wk-cat-list" role="tablist" aria-orientation="vertical">
          {FILTERS.map((f) => (
            <li key={f.id} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                data-active={filter === f.id || undefined}
                className="wk-cat-btn"
                onClick={() => setFilter(f.id)}
              >
                <span>{f.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="wk-sidebar-toggle jr-rail-legend">
          <span className="jr-now-dot" aria-hidden="true" />
          <span>Currently active</span>
        </div>
      </aside>

      <div className="jr-content" data-filter={filter}>
        {children}
      </div>
    </main>
  );
}
