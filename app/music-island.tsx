"use client";

import { useEffect, useRef, useState } from "react";
import { TRACKS } from "./tracks";

/** Bar count in the collapsed equalizer. Each gets its own CSS delay. */
const BARS = [0, 1, 2, 3];

/** Glyphs the spinning record throws off. Purely decorative — the whole
 * cluster is aria-hidden, and CSS stops emitting them under reduced-motion. */
const NOTES = ["♪", "♫", "♩"];

function clock(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Dynamic-Island-style music player. Collapsed it is an inverted pill with a
 * live equalizer; clicking morphs it into the transport.
 *
 * Audio is paused on load — nothing plays until the visitor presses play,
 * which is the spec's "muted by default, visible toggle" requirement.
 *
 * Both layers stay mounted so the swap can cross-fade; the inactive one is
 * `inert`, which takes it out of the tab order and the accessibility tree
 * without a manual `tabIndex={-1}` sweep over every child.
 */
export function MusicIsland() {
  const audio = useRef<HTMLAudioElement>(null);
  const pill = useRef<HTMLButtonElement>(null);
  const play = useRef<HTMLButtonElement>(null);
  const artistBox = useRef<HTMLParagraphElement>(null);
  const artistText = useRef<HTMLSpanElement>(null);
  /** Set by `ended` so the next track keeps playing — see the handler. */
  const resume = useRef(false);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [broken, setBroken] = useState(false);
  /** Pixels the artist/game line overflows its box by, 0 when it fits. Drives
   * the marquee — only text that's actually clipped should ever move. */
  const [overflow, setOverflow] = useState(0);

  const track = TRACKS[index];

  // Track changes swap the source; keep playing across a skip, but never
  // start playback on the initial mount.
  useEffect(() => {
    const el = audio.current;
    if (!el) return;

    // The <audio> is in the server HTML and preloads, so `loadedmetadata` and
    // `error` can both fire before React hydrates and attaches their handlers.
    // Read whatever already landed instead of waiting for an event that has
    // been and gone — otherwise duration stays 0 and the seek bar sits dead.
    if (el.error) setBroken(true);
    else if (el.readyState >= HTMLMediaElement.HAVE_METADATA) {
      setDuration(el.duration);
      setBroken(false);
    }

    const carry = playing || resume.current;
    resume.current = false;
    if (!carry) return;
    el.play().catch(() => setBroken(true));
    // `playing` is deliberately not a dependency — this effect exists to carry
    // playback across a track change, not to react to the play/pause toggle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Measures whether the artist/game line is wider than its box. A
  // ResizeObserver on the text itself (not just an effect on the track)
  // catches every cause of overflow changing: a new track, but also the
  // viewport resizing the panel, or a font finishing its load.
  useEffect(() => {
    const box = artistBox.current;
    const text = artistText.current;
    if (!box || !text) return;
    const measure = () =>
      setOverflow(Math.max(0, text.scrollWidth - box.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    ro.observe(text);
    return () => ro.disconnect();
  }, [track, broken]);

  // Escape collapses, matching every other dismissible overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  // Toggling flips which layer is `inert`, and a layer going inert drops the
  // focus inside it on the floor — the tab order would restart from the top of
  // the document. Hand focus across to the layer that just became live.
  // Skips the first run so a page load doesn't yank focus into the island.
  const settled = useRef(false);
  useEffect(() => {
    if (!settled.current) {
      settled.current = true;
      return;
    }
    (open ? play : pill).current?.focus();
  }, [open]);

  function toggle() {
    const el = audio.current;
    if (!el || broken) return;
    if (el.paused) el.play().catch(() => setBroken(true));
    else el.pause();
  }

  function skip(by: number) {
    setTime(0);
    setIndex((i) => (i + by + TRACKS.length) % TRACKS.length);
  }

  function seek(to: number) {
    const el = audio.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = to;
    setTime(to);
  }

  return (
    <div
      className="island"
      data-open={open || undefined}
      data-playing={playing || undefined}
      onBlur={(e) => {
        // Collapse on a keyboard tab-out. `relatedTarget` must be a real
        // element: expanding makes the pill inert, which blurs it with a null
        // relatedTarget, and treating that as a tab-out collapsed the panel in
        // the same tick it opened.
        if (open && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget))
          setOpen(false);
      }}
    >
      <audio
        ref={audio}
        src={track?.src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          // Reaching the end also pauses the element, so by the time the
          // track-change effect runs `playing` is already false and it would
          // decline to carry playback over. Record the intent instead.
          // A lone track has nowhere to advance to, so it just stops.
          if (TRACKS.length < 2) return;
          resume.current = true;
          skip(1);
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setBroken(false);
        }}
        onError={() => setBroken(true)}
      />

      {/* --- collapsed --- */}
      <button
        ref={pill}
        type="button"
        className="island-pill"
        aria-expanded={open}
        aria-label={`Music player: ${track?.title ?? "no track"}. Expand`}
        onClick={() => setOpen(true)}
        inert={open}
      >
        <span className="island-dot" aria-hidden="true" />
        <span className="island-title">{track?.title ?? "No track"}</span>
        <span className="island-eq" aria-hidden="true">
          {BARS.map((b) => (
            <i key={b} style={{ "--b": b } as React.CSSProperties} />
          ))}
        </span>
      </button>

      {/* --- expanded --- */}
      <div className="island-panel" inert={!open}>
        <div className="island-art" aria-hidden="true">
          <span className="disc" />
          <span className="notes">
            {NOTES.map((n, i) => (
              <i key={n} style={{ "--n": i } as React.CSSProperties}>
                {n}
              </i>
            ))}
          </span>
        </div>

        <div className="island-meta">
          <p className="island-track">{track?.title ?? "No track"}</p>
          <p
            className="island-artist"
            ref={artistBox}
            data-marquee={overflow > 0 || undefined}
            style={
              {
                "--marquee-distance": `-${overflow}px`,
                // Longer lines drift further, so they get proportionally more
                // time — otherwise a long title would blur past.
                "--marquee-duration": `${(2.6 + overflow / 28).toFixed(1)}s`,
              } as React.CSSProperties
            }
          >
            <span className="island-artist-text" ref={artistText}>
              {broken
                ? "Track unavailable"
                : track
                  ? `${track.artist} · ${track.game}`
                  : "—"}
            </span>
          </p>

          <input
            className="island-seek"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(time, duration || 0)}
            disabled={broken || !duration}
            aria-label="Seek"
            onChange={(e) => seek(Number(e.target.value))}
            style={
              { "--p": duration ? time / duration : 0 } as React.CSSProperties
            }
          />

          <div className="island-row">
            <span className="island-time">{clock(time)}</span>

            <span className="island-controls">
              <button
                type="button"
                aria-label="Previous track"
                onClick={() => skip(-1)}
                disabled={TRACKS.length < 2}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 5v14L8 12zM6 5v14" />
                </svg>
              </button>

              <button
                ref={play}
                type="button"
                className="island-play"
                aria-label={playing ? "Pause" : "Play"}
                onClick={toggle}
                disabled={broken}
              >
                {playing ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 5v14M15 5v14" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 4v16l13-8z" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                aria-label="Next track"
                onClick={() => skip(1)}
                disabled={TRACKS.length < 2}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 5v14l10-7zM18 5v14" />
                </svg>
              </button>
            </span>

            <button
              type="button"
              className="island-close"
              aria-label="Collapse music player"
              onClick={() => setOpen(false)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 15l6-6 6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
