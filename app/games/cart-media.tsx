"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  getFinePointerServerSnapshot,
  getFinePointerSnapshot,
  subscribeFinePointer,
} from "../fine-pointer";

/**
 * Video autoplay, shared by every tile and the toggles on /software and
 * /games. Saved
 * per visitor; until they choose, it follows reduced-motion (on unless the
 * visitor asked for less motion).
 */
const AUTOPLAY_KEY = "autoplay-video";
const autoplayListeners = new Set<() => void>();

function subscribeAutoplay(callback: () => void) {
  autoplayListeners.add(callback);
  return () => {
    autoplayListeners.delete(callback);
  };
}

function getAutoplay() {
  try {
    const saved = localStorage.getItem(AUTOPLAY_KEY);
    if (saved !== null) return saved === "1";
  } catch {
    // blocked storage: fall through to the default
  }
  return !matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setAutoplay(on: boolean) {
  try {
    localStorage.setItem(AUTOPLAY_KEY, on ? "1" : "0");
  } catch {
    // non-fatal: the choice just won't outlive the page
  }
  autoplayListeners.forEach((l) => l());
}

const useAutoplay = () => useSyncExternalStore(subscribeAutoplay, getAutoplay, () => false);

/** The switch beside a tile grid's heading that turns its videos on and off. */
export function AutoplayToggle() {
  const on = useAutoplay();
  return (
    <button type="button" className="autoplay-toggle" aria-pressed={on} onClick={() => setAutoplay(!on)}>
      <span className="autoplay-track" aria-hidden="true">
        <span className="autoplay-thumb" />
      </span>
      Autoplay
    </button>
  );
}

/**
 * A video tile's media: a muted loop. With autoplay on it just plays; with
 * it off it plays while the cart is hovered or focused, like a preview on a
 * store shelf, and where there's no hover to drive it (touch, reduced
 * motion) it shows native controls instead.
 */
export function CartVideo({ src, poster }: { src: string; poster?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const hover = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot,
  );
  const autoplay = useAutoplay();

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    // Autoplay only while the tile is on screen, so a long shelf doesn't
    // decode every video at once.
    if (autoplay) {
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      });
      io.observe(v);
      return () => {
        io.disconnect();
        v.pause();
      };
    }
    const cart = v.closest(".tile");
    if (!cart || !hover) return;
    const play = () => void v.play().catch(() => {});
    const stop = () => v.pause();
    cart.addEventListener("pointerenter", play);
    cart.addEventListener("pointerleave", stop);
    cart.addEventListener("focusin", play);
    cart.addEventListener("focusout", stop);
    return () => {
      cart.removeEventListener("pointerenter", play);
      cart.removeEventListener("pointerleave", stop);
      cart.removeEventListener("focusin", play);
      cart.removeEventListener("focusout", stop);
    };
  }, [autoplay, hover]);

  return (
    <video
      ref={video}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      controls={!hover && !autoplay}
    />
  );
}

/** Only one track plays at a time across the shelf. */
let playing: HTMLAudioElement | null = null;

/** A music tile's Listen button: play/pause for its track, nothing more. */
export function CartAudio({ src, name }: { src: string; name: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);

  function toggle() {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      if (playing && playing !== a) playing.pause();
      playing = a;
      void a.play().catch(() => {});
    } else {
      a.pause();
    }
  }

  return (
    <>
      <button type="button" className="tile-btn" aria-pressed={on} onClick={toggle}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {on ? (
            <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
          ) : (
            <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
          )}
        </svg>
        {on ? "Pause" : "Listen"}
        <span className="sr-only"> {name}</span>
      </button>
      <audio
        ref={audio}
        src={src}
        preload="none"
        onPlay={() => setOn(true)}
        onPause={() => setOn(false)}
      />
    </>
  );
}
