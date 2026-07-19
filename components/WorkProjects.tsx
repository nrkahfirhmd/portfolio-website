"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
    type Variants,
} from "framer-motion";
import {
    projects,
    workCategories,
    type Project,
    type ProjectCategory,
} from "@/lib/projects";
import ProjectArticle from "@/components/ProjectArticle";

interface Props {
    /** Category driven by the sidebar nav (Software/AI/System), or null for "All". */
    activeCategory?: ProjectCategory | null;
    /** Push filter changes back to the sidebar (All → "Work"). */
    onNavigate: (label: string) => void;
}

type Filter = ProjectCategory | "All";

const accentByCategory: Record<ProjectCategory, string> = {
    Software: "bg-primary",
    AI: "bg-secondary",
    System: "bg-tertiary",
};

// Showcase backdrop gradient per category — makes each cover read distinct.
const coverBgByCategory: Record<ProjectCategory, string> = {
    Software: "from-primary via-secondary to-quaternary",
    AI: "from-secondary via-tertiary to-quaternary",
    System: "from-tertiary via-quaternary to-primary",
};

/* ---------- header ---------- */

const headingWords = ["Selected", "Work"];

function Header({
    filter,
    setFilter,
    count,
}: {
    filter: Filter;
    setFilter: (f: Filter) => void;
    count: number;
}) {
    const filters: Filter[] = ["All", ...workCategories];

    return (
        <header className="px-gutter pt-12">
            <div className="overflow-hidden">
                <h1 className="flex flex-wrap gap-x-4 font-heading text-heading leading-[0.9] tracking-wide text-text">
                    {headingWords.map((word, i) => (
                        <motion.span
                            key={word}
                            initial={{ y: "110%" }}
                            animate={{ y: 0 }}
                            transition={{
                                delay: 0.05 + i * 0.08,
                                duration: 0.7,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="inline-block"
                        >
                            {word}
                        </motion.span>
                    ))}
                </h1>
            </div>

            <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
                className="mt-4 max-w-xl text-text-muted"
            >
                Things I&apos;ve designed, built, and broken — spanning product
                software, applied AI, and low-level systems. Each one taught me
                something the last one didn&apos;t.
            </motion.p>

            {/* filter + live count */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
                className="mt-8 flex flex-wrap items-center gap-3"
            >
                <div className="flex flex-wrap gap-2">
                    {filters.map((f) => {
                        const active = f === filter;
                        return (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`relative cursor-pointer border border-border px-4 py-1.5 font-heading text-label tracking-wide transition-colors duration-200 ${
                                    active
                                        ? "text-background"
                                        : "text-text hover:bg-quaternary"
                                }`}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="filter-pill"
                                        className="absolute inset-0 bg-text"
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 34,
                                        }}
                                    />
                                )}
                                <span className="relative z-10">{f}</span>
                            </button>
                        );
                    })}
                </div>

                <span className="ml-auto font-heading text-label tabular-nums text-text-muted">
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                            key={count}
                            initial={{ y: -8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 8, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="inline-block"
                        >
                            {String(count).padStart(2, "0")}
                        </motion.span>
                    </AnimatePresence>{" "}
                    project{count === 1 ? "" : "s"}
                </span>
            </motion.div>
        </header>
    );
}

/* ---------- card ---------- */

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 56 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
            delay: (i % 2) * 0.1,
        },
    }),
};

