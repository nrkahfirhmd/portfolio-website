import { PERSON } from "@/content/site";
import { SharedTitle } from "../page-transition";
import { HeroMedia, StoryMetaGrid } from "../story/components";
import { projectBySlug } from "./projects";

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

/** A software story's title block: hero kicker, title, CTAs, 4-cell metadata grid, and hero media stage. */
export function ArticleHeader({ slug }: { slug: string }) {
  const project = projectBySlug(slug);
  const kicker = [project.period, ...(project.tags ?? [])].filter(Boolean).join(" · ");
  const hasLive = Boolean(project.live);
  const liveLabel = project.live?.includes("apps.apple.com")
    ? "App Store"
    : "Visit Live";

  return (
    <header className="story-head">
      {kicker && <p className="story-meta">{kicker}</p>}
      <SharedTitle name={`title-${project.slug}`}>
        <h1 className="story-title">{project.name}</h1>
      </SharedTitle>
      {project.tagline && <p className="story-msg">{project.tagline}</p>}
      {project.body && <p className="story-body">{project.body}</p>}

      {(project.live || project.repo) && (
        <div className="story-actions">
          {project.live && (
            <a
              className="story-action story-action--primary"
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{liveLabel}</span>
              <Arrow />
            </a>
          )}
          {project.repo && (
            <a
              className={hasLive ? "story-action" : "story-action story-action--primary"}
              href={`https://github.com/${PERSON.github}/${project.repo}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Source</span>
              <Arrow />
            </a>
          )}
        </div>
      )}

      <StoryMetaGrid
        items={[
          { label: "Role", value: project.role },
          { label: "Timeline", value: project.period },
          { label: "Context", value: project.tags?.join(" · ") },
          { label: "Stack", value: project.stack?.join(" · ") },
        ]}
      />

      <HeroMedia
        src={project.screen ?? project.cover}
        alt={`${project.name} preview`}
        kind={project.platform}
      />
    </header>
  );
}
