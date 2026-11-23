"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BaliClock } from "./bali-clock";
import type { SocialLinkItem } from "./gallery-home";
import "./memory-field.css";

type StarTone = "polaris" | "rigel" | "sol" | "vega";

interface StarNote {
  id: string;
  author: string;
  message: string;
  xPct: number;
  yPct: number;
  tone: StarTone;
  date: string;
}

const STORAGE_KEY = "kv_star_notes_v1";
const STORAGE_EVENT = "kv-star-notes-update";

const STAR_TONES: { id: StarTone; label: string }[] = [
  { id: "polaris", label: "Polaris (Ink)" },
  { id: "rigel", label: "Rigel (Blue)" },
  { id: "sol", label: "Sol (Amber)" },
  { id: "vega", label: "Vega (Teal)" },
];

// Single honest host star authored by Kahfi (no fabricated visitor messages, R-18/R-38)
const SEED_STARS: StarNote[] = [
  {
    id: "seed-kahfi",
    author: "Kahfi",
    message:
      "Thanks for stopping by. Click anywhere in the sky to place a star and leave a note for me.",
    xPct: 38,
    yPct: 46,
    tone: "rigel",
    date: "Host",
  },
];

function subscribeNotes(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(STORAGE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(STORAGE_EVENT, cb);
  };
}

function getNotesSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot() {
  return "[]";
}

interface SiteFooterProps {
  name: string;
  openToWork: boolean;
  socials: SocialLinkItem[];
  showSpace?: boolean;
}

