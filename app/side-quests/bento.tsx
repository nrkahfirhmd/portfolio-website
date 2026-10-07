"use client";

// Side-quests grid (ported from portfolio-website's MagicBento): story cards that open into an article, plus playful cells.

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { SideQuest, SideQuestPhoto } from "./types";

type Kind = SideQuest["kind"];

const KIND_LABEL: Record<Kind, string> = {
  career: "Career",
  volunteer: "Volunteering",
  project: "Side Project",
  community: "Community",
};

/** Mirrors the site's motion tokens: --primitive-easing-out, the spring. */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: "spring", stiffness: 260, damping: 24 } as const;
const TILT = { stiffness: 200, damping: 22 };

type Cell =
  | { type: "entry"; entry: SideQuest; index: number }
  | { type: "album" }
  | { type: "pile" }
  | { type: "polaroids" }
  | { type: "flip" };

export function SideQuestBento({
  entries,
  album,
  keepsakes,
  stickers,
  funFact,
}: {
  entries: SideQuest[];
  album: SideQuestPhoto[];
  keepsakes: SideQuestPhoto[];
  stickers: { src: string; alt: string }[];
  funFact: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeKind, setActiveKind] = useState<Kind | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

  // Playful cells slot in at fixed positions between the stories.
  const cells: Cell[] = [];
  entries.forEach((entry, index) => {
    cells.push({ type: "entry", entry, index });
    if (index === 0) cells.push({ type: "album" }, { type: "pile" });
    if (index === 3) cells.push({ type: "polaroids" });
  });
  cells.push({ type: "flip" });

  const kinds = [...new Set(entries.map((e) => e.kind))];

  // Escape closes the open article; the overlay owns scrolling while open.
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openIndex, close]);

  return (
    <>
      <div className="sq-filters" role="group" aria-label="Filter stories by kind">
        <FilterChip label="Everything" active={activeKind === null} onClick={() => setActiveKind(null)} />
        {kinds.map((kind) => (
          <FilterChip
            key={kind}
            label={KIND_LABEL[kind]}
            active={activeKind === kind}
            onClick={() => setActiveKind((k) => (k === kind ? null : kind))}
          />
        ))}
      </div>

      <div className="sq-grid">
        {cells.map((cell) => {
          if (cell.type === "album") return <AlbumCell key="album" photos={album} />;
          if (cell.type === "pile") return <StickerCell key="pile" stickers={stickers} />;
          if (cell.type === "polaroids") return <PolaroidCell key="polaroids" photos={keepsakes} />;
          if (cell.type === "flip") return <FlipCell key="flip" fact={funFact} />;
          return (
            <StoryCard
              key={cell.entry.title}
              entry={cell.entry}
              layoutId={`sq-${cell.index}`}
              dimmed={activeKind !== null && cell.entry.kind !== activeKind}
              onOpen={() => setOpenIndex(cell.index)}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Article entry={entries[openIndex]} layoutId={`sq-${openIndex}`} onClose={close} />
        )}
      </AnimatePresence>
    </>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" className="sq-chip" aria-pressed={active} onClick={onClick}>
      {label}
    </button>
  );
}

/* --- story card ------------------------------------------------------- */

function StoryCard({
  entry,
  layoutId,
  dimmed,
  onOpen,
}: {
  entry: SideQuest;
  layoutId: string;
  dimmed: boolean;
  onOpen: () => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // The card leans toward the cursor and springs back on leave.
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, TILT);
  const springY = useSpring(rotateY, TILT);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (reduce) return;
    const rect = el.getBoundingClientRect();
    rotateY.set(((e.clientX - rect.left) / rect.width - 0.5) * 6);
    rotateX.set(((e.clientY - rect.top) / rect.height - 0.5) * -6);
  }

  return (
    <div className="sq-cell reveal" data-size={entry.size ?? "sm"}>
      <motion.div
        layoutId={layoutId}
        animate={{ opacity: dimmed ? 0.35 : 1, scale: dimmed ? 0.97 : 1 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        style={reduce ? undefined : { rotateX: springX, rotateY: springY, transformPerspective: 900 }}
        className="sq-fill"
      >
        <div
          ref={ref}
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          aria-label={`Read the story: ${entry.title}`}
          data-cursor-label="Read the story"
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpen();
            }
          }}
          onPointerMove={handleMove}
          onPointerLeave={() => {
            rotateX.set(0);
            rotateY.set(0);
          }}
          className="sq-card"
        >
          <Cover entry={entry} />
          <span className="sq-scrim" aria-hidden="true" />
          <span className="sq-card-text">
            <span className="sq-meta">
              <span className="sq-badge">{KIND_LABEL[entry.kind]}</span>
              {entry.period}
            </span>
            <span className="sq-card-title">{entry.title}</span>
            <span className="sq-card-summary">{entry.summary}</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/** Cover image, or the site's dotted placeholder without one. */
function Cover({ entry }: { entry: SideQuest }) {
  if (entry.image)
    return <Image className="sq-cover" src={entry.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" />;
  return <span className="sq-cover sq-art" aria-hidden="true" />;
}

/* --- playful cells ---------------------------------------------------- */

/** Swipeable album: drag sideways, use the arrows, or pick a dot. */
function AlbumCell({ photos }: { photos: SideQuestPhoto[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  // Direction sets the slide's sign, so swipes read as continuous.
  const [direction, setDirection] = useState(0);
  const count = photos.length;
  const paginate = (dir: number) => {
    setDirection(dir);
    setIndex((i) => (i + dir + count) % count);
  };
  const photo = photos[index];
  const slide = {
    enter: (dir: number) => ({ x: reduce ? 0 : dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: reduce ? 0 : dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="sq-cell reveal" data-size="tall">
      <div className="sq-album" role="group" aria-roledescription="carousel" aria-label="Photo album: swipe or use the arrows">
        <div className="sq-album-stage">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 400, damping: 33 }, opacity: { duration: 0.2 } }}
              drag={reduce ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60 || info.velocity.x < -400) paginate(1);
                else if (info.offset.x > 60 || info.velocity.x > 400) paginate(-1);
              }}
              className="sq-album-slide"
            >
              <Image src={photo.image} alt={photo.caption} fill sizes="(max-width: 768px) 100vw, 33vw" draggable={false} />
              <span className="sq-album-caption">{photo.caption}</span>
            </motion.div>
          </AnimatePresence>
          <span className="sq-tag">Album</span>
          <button type="button" className="sq-arrow" data-dir="prev" aria-label="Previous photo" onClick={() => paginate(-1)}>
            <Chevron d="m15 18-6-6 6-6" />
          </button>
          <button type="button" className="sq-arrow" data-dir="next" aria-label="Next photo" onClick={() => paginate(1)}>
            <Chevron d="m9 18 6-6-6-6" />
          </button>
        </div>
        <div className="sq-dots">
          {photos.map((p, i) => (
            <button
              key={p.caption}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === index}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Chevron({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const MOVE_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
  </svg>
);

const STICKER_SPOTS = [
  { rotate: -8, left: "12%", top: "22%" },
  { rotate: 7, left: "52%", top: "16%" },
  { rotate: -5, left: "18%", top: "58%" },
  { rotate: 11, left: "56%", top: "54%" },
];

/** A pile of hobby stickers to toss around inside the cell. */
function StickerCell({ stickers }: { stickers: { src: string; alt: string }[] }) {
  const bounds = useRef<HTMLDivElement>(null);
  return (
    <div className="sq-cell reveal" data-size="tall">
      <div ref={bounds} className="sq-play sq-pile">
        <p className="sq-play-title">Off-duty inventory</p>
        <p className="sq-hint">{MOVE_ICON}Drag the stickers around</p>
        {stickers.map((s, i) => {
          const spot = STICKER_SPOTS[i % STICKER_SPOTS.length];
          return (
            <motion.div
              key={s.src}
              drag
              dragConstraints={bounds}
              dragElastic={0.15}
              initial={{ rotate: spot.rotate }}
              whileHover={{ scale: 1.08 }}
              whileDrag={{ scale: 1.15, zIndex: 20 }}
              style={{ left: spot.left, top: spot.top }}
              className="sq-sticker"
            >
              <Image src={s.src} alt={s.alt} width={64} height={64} draggable={false} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const POLAROID_SPOTS = [
  { rotate: -7, left: "8%", top: "16%" },
  { rotate: 6, left: "40%", top: "10%" },
  { rotate: -3, left: "24%", top: "44%" },
];

/** Scattered polaroids: pick them up, toss them around. */
function PolaroidCell({ photos }: { photos: SideQuestPhoto[] }) {
  const bounds = useRef<HTMLDivElement>(null);
  // The last one grabbed stays on top.
  const [top, setTop] = useState<number | null>(null);
  return (
    <div className="sq-cell reveal" data-size="tall">
      <div ref={bounds} className="sq-play sq-keepsakes">
        <p className="sq-play-title sq-play-title--end">Keepsakes</p>
        <p className="sq-hint">{MOVE_ICON}Drag the polaroids</p>
        {photos.map((photo, i) => {
          const spot = POLAROID_SPOTS[i % POLAROID_SPOTS.length];
          return (
            <motion.figure
              key={photo.caption}
              drag
              dragConstraints={bounds}
              dragElastic={0.12}
              onDragStart={() => setTop(i)}
              initial={{ rotate: spot.rotate }}
              whileHover={{ scale: 1.05, rotate: 0 }}
              whileDrag={{ scale: 1.12, rotate: 0 }}
              style={{ left: spot.left, top: spot.top, zIndex: top === i ? 30 : 10 + i }}
              className="sq-polaroid"
            >
              <span className="sq-polaroid-photo">
                <Image src={photo.image} alt={photo.caption} fill sizes="7rem" draggable={false} />
              </span>
              <figcaption>{photo.caption}</figcaption>
            </motion.figure>
          );
        })}
      </div>
    </div>
  );
}

/** A small mystery card that rewards a click. */
function FlipCell({ fact }: { fact: string }) {
  const [flipped, setFlipped] = useState(false);
  const reduce = useReducedMotion();
  return (
    <div className="sq-cell reveal sq-flip" data-size="sm">
      <button type="button" aria-pressed={flipped} aria-label="Flip the fun-fact card" onClick={() => setFlipped((f) => !f)}>
        <motion.span
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : SPRING}
          className="sq-flip-inner"
        >
          <span className="sq-flip-face sq-flip-front">
            <span className="sq-card-title">Fun fact</span>
            <span className="sq-hint-inline">Tap to flip</span>
          </span>
          <span className="sq-flip-face sq-flip-back">{fact}</span>
        </motion.span>
      </button>
    </div>
  );
}

/* --- article ---------------------------------------------------------- */

function Article({ entry, layoutId, onClose }: { entry: SideQuest; layoutId: string; onClose: () => void }) {
  return (
    <>
      <motion.div
        className="sq-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />
      <div className="sq-dialog-wrap">
        <motion.article layoutId={layoutId} role="dialog" aria-modal="true" aria-label={entry.title} className="sq-dialog">
          <div className="sq-dialog-cover">
            <Cover entry={entry} />
            <button type="button" className="sq-close" aria-label="Close story" onClick={onClose} autoFocus>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <motion.div
            className="sq-dialog-body"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.15 }}
          >
            <p className="sq-meta">
              <span className="sq-badge">{KIND_LABEL[entry.kind]}</span>
              {entry.period}
            </p>
            <div>
              <h3 className="sq-dialog-title">{entry.title}</h3>
              <p className="sq-org">{entry.org}</p>
            </div>
            <p className="sq-lead">{entry.summary}</p>
            <p>{entry.story}</p>
            {entry.body?.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
            {entry.highlight && <blockquote>{entry.highlight}</blockquote>}
            <ul className="sq-skills">
              {entry.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </motion.div>
        </motion.article>
      </div>
    </>
  );
}
