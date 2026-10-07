"use client";

import { useState } from "react";

/** A tagline word that pops on click; remounting the span (new key) replays the animation. */
export function SparkWord({ children }: { children: string }) {
  const [burst, setBurst] = useState(0);

  return (
    <button
      type="button"
      className="flourish spark"
      onClick={() => setBurst((b) => b + 1)}
    >
      <span key={burst} className={burst ? "spark-burst" : undefined}>
        {children}
      </span>
    </button>
  );
}