export function StarSpace() {
  const skyRef = useRef<HTMLDivElement>(null);
  // shortcut: persisted in browser localStorage; wire to a shared backend/DB when deploying multi-visitor sky
  const savedRaw = useSyncExternalStore(subscribeNotes, getNotesSnapshot, getServerSnapshot);
  const userNotes: StarNote[] = (() => {
    try {
      const parsed = JSON.parse(savedRaw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();
  const stars = [...SEED_STARS, ...userNotes];

  const [selectedId, setSelectedId] = useState<string | null>(SEED_STARS[0].id);
  const [composingAt, setComposingAt] = useState<{ xPct: number; yPct: number } | null>(null);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<StarTone>("polaris");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setComposingAt(null);
        setSelectedId(null);
        setError(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const selectedStar = stars.find((s) => s.id === selectedId) ?? null;

  const openComposerAt = (xPct: number, yPct: number) => {
    setSelectedId(null);
    setError(null);
    setComposingAt({
      xPct: Math.max(8, Math.min(92, xPct)),
      yPct: Math.max(14, Math.min(82, yPct)),
    });
  };

  const handleSkyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, .sp-card")) return;
    const rect = skyRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    openComposerAt(xPct, yPct);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMsg = message.trim();
    if (!cleanMsg) {
      setError("Write a short message before placing your star.");
      return;
    }
    if (!composingAt) return;

    const cleanAuthor = author.trim() || "Stargazer";
    const nextStar: StarNote = {
      id: `star-${stars.length + 1}-${Math.round(composingAt.xPct)}-${Math.round(composingAt.yPct)}`,
      author: cleanAuthor,
      message: cleanMsg,
      xPct: composingAt.xPct,
      yPct: composingAt.yPct,
      tone,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };

    const nextUserNotes = [...userNotes, nextStar];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUserNotes));
      window.dispatchEvent(new Event(STORAGE_EVENT));
    } catch {
      // Storage full or unavailable
    }

    setAuthor("");
    setMessage("");
    setError(null);
    setComposingAt(null);
    setSelectedId(nextStar.id);
  };

  return (
    <section className="sp-section" aria-labelledby="sp-heading">
      <div className="sp-head">
        <h2 id="sp-heading" className="sp-title">
          Leave a star.
        </h2>

        <button
          type="button"
          className="sp-add-btn"
          onClick={() =>
            openComposerAt(12 + Math.random() * 76, 18 + Math.random() * 60)
          }
        >
          + Place a star
        </button>
      </div>

      <div ref={skyRef} className="sp-sky" onClick={handleSkyClick}>
        {/* Subtle constellation lines connecting consecutive stars */}
        <svg
          className="sp-constellation"
          viewBox="0 0 1000 440"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {stars.map((s, i) => {
            if (i === 0) return null;
            const prev = stars[i - 1];
            const isHighlighted = s.id === selectedId || prev.id === selectedId;
            return (
              <line
                key={`${prev.id}-${s.id}`}
                x1={(prev.xPct / 100) * 1000}
                y1={(prev.yPct / 100) * 440}
                x2={(s.xPct / 100) * 1000}
                y2={(s.yPct / 100) * 440}
                stroke={isHighlighted ? "#166238" : "#0f172a"}
                strokeOpacity={isHighlighted ? 0.5 : 0.16}
                strokeWidth="1"
                strokeDasharray="4 5"
              />
            );
          })}
        </svg>

        {/* Pinned stars */}
        {stars.map((s) => {
          const isSelected = selectedId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              className={`sp-star sp-star--${s.tone}`}
              data-selected={isSelected || undefined}
              style={{ left: `${s.xPct}%`, top: `${s.yPct}%` }}
              aria-label={`Read note from ${s.author}`}
              onClick={(e) => {
                e.stopPropagation();
                setComposingAt(null);
                setSelectedId(s.id);
              }}
            >
              <span className="sp-star-glyph" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
                </svg>
              </span>
              <span className="sp-star-name" aria-hidden="true">
                {s.author}
              </span>
            </button>
          );
        })}

        {composingAt && (
          <span
            className="sp-target"
            style={{ left: `${composingAt.xPct}%`, top: `${composingAt.yPct}%` }}
            aria-hidden="true"
          />
        )}

        {/* Selected star reader card */}
        {selectedStar && !composingAt && (
          <div className="sp-card" role="region" aria-label={`Note from ${selectedStar.author}`}>
            <div className="sp-card-head">
              <span className={`sp-card-badge sp-card-badge--${selectedStar.tone}`}>
                {selectedStar.author} · {selectedStar.date}
              </span>
              <button
                type="button"
                className="sp-card-close"
                aria-label="Close note"
                onClick={() => setSelectedId(null)}
              >
                &times;
              </button>
            </div>
            <p className="sp-card-msg">{selectedStar.message}</p>
          </div>
        )}

        {/* New star composer card */}
        {composingAt && (
          <div className="sp-card" role="dialog" aria-label="Place a star">
            <div className="sp-card-head">
              <span className="sp-card-title">New star</span>
              <button
                type="button"
                className="sp-card-close"
                aria-label="Close composer"
                onClick={() => {
                  setComposingAt(null);
                  setError(null);
                }}
              >
                &times;
              </button>
            </div>

            <form className="sp-form" onSubmit={handleSubmit}>
              <label className="sp-label">
                Name (optional)
                <input
                  type="text"
                  className="sp-input"
                  value={author}
                  maxLength={28}
                  placeholder="Your name"
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </label>

              <label className="sp-label">
                Message
                <textarea
                  className="sp-textarea"
                  value={message}
                  maxLength={200}
                  placeholder="Leave a message in the sky..."
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (error) setError(null);
                  }}
                />
              </label>

              <fieldset className="sp-tones">
                <legend className="sp-tones-legend">Star light</legend>
                <div className="sp-tone-row">
                  {STAR_TONES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`sp-tone-swatch sp-tone-swatch--${t.id}`}
                      aria-label={t.label}
                      aria-pressed={tone === t.id}
                      onClick={() => setTone(t.id)}
                    />
                  ))}
                </div>
              </fieldset>

              {error && (
                <p className="sp-error" role="alert">
                  {error}
                </p>
              )}

              <div className="sp-form-actions">
                <button
                  type="button"
                  className="sp-btn-cancel"
                  onClick={() => {
                    setComposingAt(null);
                    setError(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="sp-btn-submit">
                  Place star
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export function SiteFooter({ name, openToWork, socials, showSpace = true }: SiteFooterProps) {
  return (
    <footer className="gh-footer-wrap">
      {showSpace ? <StarSpace /> : null}

      <div className="gh-footer">
        <div className="gh-colophon">
          <span>&copy;2026 {name.toUpperCase()}</span>
          {openToWork ? (
            <>
              <span className="gh-colophon-sep" aria-hidden="true">
                |
              </span>
              <a
                href="mailto:nurkahfirahmada@gmail.com?subject=Inquiry%20Regarding%20Work%20Opportunity"
                className="gh-open-status"
              >
                <span className="gh-open-dot" aria-hidden="true" />
                <span>OPEN TO WORK</span>
              </a>
            </>
          ) : null}
        </div>

        <div className="gh-footer-right">
          <nav className="gh-socials" aria-label="Social and contact links">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={s.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="gh-social-link"
                aria-label={s.label}
                title={s.label}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </nav>

          <div className="gh-clock-pill">
            <BaliClock />
          </div>
        </div>
      </div>
    </footer>
  );
}
