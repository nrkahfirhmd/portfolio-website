import Image from "next/image";
import Link from "next/link";
import { Masonry } from "./masonry";
import { PROJECTS, type Project } from "./projects";

// "Selected work" on /software: a Pinterest-style masonry of project covers.
// A tile is only its image; hover or focus reveals the name and date, and the
// whole tile opens the project's page, whose header carries the details.
// Projects without a `cover` yet show their system diagram instead.

// --- the system diagram, the fallback cover ---------------------------------

const BOX_W = 132;
const BOX_H = 46;
const GAP_X = 44;
const GAP_Y = 30;
const PAD = 2;

/** One project's `system` as SVG. `vertical` transposes the grid (x <-> y)
 * so a four-step pipeline reads top-down on a phone instead of shrinking to
 * unreadable type. */
function SystemDiagram({ project, vertical = false }: { project: Project; vertical?: boolean }) {
  const nodes = project.system.nodes.map((n) => ({ ...n, gx: vertical ? n.y : n.x, gy: vertical ? n.x : n.y }));
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
      aria-label={`${project.name}: ${project.system.edges
        .map(([a, b]) => `${at.get(a)!.n.label} to ${at.get(b)!.n.label}`)
        .join(", ")}`}
    >
      {project.system.edges.map(([a, b], i) => {
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

export function Bento() {
  return (
    <Masonry className="bento">
      {PROJECTS.map((p) => (
        <Link
          key={p.repo}
          className="tile"
          href={`/software/work/${p.repo}`}
          data-cursor-label="Read the story"
        >
          {p.cover ? (
            <Image
              className="tile-cover"
              src={p.cover.src}
              width={p.cover.width}
              height={p.cover.height}
              sizes="(max-width: 640px) 100vw, 22rem"
              alt=""
            />
          ) : (
            // Top-down: a masonry column is narrow at every width, and a
            // pipeline shrunk sideways would be unreadable type. Hidden from
            // screen readers: the caption already names the link.
            <span className="sys-frame" aria-hidden="true">
              <SystemDiagram project={p} vertical />
            </span>
          )}
          <span className="tile-caption">
            <span className="tile-name">{p.name}</span>
            <span className="tile-when">{p.period}</span>
          </span>
        </Link>
      ))}
    </Masonry>
  );
}
