"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef } from "react";

interface Props {
    children: React.ReactNode;
    /** How far the button chases the cursor (px pull radius). */
    strength?: number;
    className?: string;
    onClick?: () => void;
}

/**
 * Wraps children in a pointer-following "magnetic" element.
 * The button eases toward the cursor while hovered, then springs back on leave.
 * Falls back to a static element when the user prefers reduced motion.
 */
export default function MagneticButton({
    children,
    strength = 0.4,
    className = "",
    onClick,
}: Props) {
    const ref = useRef<HTMLButtonElement>(null);
    const reduce = useReducedMotion();

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
    const springY = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });

    function handleMove(e: React.PointerEvent<HTMLButtonElement>) {
        if (reduce || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        x.set(relX * strength);
        y.set(relY * strength);
    }

    function reset() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.button
            ref={ref}
            onPointerMove={handleMove}
            onPointerLeave={reset}
            onClick={onClick}
            style={{ x: springX, y: springY }}
            whileTap={{ scale: 0.94 }}
            className={className}
        >
            {children}
        </motion.button>
    );
}
