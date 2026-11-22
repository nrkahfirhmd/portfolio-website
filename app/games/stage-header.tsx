import { PERSON, STUDIO } from "@/content/site";
import { SharedTitle } from "../page-transition";
import { stageBySlug } from "./games";

const line = (parts: (string | undefined)[]) => parts.filter(Boolean).join(" · ");

function Arrow() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

/** A devlog's title block, same shape as a software story's. */
export function StageHeader({ slug }: { slug: string }) {
  const stage = stageBySlug(slug);
  const specifics = [stage.engine, stage.platforms, stage.role].filter(
    (v): v is string => Boolean(v),
  );
  const hasActions = Boolean(stage.play || stage.repo || stage.locked);

  return (
    <header className="story-head">
      <p className="story-meta">{line([stage.year, stage.status, stage.jam])}</p>
      <SharedTitle name={`title-${stage.slug}`}>
        <h1 className="story-title">{stage.name}</h1>
      </SharedTitle>
      {stage.genre && <p className="story-msg">{stage.genre}</p>}
      <p className="story-body">{stage.blurb}</p>
      {specifics.length > 0 && (
        <ul className="story-chips" aria-label="Engine, platforms, and role">
          {specifics.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {hasActions && (
        <div className="story-actions">
          {stage.play && (
            <a
              href={stage.play}
              target="_blank"
              rel="noopener noreferrer"
              className="story-action story-action--primary"
            >
              <span>Play in browser</span>
              <Arrow />
            </a>
          )}
          {stage.repo && (
            <a
              href={`https://github.com/${PERSON.github}/${stage.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="story-action"
            >
              <span>Source</span>
              <Arrow />
            </a>
          )}
          {stage.locked && (
            <a
              href={STUDIO.url}
              target="_blank"
              rel="noopener noreferrer"
              className="story-action story-action--primary"
            >
              <span>Follow on itch.io</span>
              <Arrow />
            </a>
          )}
        </div>
      )}
    </header>
  );
}
