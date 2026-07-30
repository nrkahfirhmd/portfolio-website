"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Reactive `matchMedia`, safe to call during SSR.
 *
 * The server snapshot is always `false`, so the first client render matches the
 * HTML React streamed and hydration stays quiet; the real value lands in the
 * commit right after. Anything gated on this must therefore look correct in its
 * `false` state on first paint.
 */
export function useMediaQuery(query: string) {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const mql = window.matchMedia(query);
            mql.addEventListener("change", onChange);
            return () => mql.removeEventListener("change", onChange);
        },
        [query]
    );

    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches,
        () => false
    );
}

/** Mirrors Tailwind's `md` breakpoint (48rem), one pixel below it. */
export const MOBILE_QUERY = "(max-width: 767.98px)";

/**
 * The JS twin of the `roomy` CSS variant, inverted: true on anything that is
 * narrow *or* short. Drag ranges are measured in px against the viewport, so a
 * phone held sideways needs the compact numbers even though it clears `md` on
 * width — which `MOBILE_QUERY` alone would miss.
 */
export const COMPACT_QUERY = "(max-width: 767.98px), (max-height: 30rem)";
