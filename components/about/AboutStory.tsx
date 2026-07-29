"use client";

import { useEffect, useRef, useState } from "react";
import {
    animate,
    motion,
    useInView,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
    type Variants,
} from "framer-motion";
import { chapters, intro, outro, skills, stats } from "@/lib/about";
import { useTheme } from "@/components/ThemeProvider";
import { easeEntrance, springConfig, transition } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/*  Motion primitives                                                  */
/* ------------------------------------------------------------------ */

const wordContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.055 } },
};

const wordChild: Variants = {
    hidden: { y: "115%" },
    show: { y: 0, transition: transition.reveal },
};

/** Heading whose words rise from behind a mask when scrolled into view. */
function RevealHeading({
    text,
    className = "",
}: {
    text: string;
    className?: string;
}) {
    const ref = useRef<HTMLHeadingElement>(null);
    const inView = useInView(ref, { once: true, margin: "-12% 0px" });
    const reduce = useReducedMotion();

    return (
        <h2
            ref={ref}
            className={`font-heading uppercase leading-[0.92] tracking-wide ${className}`}
        >
            <motion.span
                variants={reduce ? undefined : wordContainer}
                initial={reduce ? undefined : "hidden"}
                animate={inView || reduce ? "show" : "hidden"}
                className="flex flex-wrap gap-x-[0.28em]"
            >
                {text.split(" ").map((word, i) => (
                    <span key={`${word}-${i}`} className="overflow-hidden pb-[0.08em]">
                        <motion.span
                            variants={reduce ? undefined : wordChild}
                            className="inline-block"
                        >
                            {word}
                        </motion.span>
                    </span>
                ))}
            </motion.span>
        </h2>
    );
}

