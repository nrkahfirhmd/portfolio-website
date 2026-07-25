"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
    experienceAlbum,
    experiencePolaroids,
    type BentoSize,
    type ExperienceEntry,
    type ExperienceKind,
    type ExperiencePhoto,
} from "@/lib/experience";

const revealEase = [0.22, 1, 0.36, 1] as const;

const kindMeta: Record<ExperienceKind, { label: string; art: string }> = {
    career: { label: "Career", art: "from-primary via-secondary to-tertiary" },
    volunteer: { label: "Volunteering", art: "from-secondary via-tertiary to-quaternary" },
    project: { label: "Side Project", art: "from-primary via-tertiary to-quaternary" },
    community: { label: "Community", art: "from-tertiary via-quaternary to-secondary" },
};

/** Grid footprints on the 6-column bento; single column on mobile. */
const sizeClass: Record<BentoSize, string> = {
    lg: "min-h-80 md:col-span-4 md:row-span-2",
    tall: "min-h-80 md:col-span-2 md:row-span-2",
    wide: "min-h-56 md:col-span-6",
    sm: "min-h-56 md:col-span-2",
};

interface BentoGridProps {
    chapterId: string;
    entries: ExperienceEntry[];
    /** Adds the playful cells (drag pile, flip card) and kind filters. */
    extras?: boolean;
}

/** Story cards interleaved with playful cells at fixed grid positions. */
type BentoCell =
    | { type: "entry"; entry: ExperienceEntry; index: number }
    | { type: "album" }
    | { type: "pile" }
    | { type: "polaroids" }
    | { type: "flip" };

