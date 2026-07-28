"use client";

import { useEffect, useState } from "react";
import {
    motion,
    useTransform,
    useReducedMotion,
    type MotionValue,
} from "framer-motion";
import { recolorSvg } from "@/helper/recolorSvg";
import type { StickerItem } from "@/lib/notFound";
import { spring } from "@/lib/motion";

interface Props extends StickerItem {
    /** Shared, normalized (-0.5..0.5) cursor position from the page. */
    pointerX: MotionValue<number>;
    pointerY: MotionValue<number>;
}

/**
 * A draggable SVG sticker that drifts with the cursor (parallax) and
 * straightens + lifts on hover. Its fills are rewritten to theme CSS
 * variables, so it recolors with the active theme.
 */
export default function ParallaxSticker({
    src,
    alt,
    size,
    className,
    rotation,
    depth,
    colors,
    pointerX,
    pointerY,
}: Props) {
    const reduce = useReducedMotion();
    const [svg, setSvg] = useState("");

    const driftX = useTransform(pointerX, (v) => (reduce ? 0 : v * depth));
    const driftY = useTransform(pointerY, (v) => (reduce ? 0 : v * depth));

    useEffect(() => {
        let active = true;

        fetch(src)
            .then((r) => r.text())
            .then((raw) => {
                if (active) setSvg(recolorSvg(raw, colors));
            })
            .catch(() => {});

        return () => {
            active = false;
        };
    }, [src, colors]);

    return (
        <motion.div
            className={`absolute ${className}`}
            style={{ x: driftX, y: driftY }}
        >
            {/* Drag lives on its own node: framer-motion's drag projection
                mis-measures when the same element also carries a rotate. */}
            <motion.div
                drag={!reduce}
                dragElastic={0.4}
                dragTransition={{ bounceStiffness: 260, bounceDamping: 16 }}
                whileDrag={{ cursor: "grabbing", zIndex: 30 }}
                style={{ width: size }}
                className="cursor-none"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.6, rotate: rotation }}
                    animate={{ opacity: svg ? 1 : 0, scale: 1, rotate: rotation }}
                    transition={{ ...spring.bouncy, delay: 0.2 }}
                    whileHover={{ rotate: 0, scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    role="img"
                    aria-label={alt}
                    // Same offset shadow as the home stage's floating items —
                    // stickers get the sticker shadow, wherever they appear.
                    className="aspect-square select-none drop-shadow-sticker [&>svg]:h-full [&>svg]:w-full"
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
            </motion.div>
        </motion.div>
    );
}
