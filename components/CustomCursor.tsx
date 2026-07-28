"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function CustomCursor() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, {
        stiffness: 500,
        damping: 35,
    });

    const springY = useSpring(y, {
        stiffness: 500,
        damping: 35,
    });

    useEffect(() => {
        const move = (e: PointerEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };

        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
    }, [x, y]);

    return (
        <motion.div
            className="
                cursor-dot
                pointer-events-none
                fixed
                left-0
                top-0
                z-[9999]
                h-4
                w-4
                rounded-full
                bg-white
                mix-blend-difference
                -translate-x-1/2
                -translate-y-1/2
            "
            style={{
                x: springX,
                y: springY,
            }}
        />
    );
}