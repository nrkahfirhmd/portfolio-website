"use client";

import Image from "next/image";
import { useState } from "react";
import { BrushReveal } from "./brush-reveal";

export function PortraitToggle({ name }: { name: string }) {
  const [spider, setSpider] = useState(false);

  const toggle = () => setSpider((s) => !s);

  return (
    <div
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
      <Image
        className="photo-img"
        src="/portrait.png"
        alt=""
        width={1500}
        height={1500}
      />
      <Image
        className="photo-img photo-img--spider"
        src="/spiderman.png"
        alt=""
        width={384}
        height={384}
      />
      <BrushReveal src={spider ? "/portrait.png" : "/spiderman.png"} />
    </div>
  );
}
