"use client";

import { useEffect, useRef, useState } from "react";
import {
    animate,
    motion,
    useInView,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from "framer-motion";
import MagneticButton from "@/components/MagneticButton";
import BentoGrid from "@/components/experience/MagicBento";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    experienceChapters,
    type ExperienceChapter,
    type ExperienceEntry,
    type ExperienceKind,
} from "@/lib/experience";

/** Reveal ease shared by every scroll-triggered entrance. */
const revealEase = [0.22, 1, 0.36, 1] as const;

/** Each kind of experience gets its own theme color, matching the menu palette. */
const kindMeta: Record<ExperienceKind, { label: string; dot: string; accent: string }> = {
    career: { label: "Career", dot: "bg-primary", accent: "border-primary" },
    volunteer: { label: "Volunteering", dot: "bg-secondary", accent: "border-secondary" },
    project: { label: "Side Project", dot: "bg-tertiary", accent: "border-tertiary" },
    community: { label: "Community", dot: "bg-quaternary", accent: "border-quaternary" },
};

export default function ExperienceStory() {
    return (
        <div className="overflow-x-clip">
            <Intro />
            <Timeline chapters={experienceChapters} />
            <Outro />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Intro                                                               */
/* ------------------------------------------------------------------ */

const introContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.5 } },
};

function Intro() {
    const reduce = useReducedMotion();

    const introWord = {
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 28 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.55, ease: revealEase },
        },
    };

    const headline = "Every little thing in my life has an origin story and its own lore.".split(" ");

    return (
        <header className="flex min-h-screen flex-col justify-center gap-8 px-gutter">
            <motion.h1
                variants={introContainer}
                initial="hidden"
                animate="show"
                className="max-w-4xl font-heading text-heading leading-[0.95] tracking-wide text-text"
            >
                {headline.map((word, i) => (
                    <motion.span key={i} variants={introWord} className="inline-block">
                        {word}
                        {i < headline.length - 1 && " "}
                    </motion.span>
                ))}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="max-w-xl text-lg text-text-muted"
            >
                My career tells only part of the story. 
                It's the side quests and experiences beyond work that have shaped how I think, create, and show up. 
                Scroll through to get to know the human behind the work.
            </motion.p>

            {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                aria-hidden
                className="mt-42 flex items-center gap-3 text-sm text-text-muted"
            >
                <motion.svg
                    animate={reduce ? undefined : { y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 5v14" />
                    <path d="m19 12-7 7-7-7" />
                </motion.svg>
                <span>Chapter one begins below</span>
            </motion.div> */}
        </header>
    );
}

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

function Timeline({ chapters }: { chapters: ExperienceChapter[] }) {
    const spineRef = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();

    // The colored spine draws itself as the reader moves through the story.
    const { scrollYProgress } = useScroll({
        target: spineRef,
        offset: ["start 0.8", "end 0.7"],
    });
    const scaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.4 });

    return (
        <div ref={spineRef} className="relative px-gutter pb-24">
            {/* Track: always visible so the reader knows how far the story goes. */}
            <div
                aria-hidden
                className="absolute left-[calc(var(--spacing-gutter)+7px)] top-0 h-full w-[2px] bg-text-subtle/50"
            />
            {/* Progress: fills the track in sync with scroll position. */}
            <motion.div
                aria-hidden
                style={{ scaleY: reduce ? 1 : scaleY }}
                className="absolute left-[calc(var(--spacing-gutter)+7px)] top-0 h-full w-[2px] origin-top bg-primary"
            />

            <div className="flex flex-col gap-24">
                {chapters.map((chapter) => (
                    <Chapter key={chapter.id} chapter={chapter} />
                ))}
            </div>
        </div>
    );
}

