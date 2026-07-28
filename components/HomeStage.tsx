"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
    motion,
    useReducedMotion,
    useTransform,
    type MotionValue,
} from "framer-motion";
import FloatingItem from "@/components/FloatingItem";
import { floatingItems, intro } from "@/lib/home";
import { spring } from "@/lib/motion";

/**
 * Bounding box each arrangement occupies at scale 1, plus the room its chrome
 * (navbar and footer) needs, measured from the offsets in lib/home.
 *
 * There are two because one is not enough: the wide collage is 860px across but
 * only 980 tall, so on a portrait phone it is width-bound and scales to ~0.36 —
 * legible type collapses to 6px while two thirds of the viewport height sits
 * empty. The portrait box is the same pieces restacked into a 340×550 column,
 * which fits a phone at or near scale 1.
 */
/**
 * `offsetX`/`offsetY` re-centre the composition on the avatar, which is the only
 * in-flow child and therefore the only thing the flex parent knows how to
 * centre. Each is half the difference between the overhang on opposing sides:
 * the wide collage reaches 352px left of the avatar but 240px right, and both
 * hang the intro card above it — 80px wide, 100px portrait — with nothing below.
 */
const DESIGN = {
    portrait: { width: 390, height: 555, chromeX: 32, chromeY: 140, offsetX: -14, offsetY: 50 },
    wide: { width: 860, height: 980, chromeX: 64, chromeY: 150, offsetX: 56, offsetY: 40 },
};

/** Must match the `md:` layer in the collage's offsets — they switch together. */
const WIDE_QUERY = "(min-width: 768px)";

/** Floor the scale: a viewport smaller than the chrome would otherwise yield a
 *  negative factor, which mirrors and collapses the whole collage. */
const MIN_SCALE = 0.3;

/**
 * Fits the active arrangement to the viewport. Within a breakpoint the
 * composition is scaled as a whole rather than re-laid out, so its proportions
 * survive every screen size on only two sets of offsets.
 */
function useStageScale() {
    const [fit, setFit] = useState({ scale: 1, box: DESIGN.wide });

    useEffect(() => {
        const wide = window.matchMedia(WIDE_QUERY);

        const update = () => {
            const box = wide.matches ? DESIGN.wide : DESIGN.portrait;
            const scale = Math.max(
                MIN_SCALE,
                Math.min(
                    1,
                    (window.innerWidth - box.chromeX) / box.width,
                    // innerHeight, not 100vh: on mobile Safari it excludes the
                    // retracted toolbars, so the collage is measured against
                    // the height actually on screen and never sits under them.
                    (window.innerHeight - box.chromeY) / box.height
                )
            );

            setFit((prev) =>
                prev.scale === scale && prev.box === box ? prev : { scale, box }
            );
        };

        update();
        window.addEventListener("resize", update);
        window.addEventListener("orientationchange", update);
        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("orientationchange", update);
        };
    }, []);

    return fit;
}

interface Props {
    /** Shared, normalized (-0.5..0.5) cursor position from the page. */
    pointerX: MotionValue<number>;
    pointerY: MotionValue<number>;
    onSelect: (label: string) => void;
}

/**
 * The landing collage: avatar centre-stage, sticker shortcuts orbiting it, all
 * drifting against the cursor at different depths. Two arrangements — a wide
 * one and a portrait one that stacks the same pieces into a column — each
 * scaled as a whole, so the collage keeps its proportions from 320px up.
 */
