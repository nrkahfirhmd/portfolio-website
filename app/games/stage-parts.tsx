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
