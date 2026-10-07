import { PERSON, STUDIO } from "@/content/site";
import { SharedTitle } from "../page-transition";
import { stageBySlug } from "./games";

const line = (parts: (string | undefined)[]) => parts.filter(Boolean).join(" · ");

/** A devlog's title block, same shape as a software story's. */
export function StageHeader({ slug }: { slug: string }) {
  const stage = stageBySlug(slug);
  return (
    <header className="story-head rise">
      <p className="story-meta">{line([stage.year, stage.status, stage.jam])}</p>
      <SharedTitle name={`title-${stage.slug}`}>
        <h1 className="story-title">{stage.name}</h1>
      </SharedTitle>
      {stage.genre && <p className="story-msg">{stage.genre}</p>}
      <p className="story-body">{stage.blurb}</p>
      <p className="story-meta">{line([stage.engine, stage.platforms, stage.role])}</p>
      <p className="stage-actions">
        {stage.play && (
          <a href={stage.play}>
            Play in browser
          </a>
        )}
        {stage.repo && (
          <a href={`https://github.com/${PERSON.github}/${stage.repo}`}>
            Source
          </a>
        )}
        {stage.locked && (
          <a href={STUDIO.url}>
            Follow on itch.io
          </a>
        )}
      </p>
    </header>
  );
}
