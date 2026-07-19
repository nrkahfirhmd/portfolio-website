"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
    AnimatePresence,
    motion,
    useScroll,
    useTransform,
} from "framer-motion";
import {
    getArticle,
    articleHeadings,
    type Article,
    type Block,
    type Inline,
} from "@/lib/articles";
import type { Project, ProjectCategory } from "@/lib/projects";

const accentByCategory: Record<ProjectCategory, string> = {
    Software: "bg-primary",
    AI: "bg-secondary",
    System: "bg-tertiary",
};

const coverBgByCategory: Record<ProjectCategory, string> = {
    Software: "from-primary via-secondary to-quaternary",
    AI: "from-secondary via-tertiary to-quaternary",
    System: "from-tertiary via-quaternary to-primary",
};

/* ---------- inline renderer ---------- */

function InlineRun({ nodes }: { nodes: Inline[] }) {
    return (
        <>
            {nodes.map((n, i) => {
                if (typeof n === "string") return <Fragment key={i}>{n}</Fragment>;
                if ("b" in n)
                    return (
                        <strong key={i} className="font-semibold text-text">
                            {n.b}
                        </strong>
                    );
                if ("i" in n)
                    return (
                        <em key={i} className="italic">
                            {n.i}
                        </em>
                    );
                if ("code" in n)
                    return (
                        <code
                            key={i}
                            className="rounded border border-border/30 bg-quaternary px-1.5 py-0.5 font-mono text-[0.85em] text-text"
                        >
                            {n.code}
                        </code>
                    );
                if ("link" in n)
                    return (
                        <a
                            key={i}
                            href={n.link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="underline decoration-2 underline-offset-2 transition-colors hover:text-primary"
                        >
                            {n.link.text}
                        </a>
                    );
                return null;
            })}
        </>
    );
}

/* ---------- code block with copy ---------- */

function CodeBlock({ lang, code }: { lang: string; code: string }) {
    const [copied, setCopied] = useState(false);

    async function copy() {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* clipboard blocked — ignore */
        }
    }

    return (
        <div className="overflow-hidden border border-border bg-text">
            <div className="flex items-center justify-between border-b border-white/15 px-4 py-2">
                <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-primary" />
                    <span className="h-3 w-3 rounded-full bg-tertiary" />
                    <span className="h-3 w-3 rounded-full bg-quaternary" />
                    <span className="ml-3 font-mono text-xs text-white/50">
                        {lang}
                    </span>
                </div>
                <button
                    onClick={copy}
                    className="cursor-pointer font-mono text-xs text-white/70 transition-colors hover:text-white"
                >
                    {copied ? "Copied ✓" : "Copy"}
                </button>
            </div>
            <pre className="overflow-x-auto p-4">
                <code className="font-mono text-sm leading-relaxed text-quaternary">
                    {code}
                </code>
            </pre>
        </div>
    );
}

/* ---------- block renderer ---------- */

const calloutTone: Record<
    "info" | "warn" | "success",
    { bar: string; bg: string; icon: string }
> = {
    info: { bar: "bg-primary", bg: "bg-primary/10", icon: "i" },
    warn: { bar: "bg-secondary", bg: "bg-secondary/15", icon: "!" },
    success: { bar: "bg-tertiary", bg: "bg-tertiary/20", icon: "✓" },
};

