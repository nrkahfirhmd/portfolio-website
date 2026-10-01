"use client";

import { useEffect, useRef, useState } from "react";

/** github.com/nrkahfirhmd — same handle as the footer's GitHub link. */
const USERNAME = "nrkahfirhmd";
/** Public events endpoint needs no key, so there's nothing to leak
 * client-side — unauthenticated rate limit is 60/hr per visitor IP, plenty
 * for a personal page polled this slowly. */
const POLL_MS = 5 * 60_000;
/** Days shown in the activity dot row. Not derived from anything — just how
 * many fit the panel width. */
const DOT_DAYS = 11;

/** What Kv is building right now. Not derived from GitHub — a repo slug
 * rarely matches how a project actually gets talked about — so this is the
 * list to edit by hand when the focus changes. The collapsed pill shows the
 * count; the expanded panel lists them. */
const NOW_BUILDING = ["Project Akar Fehu", "Final Challenge ADA", "Omawe"];

/** Octocat mark — same path as the footer's GitHub link in app/page.tsx. */
const GITHUB_ICON_D =
  "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7A5.2 5.2 0 0 0 19.9 5a4.9 4.9 0 0 0-.1-3.6s-1.1-.4-3.7 1.4a12.7 12.7 0 0 0-6.6 0C6.9 1 5.8 1.4 5.8 1.4A4.9 4.9 0 0 0 5.7 5a5.2 5.2 0 0 0-1.4 3.7c0 5.2 3.2 6.4 6.2 6.7a3.4 3.4 0 0 0-.9 2.6V22";

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

/** Maps one event to a headline, or null for types not worth surfacing
 * (stars, follows, etc. are noise, not "building"). Repo name is baked into
 * the label so the caller never has to re-join the two. */
function summarize(e: GithubEvent): Activity | null {
  const repo = e.repo.name.split("/").pop() ?? e.repo.name;
  const base = { id: e.id, time: e.created_at };
  switch (e.type) {
    case "PushEvent":
      // GitHub's events payload dropped the `commits` array (and any commit
      // count) a while back — `ref`/`head`/`before` is all that's left, so
      // this can say a push happened, not how many commits were in it.
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

/** One bool per of the last DOT_DAYS calendar days (oldest first): did any
 * public event land that day. The events feed only covers recent history, so
 * this reads as "active lately" rather than a real GitHub contribution
 * calendar — good enough for a decorative pulse, not pretending to be more. */
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

/**
 * Dynamic-Island-style status card — same collapse/expand shell as the music
 * island this replaced (app/music-island.tsx). Collapsed follows iOS's
 * compact leading/trailing layout: GitHub mark left, active project count
 * right; expanded lists what Kv is building, adds the latest real GitHub event and
 * a day-by-day activity row, so the tagline's "building things" claim is
 * backed by live data instead of just stated.
 */
export function GithubActivity() {
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
          `https://api.github.com/users/${USERNAME}/events/public`,
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
  }, []);

  const live = !broken && !loading;
  const latestLine = broken
    ? "GitHub unavailable"
    : loading
      ? "Loading activity…"
      : (latest?.label ?? "No recent activity");
  const dots = activeDays ?? Array<boolean>(DOT_DAYS).fill(false);

  // Escape collapses, matching every other dismissible overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  // Toggling flips which layer is `inert`, which drops focus inside it on
  // the floor. Hand focus across to the layer that just became live; skip
  // the first run so a page load doesn't yank focus into the island.
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
          <path d={GITHUB_ICON_D} />
        </svg>
        {/* iOS compact layout: leading and trailing glyphs hug the edges,
            the middle stays empty where the camera cutout would be. */}
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
            <path d={GITHUB_ICON_D} />
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
