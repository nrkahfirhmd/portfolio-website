"use client";

import Link from "next/link";
import {
    motion,
    useMotionValue,
    useSpring,
    useReducedMotion,
} from "framer-motion";
import DraggableDigit from "@/components/DraggableDigit";
import EyeZero from "@/components/EyeZero";
import MagneticButton from "@/components/MagneticButton";
import ParallaxSticker from "@/components/ParallaxSticker";
import { stickers } from "@/lib/notFound";

const digitSpring = { type: "spring" as const, stiffness: 260, damping: 18 };

export default function NotFound() {
    const reduce = useReducedMotion();

    // Normalized cursor position shared with every parallax sticker.
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const smoothX = useSpring(pointerX, { stiffness: 90, damping: 20 });
    const smoothY = useSpring(pointerY, { stiffness: 90, damping: 20 });

    function handlePointer(e: React.PointerEvent<HTMLElement>) {
        if (reduce) return;
        pointerX.set(e.clientX / window.innerWidth - 0.5);
        pointerY.set(e.clientY / window.innerHeight - 0.5);
    }

    return (
        <main
            onPointerMove={handlePointer}
            className="relative flex min-h-screen flex-col overflow-hidden bg-background"
        >
            {/* Animated 4-color band motif (matches ContentPanel) */}
            <div className="flex shrink-0">
                {["bg-primary", "bg-secondary", "bg-tertiary", "bg-quaternary"].map(
                    (c, i) => (
                        <motion.span
                            key={c}
                            className={`h-3 w-full origin-left ${c}`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 * i, ease: "easeOut" }}
                        />
                    )
                )}
            </div>

            {/* Floating draggable stickers */}
            {stickers.map((s) => (
                <ParallaxSticker
                    key={s.src}
                    {...s}
                    pointerX={smoothX}
                    pointerY={smoothY}
                />
            ))}

            {/* Center stage */}
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-gutter text-center">
                {/* 404 — draggable 4s, cursor-tracking eye 0 */}
                <div className="flex select-none items-center justify-center font-heading leading-none text-[clamp(6rem,24vw,17rem)] text-text">
                    <DraggableDigit rotation={-6} delay={0.05}>
                        4
                    </DraggableDigit>

                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ ...digitSpring, delay: 0.15 }}
                        className="mx-[0.04em]"
                    >
                        <EyeZero />
                    </motion.div>

                    <DraggableDigit rotation={6} delay={0.25}>
                        4
                    </DraggableDigit>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-4 max-w-lg font-heading text-caption tracking-wide text-text"
                >
                    This page wandered off the gallery.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-2 max-w-md text-text-muted"
                >
                    Drag the digits, poke the stickers — or head back to solid ground.
                </motion.p>

                {/* Magnetic CTA + secondary link */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
                >
                    <MagneticButton className="cursor-none">
                        <Link
                            href="/"
                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-border bg-text px-8 py-3.5 font-heading text-nav tracking-wide text-background"
                        >
                            <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-300 ease-out group-hover:translate-x-0" />
                            <span className="relative">Back to home</span>
                            <span className="relative transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </Link>
                    </MagneticButton>

                    <Link
                        href="/"
                        className="cursor-none text-label text-text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
                    >
                        or explore the work
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
