"use client";

import Image from "next/image";
import {
    motion,
    useTransform,
    useReducedMotion,
    type MotionValue,
} from "framer-motion";

interface Props {
    src: string;
    alt: string;
    size: number;
    /** Tailwind position classes, e.g. "left-[12%] top-[20%]". */
    className: string;
    rotation: number;
    /** Parallax intensity — higher drifts further with the cursor. */
    depth: number;
    /** Shared, normalized (-0.5..0.5) cursor position from the page. */
    pointerX: MotionValue<number>;
    pointerY: MotionValue<number>;
}

/**
 * A draggable image sticker that drifts with the cursor (parallax) and
 * straightens + lifts on hover. Reuses the portfolio's existing art.
 */
export default function ParallaxSticker({
    src,
    alt,
    size,
    className,
    rotation,
    depth,
    pointerX,
    pointerY,
}: Props) {
    const reduce = useReducedMotion();
    const driftX = useTransform(pointerX, (v) => (reduce ? 0 : v * depth));
    const driftY = useTransform(pointerY, (v) => (reduce ? 0 : v * depth));

    return (
        <motion.div
            className={`absolute ${className}`}
            style={{ x: driftX, y: driftY }}
        >
            <motion.div
                drag={!reduce}
                dragElastic={0.4}
                dragTransition={{ bounceStiffness: 260, bounceDamping: 16 }}
                initial={{ opacity: 0, scale: 0.6, rotate: rotation }}
                animate={{ opacity: 1, scale: 1, rotate: rotation }}
                transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.2 }}
                whileHover={{ rotate: 0, scale: 1.08, zIndex: 30 }}
                whileTap={{ scale: 0.92 }}
                className="cursor-none select-none drop-shadow-[6px_10px_14px_rgba(0,0,0,0.14)]"
            >
                <Image
                    src={src}
                    alt={alt}
                    width={size}
                    height={size}
                    draggable={false}
                    className="pointer-events-none h-auto w-full"
                />
            </motion.div>
        </motion.div>
    );
}
