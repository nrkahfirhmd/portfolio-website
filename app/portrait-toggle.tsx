"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BrushReveal } from "./brush-reveal";
import { useFinePointer } from "./fine-pointer";

export function PortraitToggle({ name }: { name: string }) {
  const [spider, setSpider] = useState(false);
  const photo = useRef<HTMLDivElement>(null);
  const parallax = useFinePointer();

  const toggle = () => setSpider((s) => !s);

  // Drifts with the pointer (--mx/--my, -1..1). Written on the photo, not :root, so only it restyles; once per frame.
  useEffect(() => {
    const el = photo.current;
    if (!parallax || !el) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const move = (e: PointerEvent) => {
      x = (e.clientX / innerWidth - 0.5) * 2;
      y = (e.clientY / innerHeight - 0.5) * 2;
      raf ||= requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty("--mx", x.toFixed(3));
        el.style.setProperty("--my", y.toFixed(3));
      });
    };
    addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };
  }, [parallax]);

  return (
    <div
      ref={photo}
      className="photo"
      tabIndex={0}
      role="img"
      aria-label={`Portrait of ${name}`}
      data-revealed={spider ? "spider" : "portrait"}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      {/* The circle is at most 168px (home.css), so sizes lets a 2x screen pick ~384px, not a full-size PNG. Eager: it's the first thing in view. */}
      <Image
        className="photo-img"
        src="/portrait.png"
        alt=""
        width={384}
        height={384}
        sizes="168px"
        loading="eager"
        fetchPriority="high"
      />
      <Image
        className="photo-img photo-img--spider"
        src="/spiderman.png"
        alt=""
        width={384}
        height={384}
        sizes="168px"
      />
      <BrushReveal src={spider ? "/portrait.png" : "/spiderman.png"} />
    </div>
  );
}