export default function HomeStage({ pointerX, pointerY, onSelect }: Props) {
    const reduce = useReducedMotion();
    const { scale, box } = useStageScale();

    // Avatar sits deepest, so it moves least — sells the layering.
    const avatarX = useTransform(pointerX, (v) => (reduce ? 0 : v * 18));
    const avatarY = useTransform(pointerY, (v) => (reduce ? 0 : v * 12));

    // Background wash drifts opposite the cursor for counter-parallax.
    const washX = useTransform(pointerX, (v) => (reduce ? 0 : v * -60));
    const washY = useTransform(pointerY, (v) => (reduce ? 0 : v * -40));

    return (
        <div className="relative flex h-full items-center justify-center overflow-hidden">
            {/* Ambient theme wash — pure decoration, hidden from AT. A single
                soft field behind the avatar: enough to show the theme has
                changed, not enough to read as a shape of its own. */}
            <motion.div
                aria-hidden
                style={{ x: washX, y: washY }}
                className="pointer-events-none absolute inset-0 -z-0"
            >
                <div className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-quaternary/30 blur-3xl" />
            </motion.div>

            {/* One transform-origin for the entire collage. */}
            {/* Explicit width, not `w-fit`: the avatar is the only in-flow child,
                so fit-content would resolve circularly against the image's
                `max-width: 100%` and collapse the whole collage to zero. */}
            <div
                // --stage-scale lets descendants size a hit area in physical px
                // despite living inside this scaled subtree.
                style={
                    {
                        scale,
                        "--stage-scale": scale,
                        // Multiplied by `scale` by hand: `translate` and `scale`
                        // are separate CSS properties and translate resolves
                        // first, so an offset left in design units would stay a
                        // flat pixel count while the collage it re-centres shrank
                        // around it.
                        translate: `${box.offsetX * scale}px ${box.offsetY * scale}px`,
                    } as React.CSSProperties
                }
                className="relative z-10 w-[140px] origin-center md:w-[220px]"
            >
                {/* Intro card — occupies the empty upper-left of the wide
                    collage, and sits directly above the avatar in the portrait
                    one, where there is no left margin to occupy. Squared off and
                    set on a hairline, so it reads as a caption on the page
                    rather than a sticker pasted onto it. */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring.lift, delay: 0.05 }}
                    className="absolute -left-[110px] top-0 w-[260px] -translate-y-[100px] border-l border-line-bold bg-transparent pl-5 md:left-0 md:w-64 md:-translate-x-[22rem] md:-translate-y-20"
                >
                    <p className="whitespace-pre-line font-heading text-caption leading-tight tracking-wide text-text">
                        {intro.role}
                    </p>
                    <p className="mt-2 text-sm text-text-muted">{intro.hint}</p>
                </motion.div>

                {floatingItems.map((item) => (
                    <FloatingItem
                        key={item.label}
                        {...item}
                        pointerX={pointerX}
                        pointerY={pointerY}
                        onSelect={() => onSelect(item.label)}
                    />
                ))}

                <motion.div
                    style={{ x: avatarX, y: avatarY }}
                    initial={{ opacity: 0, y: 60, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={spring.image}
                >
                    <motion.button
                        type="button"
                        onClick={() => onSelect("Index")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        aria-label="About Me — read my story"
                        className="
                            group
                            relative
                            block
                            cursor-none
                            rounded-inline
                            outline-none
                            focus-visible:ring-2
                            focus-visible:ring-text
                            focus-visible:ring-offset-2
                            focus-visible:ring-offset-background
                        "
                    >
                        <Image
                            src="/home/avatar.png"
                            alt="Illustration of Kahfi"
                            width={220}
                            height={650}
                            sizes="220px"
                            loading="eager"
                            fetchPriority="high"
                            // Definite width + auto height keeps the aspect ratio and
                            // satisfies next/image's one-dimension-modified warning.
                            // w-full defers that width to the stage container,
                            // which is the one place the breakpoint is declared.
                            className="
                                h-auto
                                w-full
                                select-none
                                drop-shadow-lift
                                transition-[filter] duration-(--duration-fast)
                                group-hover:drop-shadow-lift-hover
                                group-focus-visible:drop-shadow-lift-hover
                            "
                        />

                        <span className="mt-3 flex justify-center">
                            <span className="relative inline-block">
                                <span className="text-label font-medium text-text-muted transition-colors duration-(--duration-fast) group-hover:text-text group-focus-visible:text-text">
                                    About Me
                                </span>
                                <span className="absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-(--duration-fast) ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                            </span>
                        </span>
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}
