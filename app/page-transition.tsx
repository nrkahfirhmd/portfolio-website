import { type ReactNode, ViewTransition } from "react";

const SLIDE = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

/**
 * Wraps a page so it slides with the navigation's direction: deeper links
 * carry transitionTypes={["nav-forward"]}, links back up carry "nav-back".
 * Untyped navigations (browser back, refresh) don't animate. Lives in each
 * page rather than the layout, since a layout never enters or exits.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={SLIDE} exit={SLIDE} default="none">
      {children}
    </ViewTransition>
  );
}

/** A title that morphs between a tile and its article. Same `name` on both. */
export function SharedTitle({ name, children }: { name: string; children: ReactNode }) {
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
