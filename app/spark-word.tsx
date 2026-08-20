"use client";

import { useState } from "react";

/** A tagline word that pops on click. Remounting the inner span on each
 * click replays the CSS animation — same trick as the page's [data-enter]
 * load stagger, no manual reflow/class-toggle hack needed. */
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
