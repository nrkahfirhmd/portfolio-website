"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Props {
    children: React.ReactNode;
    /** Resting tilt in degrees. */
    rotation: number;
    delay?: number;
}

/**
 * A big draggable character for the 404 headline.
 *
 * Drag and rotation live on separate elements on purpose: framer-motion's
 * drag sets up layout projection, which mis-measures when the same node also
 * carries a rotate transform (the digit drifts off-center). The outer node
 * only ever translates; the inner node owns rotate/scale.
 */
export default function DraggableDigit({ children, rotation, delay = 0 }: Props) {
    const reduce = useReducedMotion();

    return (
        <motion.div
            drag={!reduce}
            dragConstraints={{ left: -220, right: 220, top: -160, bottom: 160 }}
            dragElastic={0.5}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 14 }}
            whileDrag={{ cursor: "grabbing" }}
            className="cursor-none"
        >
            <motion.span
                initial={{ y: -120, opacity: 0, rotate: rotation * 2 }}
                animate={{ y: 0, opacity: 1, rotate: rotation }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay }}
                whileHover={{ rotate: 0, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block select-none"
            >
                {children}
            </motion.span>
        </motion.div>
    );
}
