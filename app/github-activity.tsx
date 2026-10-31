"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DOT_DAYS, type GithubSnapshot } from "./github";
import { ICONS } from "./socials";

function relativeTime(iso: string, nowMinute: number) {
  const m = Math.floor(nowMinute - new Date(iso).getTime() / 60_000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

const noSubscribe = () => () => {};
/** The current minute on the client, null on the server: the cached page is up to a day old, so "3h ago" is worked out here. */
const useNowMinute = () =>
  useSyncExternalStore(noSubscribe, () => Math.floor(Date.now() / 60_000), () => null);

/** Dynamic-Island-style card: collapsed shows the project count; expanded lists what's being built plus GitHub activity (fetched daily on the server, app/github.ts). */
export function GithubActivity({
  github,
  nowBuilding: NOW_BUILDING,
}: {
  /** Null when GitHub couldn't be reached. */
  github: GithubSnapshot | null;
  /** What Kv is building right now (content/site.ts). */
  nowBuilding: readonly string[];
}) {
  const pill = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const nowMinute = useNowMinute();

  const [open, setOpen] = useState(false);
  const latest = github?.latest ?? null;

  const live = !!github;
  const latestLine = !github ? "GitHub unavailable" : (latest?.label ?? "No recent activity");
  const dots = github?.activeDays ?? Array<boolean>(DOT_DAYS).fill(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  // Toggling `inert` drops focus; hand it to the layer now live (not on first render).
  const settled = useRef(false);
  useEffect(() => {
    if (!settled.current) {
      settled.current = true;
      return;
    }
    (open ? close : pill).current?.focus();
  }, [open]);

  return (
    <div
      className="island"
      data-open={open || undefined}
      data-live={live || undefined}
      style={{ "--projects": NOW_BUILDING.length } as React.CSSProperties}
      onBlur={(e) => {
        if (open && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget))
          setOpen(false);
      }}
    >
      {/* --- collapsed --- */}
      <button
        ref={pill}
        type="button"
        className="island-pill"
        aria-expanded={open}
        aria-label={`Working on ${NOW_BUILDING.length} ${NOW_BUILDING.length === 1 ? "project" : "projects"}. Expand for the list and GitHub activity`}
        onClick={() => setOpen(true)}
        inert={open}
      >
        <svg
          className="island-gh-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={ICONS.github} />
        </svg>
        <span className="island-count">
          {NOW_BUILDING.length}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </span>
      </button>

      {/* --- expanded --- */}
      <div className="island-panel" inert={!open}>
        <div className="island-gh-header">
          <svg
            className="island-gh-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={ICONS.github} />
          </svg>
          <p className="island-gh-user island-gh-muted" id="island-now">
            Working on
          </p>
          <button
            ref={close}
            type="button"
            className="island-close"
            aria-label="Collapse GitHub activity"
            onClick={() => setOpen(false)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 15l6-6 6 6" />
            </svg>
          </button>
        </div>

        <ul className="island-now" aria-labelledby="island-now">
          {NOW_BUILDING.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>

        <div className="island-gh-row">
          <span className="island-gh-text">{latestLine}</span>
          {latest && nowMinute !== null && (
            <span className="island-gh-time">{relativeTime(latest.time, nowMinute)}</span>
          )}
        </div>

        <div className="island-gh-days" aria-label={`Active ${dots.filter(Boolean).length} of the last ${DOT_DAYS} days`}>
          {dots.map((active, i) => (
            <span key={i} className="island-gh-day" data-active={active || undefined} aria-hidden="true" />
          ))}
        </div>
      </div>
    </div>
  );
}