function Chapter({ chapter }: { chapter: ExperienceChapter }) {
    const ref = useRef<HTMLElement>(null);
    const reduce = useReducedMotion();

    // Ghost number drifts slower than the content — a cheap, GPU-only parallax.
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const ghostY = useTransform(scrollYProgress, [0, 1], [80, -80]);

    return (
        <section ref={ref} id={chapter.id} className="relative">
            <motion.span
                aria-hidden
                style={reduce ? undefined : { y: ghostY }}
                className="pointer-events-none absolute -top-10 right-0 select-none font-heading text-[9rem] leading-none text-transparent opacity-40 [-webkit-text-stroke:2px_var(--color-text-subtle)] md:text-[14rem]"
            >
                {chapter.number}
            </motion.span>

            <div className="sticky top-0 z-20 -ml-2 py-4 pl-2">
                <motion.div
                    initial={{ opacity: 0, x: reduce ? 0 : -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.5, ease: revealEase }}
                    className="pl-10 md:pl-14"
                >
                    <p className="text-sm font-medium uppercase tracking-widest text-text-muted">
                        Chapter {chapter.number}
                    </p>
                    <h2 className="mt-2 font-heading text-5xl tracking-wide text-text">
                        {chapter.title}
                    </h2>
                    <p className="max-w-lg text-text-muted">{chapter.tagline}</p>
                </motion.div>
            </div>

            {chapter.layout === "bento" ? (
                <div className="mt-10 pl-10 md:pl-14">
                    <BentoGrid chapterId={chapter.id} entries={chapter.entries} extras />
                </div>
            ) : (
                <ol className="mt-10 flex flex-col gap-12">
                    {chapter.entries.map((entry) => (
                        <Entry key={`${entry.period}-${entry.title}`} entry={entry} />
                    ))}
                </ol>
            )}
        </section>
    );
}

const skillList = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

function Entry({ entry }: { entry: ExperienceEntry }) {
    const reduce = useReducedMotion();
    const meta = kindMeta[entry.kind];

    const skillItem = {
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: revealEase } },
    };

    return (
        <motion.li
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: revealEase }}
            className="relative pl-10 md:pl-14"
        >
            {/* Dot on the spine, popping in with the card. */}
            <motion.span
                aria-hidden
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 }}
                className={`absolute left-0 top-8 h-4 w-4 border-2 border-border ${meta.dot}`}
            />

            <Card className="group transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--color-border)]">
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="font-heading text-mark tracking-wide text-text">
                            {entry.period}
                        </span>
                        <Badge
                            variant="outline"
                            className={`border-l-4 ${meta.accent}`}
                        >
                            {meta.label}
                        </Badge>
                    </div>

                    <div>
                        <h3 className="font-heading text-4xl leading-none tracking-wide text-text">
                            {entry.title}
                        </h3>
                        <p className="text-sm font-medium text-text-muted">{entry.org}</p>
                    </div>

                    <p className="font-medium text-text">{entry.summary}</p>
                    <p className="max-w-2xl text-text-muted">{entry.story}</p>

                    {entry.highlight && (
                        <blockquote
                            className={`border-l-4 ${meta.accent} pl-4 text-sm font-medium italic text-text`}
                        >
                            {entry.highlight}
                        </blockquote>
                    )}

                    <motion.ul
                        variants={skillList}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.4 }}
                        className="flex flex-wrap gap-2"
                    >
                        {entry.skills.map((skill) => (
                            <motion.li key={skill} variants={skillItem}>
                                <Badge>{skill}</Badge>
                            </motion.li>
                        ))}
                    </motion.ul>
                </CardContent>
            </Card>
        </motion.li>
    );
}

function Counter({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-20% 0px" });
    const reduce = useReducedMotion();
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView || reduce) return;
        const controls = animate(0, value, {
            duration: 1.4,
            ease: "easeOut",
            onUpdate: (v) => setDisplay(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, reduce, value]);

    return <span ref={ref}>{reduce ? value : display}</span>;
}

/* ------------------------------------------------------------------ */
/* Outro                                                               */
/* ------------------------------------------------------------------ */

function Outro() {
    const reduce = useReducedMotion();

    return (
        <section className="flex min-h-[50vh] flex-col items-center justify-center gap-8 px-gutter py-24 text-center">
            <motion.h2
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: revealEase }}
                className="max-w-2xl font-heading text-6xl leading-none tracking-wide text-text"
            >
                The next chapter is unwritten.
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-md text-text-muted"
            >
                If any of these stories sound like the kind of work you need,
                let&apos;s talk about writing the next one together.
            </motion.p>

            <MagneticButton
                onClick={() => {
                    window.location.href = "mailto:nurkahfirahmada@gmail.com";
                }}
                className="cursor-pointer border border-border bg-primary px-8 py-3 font-heading text-nav tracking-wide text-background transition-shadow duration-200 hover:shadow-[6px_6px_0_0_var(--color-border)]"
            >
                Start a conversation
            </MagneticButton>
        </section>
    );
}
