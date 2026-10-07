"use client";

import { useEffect, useRef, useState } from "react";
import { ICONS } from "./socials";

/** Keyless public endpoint: 60 req/hr per visitor IP is plenty at this rate. */
const POLL_MS = 5 * 60_000;
/** Days in the activity dot row: as many as fit the panel. */
const DOT_DAYS = 11;

type GithubEvent = {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload?: {
    action?: string;
    ref_type?: string;
    pull_request?: { merged?: boolean };
  };
};

type Activity = { id: string; time: string; label: string };

const ACTION_VERB: Record<string, string> = {
  opened: "Opened",
  closed: "Closed",
  reopened: "Reopened",
};

/** One event as a headline, or null for noise (stars, follows, …). */
function summarize(e: GithubEvent): Activity | null {
  const repo = e.repo.name.split("/").pop() ?? e.repo.name;
  const base = { id: e.id, time: e.created_at };
  switch (e.type) {
    case "PushEvent":
      // The events payload no longer carries commit counts.
      return { ...base, label: `Pushed to ${repo}` };
    case "PullRequestEvent": {
      const action = e.payload?.action;
      const merged = action === "closed" && e.payload?.pull_request?.merged;
      const verb = merged ? "Merged" : (ACTION_VERB[action ?? ""] ?? "Updated");
      return { ...base, label: `${verb} PR on ${repo}` };
    }
    case "IssuesEvent":
      return { ...base, label: `${ACTION_VERB[e.payload?.action ?? ""] ?? "Updated"} issue on ${repo}` };
    case "CreateEvent":
      return {
        ...base,
        label:
          e.payload?.ref_type === "repository"
            ? `Created repo ${repo}`
            : `Created ${e.payload?.ref_type ?? "ref"} on ${repo}`,
      };
    case "ReleaseEvent":
      return { ...base, label: `Published release on ${repo}` };
    case "ForkEvent":
      return { ...base, label: `Forked ${repo}` };
    default:
      return null;
  }
}

function relativeTime(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

/** Per day of the last DOT_DAYS (oldest first): did any public event land. "Active lately", not a contribution calendar. */
function activeDaysFrom(events: GithubEvent[]) {
  const stamped = new Set(events.map((e) => e.created_at.slice(0, 10)));
  const days: boolean[] = [];
  const today = new Date();
  for (let i = DOT_DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(stamped.has(d.toISOString().slice(0, 10)));
  }
  return days;
}

/** Dynamic-Island-style card: collapsed shows the project count; expanded lists what's being built plus live GitHub activity. */
export function GithubActivity({
  username,
  nowBuilding: NOW_BUILDING,
}: {
  /** GitHub handle whose public events feed the island. */
  username: string;
  /** What Kv is building right now (content/site.ts). */
  nowBuilding: readonly string[];
}) {
  const pill = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const [latest, setLatest] = useState<Activity | null>(null);
  const [activeDays, setActiveDays] = useState<boolean[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${username}/events/public`,
          { headers: { Accept: "application/vnd.github+json" } },
        );
        if (!res.ok) throw new Error(String(res.status));
        const events: GithubEvent[] = await res.json();
        if (cancelled) return;
        let found: Activity | null = null;
        for (const e of events) {
          const a = summarize(e);
          if (a) {
            found = a;
            break;
          }
        }
        setLatest(found);
        setActiveDays(activeDaysFrom(events));
        setBroken(false);
      } catch {
        if (!cancelled) setBroken(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [username]);

  const live = !broken && !loading;
  const latestLine = broken
    ? "GitHub unavailable"
    : loading
      ? "Loading activity…"
      : (latest?.label ?? "No recent activity");
  const dots = activeDays ?? Array<boolean>(DOT_DAYS).fill(false);

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
          {latest && <span className="island-gh-time">{relativeTime(latest.time)}</span>}
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
