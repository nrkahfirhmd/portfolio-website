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

interface Props extends FloatingItemData {
    /** Shared, normalized (-0.5..0.5) cursor position from the page. */
    pointerX: MotionValue<number>;
    pointerY: MotionValue<number>;
    onSelect: () => void;
}

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

/**
 * A collage sticker that drifts with the cursor (depth parallax), bobs on its
 * own idle loop, then straightens, lifts and reveals its hint when engaged.
 * Hover and keyboard focus drive the exact same `active` state, so the item
 * reads identically to mouse and keyboard users.
 */
export default function FloatingItem({
    icon,
    label,
    hint,
    className,
    rotation,
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
                transition={{ ...spring, delay }}
            >
                <motion.button
                    type="button"
                    onClick={onSelect}
                    onHoverStart={() => setActive(true)}
                    onHoverEnd={() => setActive(false)}
                    onFocus={() => setActive(true)}
                    onBlur={() => setActive(false)}
                    whileTap={{ scale: 0.94 }}
                    aria-label={`Open ${label} — ${hint}`}
                    className="
                        group
                        relative
                        cursor-none
                        rounded-sm
                        outline-none
                        focus-visible:ring-4
                        focus-visible:ring-primary
                        focus-visible:ring-offset-4
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
                            active || reduce
                                ? { y: -10, rotate: 0, scale: 1.08 }
                                : { y: [0, -10, 0], rotate: rotation, scale: 1 }
                        }
                        transition={
                            active || reduce
                                ? spring
                                : {
                                      y: {
                                          duration: bob,
                                          repeat: Infinity,
                                          ease: "easeInOut",
                                      },
                                      rotate: spring,
                                      scale: spring,
                                  }
                        }
                        className="
                            transition-[filter] duration-300
                            drop-shadow-[4px_6px_0_var(--tertiary)]
                            group-hover:drop-shadow-[10px_14px_0_var(--primary)]
                            group-focus-visible:drop-shadow-[10px_14px_0_var(--primary)]
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
                            style={{ width, height: "auto" }}
                            className="select-none"
                        />
                    </motion.div>

                    <div className="mt-3 flex flex-col items-center">
                        <span className="relative inline-block">
                            <span
                                className={`text-label font-semibold transition-colors duration-200 ${
                                    active ? "text-primary" : "text-text"
                                }`}
                            >
                                {label}
                            </span>

                            {/* Underline wipes in from the left on engage. */}
                            <motion.span
                                className="absolute -bottom-0.5 left-0 h-0.5 w-full origin-left bg-primary"
                                initial={false}
                                animate={{ scaleX: active ? 1 : 0 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
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
                                        transition={{ duration: 0.2, ease: "easeOut" }}
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
