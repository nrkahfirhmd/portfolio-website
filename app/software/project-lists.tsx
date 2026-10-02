import Image from "next/image";
import Link from "next/link";
import { CartVideo } from "../games/cart-media";
import { Masonry } from "./masonry";
import { PROJECTS, type Project } from "./projects";
import { SharedTitle } from "../page-transition";

// "Selected work" on /software: a Pinterest-style masonry of project covers.
// A tile is only its image; hover or focus reveals the name and date, and the
// whole tile opens the project's page, whose header carries the details.
// Projects without a `cover` yet show their system diagram instead. Mobile
// and web projects are a showcase: a device screen over a blurred backdrop.

// --- the system diagram, the fallback cover ---------------------------------

const BOX_W = 132;
const BOX_H = 46;
const GAP_X = 44;
const GAP_Y = 30;
const PAD = 2;

/** One project's `system` as SVG. `vertical` transposes the grid (x <-> y)
 * so a four-step pipeline reads top-down on a phone instead of shrinking to
 * unreadable type. */
function SystemDiagram({
  name,
  system,
  vertical = false,
}: {
  name: string;
  system: NonNullable<Project["system"]>;
  vertical?: boolean;
}) {
  const nodes = system.nodes.map((n) => ({ ...n, gx: vertical ? n.y : n.x, gy: vertical ? n.x : n.y }));
  const cols = Math.max(...nodes.map((n) => n.gx)) + 1;
  const rows = Math.max(...nodes.map((n) => n.gy)) + 1;
  const w = cols * BOX_W + (cols - 1) * GAP_X + PAD * 2;
  const h = rows * BOX_H + (rows - 1) * GAP_Y + PAD * 2;
  const at = new Map(
    nodes.map((n) => [n.id, { x: PAD + n.gx * (BOX_W + GAP_X), y: PAD + n.gy * (BOX_H + GAP_Y), n }]),
  );

  return (
    <svg
      className={`sys${vertical ? " sys--v" : ""}`}
      viewBox={`0 0 ${w} ${h}`}
      // Natural size where there is room, scaled down only when there isn't:
      // the labels are drawn at 12px and should stay there.
      style={{ "--sys-w": `${w}px` } as React.CSSProperties}
      role="img"
      aria-label={`${name}: ${system.edges
        .map(([a, b]) => `${at.get(a)!.n.label} to ${at.get(b)!.n.label}`)
        .join(", ")}`}
    >
      {system.edges.map(([a, b], i) => {
        const A = at.get(a)!;
        const B = at.get(b)!;
        // Leave along the main axis when the target is further along it,
        // otherwise drop across; either way a soft S-curve, never a kink.
        const forward = vertical ? B.y > A.y : B.x > A.x;
        let d: string;
        if (vertical ? forward : !forward) {
          const x1 = A.x + BOX_W / 2, y1 = A.y + BOX_H, x2 = B.x + BOX_W / 2, y2 = B.y;
          const m = (y1 + y2) / 2;
          d = `M${x1} ${y1} C${x1} ${m} ${x2} ${m} ${x2} ${y2 - 4}`;
        } else {
          const x1 = A.x + BOX_W, y1 = A.y + BOX_H / 2, x2 = B.x, y2 = B.y + BOX_H / 2;
          const m = (x1 + x2) / 2;
          d = `M${x1} ${y1} C${m} ${y1} ${m} ${y2} ${x2 - 4} ${y2}`;
        }
        return (
          <g key={i} className="sys-edge" style={{ "--e": i } as React.CSSProperties}>
            <path className="sys-wire" d={d} />
            <path className="sys-flow" d={d} pathLength={1} />
          </g>
        );
      })}
      {[...at.values()].map(({ x, y, n }) => (
        <g key={n.id} className="sys-node" transform={`translate(${x} ${y})`}>
          <rect width={BOX_W} height={BOX_H} rx="7" />
          <text x="12" y={n.sub ? 20 : 28} className="sys-label">
            {n.label}
          </text>
          {n.sub && (
            <text x="12" y="35" className="sys-sub">
              {n.sub}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/** A tile's shape: "tall" one cell across and two down, "wide" two across
 * and one down, or square. */
export type Shape = "tall" | "wide" | "square";

/**
 * A showcase tile's media, shared with the /games library: the backdrop,
 * blurred, and in front of it either a screen (tall: an iPhone, wide: a Mac
 * window, with the recording or a still inside) or, on a square tile, the
 * logo. Decorative: the caption names it.
 */
export function Showcase({
  name,
  shape,
  backdrop,
  screen,
  logo,
}: {
  name: string;
  shape: Shape;
  backdrop?: string;
  screen?: string;
  logo?: string;
}) {
  const video = screen && /\.(mp4|webm|mov)$/i.test(screen);
  return (
    <span className="showcase" aria-hidden="true">
      {backdrop && (
        <Image className="showcase-bg" src={backdrop} alt="" fill sizes="(max-width: 640px) 100vw, 40rem" />
      )}
      {shape === "square" ? (
        logo ? (
          <span className="showcase-logo">
            <Image src={logo} alt="" fill sizes="(max-width: 640px) 50vw, 12rem" />
          </span>
        ) : (
          // No logo yet: the name stands in as a wordmark.
          <span className="showcase-logo showcase-wordmark">{name}</span>
        )
      ) : (
        <span className="showcase-screen">
          {video ? (
            // "#t=0.1" makes browsers paint that frame while the video sits
            // paused, rather than a blank screen until the first hover.
            <CartVideo src={`${screen}#t=0.1`} />
          ) : screen ? (
            <Image src={screen} alt="" fill sizes="(max-width: 640px) 80vw, 24rem" />
          ) : (
            <span className="showcase-blank">{name}</span>
          )}
        </span>
      )}
    </span>
  );
}

const SHAPE = { mobile: "tall", web: "wide" } as const;

export function Bento() {
  return (
    <Masonry className="bento">
      {PROJECTS.map((p) => (
        <Link
          key={p.slug}
          className="tile reveal"
          data-shape={p.platform && SHAPE[p.platform]}
          href={`/software/work/${p.slug}`}
          transitionTypes={["nav-forward"]}
          data-cursor-label="Read the story"
        >
          {p.platform || p.logo ? (
            <Showcase
              name={p.name}
              shape={p.platform ? SHAPE[p.platform] : "square"}
              backdrop={p.cover?.src}
              screen={p.screen}
              logo={p.logo}
            />
          ) : p.cover ? (
            <Image
              className="tile-cover"
              src={p.cover.src}
              width={p.cover.width}
              height={p.cover.height}
              sizes="(max-width: 640px) 100vw, 22rem"
              alt=""
            />
          ) : p.system ? (
            // Top-down: a masonry column is narrow at every width, and a
            // pipeline shrunk sideways would be unreadable type. Hidden from
            // screen readers: the caption already names the link.
            <span className="sys-frame" aria-hidden="true">
              <SystemDiagram name={p.name} system={p.system} vertical />
            </span>
          ) : (
            <span className="tile-empty" aria-hidden="true">
              {p.name}
            </span>
          )}
          <span className="tile-caption">
            <SharedTitle name={`title-${p.slug}`}>
              <span className="tile-name">{p.name}</span>
            </SharedTitle>
            {p.period && <span className="tile-when">{p.period}</span>}
          </span>
        </Link>
      ))}
    </Masonry>
  );
}
