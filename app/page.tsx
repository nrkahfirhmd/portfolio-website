"use client";

import { useCallback, useEffect, useState } from "react";
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from "framer-motion";
import ContentPanel from "@/components/ContentPanel";
import Footer from "@/components/Footer";
import HomeStage from "@/components/HomeStage";
import Navbar from "@/components/Navbar";
import SidebarMenu from "@/components/SidebarMenu";
import { navItems } from "@/lib/nav";

/** Panel morph: slow enough to read as one continuous motion, not a cut. */
const shellTransition = { duration: 0.6, ease: [0.76, 0, 0.24, 1] as const };

/** Layers cross-fade faster than the shell resizes, so nothing overlaps mid-morph. */
const layer = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
};

export default function Home() {
    const [selected, setSelected] = useState<string | null>(null);
    const reduce = useReducedMotion();

    // Normalized cursor position, shared with every parallax layer on the stage.
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const smoothX = useSpring(pointerX, { stiffness: 90, damping: 20 });
    const smoothY = useSpring(pointerY, { stiffness: 90, damping: 20 });

    const handleSelect = useCallback((label: string) => {
        setSelected((prev) => (prev === label ? null : label));
    }, []);

    // Escape returns to the collage — the only way back once the sidebar is open.
    useEffect(() => {
        if (!selected) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelected(null);
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [selected]);

    function handlePointer(e: React.PointerEvent<HTMLElement>) {
        if (reduce || selected) return;

        const { innerWidth: w, innerHeight: h } = window;
        // A zero-sized viewport (offscreen tab, some embedded contexts) would
        // divide to Infinity and permanently corrupt the springs downstream.
        if (!w || !h) return;

        pointerX.set(e.clientX / w - 0.5);
        pointerY.set(e.clientY / h - 0.5);
    }

    return (
        <main
            onPointerMove={handlePointer}
            className="relative min-h-screen overflow-hidden bg-background"
        >
            {/* Shell: full-bleed collage, then collapses into the sidebar rail.
                `w-full` is a load-bearing baseline, not decoration — this element
                is fixed-position, so without a declared width it shrink-wraps to
                its content until Motion writes its first inline style. */}
            <motion.div
                initial={{ width: "100%", borderRightColor: "rgba(0, 0, 0, 0)" }}
                animate={{
                    width: selected ? "var(--spacing-sidebar)" : "100%",
                    // Fully transparent black, not `transparent` — Motion can
                    // interpolate the former but treats the keyword as non-animatable.
                    borderRightColor: selected
                        ? "var(--color-border)"
                        : "rgba(0, 0, 0, 0)",
                }}
                transition={shellTransition}
                className="fixed left-0 top-0 z-40 h-screen w-full overflow-hidden border-r bg-background"
            >
                <AnimatePresence>
                    {!selected && (
                        <motion.div
                            {...layer}
                            transition={{ duration: 0.35, delay: 0.25 }}
                        >
                            <Navbar />
                        </motion.div>
                    )}
                </AnimatePresence>

                <section className="relative h-full">
                    <AnimatePresence mode="wait">
                        {selected ? (
                            <motion.div
                                key="sidebar"
                                {...layer}
                                transition={{ duration: 0.35, delay: 0.25 }}
                                className="absolute inset-0 flex items-center justify-start"
                            >
                                <SidebarMenu
                                    items={navItems}
                                    selected={selected}
                                    onSelect={handleSelect}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="stage"
                                {...layer}
                                transition={{ duration: 0.35, delay: 0.25 }}
                                className="absolute inset-0"
                            >
                                <HomeStage
                                    pointerX={smoothX}
                                    pointerY={smoothY}
                                    onSelect={handleSelect}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                <AnimatePresence>
                    {!selected && (
                        <motion.div
                            {...layer}
                            transition={{ duration: 0.35, delay: 0.25 }}
                        >
                            <Footer />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Content rail. Keyed on `selected` so each section re-animates in. */}
            <motion.div
                animate={{ marginLeft: selected ? "var(--spacing-sidebar)" : 0 }}
                transition={shellTransition}
                className="min-h-screen"
            >
                <AnimatePresence mode="wait">
                    {selected && (
                        <motion.div
                            key={selected}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                        >
                            <ContentPanel label={selected} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </main>
    );
}
