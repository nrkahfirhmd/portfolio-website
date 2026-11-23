"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  label?: string;
  variant?: "default" | "mobile";
  className?: string;
}

type WebkitVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};

function fmt(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Portfolio-native video player with smoked frosted-glass controls and keyboard support. */
export function VideoPlayer({
  src,
  poster,
  label = "Project demo video",
  variant = "default",
  className,
}: VideoPlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimerRef = useRef<number | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [dockVisible, setDockVisible] = useState(true);
  const [focusedInside, setFocusedInside] = useState(false);

  const regionId = useId();
  const resolvedSrc = src.includes("#") ? src : `${src}#t=0.1`;

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setDockVisible(false);
    }, 2200);
  }, [clearHideTimer]);

  const revealDock = useCallback(
    (isPlayingNow: boolean) => {
      setDockVisible(true);
      if (isPlayingNow) {
        scheduleHide();
      } else {
        clearHideTimer();
      }
    },
    [clearHideTimer, scheduleHide],
  );

  useEffect(() => {
    const onFsChange = () => {
      const root = rootRef.current;
      setFullscreen(Boolean(root && document.fullscreenElement === root));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      clearHideTimer();
    };
  }, [clearHideTimer]);

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el || failed) return;
    if (el.paused) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [failed]);

  const toggleMute = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  }, []);

  const seekTo = useCallback(
    (next: number) => {
      const el = videoRef.current;
      if (!el || !duration) return;
      const clamped = Math.max(0, Math.min(duration, next));
      el.currentTime = clamped;
      setTime(clamped);
    },
    [duration],
  );

  const toggleFullscreen = useCallback(() => {
    const root = rootRef.current;
    const el = videoRef.current as WebkitVideo | null;
    if (!root || !el) return;
    if (document.fullscreenElement === root) {
      void document.exitFullscreen?.().catch(() => {});
    } else if (root.requestFullscreen) {
      void root.requestFullscreen().catch(() => {});
    } else if (el.webkitEnterFullscreen) {
      el.webkitEnterFullscreen();
    }
  }, []);

  const retryLoad = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    setFailed(false);
    setBuffering(true);
    el.load();
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    const isRange = target.tagName === "INPUT";
    const isButton = target.tagName === "BUTTON";

    if ((e.key === " " || e.key.toLowerCase() === "k") && !isButton) {
      e.preventDefault();
      togglePlay();
      revealDock(!playing);
    } else if (e.key.toLowerCase() === "m") {
      e.preventDefault();
      toggleMute();
      revealDock(playing);
    } else if (e.key.toLowerCase() === "f") {
      e.preventDefault();
      toggleFullscreen();
    } else if (!isRange && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      e.preventDefault();
      seekTo(time + (e.key === "ArrowRight" ? 5 : -5));
      revealDock(playing);
    }
  }

  function updateBuffered(el: HTMLVideoElement) {
    if (!el.duration || el.buffered.length === 0) return;
    const end = el.buffered.end(el.buffered.length - 1);
    setBuffered(Math.min(1, end / el.duration));
  }

  const progress = duration > 0 ? Math.min(1, time / duration) : 0;
  const showDock = !playing || dockVisible || focusedInside;

  const rootCls = [
    "vp-root",
    variant === "mobile" && "vp-root--mobile",
    playing && "is-playing",
    showDock && "is-dock-visible",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={rootRef}
      id={regionId}
      className={rootCls}
      role="region"
      aria-label={label}
      onMouseMove={() => revealDock(playing)}
      onMouseLeave={() => {
        if (playing && !focusedInside) {
          clearHideTimer();
          setDockVisible(false);
        }
      }}
      onFocusCapture={() => {
        setFocusedInside(true);
        setDockVisible(true);
        clearHideTimer();
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setFocusedInside(false);
          if (playing) scheduleHide();
        }
      }}
      onKeyDown={onKeyDown}
    >
      <video
        ref={videoRef}
        className="vp-video"
        src={resolvedSrc}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onClick={togglePlay}
        onPlay={() => {
          setPlaying(true);
          setBuffering(false);
          scheduleHide();
        }}
        onPause={() => {
          setPlaying(false);
          clearHideTimer();
          setDockVisible(true);
        }}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        onTimeUpdate={(e) => {
          setTime(e.currentTarget.currentTime);
          updateBuffered(e.currentTarget);
        }}
        onProgress={(e) => updateBuffered(e.currentTarget)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          updateBuffered(e.currentTarget);
        }}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        onError={() => {
          setFailed(true);
          setBuffering(false);
          setPlaying(false);
        }}
      />

      {failed ? (
        <div className="vp-state" role="alert">
          <p className="vp-state-msg">Video could not load.</p>
          <button type="button" className="vp-retry" onClick={retryLoad}>
            Retry
          </button>
        </div>
      ) : null}

      {!failed && buffering && playing ? (
        <div className="vp-loading" role="status" aria-live="polite">
          <span className="vp-spinner" aria-hidden="true" />
          <span className="sr-only">Loading video</span>
        </div>
      ) : null}

      {!failed && !playing ? (
        <button
          type="button"
          className="vp-center-play"
          aria-label={`Play ${label}`}
          onClick={togglePlay}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.5 5.5v13l10.5-6.5z" fill="currentColor" />
          </svg>
        </button>
      ) : null}

      {!failed ? (
        <div className="vp-dock">
          <div
            className="vp-scrub"
            style={
              {
                "--vp-progress": `${(progress * 100).toFixed(3)}%`,
                "--vp-buffered": `${(buffered * 100).toFixed(3)}%`,
              } as React.CSSProperties
            }
          >
            <span className="vp-track" aria-hidden="true">
              <span className="vp-buffered" />
              <span className="vp-fill" />
            </span>
            <input
              type="range"
              className="vp-range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={time}
              aria-label={`Seek ${label}`}
              aria-valuetext={`${fmt(time)} of ${fmt(duration)}`}
              onChange={(e) => seekTo(Number(e.target.value))}
            />
          </div>

          <div className="vp-controls">
            <button
              type="button"
              className="vp-btn"
              aria-label={playing ? `Pause ${label}` : `Play ${label}`}
              aria-pressed={playing}
              onClick={togglePlay}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {playing ? (
                  <path d="M7 5.5h3.5v13H7zM13.5 5.5H17v13h-3.5z" fill="currentColor" />
                ) : (
                  <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
                )}
              </svg>
            </button>

            <span className="vp-time" aria-hidden="true">
              <span className="vp-time-now">{fmt(time)}</span>
              <span className="vp-time-sep">/</span>
              <span className="vp-time-total">{fmt(duration)}</span>
            </span>

            <span className="vp-spacer" aria-hidden="true" />

            <button
              type="button"
              className="vp-btn"
              aria-label={muted ? "Unmute video" : "Mute video"}
              aria-pressed={muted}
              onClick={toggleMute}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {muted ? (
                  <path
                    d="M4.5 9.5H8l4.5-4v13L8 14.5H4.5zM16 9.5l4.5 5m0-5L16 14.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M4.5 9.5H8l4.5-4v13L8 14.5H4.5zM16 9.2a4 4 0 0 1 0 5.6M18.6 6.8a7.4 7.4 0 0 1 0 10.4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>

            <button
              type="button"
              className="vp-btn"
              aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              aria-pressed={fullscreen}
              onClick={toggleFullscreen}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {fullscreen ? (
                  <path
                    d="M9 4.5V9H4.5M15 4.5V9h4.5M9 19.5V15H4.5M15 19.5V15h4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M4.5 9V4.5H9M19.5 9V4.5H15M4.5 15v4.5H9M19.5 15v4.5H15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
