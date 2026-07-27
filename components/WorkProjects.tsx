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
    categoryAccent,
    categoryTint,
    projects,
    workCategories,
    type Project,
    type ProjectCategory,
} from "@/lib/projects";
import { riseIn, spring, springConfig, transition } from "@/lib/motion";
import ProjectArticle from "@/components/ProjectArticle";

interface Props {
    /** Category driven by the sidebar nav (Software/AI/System), or null for "All". */
    activeCategory?: ProjectCategory | null;
    /** Push filter changes back to the sidebar (All → "Work"). */
    onNavigate: (label: string) => void;
}

type Filter = ProjectCategory | "All";

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
                                ...transition.reveal,
                                delay: 0.05 + i * 0.08,
                            }}
                            className="inline-block"
                        >
                            {word}
                        </motion.span>
                    ))}
                </h1>
            </div>

            <motion.p
                {...riseIn()}
                transition={{ ...transition.rise, delay: 0.35 }}
                className="mt-4 max-w-xl text-text-muted"
            >
                Things I&apos;ve designed, built, and broken — spanning product
                software, applied AI, and low-level systems. Each one taught me
                something the last one didn&apos;t.
            </motion.p>

            {/* filter + live count */}
            <motion.div
                {...riseIn()}
                transition={{ ...transition.rise, delay: 0.45 }}
                className="mt-8 flex flex-wrap items-center gap-3"
            >
                <div className="flex flex-wrap gap-2">
                    {filters.map((f) => {
                        const active = f === filter;
                        return (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`relative cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-(--duration-fast) ${
                                    active
                                        ? "border-transparent text-background"
                                        : "border-line-strong text-text-muted hover:border-line-bold hover:text-text"
                                }`}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="filter-pill"
                                        className="absolute inset-0 rounded-full bg-text"
                                        transition={spring.rail}
                                    />
                                )}
                                <span className="relative z-10">{f}</span>
                            </button>
                        );
                    })}
                </div>

                <span className="ml-auto text-sm tabular-nums text-text-muted">
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                            key={count}
                            initial={{ y: -8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 8, opacity: 0 }}
                            transition={transition.tick}
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
        transition: { ...transition.card, delay: (i % 2) * 0.1 },
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
    const sx = useSpring(px, springConfig.pointer);
    const sy = useSpring(py, springConfig.pointer);
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
            whileHover={reduce ? undefined : { y: -4 }}
            transition={spring.lift}
            className={`group relative block overflow-hidden rounded-card border border-line bg-surface ${
                hovered ? "shadow-card-hover" : "shadow-card"
            }`}
        >
            {/* ---------- image showcase ---------- */}
            <div
                ref={showcaseRef}
                onPointerMove={onPointerMove}
                className="relative aspect-[16/10] w-full overflow-hidden bg-background"
            >
                {/* faint category tint in the corner */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br to-transparent ${categoryTint[project.category]}`}
                />

                <motion.div
                    style={reduce ? undefined : { x: imgX, y: imgY }}
                    animate={{ scale: hovered ? 1.05 : 1 }}
                    transition={spring.image}
                    className="absolute inset-0 flex items-center justify-center p-10"
                >
                    <Image
                        src={project.cover}
                        alt={`${project.title} showcase`}
                        width={340}
                        height={240}
                        className="h-full w-auto object-contain drop-shadow-xl"
                    />
                </motion.div>

                {/* muted index, top-left */}
                <span className="absolute left-5 top-4 text-sm font-medium tabular-nums text-text-subtle">
                    {project.id}
                </span>
            </div>

            {/* ---------- meta ---------- */}
            <div className="flex flex-col gap-3 p-6">
                {/* category + year row */}
                <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium uppercase tracking-wider text-text-muted">
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${categoryAccent[project.category]}`}
                        />
                        {project.category}
                    </span>
                    <span className="tabular-nums text-text-subtle">
                        {project.year} · {project.role}
                    </span>
                </div>

                <h2 className="font-heading text-title leading-none tracking-wide text-text">
                    {project.title}
                </h2>

                <p className="text-sm leading-relaxed text-text-muted">
                    {project.blurb}
                </p>

                {/* footer: stack + hover arrow */}
                <div className="mt-2 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-xs tabular-nums text-text-subtle">
                        {project.stack.join(" · ")}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-text">
                        <span className="opacity-0 transition-opacity duration-(--duration-fast) group-hover:opacity-100">
                            View
                        </span>
                        <motion.span
                            initial={false}
                            animate={{ x: hovered ? 4 : 0 }}
                            transition={spring.nudge}
                            aria-hidden
                        >
                            →
                        </motion.span>
                    </span>
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
                className="grid grid-cols-1 gap-8 px-gutter pt-12 md:grid-cols-2"
            >
                <AnimatePresence mode="popLayout">
                    {visible.map((project, i) => (
                        <motion.div
                            key={project.id}
                            layout
                            exit={{ opacity: 0, scale: 0.92, y: 16 }}
                            transition={transition.shuffle}
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
