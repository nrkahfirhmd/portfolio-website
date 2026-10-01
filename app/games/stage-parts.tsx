import Link from "next/link";
import { PERSON } from "@/content/site";
import { STUDIO, type Stage } from "./games";

/** Label ....... value rows: the stage's facts. */
export function StageStats({ stage }: { stage: Stage }) {
  const rows = (
    [
      ["Genre", stage.genre],
      ["Engine", stage.engine],
      ["Platforms", stage.platforms],
      ["Role", stage.role],
      ["Made for", stage.jam],
      ["Year", stage.year],
      ["Status", stage.status],
    ] as const
  ).filter(([, v]) => v);
  return (
    <dl className="stage-stats">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Play / devlog / source / follow, whichever the stage has. */
export function StageActions({ stage, devlog }: { stage: Stage; devlog?: boolean }) {
  return (
    <p className="stage-actions">
      {stage.play && (
        <a className="play" href={stage.play}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
          </svg>
          Play in browser
        </a>
      )}
      {devlog && (
        <Link className="stage-link" href={`/games/stage/${stage.slug}`}>
          Read the devlog
        </Link>
      )}
      {stage.repo && (
        <a className="stage-link" href={`https://github.com/${PERSON.github}/${stage.repo}`}>
          Source
        </a>
      )}
      {stage.locked && (
        <a className="stage-link" href={STUDIO.url}>
          Follow on itch.io
        </a>
      )}
    </p>
  );
}

export function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
