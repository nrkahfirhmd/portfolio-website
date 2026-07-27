import type { SpringOptions, Transition } from "framer-motion";

/**
 * Motion tokens — the Framer Motion half of the design language.
 *
 * These mirror the `--ease-*` and `--duration-*` variables in app/globals.css
 * (seconds here, milliseconds there). Framer can't read CSS variables for
 * timing, so the two sides are kept in sync by hand — change both together.
 */

/** Signature entrance curve. Everything that arrives on screen uses this. */
export const easeEntrance = [0.22, 1, 0.36, 1] as const;

/** Seconds. Mirrors --duration-* in globals.css. */
export const duration = {
    fast: 0.2,
    base: 0.35,
    mid: 0.5,
    slow: 0.65,
    hero: 0.7,
} as const;

/**
 * Springs, named by what they carry rather than by their numbers.
 * `rail` covers every small indicator that snaps into place (TOC bar, filter
 * pill); `nudge` is the looser one used for hover arrows.
 *
 * Raw configs, for `useSpring`.
 */
export const springConfig = {
    rail: { stiffness: 400, damping: 33 },
    nudge: { stiffness: 400, damping: 20 },
    lift: { stiffness: 300, damping: 26 },
    image: { stiffness: 200, damping: 22 },
    pointer: { stiffness: 150, damping: 18 },
    /** Slow, wide travel — watermarks and other far-background parallax. */
    drift: { stiffness: 60, damping: 18 },
} satisfies Record<string, SpringOptions>;

/** The same springs as `transition` props. */
export const spring = {
    rail: { type: "spring", ...springConfig.rail },
    nudge: { type: "spring", ...springConfig.nudge },
    lift: { type: "spring", ...springConfig.lift },
    image: { type: "spring", ...springConfig.image },
    pointer: { type: "spring", ...springConfig.pointer },
    drift: { type: "spring", ...springConfig.drift },
} satisfies Record<string, Transition>;

/** Entrance transitions, composed from the tokens above. */
export const transition = {
    /** Panel and overlay swaps. */
    panel: { duration: 0.4, ease: easeEntrance },
    /** Text and blocks fading up into view. */
    rise: { duration: duration.mid, ease: "easeOut" },
    /** Big type masking up from behind an overflow-hidden edge. */
    reveal: { duration: duration.hero, ease: easeEntrance },
    /** Cards entering the grid. */
    card: { duration: duration.slow, ease: easeEntrance },
    /** Layout shuffles when the grid is filtered. */
    shuffle: { duration: duration.base, ease: "easeInOut" },
    /** Counter ticks and other micro swaps. */
    tick: { duration: duration.fast },
} satisfies Record<string, Transition>;

/** Fade-and-rise entrance, the default for supporting copy. */
export const riseIn = (y = 12) => ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
});
