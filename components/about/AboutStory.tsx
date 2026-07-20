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

/* ------------------------------------------------------------------ */
/*  Motion primitives                                                  */
/* ------------------------------------------------------------------ */

const EASE = [0.16, 1, 0.3, 1] as const;

const wordContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.055 } },
};

const wordChild: Variants = {
    hidden: { y: "115%" },
    show: { y: 0, transition: { duration: 0.75, ease: EASE } },
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
            transition={{ duration: 0.7, ease: EASE, delay }}
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
    const sx = useSpring(x, { stiffness: 200, damping: 14 });
    const sy = useSpring(y, { stiffness: 200, damping: 14 });

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
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return;
        if (reduce) {
            setDisplay(to);
            return;
        }
        const controls = animate(0, to, {
            duration: 1.6,
            ease: EASE,
            onUpdate: (v) => setDisplay(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, to, reduce]);

    return (
        <span ref={ref}>
            {display}
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
    const spx = useSpring(px, { stiffness: 60, damping: 18 });
    const spy = useSpring(py, { stiffness: 60, damping: 18 });

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
            className="relative flex min-h-screen flex-col justify-center overflow-hidden px-gutter"
        >
            {/* Giant kanji watermark */}
            <motion.span
                aria-hidden
                style={{ y: reduce ? 0 : kanjiY, opacity: kanjiOpacity, x: spx }}
                className="pointer-events-none absolute right-[-4%] top-1/2 -translate-y-1/2 select-none font-heading text-[42vw] leading-none text-text"
            >
                <motion.span style={{ y: spy }} className="inline-block">
                    {intro.kanji}
                </motion.span>
            </motion.span>

            <motion.div style={{ y: reduce ? 0 : titleY }} className="relative z-10">
                <motion.p
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="mb-8 flex items-center gap-3 font-sans text-mark uppercase tracking-[0.35em] text-text-muted"
                >
                    <span className="inline-block h-3 w-3 bg-primary" />
                    {intro.role}
                </motion.p>

                <h1 className="font-heading text-[clamp(3rem,11vw,10rem)] font-bold uppercase leading-[0.82] tracking-wide text-text">
                    {intro.tagline.map((line, i) => (
                        <span key={line} className="block overflow-hidden">
                            <motion.span
                                initial={reduce ? false : { y: "110%" }}
                                animate={{ y: 0 }}
                                transition={{
                                    duration: 0.9,
                                    ease: EASE,
                                    delay: 0.15 + i * 0.12,
                                }}
                                className={`inline-block ${
                                    i === 1 ? "text-primary" : ""
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
                transition={{ delay: 1.1, duration: 0.8 }}
                className="absolute bottom-10 left-gutter z-10 flex items-center gap-3 font-sans text-sm uppercase tracking-[0.3em] text-text-muted"
            >
                <motion.span
                    animate={reduce ? undefined : { y: [0, 8, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block h-8 w-[2px] bg-text"
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
            {/* Progress rail */}
            <div className="pointer-events-none absolute left-gutter top-0 bottom-0 hidden w-[2px] bg-border/15 md:block">
                <motion.div
                    style={{ scaleY }}
                    className="absolute inset-0 origin-top bg-primary"
                />
            </div>

            {chapters.map((ch, i) => (
                <section
                    key={ch.heading}
                    className="relative grid min-h-[60vh] grid-cols-1 items-center gap-10 px-gutter md:grid-cols-[1fr_1.1fr] md:pl-24"
                >
                    {/* Sticky kanji marker */}
                    <div className="md:sticky md:top-[24vh] md:self-start">
                        <FadeUp>
                            <span className="mb-24 block font-sans text-label uppercase tracking-[0.35em] text-primary">
                                {ch.kicker}
                            </span>
                            <span
                                aria-hidden
                                className="block select-none font-heading text-[clamp(6rem,16vw,13rem)] leading-none text-text"
                            >
                                {ch.kanji}
                            </span>
                        </FadeUp>
                    </div>

                    <div>
                        <RevealHeading
                            text={ch.heading}
                            className="mb-8 text-[clamp(2rem,5vw,4rem)] text-text"
                        />
                        <div className="max-w-xl space-y-5">
                            {ch.body.map((p, j) => (
                                <FadeUp key={j} delay={0.1 + j * 0.08}>
                                    <p className="font-sans text-xl leading-relaxed text-text-muted">
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
        <section className="border-y-2 border-border py-14">
            <FadeUp className="mb-8 px-gutter">
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
                                    className="flex shrink-0 items-center gap-6 font-heading text-[clamp(1.6rem,3.5vw,3rem)] uppercase tracking-wide text-text"
                                >
                                    {skill}
                                    <span className="inline-block h-3 w-3 rotate-45 bg-primary" />
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
        <section className="grid grid-cols-2 border-b-2 border-border md:grid-cols-4">
            {stats.map((s, i) => (
                <FadeUp
                    key={s.label}
                    delay={i * 0.08}
                    className={`border-border px-gutter py-16 ${
                        i % 2 === 0 ? "border-r-2" : ""
                    } ${i !== 3 ? "md:border-r-2" : "md:border-r-0"} ${
                        i < 2 ? "border-b-2 md:border-b-0" : ""
                    }`}
                >
                    <div className="font-heading text-[clamp(3rem,7vw,6rem)] leading-none text-text">
                        <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <p className="mt-3 font-sans text-base uppercase tracking-[0.2em] text-text-muted">
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
        <section className="px-gutter py-24">
            <FadeUp className="mb-6">
                <p className="font-sans text-label uppercase tracking-[0.35em] text-text-muted">
                    Pick a mood — the whole den shifts
                </p>
            </FadeUp>
            <FadeUp>
                <button
                    onClick={cycleTheme}
                    aria-label="Change color theme"
                    className="group flex h-24 w-full overflow-hidden border-2 border-border"
                >
                    {swatches.map((c) => (
                        <motion.span
                            key={c}
                            className={`h-full flex-1 ${c}`}
                            whileHover={{ flex: 2.4 }}
                            transition={{ duration: 0.35, ease: EASE }}
                        />
                    ))}
                </button>
            </FadeUp>
        </section>
    );
}

function Outro() {
    return (
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-gutter text-center">
            <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-heading text-[38vw] leading-none text-text/[0.06]"
            >
                {outro.kanji}
            </span>

            <div className="relative z-10 flex flex-col items-center">
                <RevealHeading
                    text={outro.heading}
                    className="mb-8 text-[clamp(2.5rem,8vw,7rem)] text-text"
                />
                <FadeUp>
                    <p className="mb-4 max-w-4xl font-sans text-xl leading-relaxed text-text-muted">
                        {outro.body}
                    </p>
                    <p className="mb-12 text-xl font-bold text-text-muted font-sans">
                        {outro.quoter}
                    </p>
                </FadeUp>

                <FadeUp>
                    <Magnetic>
                        <a
                            href="mailto:nurkahfirahmada@gmail.com"
                            className="inline-flex items-center gap-4 border-2 border-border bg-text px-10 py-5 font-heading text-2xl uppercase tracking-wide text-background transition-colors hover:bg-primary hover:text-text"
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
        <div className="relative">
            {/* top theme bar (matches ContentPanel language) */}
            <div className="sticky top-0 z-30 flex">
                <span className="h-2 w-full bg-primary" />
                <span className="h-2 w-full bg-secondary" />
                <span className="h-2 w-full bg-tertiary" />
                <span className="h-2 w-full bg-quaternary" />
            </div>

            <Hero />
            <Chapters />
            <SkillsMarquee />
            <Stats />
            <ThemePlay />
            <Outro />
        </div>
    );
}
