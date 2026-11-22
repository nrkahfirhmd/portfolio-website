"use client";

import { useId, useRef, useState } from "react";

const BARS = [
  0.34, 0.52, 0.78, 0.61, 0.88, 0.45, 0.72, 0.94, 0.58, 0.41, 0.67, 0.85,
  0.49, 0.76, 0.92, 0.63, 0.38, 0.71, 0.84, 0.55, 0.46, 0.79, 0.96, 0.68,
  0.43, 0.74, 0.89, 0.57, 0.39, 0.65, 0.82, 0.51, 0.73, 0.6, 0.44, 0.32,
];

function fmt(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Portfolio-native audio player with scrubbable waveform. */
export function AudioPlayer({
  src,
  title,
  subtitle,
  caption,
}: {
  src: string;
  title: string;
  subtitle?: string;
  caption?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const labelId = useId();

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }

  function seek(next: number) {
    const el = audioRef.current;
    if (!el || !duration) return;
    el.currentTime = next;
    setTime(next);
  }

  const progress = duration > 0 ? Math.min(1, time / duration) : 0;

  return (
    <figure className="st-figure">
      <div className="ap-card" role="region" aria-labelledby={labelId}>
        <div className="ap-head">
          <button
            type="button"
            className="ap-play"
            aria-label={playing ? `Pause ${title}` : `Play ${title}`}
            aria-pressed={playing}
            onClick={togglePlay}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {playing ? (
                <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
              ) : (
                <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
              )}
            </svg>
          </button>

          <div className="ap-meta">
            <p id={labelId} className="ap-title">{title}</p>
            {subtitle && <p className="ap-sub">{subtitle}</p>}
          </div>
        </div>

        <div className="ap-wave-wrap">
          <div className="ap-bars" aria-hidden="true">
            {BARS.map((h, i) => {
              const filled = i / BARS.length <= progress;
              return (
                <span
                  key={i}
                  className={filled ? "ap-bar is-on" : "ap-bar"}
                  style={{ height: `${Math.round(h * 100)}%` }}
                />
              );
            })}
          </div>
          <input
            className="ap-range"
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={time}
            aria-label={`Seek ${title}`}
            onChange={(e) => seek(Number(e.target.value))}
          />
        </div>

        <div className="ap-foot">
          <span className="ap-time">{fmt(time)}</span>
          <span className="ap-time">{fmt(duration)}</span>
        </div>

        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
