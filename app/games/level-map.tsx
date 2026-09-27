"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { STORY_SLUGS, type Stage } from "./games";
import { LockIcon, StageActions, StageStats } from "./stage-parts";

type Pt = [x: number, y: number];

/** Two layouts of the same map: a wide snake for desktop, a tall zigzag for
 * phones. Node buttons sit over the SVG trail in % of the viewBox, so the
 * trail can scale freely while the buttons stay real, focusable HTML. */
const LAYOUTS = {
  wide: { w: 1000, h: 240, pts: [[90, 170], [300, 80], [500, 165], [700, 75], [910, 155]] as Pt[] },
  tall: { w: 360, h: 640, pts: [[95, 70], [265, 195], [100, 325], [260, 455], [180, 580]] as Pt[] },
};

/** Catmull-Rom through the nodes, as cubic Béziers — a trail that bends
 * through every stage instead of kinking at each one. */
function trail(pts: Pt[]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/**
 * Level select. Pick a stage by click or arrow keys; the pawn hops along to
 * it and the stage card below swaps in. The hop is the page's one authored
 * motion moment — position eases on the wrapper, the arc is a keyframe on
 * the inner sprite, re-keyed per move so it replays every time.
 */
export function LevelMap({ stages }: { stages: Stage[] }) {
  // Start on the newest playable stage, not the locked teaser.
  const [sel, setSel] = useState(() => {
    const last = stages.findLastIndex((s) => !s.locked);
    return last === -1 ? 0 : last;
  });
  const [hops, setHops] = useState(0);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});

  function select(i: number, layout: string, focus = false) {
    const next = (i + stages.length) % stages.length;
    if (next !== sel) setHops((h) => h + 1);
    setSel(next);
    if (focus) buttons.current[`${layout}-${next}`]?.focus();
  }

  const stage = stages[sel];

  return (
    <>
      {(Object.keys(LAYOUTS) as (keyof typeof LAYOUTS)[]).map((key) => {
        const { w, h, pts } = LAYOUTS[key];
        const pos = (i: number) => ({
          left: `${(pts[i][0] / w) * 100}%`,
          top: `${(pts[i][1] / h) * 100}%`,
        });
        return (
          <div
            key={key}
            className={`map map-${key}`}
            style={{ aspectRatio: `${w} / ${h}` }}
            role="group"
            aria-label="Level select. Use arrow keys to move between stages."
          >
            <svg viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
              <path className="trail" d={trail(pts.slice(0, stages.length))} />
            </svg>

            {stages.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  buttons.current[`${key}-${i}`] = el;
                }}
                type="button"
                className="stage-node"
                data-locked={s.locked || undefined}
                aria-pressed={i === sel}
                aria-controls="stage-card"
                aria-label={`Stage ${s.id}: ${s.locked ? "locked" : s.name}`}
                style={pos(i)}
                onClick={() => select(i, key)}
                onKeyDown={(e) => {
                  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
                  if (!step) return;
                  e.preventDefault();
                  select(i + step, key, true);
                }}
              >
                {s.locked ? <LockIcon /> : s.id}
              </button>
            ))}

            <div className="pawn" style={pos(sel)} aria-hidden="true">
              <div key={hops} className={hops ? "pawn-sprite pawn-hop" : "pawn-sprite"}>
                <Pawn />
              </div>
            </div>
          </div>
        );
      })}

      <article
        id="stage-card"
        className="stage-card"
        aria-live="polite"
        data-locked={stage.locked || undefined}
      >
        <div key={stage.id} className="stage-swap">
          <div className="stage-art">
            {stage.cover ? (
              <Image
                src={stage.cover}
                alt={`${stage.name} cover art`}
                width={630}
                height={500}
                sizes="(max-width: 720px) 100vw, 22rem"
              />
            ) : (
              <span className="stage-art-empty" aria-hidden="true">
                {stage.locked ? <LockIcon /> : stage.id}
              </span>
            )}
          </div>

          <div className="stage-info">
            <h3 className="stage-title">
              <span className="stage-num">{stage.id}</span>
              {stage.name}
            </h3>
            <p className="stage-blurb">{stage.blurb}</p>

            <StageStats stage={stage} />
            <StageActions stage={stage} devlog={STORY_SLUGS.has(stage.slug)} />
          </div>
        </div>
      </article>
    </>
  );
}

/** A board-game pawn: the player marker. */
function Pawn() {
  return (
    <svg viewBox="0 0 24 32" width="30" height="40" aria-hidden="true">
      <ellipse className="pawn-shadow" cx="12" cy="30" rx="8" ry="2" />
      <circle cx="12" cy="7" r="5" />
      <path d="M7.5 13.5h9l-1.6 3.5 3.6 9.5a1.5 1.5 0 0 1-1.4 2H6.9a1.5 1.5 0 0 1-1.4-2l3.6-9.5z" />
    </svg>
  );
}
