"use client";

import { motion, useReducedMotion } from "framer-motion";
import { duration, easeEntrance } from "@/lib/motion";

interface Props {
    /** `true` while the rail is on screen — the button then offers to hide it. */
    open: boolean;
    onToggle: () => void;
    /** Matches the shell's morph, so the button rides the rail's edge. */
    transition: { duration: number; ease: readonly [number, number, number, number] };
}

/**
 * The rail's own handle: a hairline tab pinned to its trailing edge.
 *
 * It travels with the edge rather than living inside the rail, because the rail
 * collapses to nothing — a control parked in there would collapse with it and
 * leave no way back.
 */
export default function RailToggle({ open, onToggle, transition }: Props) {
    const reduce = useReducedMotion();

    return (
        <motion.button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls="sidebar-rail"
            aria-label={open ? "Hide sidebar" : "Show sidebar"}
            title={`${open ? "Hide" : "Show"} sidebar (⌘B)`}
            initial={false}
            animate={{ left: open ? "var(--spacing-sidebar)" : 0 }}
            transition={reduce ? { duration: 0 } : transition}
            className="fixed top-8 z-50 flex h-9 w-6 cursor-pointer items-center justify-center rounded-r-panel border border-l-0 border-border bg-background text-text-muted transition-colors hover:text-text"
        >
            {/* One chevron, flipped — the same mark means "fold away" and
                "bring back" depending on which side the rail is on. */}
            <motion.svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                initial={false}
                animate={{ rotate: open ? 0 : 180 }}
                transition={
                    reduce ? { duration: 0 } : { duration: duration.fast, ease: easeEntrance }
                }
            >
                <path d="M15 6 9 12l6 6" />
            </motion.svg>
        </motion.button>
    );
}
