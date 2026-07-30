"use client";

import { motion, useReducedMotion } from "framer-motion";
import { spring } from "@/lib/motion";
import { useMediaQuery, COMPACT_QUERY } from "@/lib/useMediaQuery";

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
    const compact = useMediaQuery(COMPACT_QUERY);

    return (
        <motion.div
            drag={!reduce}
            // 220px of sideways travel is over half a phone's width: a digit
            // dropped at the limit half-hangs off the screen and stays there.
            // Tighter bounds keep the numeral legible wherever it is let go.
            dragConstraints={
                compact
                    ? { left: -70, right: 70, top: -90, bottom: 90 }
                    : { left: -220, right: 220, top: -160, bottom: 160 }
            }
            dragElastic={0.5}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 14 }}
            whileDrag={{ cursor: "grabbing" }}
            className="cursor-none"
        >
            <motion.span
                initial={{ y: -120, opacity: 0, rotate: rotation * 2 }}
                animate={{ y: 0, opacity: 1, rotate: rotation }}
                transition={{ ...spring.bouncy, delay }}
                whileHover={{ rotate: 0, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block select-none"
            >
                {children}
            </motion.span>
        </motion.div>
    );
}
