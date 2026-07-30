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
import { spring, springConfig, transition } from "@/lib/motion";

export default function NotFound() {
    const reduce = useReducedMotion();

    // Normalized cursor position shared with every parallax sticker.
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const smoothX = useSpring(pointerX, springConfig.drift);
    const smoothY = useSpring(pointerY, springConfig.drift);

    function handlePointer(e: React.PointerEvent<HTMLElement>) {
        if (reduce) return;
        pointerX.set(e.clientX / window.innerWidth - 0.5);
        pointerY.set(e.clientY / window.innerHeight - 0.5);
    }

    return (
        <main
            onPointerMove={handlePointer}
            // dvh, not vh: with a mobile browser's toolbar showing, 100vh is
            // taller than what is on screen, and this page has stickers pinned
            // to the bottom edge — they would sit under the toolbar. The safe
            // area keeps them off the home indicator too.
            className="relative flex min-h-dvh flex-col overflow-hidden bg-background pb-[env(safe-area-inset-bottom)]"
        >
            {/* The four-colour band that used to sit here is gone, as on the
                about page: the pattern for this page is a single column with no
                nav clutter, and the band was competing with the numerals. */}

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
            {/* py-24 on a phone: the stickers sit in the corners of this same
                viewport, and the padding is what keeps the copy out of them.
                Sideways there is no 96px to give away — at 320px of height the
                copy and button need nearly all of it — so `short` takes it
                back and the corner placements do the separating instead. */}
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-gutter py-24 text-center short:py-6 roomy:py-0">
                {/* 404 — draggable 4s, cursor-tracking eye 0. Hidden from AT:
                    the "0" is a graphic with no text, so a screen reader would
                    otherwise announce a bare "4 4". The heading below carries
                    the code instead. */}
                <div
                    aria-hidden
                    className="flex select-none items-center justify-center font-heading text-numeral leading-none text-text"
                >
                    <DraggableDigit rotation={-6} delay={0.05}>
                        4
                    </DraggableDigit>

                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ ...spring.bouncy, delay: 0.15 }}
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
                    transition={{ ...transition.rise, delay: 0.4 }}
                    // On a short viewport the stickers are the only thing left in
                    // the margins, so the copy keeps to a narrower column rather
                    // than running out to meet them.
                    className="mt-4 max-w-lg font-heading text-caption tracking-wide text-text short:max-w-sm"
                >
                    <span className="sr-only">404 — </span>
                    This page wandered off the gallery.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...transition.rise, delay: 0.5 }}
                    // text-pretty: centred copy rags on both sides, where a
                    // one-word last line shows badly.
                    className="mt-2 max-w-md text-pretty text-text-muted short:max-w-xs"
                >
                    Drag the digits, poke the stickers — or head back to solid ground.
                </motion.p>

                {/* Single magnetic CTA. The old secondary link read "or explore
                    the work" but pointed at "/" as well — one destination, so
                    one button, which is also what this page's pattern wants. */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...transition.rise, delay: 0.6 }}
                    className="mt-7 flex justify-center roomy:mt-9"
                >
                    <MagneticButton className="cursor-none">
                        <Link
                            href="/"
                            // Solid ink, no border, lift on hover — the same CTA
                            // as the work and about pages. The old primary wipe
                            // put --background text on --primary: 3.3:1 at best,
                            // 2.0:1 on the red theme.
                            className="group inline-flex items-center gap-2 rounded-full bg-text px-8 py-3.5 font-heading text-nav tracking-wide text-background transition-transform duration-(--duration-fast) hover:-translate-y-0.5"
                        >
                            Back to home
                            <span
                                aria-hidden
                                className="transition-transform duration-(--duration-fast) group-hover:translate-x-1"
                            >
                                →
                            </span>
                        </Link>
                    </MagneticButton>
                </motion.div>
            </div>
        </main>
    );
}
