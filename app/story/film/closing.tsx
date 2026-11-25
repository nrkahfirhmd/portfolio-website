import Image from "next/image";
import { STORY } from "@/content/site";
import { ISLANDS, project } from "./islands";
import { Letters, Say, slot, Spot, vars } from "./parts";

/* ------------------------------------------------------------ the quiet one */

export function Coretax() {
  const { name, quiet, using, end } = STORY.coretax;
  return (
    <section className="fm-scene fm-told fm-coretax" data-scene="coretax" data-tone="light" style={slot("coretax")}>
      <div className="fm-art" aria-hidden="true">
        <div className="ct-dial">
          <div className="ct-hand">
            <Spot name="tick" at={2.6} until={5.4} live turn={-6} size={0.06} />
          </div>
          <p className="ct-clock" data-clock="">
            &lt;0:15
          </p>
        </div>
        <Spot name="blank" at={1.1} until={1.7} turn={-5} />
      </div>
      <div className="fm-copy">
        <h2 className="nr-title">{name}</h2>
        <div className="nr-stack">
          <Say text={quiet} at={0.2} travel={0.4} out={1.75} />
          <Say text={using} at={1.95} out={2.75} />
          <Say text={end} at={3} quiet />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Bandung to Bali */

export function IslandMap() {
  const { bandung, gpa, bali, motto, practice } = STORY.map;
  const [bx, by] = project(-6.91, 107.61);
  const [dx, dy] = project(-8.65, 115.22);
  return (
    <section className="fm-scene fm-told fm-map" data-scene="map" data-tone="day" style={slot("map")}>
      <div className="fm-art" aria-hidden="true">
        <div className="mp-camera">
          <svg viewBox="0 0 1230 380" className="mp-svg">
            <defs>
              <pattern id="mp-hatch" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(-14)">
                <rect width="3.2" height="3.2" className="mp-land" />
                <line x1="0" y1="1.6" x2="3.2" y2="1.6" className="mp-cut" />
              </pattern>
            </defs>
            <path d={ISLANDS} className="mp-water mp-water--3" />
            <path d={ISLANDS} className="mp-water mp-water--2" />
            <path d={ISLANDS} className="mp-water mp-water--1" />
            <path d={ISLANDS} fill="url(#mp-hatch)" className="mp-coast" />
            <path d={`M${bx} ${by} Q${(bx + dx) / 2} ${by - 150} ${dx} ${dy}`} pathLength={1} className="mp-route" />
            <circle cx={bx} cy={by} r="5" className="mp-pin" />
            <circle cx={dx} cy={dy} r="5" className="mp-pin mp-pin--bali" />
            <g data-head="">
              <circle r="4" fill="none" data-note="spot" data-live="" data-at="1.35" data-until="4.6" data-size="0.05" data-turn="-8" />
            </g>
            <text x={bx} y={by + 24} className="mp-place">
              Bandung
            </text>
            <text x={dx} y={dy - 14} className="mp-place mp-place--bali">
              Bali
            </text>
          </svg>
        </div>
        <figure className="mp-print mp-print--bandung">
          <span className="mp-photo">
            <Image src="/about-me/bandung_1.webp" alt="" width={1600} height={2134} sizes="(max-aspect-ratio: 1/1) 44vw, 24vw" />
          </span>
          <figcaption className="fm-hand">{gpa}</figcaption>
        </figure>
        <figure className="mp-print mp-print--bali">
          <span className="mp-photo">
            <Image src="/side-quests/academy.jpg" alt="" width={1600} height={1200} sizes="(max-aspect-ratio: 1/1) 70vw, 34vw" />
          </span>
        </figure>
      </div>
      <div className="fm-copy">
        <div className="nr-stack">
          <Say text={bandung} at={0.25} travel={0.4} out={2.05} />
          <p className="nr-sr">{gpa}</p>
          <Say text={bali} at={2.3} step={0.08} quiet out={4.5} />
          <div className="mp-motto">
            <Say
              text={motto}
              at={4.85}
              keyed={(_, text, at) => <Letters text={text} at={at} className="nr-delete" />}
            />
            <Say text={practice} at={6.55} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ next */

// Twelve people, counted the way you would on paper: two fives and a two.
const TALLY = Array.from({ length: 12 }, (_, i) => {
  const x = 14 + Math.floor(i / 5) * 128;
  const n = i % 5;
  return n === 4 ? `M${x - 12} 78 Q${x + 36} 52 ${x + 84} 20` : `M${x + n * 23} ${10 + (i % 3) * 3} q${(i % 2) * 5 - 2} 40 ${(i % 3) - 1} ${80 - (i % 2) * 5}`;
});

export function Next() {
  const { name, twelve, game, end } = STORY.next;
  return (
    <section className="fm-scene fm-told fm-next" data-scene="next" data-tone="dark" style={slot("next")}>
      <div className="fm-art" aria-hidden="true">
        <svg className="nx-tally" viewBox="0 0 330 100">
          {TALLY.map((d, i) => (
            <path key={d} d={d} pathLength={1} style={vars({ "--i": i })} />
          ))}
        </svg>
      </div>
      <div className="fm-copy">
        <h2 className="nr-title">{name}</h2>
        <div className="nr-stack">
          <Say text={twelve} at={0.2} travel={0.4} out={2.3} />
          <Say text={game} at={2.6} step={0.1} out={4.45} />
          <Say text={end} at={4.75} step={0.13} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ the notes */

// Where the notes sit in the photo (share of its width and height), so the rain can land on them.
const RAIN: [x: number, y: number, color: string, tilt: number][] = [
  [0.286, 0.51, "#f0913f", -20],
  [0.378, 0.494, "#d9d3dc", 32],
  [0.473, 0.486, "#e8e2e4", 1],
  [0.525, 0.475, "#b9d94a", 3],
  [0.718, 0.485, "#f0913f", 8],
  [0.624, 0.53, "#7fcdbf", -4],
  [0.389, 0.579, "#cfc6d2", 28],
  [0.525, 0.584, "#c9c0cd", 0],
  [0.726, 0.598, "#d4ccd6", 16],
  [0.417, 0.653, "#f07f88", 4],
  [0.664, 0.647, "#ef7d86", -6],
  [0.593, 0.681, "#b5d546", -14],
  [0.519, 0.713, "#f0858d", 4],
  [0.354, 0.735, "#d5de48", -18],
  [0.436, 0.768, "#2f8ea3", 22],
  [0.645, 0.754, "#f0823f", 4],
  [0.471, 0.837, "#bddb4a", -1],
  [0.559, 0.817, "#ef7f88", 7],
  [0.68, 0.818, "#cdb3de", 34],
];

export function Notes() {
  return (
    <section className="fm-scene fm-told fm-notes" data-scene="notes" data-tone="light" style={slot("notes")}>
      <div className="fm-notes-ground" aria-hidden="true" />
      <div className="nt-photo">
        <Image
          src="/about-me/bali_1.webp"
          alt="Kahfi from behind, shirt covered in handwritten sticky notes from friends at the Apple Developer Academy"
          width={1200}
          height={1600}
          sizes="(max-aspect-ratio: 1/1) 88vw, 46vw"
        />
        <div className="nt-rain" aria-hidden="true">
          {RAIN.map(([x, y, color, tilt], i) => (
            <i
              key={i}
              className="fm-paper"
              style={vars({ "--x": x, "--y": y, "--paper": color, "--tilt": `${tilt}deg`, "--i": (i * 7) % RAIN.length })}
            />
          ))}
        </div>
        <Spot name="last" at={4.35} until={99} turn={-6} travel={0.6} />
      </div>
      <div className="fm-copy">
        <div className="nr-stack">
          <div className="nt-lines">
            <Say text={STORY.notes[0]} at={2.15} travel={0.5} />
            <Say text={STORY.notes[1]} at={3.3} />
          </div>
        </div>
      </div>
    </section>
  );
}
