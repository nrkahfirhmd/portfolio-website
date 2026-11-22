import { PERSON, STUDIO } from "@/content/site";
import { SharedTitle } from "../page-transition";
import { HeroMedia, StoryMetaGrid } from "../story/components";
import { stageBySlug } from "./games";

const line = (parts: (string | undefined)[]) => parts.filter(Boolean).join(" · ");

/** A devlog's title block, sharing the same 4-zone hero shape as software stories. */
export function StageHeader({ slug }: { slug: string }) {
  const stage = stageBySlug(slug);
  const kicker = line([stage.year, stage.jam]);
  const heroSrc = stage.video ?? stage.screen ?? stage.cover;
  const hasPrimary = Boolean(stage.play || stage.testflight);

  return (
    <header className="story-head rise">
      {(kicker || stage.award) && (
        <div className="story-kicker-row">
          {kicker && <p className="story-meta">{kicker}</p>}
          {stage.award && (
            <p className="story-meta stage-award">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
              <span>{stage.award}</span>
            </p>
          )}
        </div>
      )}

      <SharedTitle name={`title-${stage.slug}`}>
        <h1 className="story-title">{stage.name}</h1>
      </SharedTitle>

      <p className="story-msg">{stage.blurb}</p>

      {(stage.play || stage.testflight || stage.repo || stage.locked) && (
        <div className="story-actions">
          {stage.play && (
            <a
              className="story-btn story-btn--primary"
              href={stage.play}
              target="_blank"
              rel="noopener noreferrer"
            >
              Play on itch.io
            </a>
          )}
          {stage.testflight && (
            <a
              className={stage.play ? "story-btn story-btn--secondary" : "story-btn story-btn--primary"}
              href={stage.testflight}
              target="_blank"
              rel="noopener noreferrer"
            >
              Try iOS TestFlight
            </a>
          )}
          {stage.repo && (
            <a
              className={hasPrimary ? "story-btn story-btn--secondary" : "story-btn story-btn--primary"}
              href={`https://github.com/${PERSON.github}/${stage.repo}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View source on GitHub
            </a>
          )}
          {stage.locked && (
            <a
              className={hasPrimary ? "story-btn story-btn--secondary" : "story-btn story-btn--primary"}
              href={STUDIO.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow on itch.io
            </a>
          )}
        </div>
      )}

      <StoryMetaGrid
        items={[
          { label: "Role", value: stage.role },
          { label: "Genre", value: stage.genre },
          { label: "Team", value: stage.team },
          { label: "Engine & Platform", value: line([stage.engine, stage.platforms]) },
        ]}
      />

      {heroSrc && <HeroMedia src={heroSrc} alt={`${stage.name} preview`} kind="web" />}
    </header>
  );
}