function BlockView({
    block,
    onZoom,
}: {
    block: Block;
    onZoom: (src: string, alt: string) => void;
}) {
    switch (block.type) {
        case "heading":
            return (
                <h2
                    data-heading={block.id}
                    id={block.id}
                    className="scroll-mt-24 pt-4 font-heading text-[2.2rem] leading-tight tracking-wide text-text"
                >
                    {block.text}
                </h2>
            );
        case "paragraph":
            return (
                <p className="text-lg leading-relaxed text-text-muted">
                    <InlineRun nodes={block.content} />
                </p>
            );
        case "quote":
            return (
                <blockquote className="relative py-2 pl-6">
                    <span className="absolute left-0 top-0 h-full w-1.5 bg-primary" />
                    <p className="font-heading text-[1.9rem] leading-snug tracking-wide text-text">
                        <InlineRun nodes={block.content} />
                    </p>
                    {block.cite && (
                        <cite className="mt-2 block text-sm not-italic text-text-muted">
                            — {block.cite}
                        </cite>
                    )}
                </blockquote>
            );
        case "code":
            return <CodeBlock lang={block.lang} code={block.code} />;
        case "image":
            return (
                <figure className="flex flex-col gap-2">
                    <button
                        onClick={() => onZoom(block.src, block.alt)}
                        className="group relative block cursor-pointer overflow-hidden border border-border bg-gradient-to-br from-quaternary to-tertiary"
                    >
                        <div className="flex h-72 items-center justify-center p-8">
                            <Image
                                src={block.src}
                                alt={block.alt}
                                width={420}
                                height={280}
                                className="h-full w-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <span className="absolute right-3 top-3 border border-border bg-surface/90 px-2 py-0.5 font-mono text-xs backdrop-blur-sm">
                            ⤢ zoom
                        </span>
                    </button>
                    {block.caption && (
                        <figcaption className="text-center text-sm text-text-muted">
                            {block.caption}
                        </figcaption>
                    )}
                </figure>
            );
        case "list":
            return block.ordered ? (
                <ol className="flex flex-col gap-2 pl-1">
                    {block.items.map((item, i) => (
                        <li key={i} className="flex gap-3 text-lg text-text-muted">
                            <span className="font-heading text-xl leading-none text-primary">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <span>
                                <InlineRun nodes={item} />
                            </span>
                        </li>
                    ))}
                </ol>
            ) : (
                <ul className="flex flex-col gap-2 pl-1">
                    {block.items.map((item, i) => (
                        <li key={i} className="flex gap-3 text-lg text-text-muted">
                            <span className="mt-2.5 h-2 w-2 shrink-0 bg-primary" />
                            <span>
                                <InlineRun nodes={item} />
                            </span>
                        </li>
                    ))}
                </ul>
            );
        case "callout": {
            const tone = calloutTone[block.tone];
            return (
                <div
                    className={`flex gap-4 border border-border ${tone.bg} p-4`}
                >
                    <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${tone.bar} font-heading text-background`}
                    >
                        {tone.icon}
                    </span>
                    <p className="text-base leading-relaxed text-text">
                        <InlineRun nodes={block.content} />
                    </p>
                </div>
            );
        }
        case "divider":
            return <hr className="border-border/40" />;
        default:
            return null;
    }
}

/* ---------- table of contents ---------- */

function Toc({
    headings,
    activeId,
    onJump,
    accent,
}: {
    headings: { id: string; text: string }[];
    activeId: string;
    onJump: (id: string) => void;
    accent: string;
}) {
    if (headings.length === 0) return null;
    return (
        <nav className="sticky top-24 hidden w-56 shrink-0 lg:block">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-subtle">
                On this page
            </p>
            <ul className="flex flex-col gap-1 border-l border-border/30">
                {headings.map((h) => {
                    const active = h.id === activeId;
                    return (
                        <li key={h.id} className="relative">
                            {active && (
                                <motion.span
                                    layoutId="toc-active"
                                    className={`absolute -left-px top-0 h-full w-0.5 ${accent}`}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 32,
                                    }}
                                />
                            )}
                            <button
                                onClick={() => onJump(h.id)}
                                className={`cursor-pointer py-1 pl-4 text-left text-sm transition-colors ${
                                    active
                                        ? "font-medium text-text"
                                        : "text-text-muted hover:text-text"
                                }`}
                            >
                                {h.text}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

/* ---------- main ---------- */

interface Props {
    project: Project;
    onClose: () => void;
}

export default function ProjectArticle({ project, onClose }: Props) {
    const article: Article = getArticle(project);
    const headings = articleHeadings(article);

    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
    const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
        null
    );

    const { scrollYProgress } = useScroll({ container: scrollRef });
    const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

    // Active-heading tracking for the TOC — deterministic on scroll position.
    useEffect(() => {
        const root = scrollRef.current;
        if (!root) return;

        const update = () => {
            const els = Array.from(
                root.querySelectorAll<HTMLElement>("[data-heading]")
            );
            if (els.length === 0) return;
            const rootTop = root.getBoundingClientRect().top;
            // A heading counts as "reached" once it passes 140px below the top.
            let current = els[0];
            for (const el of els) {
                if (el.getBoundingClientRect().top - rootTop <= 140) current = el;
                else break;
            }
            setActiveId(current.getAttribute("data-heading") ?? "");
        };

        update();
        root.addEventListener("scroll", update, { passive: true });
        return () => root.removeEventListener("scroll", update);
    }, [project.id]);

    // Esc to close.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (lightbox) setLightbox(null);
                else onClose();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightbox, onClose]);

    function jump(id: string) {
        const root = scrollRef.current;
        root?.querySelector(`#${id}`)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-30 bg-background md:left-sidebar"
        >
            {/* reading progress */}
            <motion.div
                style={{ scaleX: scrollYProgress }}
                className={`absolute left-0 top-0 z-20 h-1.5 w-full origin-left ${accentByCategory[project.category]}`}
            />

            {/* back button */}
            <button
                onClick={onClose}
                className="absolute left-6 top-6 z-20 flex cursor-pointer items-center gap-2 border border-border bg-surface px-4 py-2 font-heading text-mark tracking-wide text-text shadow-[3px_3px_0_0_var(--color-border)] transition-transform hover:-translate-y-0.5"
            >
                <span aria-hidden>←</span> Back to work
            </button>

            {/* scroll container */}
            <div ref={scrollRef} className="h-full overflow-y-auto">
                {/* hero */}
                <header
                    className={`relative overflow-hidden border-b border-border bg-gradient-to-br ${coverBgByCategory[project.category]}`}
                >
                    <motion.div
                        style={{ y: heroY }}
                        className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-gutter py-24 text-center"
                    >
                        <span className="border border-border bg-surface/80 px-3 py-1 font-heading text-mark tracking-wide backdrop-blur-sm">
                            {project.category} · {project.year} · {article.readMinutes} min read
                        </span>

                        <div className="overflow-hidden">
                            <motion.h1
                                initial={{ y: "110%" }}
                                animate={{ y: 0 }}
                                transition={{
                                    delay: 0.15,
                                    duration: 0.7,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="font-heading text-[clamp(3rem,7vw,6rem)] leading-[0.9] tracking-wide text-text"
                            >
                                {project.title}
                            </motion.h1>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="max-w-2xl text-lg text-text/80"
                        >
                            {article.lede}
                        </motion.p>
                    </motion.div>
                </header>

                {/* body */}
                <div className="mx-auto flex max-w-4xl gap-12 px-gutter py-16">
                    <article className="flex min-w-0 flex-1 flex-col gap-7">
                        {article.blocks.map((block, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{
                                    root: scrollRef,
                                    once: true,
                                    amount: 0.3,
                                }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <BlockView
                                    block={block}
                                    onZoom={(src, alt) => setLightbox({ src, alt })}
                                />
                            </motion.div>
                        ))}

                        <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-8">
                            <span className="font-heading text-mark tracking-wide text-text-muted">
                                {project.stack.join(" · ")}
                            </span>
                            <button
                                onClick={onClose}
                                className="cursor-pointer border border-border bg-text px-5 py-2 font-heading text-nav tracking-wide text-background transition-transform hover:-translate-y-0.5"
                            >
                                ← All projects
                            </button>
                        </div>
                    </article>

                    <Toc
                        headings={headings}
                        activeId={activeId}
                        onJump={jump}
                        accent={accentByCategory[project.category]}
                    />
                </div>
            </div>

            {/* lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                        className="fixed inset-0 z-40 flex cursor-zoom-out items-center justify-center bg-text/90 p-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative flex max-h-full max-w-4xl items-center justify-center"
                        >
                            <Image
                                src={lightbox.src}
                                alt={lightbox.alt}
                                width={900}
                                height={600}
                                className="h-auto max-h-[80vh] w-auto object-contain drop-shadow-2xl"
                            />
                        </motion.div>
                        <span className="absolute bottom-8 font-mono text-sm text-white/60">
                            click anywhere or press Esc to close
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
