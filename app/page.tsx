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
import RailToggle from "@/components/RailToggle";
import SidebarMenu from "@/components/SidebarMenu";
import { navItems } from "@/lib/nav";
import { MOBILE_QUERY, useMediaQuery } from "@/lib/useMediaQuery";

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
    const [railHidden, setRailHidden] = useState(false);
    const reduce = useReducedMotion();

    // Below `md` there is no room for a 220px rail beside the content, so the
    // sidebar changes shape rather than shrinking: it becomes a bar across the
    // top with the nav folded behind a hamburger.
    const isMobile = useMediaQuery(MOBILE_QUERY);
    // The shell wears its rail form whenever a section is open on desktop —
    // including while it is folded away, so the collage never flashes back in
    // behind the content on the way out.
    const railMode = selected !== null && !isMobile;
    const railOpen = railMode && !railHidden;

    // Normalized cursor position, shared with every parallax layer on the stage.
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const smoothX = useSpring(pointerX, { stiffness: 90, damping: 20 });
    const smoothY = useSpring(pointerY, { stiffness: 90, damping: 20 });

    const handleSelect = useCallback((label: string) => {
        setSelected((prev) => (prev === label ? null : label));
    }, []);

    const toggleRail = useCallback(() => setRailHidden((v) => !v), []);

    // Leaving the section takes the rail with it, so the next section always
    // opens with the nav in view rather than inheriting a stale folded state.
    useEffect(() => {
        if (!selected) setRailHidden(false);
    }, [selected]);

    // ⌘/Ctrl+B, the shortcut every editor already trained people on.
    useEffect(() => {
        if (!railMode) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() !== "b" || !(e.metaKey || e.ctrlKey)) return;
            e.preventDefault();
            toggleRail();
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [railMode, toggleRail]);

    // Escape returns to the collage — the only way back once the sidebar is
    // open. On mobile the bar owns Escape (it closes the panel first), and the
    // way back is tapping the active section.
    useEffect(() => {
        if (!selected || isMobile) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelected(null);
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [selected, isMobile]);

    function handlePointer(e: React.PointerEvent<HTMLElement>) {
        if (reduce || selected) return;
        // Touch and pen emit pointermove too, but a finger is a press, not a
        // hover: driving the parallax from it makes the collage lurch out from
        // under the very item being tapped. Depth is a mouse affordance.
        if (e.pointerType !== "mouse") return;

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
            // How much of the left edge the rail is currently claiming. The
            // content rail clears it with a margin, but anything `fixed` inside
            // the panel is out of flow and has to read the offset itself —
            // ProjectArticle's overlay is the one that does.
            style={
                {
                    "--rail-offset": railOpen ? "var(--spacing-sidebar)" : "0px",
                } as React.CSSProperties
            }
            // dvh, not vh: mobile browsers resolve vh against the viewport with
            // the toolbars retracted, which parks the footer behind them.
            className="relative min-h-dvh overflow-hidden bg-background"
        >
            {/* Shell: full-bleed collage, then collapses into the sidebar rail.
                `w-full` is a load-bearing baseline, not decoration — this element
                is fixed-position, so without a declared width it shrink-wraps to
                its content until Motion writes its first inline style.

                On mobile there is no rail to morph into, so the shell steps
                aside entirely and the top bar takes over. */}
            <AnimatePresence>
                {!(isMobile && selected) && (
                    <motion.div
                        key="shell"
                        id="sidebar-rail"
                        // Folded away, the rail is still in the tree at zero
                        // width — `inert` keeps its links out of the tab order
                        // and off the accessibility tree while it is invisible.
                        inert={railHidden}
                        initial={{ width: "100%", borderRightColor: "rgba(0, 0, 0, 0)" }}
                        animate={{
                            width: railMode
                                ? railHidden
                                    ? "0px"
                                    : "var(--spacing-sidebar)"
                                : "100%",
                            // Fully transparent black, not `transparent` — Motion can
                            // interpolate the former but treats the keyword as non-animatable.
                            borderRightColor: railOpen
                                ? "var(--color-border)"
                                : "rgba(0, 0, 0, 0)",
                        }}
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        transition={shellTransition}
                        className="fixed left-0 top-0 z-40 h-dvh w-full overflow-hidden border-r bg-background"
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
                                {railMode ? (
                                    <motion.div
                                        key="sidebar"
                                        {...layer}
                                        transition={{ duration: 0.35, delay: 0.25 }}
                                        // Fixed rail width rather than `inset-0`: the
                                        // shell animates its own width, and content
                                        // sized off it would reflow every frame of the
                                        // morph instead of being clipped by it.
                                        className="absolute inset-y-0 left-0 flex w-sidebar items-center justify-start"
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
                )}
            </AnimatePresence>

            {/* Desktop: the handle that folds the rail away and brings it back.
                Mobile has no rail to fold — the bar's hamburger is its answer. */}
            {railMode && (
                <RailToggle
                    open={!railHidden}
                    onToggle={toggleRail}
                    transition={shellTransition}
                />
            )}

            {/* Mobile: the sidebar as a fixed bar, nav folded behind a hamburger. */}
            {isMobile && selected && (
                <SidebarMenu
                    variant="bar"
                    items={navItems}
                    selected={selected}
                    onSelect={handleSelect}
                />
            )}

            {/* Content rail. Keyed on `selected` so each section re-animates in.
                It clears the rail with a margin on desktop and the fixed bar
                with padding on mobile — padding, because a fixed bar is out of
                flow and would otherwise sit on top of the first section. */}
            <motion.div
                animate={{ marginLeft: railOpen ? "var(--spacing-sidebar)" : 0 }}
                transition={shellTransition}
                className={`min-h-dvh ${
                    isMobile && selected
                        ? "pt-[calc(var(--spacing-topbar)_+_env(safe-area-inset-top))]"
                        : ""
                }`}
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
                            <ContentPanel label={selected} onNavigate={setSelected} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </main>
    );
}
