// Devlog diagrams drawn in HTML/SVG on the site's tokens, so they stay sharp and follow the theme. Styles in games.css.

const STAGES = [
  { at: 60, label: "The operator comes over and asks what you're doing." },
  { at: 90, label: "They ask again. Only the right answer keeps you seated." },
  { at: 100, label: "Caught. The session is over." },
];

/** WarNet's suspicion meter: calm, then questioned, then caught. */
export function SuspicionMeter() {
  return (
    <figure className="st-figure">
      <div className="dg-panel">
        <div
          className="dg-meter"
          role="img"
          aria-label="Suspicion meter from 0 to 100. At 60 the operator asks what you're doing, at 90 they ask again and you need the right answer, at 100 you're caught."
        >
          <div className="dg-meter-bar" aria-hidden="true">
            <span data-level="calm" style={{ flexGrow: 60 }} />
            <span data-level="asked" style={{ flexGrow: 30 }} />
            <span data-level="final" style={{ flexGrow: 10 }} />
            <span className="dg-meter-you" />
          </div>
          <div className="dg-meter-ticks" aria-hidden="true">
            {[0, ...STAGES.map((s) => s.at)].map((at) => (
              <span key={at} style={{ "--at": `${at}%` } as React.CSSProperties}>
                {at}
              </span>
            ))}
          </div>
        </div>
        <ol className="dg-legend">
          {STAGES.map((s, i) => (
            <li key={s.at} data-level={["asked", "final", "caught"][i]}>
              <b>{s.at}</b>
              {s.label}
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}

/** Pedestrians as [x, seconds to cross, delay]: different speeds, staggered starts. */
const WALKERS: [x: number, dur: number, delay: number][] = [
  [162, 7, 0],
  [180, 9.5, -3],
  [198, 6, -1.5],
  [216, 8.5, -6],
  [234, 7.5, -4],
  [252, 10, -2],
  [270, 6.5, -5],
  [288, 9, -7.5],
];

/** Body Count's crowd: spawned above the screen only when needed, removed past the bottom line. */
export function CrowdFlow() {
  return (
    <figure className="st-figure">
      <div className="dg-panel">
        <svg
          className="dg-crowd"
          viewBox="0 0 400 260"
          role="img"
          aria-label="Pedestrians spawn above the visible crossing only when the crowd needs more, cross it at different speeds, and are removed once they pass the bottom line."
        >
          {/* The visible portrait crossing, with horizontal zebra bars stacked down the street. */}
          <rect className="dg-screen" x="155" y="42" width="140" height="176" rx="6" />
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} className="dg-zebra" x="166" y={54 + i * 26} width="118" height="14" rx="2" />
          ))}
          <line className="dg-edge" x1="147" y1="42" x2="303" y2="42" />
          <line className="dg-edge" x1="147" y1="218" x2="303" y2="218" />

          {WALKERS.map(([x, dur, delay]) => (
            <circle
              key={x}
              className="dg-walker"
              cx={x}
              cy="0"
              r="6"
              style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
            />
          ))}

          {/* Numbered steps, keyed to the list below. */}
          {[
            [30, "1"],
            [130, "2"],
            [230, "3"],
          ].map(([y, n]) => (
            <g key={n} className="dg-step" transform={`translate(30 ${y})`}>
              <circle r="13" />
              <text dy="0.35em">{n}</text>
            </g>
          ))}
        </svg>
        <ol className="dg-legend dg-legend--steps">
          <li>
            <span>
              <b>Spawn</b> above the screen, only when the crowd needs more people.
            </span>
          </li>
          <li>
            <span>
              <b>Cross</b> each at their own speed and their own moment.
            </span>
          </li>
          <li>
            <span>
              <b>Removed</b> as soon as they pass the bottom line.
            </span>
          </li>
        </ol>
      </div>
      <figcaption>Every pedestrian goes through steps 1 to 3, all wave long.</figcaption>
    </figure>
  );
}
