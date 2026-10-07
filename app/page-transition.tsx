import { type ReactNode, ViewTransition } from "react";

const SLIDE = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

/** Slides a page with the link's transitionTypes ("nav-forward" / "nav-back"); untyped navigations don't animate. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={SLIDE} exit={SLIDE} default="none">
      {children}
    </ViewTransition>
  );
}

/** A title that morphs between a tile and its article; same `name` on both. */
export function SharedTitle({ name, children }: { name: string; children: ReactNode }) {
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
