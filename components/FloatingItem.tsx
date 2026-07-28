"use client";

import Image from "next/image";
import { useState } from "react";
import {
    AnimatePresence,
    motion,
    useReducedMotion,
    useTransform,
    type MotionValue,
} from "framer-motion";
import type { FloatingItemData } from "@/lib/home";
import { spring, transition } from "@/lib/motion";

interface Props extends FloatingItemData {
    /** Shared, normalized (-0.5..0.5) cursor position from the page. */
    pointerX: MotionValue<number>;
    pointerY: MotionValue<number>;
    onSelect: () => void;
}

/** Idle bob travel and engaged lift, in px. Small on purpose — three of these
 *  loop at once, and the collage should read as still until you reach for it. */
const BOB_TRAVEL = 6;
const LIFT = 6;

/**
 * A collage item that drifts with the cursor (depth parallax), bobs on its own
 * idle loop, then lifts and reveals its hint when engaged. Hover and keyboard
 * focus drive the exact same `active` state, so the item reads identically to
 * mouse and keyboard users.
 */
export default function FloatingItem({
    icon,
    label,
    hint,
    className,
    widthClassName,
    width,
    depth,
    delay,
    bob,
    pointerX,
    pointerY,
    onSelect,
}: Props) {
    const reduce = useReducedMotion();
    const [active, setActive] = useState(false);

    const driftX = useTransform(pointerX, (v) => (reduce ? 0 : v * depth));
    const driftY = useTransform(pointerY, (v) => (reduce ? 0 : v * depth * 0.6));

    return (
        <motion.div
            className={`absolute ${className}`}
            style={{ x: driftX, y: driftY }}
        >
            {/* Entrance owns y/scale so it never fights the idle bob below. */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...spring.lift, delay }}
            >
                <motion.button
                    type="button"
                    onClick={onSelect}
                    onHoverStart={() => setActive(true)}
                    onHoverEnd={() => setActive(false)}
                    onFocus={() => setActive(true)}
                    onBlur={() => setActive(false)}
                    whileTap={{ scale: 0.97 }}
                    aria-label={`Open ${label} — ${hint}`}
                    className="
                        group
                        relative
                        cursor-none
                        rounded-inline
                        outline-none
                        focus-visible:ring-2
                        focus-visible:ring-text
                        focus-visible:ring-offset-2
                        focus-visible:ring-offset-background
                    "
                >
                    {/* The collage is scaled down hard on narrow screens, which
                        shrinks these stickers below the 44px minimum touch target.
                        This invisible child is sized in inverse-scaled units, so
                        the tap area stays 44px physical at any stage scale. */}
                    <span
                        aria-hidden
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{
                            width: "calc(44px / var(--stage-scale, 1))",
                            height: "calc(44px / var(--stage-scale, 1))",
                        }}
                    />
                    <motion.div
                        animate={
                            // Engaged wins over the idle loop. Under reduced
                            // motion the item simply rests — it is never parked
                            // in the lifted pose it can no longer animate out of.
                            active
                                ? { y: -LIFT, scale: 1.04 }
                                : reduce
                                  ? { y: 0, scale: 1 }
                                  : { y: [0, -BOB_TRAVEL, 0], scale: 1 }
                        }
                        transition={
                            active || reduce
                                ? spring.lift
                                : {
                                      y: {
                                          duration: bob,
                                          repeat: Infinity,
                                          ease: "easeInOut",
                                      },
                                      scale: spring.lift,
                                  }
                        }
                        className="
                            drop-shadow-sticker
                            transition-[filter] duration-(--duration-fast)
                            group-hover:drop-shadow-sticker-hover
                            group-focus-visible:drop-shadow-sticker-hover
                        "
                    >
                        <Image
                            src={icon}
                            alt=""
                            width={width}
                            height={120}
                            sizes={`${width}px`}
                            // Definite width + auto height: the height prop is a
                            // placeholder, so each asset keeps its own aspect ratio.
                            // Width is a class rather than an inline style so it
                            // can carry a breakpoint; `width` stays the intrinsic
                            // hint next/image needs.
                            className={`select-none h-auto ${widthClassName}`}
                        />
                    </motion.div>

                    <div className="mt-3 flex flex-col items-center">
                        <span className="relative inline-block">
                            {/* Muted at rest, full ink when engaged — the same
                                two-step the sidebar nav uses. Accent is left to
                                the rule below, which carries no text contrast
                                requirement of its own. */}
                            <span
                                className={`text-label font-medium transition-colors duration-(--duration-fast) ${
                                    active ? "text-text" : "text-text-muted"
                                }`}
                            >
                                {label}
                            </span>

                            {/* Underline wipes in from the left on engage. */}
                            <motion.span
                                className="absolute -bottom-0.5 left-0 h-0.5 w-full origin-left bg-primary"
                                initial={false}
                                animate={{ scaleX: active ? 1 : 0 }}
                                transition={transition.tick}
                            />
                        </span>

                        {/* Hint is reserved space-free: it sits in an overlay row
                            so revealing it never nudges the collage layout. */}
                        <div className="relative h-0 w-full">
                            <AnimatePresence>
                                {active && (
                                    <motion.span
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={transition.tick}
                                        className="absolute inset-x-0 top-1.5 whitespace-nowrap text-center text-sm text-text-muted"
                                    >
                                        {hint}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
