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

/** Bounding box the collage occupies at scale 1, measured from lib/home offsets. */
const DESIGN_WIDTH = 860;
const DESIGN_HEIGHT = 980;

/** Room reserved for the navbar and footer that bracket the stage. */
const CHROME_X = 64;
const CHROME_Y = 150;

/** Floor the scale: a viewport smaller than the chrome would otherwise yield a
 *  negative factor, which mirrors and collapses the whole collage. */
const MIN_SCALE = 0.3;

/**
 * Fits the fixed-size collage to the viewport. The composition is scaled as a
 * whole rather than re-laid out per breakpoint, so its proportions survive
 * every screen without a second set of offsets to keep in sync.
 */
function useStageScale() {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const update = () =>
            setScale(
                Math.max(
                    MIN_SCALE,
                    Math.min(
                        1,
                        (window.innerWidth - CHROME_X) / DESIGN_WIDTH,
                        (window.innerHeight - CHROME_Y) / DESIGN_HEIGHT
                    )
                )
            );

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return scale;
}

interface Props {
    /** Shared, normalized (-0.5..0.5) cursor position from the page. */
    pointerX: MotionValue<number>;
    pointerY: MotionValue<number>;
    onSelect: (label: string) => void;
}

/**
 * The landing collage: avatar centre-stage, sticker shortcuts orbiting it, all
 * drifting against the cursor at different depths. The whole composition is
 * scaled per breakpoint rather than re-positioned, so the collage keeps its
 * proportions from 375px up without four sets of offsets to maintain.
 */
export default function HomeStage({ pointerX, pointerY, onSelect }: Props) {
    const reduce = useReducedMotion();
    const scale = useStageScale();

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
                style={{ scale, "--stage-scale": scale } as React.CSSProperties}
                // translate-x-14: the collage overhangs 352px left of the avatar
                // but only 240px right, so centring the avatar would leave the
                // composition visibly off-centre. Shift by half the difference.
                className="relative z-10 w-[220px] origin-center translate-x-14"
            >
                {/* Intro card — occupies the empty upper-left. Squared off and
                    set on a hairline, so it reads as a caption on the page
                    rather than a sticker pasted onto it. */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring.lift, delay: 0.05 }}
                    className="absolute left-0 top-0 w-64 -translate-x-[22rem] -translate-y-20 border-l border-line-bold bg-transparent pl-5"
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
                            style={{ width: 220, height: "auto" }}
                            className="
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