function ProjectCard({
    project,
    index,
    onOpen,
}: {
    project: Project;
    index: number;
    onOpen: (id: string) => void;
}) {
    const [hovered, setHovered] = useState(false);
    const reduce = useReducedMotion();
    const showcaseRef = useRef<HTMLDivElement>(null);

    // Pointer parallax — image drifts toward the cursor inside the showcase.
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const sx = useSpring(px, { stiffness: 150, damping: 18 });
    const sy = useSpring(py, { stiffness: 150, damping: 18 });
    const imgX = useTransform(sx, [-0.5, 0.5], [-18, 18]);
    const imgY = useTransform(sy, [-0.5, 0.5], [-14, 14]);

    function onPointerMove(e: React.PointerEvent) {
        if (reduce || !showcaseRef.current) return;
        const r = showcaseRef.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
    }
    function resetPointer() {
        px.set(0);
        py.set(0);
    }

    // Stagger columns for an asymmetric, editorial rhythm.
    const columnOffset = index % 2 === 1 ? "md:mt-16" : "";

    return (
        <motion.a
            href={project.href ?? "#"}
            onClick={(e) => {
                e.preventDefault();
                onOpen(project.id);
            }}
            layout
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                setHovered(false);
                resetPointer();
            }}
            whileHover={reduce ? undefined : { y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className={`group relative block overflow-hidden border border-border bg-surface ${columnOffset}`}
            style={{
                boxShadow: hovered
                    ? "10px 10px 0 0 var(--color-border)"
                    : "0px 0px 0 0 var(--color-border)",
            }}
        >
            {/* ---------- image showcase ---------- */}
            <div
                ref={showcaseRef}
                onPointerMove={onPointerMove}
                className={`relative h-64 w-full overflow-hidden border-b border-border bg-gradient-to-br ${
                    coverBgByCategory[project.category]
                }`}
            >
                {/* giant ghost index behind the product shot */}
                <span className="pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 select-none font-heading text-[10rem] leading-none text-background/40 mix-blend-soft-light">
                    {project.id}
                </span>

                <motion.div
                    style={reduce ? undefined : { x: imgX, y: imgY }}
                    animate={{ scale: hovered ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 22 }}
                    className="absolute inset-0 flex items-center justify-center p-8"
                >
                    <Image
                        src={project.cover}
                        alt={`${project.title} showcase`}
                        width={340}
                        height={240}
                        className="h-full w-auto object-contain drop-shadow-2xl"
                    />
                </motion.div>

                {/* category tag overlay */}
                <span className="absolute right-3 top-3 border border-border bg-surface/90 px-2 py-0.5 font-heading text-mark tracking-wide backdrop-blur-sm">
                    {project.category}
                </span>

                {/* index + view chip slides up on hover */}
                <motion.div
                    initial={false}
                    animate={{ y: hovered ? 0 : 44, opacity: hovered ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    className="absolute bottom-3 left-3 flex items-center gap-2 border border-border bg-text px-3 py-1 font-heading text-mark tracking-wide text-background"
                >
                    View project <span aria-hidden>→</span>
                </motion.div>
            </div>

            {/* ---------- meta ---------- */}
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-baseline justify-between gap-4">
                    <h2 className="font-heading text-[2.5rem] leading-none tracking-wide text-text">
                        {project.title}
                    </h2>
                    <span className="shrink-0 text-sm tabular-nums text-text-muted">
                        {project.year} · {project.role}
                    </span>
                </div>

                <p className="max-w-md text-text-muted">{project.blurb}</p>

                <div className="flex flex-wrap items-center gap-2">
                    {project.stack.map((tech) => (
                        <span
                            key={tech}
                            className="rounded-full border border-border/30 bg-quaternary px-3 py-0.5 text-sm text-text"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </motion.a>
    );
}

/* ---------- page ---------- */

export default function WorkProjects({ activeCategory, onNavigate }: Props) {
    // Filter is fully derived from the sidebar selection — single source of truth.
    const filter: Filter = activeCategory ?? "All";

    const setFilter = (f: Filter) => onNavigate(f === "All" ? "Work" : f);

    const [openId, setOpenId] = useState<string | null>(null);
    const openProject = openId
        ? projects.find((p) => p.id === openId) ?? null
        : null;

    const visible = useMemo(
        () =>
            filter === "All"
                ? projects
                : projects.filter((p) => p.category === filter),
        [filter]
    );

    return (
        <div className="pb-24">
            <Header filter={filter} setFilter={setFilter} count={visible.length} />

            <motion.div
                layout
                className="grid grid-cols-1 gap-6 px-gutter pt-12 md:grid-cols-2"
            >
                <AnimatePresence mode="popLayout">
                    {visible.map((project, i) => (
                        <motion.div
                            key={project.id}
                            layout
                            exit={{ opacity: 0, scale: 0.92, y: 16 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                            <ProjectCard
                                project={project}
                                index={i}
                                onOpen={setOpenId}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {openProject && (
                    <ProjectArticle
                        key={openProject.id}
                        project={openProject}
                        onClose={() => setOpenId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