export default function BentoGrid({ chapterId, entries, extras = false }: BentoGridProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [activeKind, setActiveKind] = useState<ExperienceKind | null>(null);
    const close = useCallback(() => setOpenIndex(null), []);

    const cells: BentoCell[] = [];
    entries.forEach((entry, index) => {
        cells.push({ type: "entry", entry, index });
        // Playful cells slot into the grid at fixed positions between stories.
        if (extras && index === 0) cells.push({ type: "album" });
        if (extras && index === 0) cells.push({ type: "pile" });
        if (extras && index === 3) cells.push({ type: "polaroids" });
    });
    if (extras) cells.push({ type: "flip" });

    const kinds = [...new Set(entries.map((e) => e.kind))];

    // Escape must close the article only — page.tsx listens for Escape to close
    // the whole panel, so intercept during capture and stop it bubbling there.
    useEffect(() => {
        if (openIndex === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                close();
            }
        };
        window.addEventListener("keydown", onKey, true);
        return () => window.removeEventListener("keydown", onKey, true);
    }, [openIndex, close]);

    // The article overlay owns scrolling while open.
    useEffect(() => {
        if (openIndex === null) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [openIndex]);

    return (
        <>
            {extras && (
                <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter stories by kind">
                    <FilterChip
                        label="Everything"
                        active={activeKind === null}
                        onClick={() => setActiveKind(null)}
                    />
                    {kinds.map((kind) => (
                        <FilterChip
                            key={kind}
                            label={kindMeta[kind].label}
                            active={activeKind === kind}
                            onClick={() => setActiveKind((k) => (k === kind ? null : kind))}
                        />
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[10rem]">
                {cells.map((cell) => {
                    if (cell.type === "album") return <AlbumCell key="album" />;
                    if (cell.type === "pile") return <DragPileCell key="pile" />;
                    if (cell.type === "polaroids") return <PolaroidCell key="polaroids" />;
                    if (cell.type === "flip") return <FlipCell key="flip" />;
                    return (
                        <BentoCard
                            key={cell.entry.title}
                            entry={cell.entry}
                            layoutId={`bento-${chapterId}-${cell.index}`}
                            index={cell.index}
                            dimmed={activeKind !== null && cell.entry.kind !== activeKind}
                            onOpen={() => setOpenIndex(cell.index)}
                        />
                    );
                })}
            </div>

            <AnimatePresence>
                {openIndex !== null && (
                    <BentoArticle
                        entry={entries[openIndex]}
                        layoutId={`bento-${chapterId}-${openIndex}`}
                        onClose={close}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

function FilterChip({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`cursor-pointer border border-border px-4 py-1.5 font-heading text-label tracking-wide transition-colors duration-200 ${
                active
                    ? "bg-primary text-background"
                    : "bg-surface text-text-muted hover:bg-quaternary hover:text-text"
            }`}
        >
            {label}
        </button>
    );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

interface BentoCardProps {
    entry: ExperienceEntry;
    layoutId: string;
    index: number;
    dimmed?: boolean;
    onOpen: () => void;
}

function BentoCard({ entry, layoutId, index, dimmed = false, onOpen }: BentoCardProps) {
    const reduce = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const meta = kindMeta[entry.kind];

    // Tilt: the card leans toward the cursor, springs back on leave.
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
    const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

    function handleMove(e: React.PointerEvent<HTMLDivElement>) {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();

        // Spotlight follows the cursor via CSS vars — no re-render per frame.
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        el.style.setProperty("--my", `${e.clientY - rect.top}px`);

        if (reduce) return;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rotateY.set(px * 6);
        rotateX.set(py * -6);
    }

    function handleLeave() {
        rotateX.set(0);
        rotateY.set(0);
    }

    return (
        <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: index * 0.08, ease: revealEase }}
            className={sizeClass[entry.size ?? "sm"]}
        >
            <motion.div
                layoutId={layoutId}
                animate={{ opacity: dimmed ? 0.35 : 1, scale: dimmed ? 0.97 : 1 }}
                transition={{ duration: 0.3, ease: revealEase }}
                style={reduce ? undefined : { rotateX: springX, rotateY: springY, transformPerspective: 900 }}
                className="h-full"
            >
                <div
                    ref={ref}
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-label={`Read the story: ${entry.title}`}
                    onClick={onOpen}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onOpen();
                        }
                    }}
                    onPointerMove={handleMove}
                    onPointerLeave={handleLeave}
                    className="group relative flex h-full cursor-pointer flex-col justify-end overflow-hidden border border-border bg-surface text-left transition-shadow duration-200 hover:shadow-[8px_8px_0_0_var(--color-border)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    <Cover entry={entry} art={meta.art} />

                    {/* Scrim keeps the copy readable over any cover. */}
                    <div
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-surface via-surface/80 to-transparent"
                    />

                    {/* Cursor spotlight. */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                            background:
                                "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--color-primary) 22%, transparent), transparent 70%)",
                        }}
                    />

                    <div className="relative z-10 flex flex-col gap-2 p-5">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">{meta.label}</Badge>
                            <span className="text-xs font-medium text-text-muted">
                                {entry.period}
                            </span>
                        </div>
                        <h3 className="font-heading text-3xl leading-none tracking-wide text-text">
                            {entry.title}
                        </h3>
                        <p className="line-clamp-2 max-w-md text-sm text-text-muted">
                            {entry.summary}
                        </p>
                        <span className="flex items-center gap-1.5 text-sm font-medium text-text opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            Read the story
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden
                            >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/** Cover image, or generated art when no photo exists yet. */
function Cover({ entry, art }: { entry: ExperienceEntry; art: string }) {
    if (entry.image) {
        return (
            <Image
                src={entry.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-105"
            />
        );
    }

    return (
        <div
            aria-hidden
            className={`absolute inset-0 bg-gradient-to-br ${art} transition-transform duration-500 group-hover:scale-105`}
        >
            <span className="absolute -right-2 -top-6 select-none font-heading text-9xl leading-none tracking-wide text-background/40">
                {entry.title.split(" ")[0]}
            </span>
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "repeating-linear-gradient(-45deg, transparent 0 14px, color-mix(in srgb, var(--color-background) 14%, transparent) 14px 16px)",
                }}
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Playful cells                                                       */
/* ------------------------------------------------------------------ */

/** Shared photo surface: real image when set, captioned gradient otherwise. */
function PhotoFrame({ photo, className = "" }: { photo: ExperiencePhoto; className?: string }) {
    if (photo.image) {
        return (
            <Image
                src={photo.image}
                alt={photo.caption}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className={`object-cover ${className}`}
            />
        );
    }
    return (
        <div
            aria-hidden
            className={`absolute inset-0 bg-gradient-to-br ${photo.tint} ${className}`}
        >
            <div
                className="absolute inset-0 opacity-60"
                style={{
                    background:
                        "repeating-linear-gradient(-45deg, transparent 0 12px, color-mix(in srgb, var(--color-background) 16%, transparent) 12px 14px)",
                }}
            />
        </div>
    );
}

/** Swipeable / clickable photo album — the "moments" reel. */
function AlbumCell() {
    const reduce = useReducedMotion();
    const [index, setIndex] = useState(0);
    // Direction drives the slide-in/out sign so swipes read as continuous.
    const [direction, setDirection] = useState(0);
    const count = experienceAlbum.length;

    const paginate = useCallback(
        (dir: number) => {
            setDirection(dir);
            setIndex((i) => (i + dir + count) % count);
        },
        [count]
    );

    const photo = experienceAlbum[index];

    const slide = {
        enter: (dir: number) => ({ x: reduce ? 0 : dir > 0 ? "100%" : "-100%", opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: reduce ? 0 : dir > 0 ? "-100%" : "100%", opacity: 0 }),
    };

    return (
        <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: revealEase }}
            className="min-h-80 md:col-span-2 md:row-span-2"
        >
            <div
                role="group"
                aria-roledescription="carousel"
                aria-label="Photo album — swipe or use the arrows"
                className="relative flex h-full flex-col overflow-hidden border border-border bg-text"
            >
                {/* Photo stage. Draggable horizontally to flip pages. */}
                <div className="relative flex-1 overflow-hidden">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                            key={index}
                            custom={direction}
                            variants={slide}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                            }}
                            drag={reduce ? false : "x"}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.6}
                            onDragEnd={(_, info) => {
                                if (info.offset.x < -60 || info.velocity.x < -400) paginate(1);
                                else if (info.offset.x > 60 || info.velocity.x > 400) paginate(-1);
                            }}
                            className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
                        >
                            <PhotoFrame photo={photo} />
                            <div
                                aria-hidden
                                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-text/80 to-transparent"
                            />
                            <p className="pointer-events-none absolute bottom-3 left-4 right-4 z-10 font-heading text-xl leading-tight tracking-wide text-background">
                                {photo.caption}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <span className="pointer-events-none absolute left-4 top-4 z-10 border border-background/40 bg-text/40 px-2 py-0.5 text-xs font-medium text-background">
                        Album
                    </span>

                    {/* Prev / next controls (keyboard + non-swipe fallback). */}
                    <button
                        type="button"
                        onClick={() => paginate(-1)}
                        aria-label="Previous photo"
                        className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center border border-border bg-surface/90 text-text transition-transform duration-150 hover:scale-110"
                    >
                        <Chevron dir="left" />
                    </button>
                    <button
                        type="button"
                        onClick={() => paginate(1)}
                        aria-label="Next photo"
                        className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center border border-border bg-surface/90 text-text transition-transform duration-150 hover:scale-110"
                    >
                        <Chevron dir="right" />
                    </button>
                </div>

                {/* Dots. */}
                <div className="flex items-center justify-center gap-1.5 bg-surface py-3">
                    {experienceAlbum.map((p, i) => (
                        <button
                            key={p.caption}
                            type="button"
                            onClick={() => {
                                setDirection(i > index ? 1 : -1);
                                setIndex(i);
                            }}
                            aria-label={`Go to photo ${i + 1}`}
                            aria-current={i === index}
                            className={`h-2 cursor-pointer border border-border transition-all duration-200 ${
                                i === index ? "w-5 bg-primary" : "w-2 bg-surface hover:bg-quaternary"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            {dir === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
        </svg>
    );
}

/** Draggable polaroids scattered in a cell — pick them up, toss them around. */
function PolaroidCell() {
    const boundsRef = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    // Track top z-order so the last-grabbed polaroid stays on top.
    const [top, setTop] = useState<number | null>(null);

    const spots = [
        { rotate: -7, left: "8%", top: "16%" },
        { rotate: 6, left: "40%", top: "10%" },
        { rotate: -3, left: "24%", top: "44%" },
    ];

    return (
        <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: revealEase }}
            className="min-h-80 md:col-span-2 md:row-span-2"
        >
            <div
                ref={boundsRef}
                className="relative h-full overflow-hidden border border-border bg-secondary/30"
            >
                <p className="absolute right-4 top-4 z-0 max-w-32 text-right font-heading text-2xl leading-tight tracking-wide text-text">
                    Keepsakes
                </p>
                <p className="absolute bottom-4 left-4 z-0 flex items-center gap-1.5 text-xs font-medium text-text-muted">
                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                    >
                        <path d="M5 9l-3 3 3 3" />
                        <path d="M9 5l3-3 3 3" />
                        <path d="M15 19l-3 3-3-3" />
                        <path d="M19 9l3 3-3 3" />
                        <path d="M2 12h20" />
                        <path d="M12 2v20" />
                    </svg>
                    Drag the polaroids
                </p>

                {experiencePolaroids.map((photo, i) => {
                    const spot = spots[i % spots.length];
                    return (
                        <motion.figure
                            key={photo.caption}
                            drag
                            dragConstraints={boundsRef}
                            dragElastic={0.12}
                            onDragStart={() => setTop(i)}
                            initial={{ rotate: spot.rotate }}
                            whileHover={{ scale: 1.05, rotate: 0 }}
                            whileDrag={{ scale: 1.12, rotate: 0 }}
                            style={{
                                left: spot.left,
                                top: spot.top,
                                zIndex: top === i ? 30 : 10 + i,
                            }}
                            className="absolute w-28 cursor-grab touch-none border border-border bg-surface p-2 shadow-[3px_3px_0_rgba(0,0,0,0.25)] active:cursor-grabbing"
                        >
                            <div className="relative aspect-square overflow-hidden">
                                <PhotoFrame photo={photo} />
                            </div>
                            <figcaption className="pt-2 text-center font-heading text-lg leading-none tracking-wide text-text">
                                {photo.caption}
                            </figcaption>
                        </motion.figure>
                    );
                })}
            </div>
        </motion.div>
    );
}

const stickers = [
    { src: "/sushi.svg", alt: "Sushi sticker", rotate: -8, left: "12%", top: "22%" },
    { src: "/controller.svg", alt: "Game controller sticker", rotate: 7, left: "52%", top: "16%" },
    { src: "/billiard.svg", alt: "Billiard ball sticker", rotate: -5, left: "18%", top: "58%" },
    { src: "/shoe.svg", alt: "Running shoe sticker", rotate: 11, left: "56%", top: "54%" },
];

/** A pile of hobby stickers the visitor can toss around inside the cell. */
function DragPileCell() {
    const boundsRef = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();

    return (
        <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: revealEase }}
            className="min-h-80 md:col-span-2 md:row-span-2"
        >
            <div
                ref={boundsRef}
                className="relative h-full overflow-hidden border border-border bg-quaternary/60"
            >
                <p className="absolute left-5 top-5 z-0 max-w-40 font-heading text-2xl leading-tight tracking-wide text-text">
                    Off-duty inventory
                </p>
                <p className="absolute bottom-5 left-5 z-0 flex items-center gap-1.5 text-xs font-medium text-text-muted">
                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                    >
                        <path d="M5 9l-3 3 3 3" />
                        <path d="M9 5l3-3 3 3" />
                        <path d="M15 19l-3 3-3-3" />
                        <path d="M19 9l3 3-3 3" />
                        <path d="M2 12h20" />
                        <path d="M12 2v20" />
                    </svg>
                    Drag the stickers around
                </p>

                {stickers.map((sticker) => (
                    <motion.div
                        key={sticker.src}
                        drag
                        dragConstraints={boundsRef}
                        dragElastic={0.15}
                        initial={{ rotate: sticker.rotate }}
                        whileHover={{ scale: 1.08 }}
                        whileDrag={{ scale: 1.15, zIndex: 20 }}
                        style={{ left: sticker.left, top: sticker.top }}
                        className="absolute z-10 h-16 w-16 cursor-grab touch-none active:cursor-grabbing"
                    >
                        <Image
                            src={sticker.src}
                            alt={sticker.alt}
                            width={64}
                            height={64}
                            draggable={false}
                            className="pointer-events-none h-full w-full drop-shadow-[3px_3px_0_rgba(0,0,0,0.25)]"
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

/** Flip card: a small mystery cell that rewards a click. */
function FlipCell() {
    const [flipped, setFlipped] = useState(false);
    const reduce = useReducedMotion();

    return (
        <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: revealEase }}
            className="min-h-56 md:col-span-2 [perspective:900px]"
        >
            <button
                type="button"
                onClick={() => setFlipped((f) => !f)}
                aria-pressed={flipped}
                aria-label="Flip the fun-fact card"
                className="relative h-full w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
                <motion.div
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={
                        reduce
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 220, damping: 22 }
                    }
                    className="relative h-full w-full [transform-style:preserve-3d]"
                >
                    <div className="absolute inset-0 flex flex-col items-start justify-between border border-border bg-primary p-5 [backface-visibility:hidden]">
                        <span className="font-heading text-3xl leading-none tracking-wide text-background">
                            Fun fact
                        </span>
                        <span className="text-sm font-medium text-background/80">
                            Tap to flip
                        </span>
                    </div>
                    <div className="absolute inset-0 flex items-center border border-border bg-surface p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <p className="text-sm leading-relaxed text-text">
                            The stickers in the pile are real hobbies: sushi hunting,
                            games, billiards, and slow morning runs. Balance is a skill
                            too.
                        </p>
                    </div>
                </motion.div>
            </button>
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/* Expanded article                                                    */
/* ------------------------------------------------------------------ */

interface BentoArticleProps {
    entry: ExperienceEntry;
    layoutId: string;
    onClose: () => void;
}

function BentoArticle({ entry, layoutId, onClose }: BentoArticleProps) {
    const meta = kindMeta[entry.kind];

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={onClose}
                className="fixed inset-0 z-50 bg-text/40 backdrop-blur-sm"
            />

            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
                <motion.article
                    layoutId={layoutId}
                    role="dialog"
                    aria-modal="true"
                    aria-label={entry.title}
                    className="pointer-events-auto relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden border border-border bg-surface shadow-[12px_12px_0_0_var(--color-border)]"
                >
                    <div className="relative h-48 shrink-0 overflow-hidden border-b border-border md:h-64">
                        {entry.image ? (
                            <Image
                                src={entry.image}
                                alt=""
                                fill
                                sizes="768px"
                                className="object-cover"
                            />
                        ) : (
                            <div className={`absolute inset-0 bg-gradient-to-br ${meta.art}`}>
                                <span className="absolute -bottom-8 left-4 select-none font-heading text-[10rem] leading-none tracking-wide text-background/40">
                                    {entry.title.split(" ")[0]}
                                </span>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close story"
                            className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center border border-border bg-surface text-text transition-transform duration-150 hover:scale-110"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                aria-hidden
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col gap-5 overflow-y-auto p-6 md:p-10">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.15, ease: revealEase }}
                            className="flex flex-col gap-5"
                        >
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge variant="outline">{meta.label}</Badge>
                                <span className="font-heading text-mark tracking-wide text-text">
                                    {entry.period}
                                </span>
                            </div>

                            <div>
                                <h3 className="font-heading text-5xl leading-none tracking-wide text-text">
                                    {entry.title}
                                </h3>
                                <p className="mt-1 text-sm font-medium text-text-muted">
                                    {entry.org}
                                </p>
                            </div>

                            <p className="text-lg font-medium leading-relaxed text-text">
                                {entry.summary}
                            </p>

                            <p className="leading-relaxed text-text-muted">{entry.story}</p>
                            {entry.body?.map((paragraph) => (
                                <p key={paragraph.slice(0, 24)} className="leading-relaxed text-text-muted">
                                    {paragraph}
                                </p>
                            ))}

                            {entry.highlight && (
                                <blockquote className="border-l-4 border-primary bg-quaternary/40 p-4 font-medium italic text-text">
                                    {entry.highlight}
                                </blockquote>
                            )}

                            <ul className="flex flex-wrap gap-2">
                                {entry.skills.map((skill) => (
                                    <li key={skill}>
                                        <Badge>{skill}</Badge>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </motion.article>
            </div>
        </>
    );
}
