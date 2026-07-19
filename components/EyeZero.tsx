"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * The "0" of the 404, rendered as an eye whose pupil tracks the cursor.
 * Sits between two draggable "4" digits in the not-found view.
 */
export default function EyeZero() {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();

    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const pupilX = useSpring(px, { stiffness: 300, damping: 20 });
    const pupilY = useSpring(py, { stiffness: 300, damping: 20 });

    useEffect(() => {
        if (reduce) return;

        const move = (e: PointerEvent) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
            // Clamp pupil travel to a ring inside the eye white.
            const radius = Math.min(
                rect.width * 0.16,
                Math.hypot(e.clientX - cx, e.clientY - cy)
            );
            px.set(Math.cos(angle) * radius);
            py.set(Math.sin(angle) * radius);
        };

        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
    }, [px, py, reduce]);

    return (
        <div
            ref={ref}
            className="relative aspect-square h-[0.82em] rounded-full bg-primary shadow-[8px_8px_0_rgba(0,0,0,0.12)]"
        >
            {/* Eye white */}
            <div className="absolute inset-[16%] rounded-full bg-surface">
                {/* Pupil */}
                <motion.div
                    style={{ x: pupilX, y: pupilY }}
                    className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-text"
                >
                    <span className="absolute right-[18%] top-[18%] h-[26%] w-[26%] rounded-full bg-surface" />
                </motion.div>
            </div>
        </div>
    );
}
