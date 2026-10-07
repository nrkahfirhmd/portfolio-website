/**
 * The tree whose shade falls across the index: drawn, not generated, since
 * branches are what make shade read as foliage. Keep the clusters few and big.
 * Colour comes from .leaves (--daylight-tint), never from here.
 */

/** Limb paths, thickest at the trunk and tapering out to the twigs. */
const LIMBS: [d: string, width: number][] = [
  ["M168 118 C 142 102 122 88 100 68", 3.6],
  ["M100 68 C 84 55 66 47 44 40", 2.5],
  ["M128 92 C 121 76 115 63 105 49", 1.9],
  ["M110 76 C 99 84 85 89 65 93", 1.7],
  ["M74 50 C 62 46 49 48 31 57", 1.3],
  ["M105 49 C 101 38 93 30 81 24", 1.1],
  ["M86 58 C 82 66 74 72 62 76", 1],
];

/** Leaf clusters [x, y, scale, rotation] at the forks and tips, hand-scattered (regular stops reading as a plant). */
const CLUSTERS: [x: number, y: number, s: number, r: number][] = [
  [152, 106, 1.6, 12],
  [128, 92, 1.35, -24],
  [140, 78, 1.25, 38],
  [100, 68, 1.5, -8],
  [118, 58, 1.05, 54],
  [105, 49, 1.15, -42],
  [86, 60, 1.1, -64],
  [81, 24, 0.9, 22],
  [65, 93, 1.2, 30],
  [62, 76, 0.95, -18],
  [44, 40, 1.25, 46],
  [31, 57, 1, -34],
  [58, 30, 0.8, 68],
];

export function Canopy() {
  return (
    <div className="canopy" aria-hidden="true">
      <svg className="canopy-defs" width="0" height="0" aria-hidden="true">
        <defs>
          {/* One cluster of nine leaves, centred on the origin. */}
          <g id="canopy-leaf" stroke="none">
            <ellipse rx="4.6" ry="2.2" transform="rotate(15)" />
            <ellipse cx="7.2" cy="-2.6" rx="4" ry="1.9" transform="rotate(-28 7.2 -2.6)" />
            <ellipse cx="-6.4" cy="2.2" rx="4.3" ry="2" transform="rotate(42 -6.4 2.2)" />
            <ellipse cx="2.6" cy="5.6" rx="3.6" ry="1.7" transform="rotate(-12 2.6 5.6)" />
            <ellipse cx="-2.2" cy="-5.4" rx="3.8" ry="1.8" transform="rotate(63 -2.2 -5.4)" />
            <ellipse cx="8.4" cy="4.4" rx="3.2" ry="1.5" transform="rotate(28 8.4 4.4)" />
            <ellipse cx="-8.8" cy="-3.4" rx="3.4" ry="1.6" transform="rotate(-38 -8.8 -3.4)" />
            <ellipse cx="4.8" cy="-7" rx="3" ry="1.4" transform="rotate(52 4.8 -7)" />
            <ellipse cx="-4.6" cy="7.6" rx="3.1" ry="1.5" transform="rotate(-56 -4.6 7.6)" />
          </g>

          {/* Trunk enters past the bottom-right corner and forks up and left. */}
          <g id="canopy-branch">
            <g fill="none" strokeLinecap="round">
              {LIMBS.map(([d, width]) => (
                <path key={d} d={d} strokeWidth={width} />
              ))}
            </g>
            {CLUSTERS.map(([x, y, s, r]) => (
              <use
                key={`${x}-${y}`}
                href="#canopy-leaf"
                transform={`translate(${x} ${y}) scale(${s}) rotate(${r})`}
              />
            ))}
          </g>
        </defs>
      </svg>

      {/* The same tree again, smaller and farther: depth for free. */}
      <svg
        className="leaves leaves-far"
        viewBox="0 0 160 110"
        preserveAspectRatio="xMaxYMax slice"
      >
        <use href="#canopy-branch" transform="translate(2 12) scale(0.72)" />
      </svg>

      <svg
        className="leaves leaves-near"
        viewBox="0 0 160 110"
        preserveAspectRatio="xMaxYMax slice"
      >
        <use href="#canopy-branch" />
      </svg>
    </div>
  );
}