/** Fades + lifts children up once, when scrolled into view. */
function FadeUp({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-10% 0px" });
    const reduce = useReducedMotion();

    return (
        <motion.div
            ref={ref}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={inView || reduce ? { opacity: 1, y: 0 } : {}}
            transition={{ ...transition.rise, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/** Cursor-attracted wrapper (magnetic effect). */
function Magnetic({
    children,
    strength = 0.35,
    className = "",
}: {
    children: React.ReactNode;
    strength?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, springConfig.image);
    const sy = useSpring(y, springConfig.image);

    function handleMove(e: React.MouseEvent<HTMLDivElement>) {
        if (reduce || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={() => {
                x.set(0);
                y.set(0);
            }}
            style={{ x: sx, y: sy }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/** Counts from 0 → value when scrolled into view. */
function Counter({ to, suffix }: { to: number; suffix: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-15% 0px" });
    const reduce = useReducedMotion();
    const [counted, setCounted] = useState(0);

    // "Things to learn" is deliberately Infinity, which has no count-up to run
    // and would render the literal string "Infinity". Show the glyph instead.
    const unbounded = !Number.isFinite(to);
    const counts = inView && !unbounded && !reduce;

    useEffect(() => {
        if (!counts) return;
        const controls = animate(0, to, {
            duration: 1.6,
            ease: easeEntrance,
            // setState from an animation callback, not from the effect body —
            // the count-up is the external system this effect subscribes to.
            onUpdate: (v) => setCounted(Math.round(v)),
        });
        return () => controls.stop();
    }, [counts, to]);

    // Every case except the running count-up is a pure function of the props.
    const shown = unbounded ? "∞" : reduce ? (inView ? to : 0) : counted;

    return (
        <span ref={ref}>
            {shown}
            {suffix}
        </span>
    );
}

/* ------------------------------------------------------------------ */
/*  Sections                                                           */
/* ------------------------------------------------------------------ */

function Hero() {
    const ref = useRef<HTMLElement>(null);
    const reduce = useReducedMotion();

    // Scroll parallax: the giant kanji drifts and fades as you leave the hero.
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const kanjiY = useTransform(scrollYProgress, [0, 1], [0, -140]);
    const kanjiOpacity = useTransform(scrollYProgress, [0, 0.8], [0.08, 0]);
    const titleY = useTransform(scrollYProgress, [0, 1], [0, 120]);

    // Pointer parallax on the watermark.
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const spx = useSpring(px, springConfig.drift);
    const spy = useSpring(py, springConfig.drift);

    function handleMove(e: React.MouseEvent<HTMLElement>) {
        if (reduce || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        px.set(((e.clientX - rect.left) / rect.width - 0.5) * 60);
        py.set(((e.clientY - rect.top) / rect.height - 0.5) * 60);
    }

    return (
        <section
            ref={ref}
            onMouseMove={handleMove}
            // The mobile panel sits below a fixed top bar, so a full viewport
            // here would push its own height past what is left to fill and add
            // a bar's worth of dead scroll. dvh, not vh, so a retracted browser
            // toolbar doesn't do the same thing again.
            // Centring one small block in a phone viewport spends the leftover
            // height as two equal voids above and below it — space that reads as
            // a mistake rather than a decision. Anchored instead: eyebrow at the
            // top, headline at the bottom, one deliberate column of air between
            // them for the watermark to live in. Desktop keeps the centred
            // composition, which has the width to justify it.
            className="relative flex min-h-[calc(100dvh-var(--spacing-topbar)-env(safe-area-inset-top))] flex-col justify-between overflow-hidden px-gutter pb-28 pt-14 md:min-h-dvh md:justify-center md:py-0"
        >
            {/* Giant kanji watermark. On mobile it sits in the gap between the
                eyebrow and the headline — the space the anchored layout opens
                up — instead of directly behind the words, where it was reading
                as noise across the middle two lines. */}
            <motion.span
                aria-hidden
                style={{ y: reduce ? 0 : kanjiY, opacity: kanjiOpacity, x: spx }}
                // 22%, not less: at 320px the eyebrow runs to three lines and
                // anything higher puts the glyph behind them.
                className="pointer-events-none absolute right-[-10%] top-[22%] translate-y-0 select-none font-heading text-[54vw] leading-none text-text md:right-[-4%] md:top-1/2 md:-translate-y-1/2 md:text-watermark"
            >
                <motion.span style={{ y: spy }} className="inline-block">
                    {intro.kanji}
                </motion.span>
            </motion.span>

            <motion.div style={{ y: reduce ? 0 : titleY }} className="relative z-10">
                <motion.p
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={transition.rise}
                    // 20px all-caps at 0.35em ran to four lines in a phone's
                    // measure — a label that reads as a paragraph. Smaller and
                    // less tracked-out until there is width to spend on it.
                    //
                    // items-start, not items-center: against two lines the mark
                    // floated at the midpoint, attached to neither of them.
                    className="flex items-start gap-3 font-sans text-sm uppercase leading-relaxed tracking-[0.15em] text-text-muted md:mb-8 md:items-center md:text-mark md:tracking-[0.35em]"
                >
                    <span className="mt-1.5 inline-block h-3 w-3 shrink-0 bg-primary md:mt-0" />
                    {intro.role}
                </motion.p>
            </motion.div>

            <motion.div style={{ y: reduce ? 0 : titleY }} className="relative z-10">
                {/* 0.82 is set for one line per tagline entry. On a phone every
                    entry wraps, and at that leading the wrapped lines run into
                    each other — so the mobile value only has to clear its own
                    ascenders.

                    The mobile size tracks the viewport rather than sitting on
                    the 3rem floor: at 48px the last line filled the measure to
                    the pixel on a 390px screen and read as jammed, not
                    full-bleed. Scaling it leaves a rag on the right. */}
                <h1 className="font-heading text-[clamp(2.25rem,11.2vw,3rem)] font-bold uppercase leading-[0.95] tracking-wide text-balance text-text md:text-hero md:leading-[0.82]">
                    {intro.tagline.map((line, i) => (
                        <span key={line} className="block overflow-hidden">
                            <motion.span
                                initial={reduce ? false : { y: "110%" }}
                                animate={{ y: 0 }}
                                transition={{
                                    ...transition.reveal,
                                    delay: 0.15 + i * 0.12,
                                }}
                                // Middle line steps back rather than switching to
                                // the accent: --primary on --background is 3.3:1
                                // at best and 2.0:1 on the red theme, well under
                                // the 4.5:1 this size of text still has to meet.
                                className={`inline-block ${
                                    i === 1 ? "text-text-muted" : ""
                                }`}
                            >
                                {line}
                            </motion.span>
                        </span>
                    ))}
                </h1>
            </motion.div>

            {/* Scroll cue */}
            <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...transition.rise, delay: 1.1 }}
                className="absolute bottom-10 left-gutter z-10 flex items-center gap-3 font-sans text-sm uppercase tracking-[0.3em] text-text-muted"
            >
                <motion.span
                    animate={reduce ? undefined : { y: [0, 8, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block h-8 w-px bg-text"
                />
                {intro.scrollCue}
            </motion.div>
        </section>
    );
}

function Chapters() {
    const railRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: railRef,
        offset: ["start 60%", "end 80%"],
    });
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <div ref={railRef} className="relative">
            {/* Progress rail — the storytelling pattern's progress indicator, and
                the one place the accent still earns its keep on this page. */}
            <div className="pointer-events-none absolute left-gutter top-0 bottom-0 hidden w-px bg-line md:block">
                <motion.div
                    style={{ scaleY }}
                    className="absolute inset-0 origin-top bg-primary"
                />
            </div>

            {chapters.map((ch) => (
                <section
                    key={ch.heading}
                    // Single column has nothing to centre against, so the 60vh
                    // floor only stretches the gap between chapters. Height
                    // comes from the prose, and padding does the separating.
                    className="relative grid grid-cols-1 items-center gap-6 px-gutter py-16 md:min-h-[60vh] md:grid-cols-[1fr_1.1fr] md:gap-10 md:py-0 md:pl-24"
                >
                    {/* Sticky kanji marker */}
                    <div className="md:sticky md:top-[24vh] md:self-start">
                        <FadeUp>
                            {/* Stacked with a 96px void between them, the marker
                                cost most of a phone screen before the chapter
                                even started. Side by side it is one line. */}
                            <div className="flex items-baseline gap-4 md:block">
                                <span className="block font-sans text-label uppercase tracking-[0.35em] text-text-muted md:mb-24">
                                    {ch.kicker}
                                </span>
                                <span
                                    aria-hidden
                                    className="block select-none font-heading text-[3.5rem] leading-none text-text md:text-kanji"
                                >
                                    {ch.kanji}
                                </span>
                            </div>
                        </FadeUp>
                    </div>

                    <div>
                        <RevealHeading
                            text={ch.heading}
                            className="mb-5 text-chapter text-text md:mb-8"
                        />
                        <div className="max-w-prose space-y-5">
                            {ch.body.map((p, j) => (
                                <FadeUp key={j} delay={0.1 + j * 0.08}>
                                    <p className="font-sans text-lg leading-relaxed text-text-muted md:text-xl">
                                        {p}
                                    </p>
                                </FadeUp>
                            ))}
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
}

function SkillsMarquee() {
    const reduce = useReducedMotion();
    const row = [...skills, ...skills];

    return (
        <section className="border-y border-line py-10 md:py-14">
            <FadeUp className="mb-6 px-gutter md:mb-8">
                <p className="font-sans text-label uppercase tracking-[0.35em] text-text-muted">
                    Tools in the den
                </p>
            </FadeUp>

            <div className="flex flex-col gap-4">
                {[0, 1].map((r) => (
                    <div key={r} className="flex overflow-hidden">
                        <div
                            className={`
                                flex
                                w-max
                                shrink-0
                                items-center
                                gap-6
                                pr-6
                                ${reduce ? "" : r === 0 ? "marquee" : "marquee-reverse"}
                            `}
                        >
                            {row.map((skill, i) => (
                                <span
                                    key={`${skill}-${i}`}
                                    className="flex shrink-0 items-center gap-4 font-heading text-chapter uppercase tracking-wide text-text md:gap-6"
                                >
                                    {skill}
                                    {/* Separator, not confetti — muted so the
                                        eye reads the words, not the marks. */}
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-text-subtle" />
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Stats() {
    return (
        <section className="grid grid-cols-2 border-b border-line md:grid-cols-4">
            {stats.map((s, i) => (
                <FadeUp
                    key={s.label}
                    delay={i * 0.08}
                    className={`border-line px-gutter py-10 md:py-16 ${
                        i % 2 === 0 ? "border-r" : ""
                    } ${i !== 3 ? "md:border-r" : "md:border-r-0"} ${
                        i < 2 ? "border-b md:border-b-0" : ""
                    }`}
                >
                    <div className="font-heading text-display leading-none text-text">
                        <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    {/* Two columns inside a phone leave ~123px per label; at
                        16px/0.2em the longest one broke to three lines. */}
                    <p className="mt-3 font-sans text-sm uppercase tracking-[0.12em] text-text-muted md:text-base md:tracking-[0.2em]">
                        {s.label}
                    </p>
                </FadeUp>
            ))}
        </section>
    );
}

/** Playful theme picker — hover to expand, click to change the whole site theme. */
function ThemePlay() {
    const { cycleTheme } = useTheme();
    const swatches = ["bg-primary", "bg-secondary", "bg-tertiary", "bg-quaternary"];

    return (
        <section className="px-gutter py-16 md:py-24">
            <FadeUp className="mb-6">
                <p className="font-sans text-label uppercase tracking-[0.35em] text-text-muted">
                    Pick a mood — the whole cave shifts
                </p>
            </FadeUp>
            <FadeUp>
                <button
                    onClick={cycleTheme}
                    aria-label="Change color theme"
                    className="group flex h-24 w-full overflow-hidden border border-line"
                >
                    {swatches.map((c) => (
                        <motion.span
                            key={c}
                            className={`h-full flex-1 ${c}`}
                            whileHover={{ flex: 2.4 }}
                            // A finger never hovers, so without this the swatches
                            // are inert on touch and the tap has no feedback at
                            // all beyond the theme changing underneath it.
                            whileTap={{ flex: 2.4 }}
                            transition={transition.shuffle}
                        />
                    ))}
                </button>
            </FadeUp>
        </section>
    );
}

function Outro() {
    return (
        <section className="relative flex min-h-[70dvh] flex-col items-center justify-center overflow-hidden px-gutter py-20 text-center md:min-h-[90dvh] md:py-0">
            {/* Centred on the section, this landed square on top of the quote —
                seven lines of body copy with a glyph running through them. It
                sits above the quote instead, where the only thing it shares
                space with is the display-size heading. */}
            <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[3%] -translate-x-1/2 translate-y-0 select-none font-heading text-watermark leading-none text-text/[0.06] md:top-1/2 md:-translate-y-1/2"
            >
                {outro.kanji}
            </span>

            <div className="relative z-10 flex flex-col items-center">
                <RevealHeading
                    text={outro.heading}
                    className="mb-6 text-hero text-text md:mb-8"
                />
                <FadeUp>
                    {/* max-w-prose, not max-w-4xl: at 56rem this quote ran past
                        100 characters a line. */}
                    {/* text-pretty, because centred text rags on both sides and
                        a one-word last line shows badly there. */}
                    <p className="mb-4 max-w-prose font-sans text-lg leading-relaxed text-pretty text-text-muted md:text-xl">
                        {outro.body}
                    </p>
                    <p className="mb-10 font-sans text-lg font-medium text-text-muted md:mb-12 md:text-xl">
                        {outro.quoter}
                    </p>
                </FadeUp>

                <FadeUp>
                    <Magnetic>
                        <a
                            href="mailto:nurkahfirahmada@gmail.com"
                            // Same solid-ink pill as the "All projects" button on
                            // the work page, scaled up for the closing CTA.
                            className="inline-flex items-center gap-3 rounded-full bg-text px-8 py-4 font-heading text-xl uppercase tracking-wide text-background transition-transform duration-(--duration-fast) hover:-translate-y-0.5 md:gap-4 md:px-10 md:py-5 md:text-2xl"
                        >
                            {outro.cta}
                            <span aria-hidden>→</span>
                        </a>
                    </Magnetic>
                </FadeUp>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */
export default function AboutStory() {
    return (
        <div className="relative pb-[env(safe-area-inset-bottom)]">
            {/* The four-colour bar that used to sit here is gone: it was the
                loudest thing on the page, and the ContentPanel language it
                claimed to match no longer has one. The theme is still shown —
                and changed — by the ThemePlay swatches further down. */}
            <Hero />
            <Chapters />
            <SkillsMarquee />
            <Stats />
            <ThemePlay />
            <Outro />
        </div>
    );
}
