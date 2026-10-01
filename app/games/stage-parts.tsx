import { PERSON } from "@/content/site";
import { STUDIO, type Stage } from "./games";

/** Play / source / follow, whichever the stage has. */
export function StageActions({ stage }: { stage: Stage }) {
  return (
    <p className="stage-actions">
      {stage.play && (
        <a className="stage-link" href={stage.play}>
          Play in browser
        </a>
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
