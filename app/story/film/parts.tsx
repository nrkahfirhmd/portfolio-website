import type { CSSProperties, ReactNode } from "react";
import { SCENES, type SceneId } from "./timeline";

export const vars = (v: Record<string, string | number>) => v as CSSProperties;

/** When the scene scrolls in and away; see live.css. */
export const slot = (id: SceneId) => {
  const { enter, exit, length } = SCENES[id];
  return vars({ "--enter": `${enter}s`, "--exit": `${exit}s`, "--exit-at": `${length - exit}s` });
};

export function Words({ text }: { text: string }) {
  return text.split(" ").map((word, i) => (
    <span key={i} className="fm-word" style={vars({ "--i": i })}>
      {word}{" "}
    </span>
  ));
}


/** One word whose letters can act by themselves. */
export function Letters({ text, at, className, quiet }: { text: string; at: number; className: string; quiet?: boolean }) {
  return (
    <span className={`nr-key ${className}`}>
      <span className="nr-w" data-note={quiet ? undefined : "word"} data-at={at} style={vars({ "--t": `${at}s` })}>
        <span className="nr-i" aria-hidden="true">
          {text.split("").map((c, i) => (
            <span key={i} className="nr-l" style={vars({ "--i": i, "--n": text.length })}>
              {c}
            </span>
          ))}
        </span>
        <span className="nr-sr">{text}</span>
      </span>
    </span>
  );
}

/* ------------------------------------------------------------ sentences the note reads out */

type Key = (words: ReactNode, text: string, at: number) => ReactNode;

/** One sentence, a word every `step` seconds from `at`; the note lands on each. Gone after `out`. */
export function Say({
  text,
  at,
  step = 0.11,
  out,
  className = "",
  wait,
  travel,
  quiet,
  keyed = (words) => <span className="nr-key">{words}</span>,
}: {
  text: string | readonly string[];
  at: number;
  step?: number;
  out?: number;
  className?: string;
  /** [from this word on, this much later]: room for something to happen mid-sentence. */
  wait?: readonly [number, number];
  /** Seconds the note takes to reach the first word. */
  travel?: number;
  /** The note is busy elsewhere: the words come without it. */
  quiet?: boolean;
  /** Wraps the [bracketed] words. */
  keyed?: Key;
}) {
  let n = 0;
  const when = (i: number) => +(at + i * step + (wait && i >= wait[0] ? wait[1] : 0)).toFixed(3);
  const word = (w: string) => {
    const first = n === 0;
    const t = when(n);
    n++;
    return (
      <span key={n} className="nr-w" data-note={quiet ? undefined : "word"} data-at={t} data-travel={first ? travel : undefined} style={vars({ "--t": `${t}s` })}>
        <span className="nr-i">{w}</span>
      </span>
    );
  };
  const spaced = (phrase: string) =>
    phrase.split(" ").flatMap((w, i) => (i ? [" ", word(w)] : [word(w)]));
  const lines = typeof text === "string" ? [text] : text;
  return (
    <p className={`nr-say ${out ? "nr-say--out" : ""} ${className}`} style={vars({ "--out": `${out ?? 0}s` })}>
      {lines.map((line, l) => (
        <span key={line} className={lines.length > 1 ? "nr-line" : undefined}>
          {line.split(/(\[[^\]]+\][^\s]*)/).map((part, i) => {
            const key = part.match(/^\[([^\]]+)\](.*)$/);
            if (key) {
              const start = when(n);
              return <span key={i}>{keyed(spaced(key[1] + key[2]), key[1] + key[2], start)}</span>;
            }
            const trimmed = part.trim();
            if (!trimmed) return null;
            return (
              <span key={i}>
                {part.startsWith(" ") ? " " : null}
                {spaced(trimmed)}
                {part.endsWith(" ") ? " " : null}
              </span>
            );
          })}
          {l < lines.length - 1 ? " " : null}
        </span>
      ))}
    </p>
  );
}

/** Somewhere for the note to be that isn't a word. */
export function Spot({
  name,
  at,
  until,
  face,
  turn,
  round,
  travel,
  live,
  drop,
  keep,
  size,
}: {
  name: string;
  at: number;
  until?: number;
  face?: string;
  turn?: number;
  round?: number;
  travel?: number;
  live?: boolean;
  drop?: boolean;
  /** Keeps the last face on the way here. */
  keep?: boolean;
  /** As a share of the stage's shorter side; its own width without it. */
  size?: number;
}) {
  return (
    <i
      aria-hidden="true"
      className={`nr-spot nr-spot--${name}`}
      data-note="spot"
      data-at={at}
      data-until={until}
      data-face={face}
      data-turn={turn}
      data-round={round}
      data-travel={travel}
      data-live={live ? "" : undefined}
      data-drop={drop ? "" : undefined}
      data-keep={keep ? "" : undefined}
      data-size={size}
    />
  );
}

