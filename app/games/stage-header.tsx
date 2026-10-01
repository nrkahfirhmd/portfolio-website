import { stageBySlug } from "./games";
import { StageActions } from "./stage-parts";
import { SharedTitle } from "../page-transition";

/**
 * A devlog's title block, the same plain shape as a software story's
 * (story.css): year and status, name, genre, blurb, the making-of facts, and
 * links. `slug` is looked up in the stage registry and **throws** on an
 * unknown value — in the preview that lands as an error message, not a crash.
 */
export function StageHeader({ slug }: { slug: string }) {
  const stage = stageBySlug(slug);
  const line = (parts: (string | undefined)[]) => parts.filter(Boolean).join(" · ");
  return (
    <header className="story-head rise">
      <p className="story-meta">{line([stage.year, stage.status, stage.jam])}</p>
      <SharedTitle name={`title-${stage.slug}`}>
        <h1 className="story-title">{stage.name}</h1>
      </SharedTitle>
      {stage.genre && <p className="story-msg">{stage.genre}</p>}
      <p className="story-body">{stage.blurb}</p>
      <p className="story-meta">{line([stage.engine, stage.platforms, stage.role])}</p>
      <StageActions stage={stage} />
    </header>
  );
}
