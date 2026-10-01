"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  getFinePointerServerSnapshot,
  getFinePointerSnapshot,
  subscribeFinePointer,
} from "../fine-pointer";

/**
 * A video tile's media: a muted loop that plays while the cart is hovered or
 * focused, like a preview on a store shelf. Where there's no hover to drive
 * it (touch, reduced motion) it shows native controls instead.
 */
export function CartVideo({ src, poster }: { src: string; poster?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const hover = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot,
  );

  useEffect(() => {
    const v = video.current;
    const cart = v?.closest(".tile");
    if (!v || !cart || !hover) return;
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
  }, [hover]);

  return (
    <video
      ref={video}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      controls={!hover}
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
