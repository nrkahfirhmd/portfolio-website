import { PERSON } from "@/content/site";
import { SharedTitle } from "../page-transition";
import { HeroMedia, StoryMetaGrid } from "../story/components";
import { projectBySlug } from "./projects";

/** A software story's title block: hero kicker, title, CTAs, 4-cell metadata grid, and hero media stage. */
export function ArticleHeader({ slug }: { slug: string }) {
  const project = projectBySlug(slug);
  const kicker = [project.period, ...(project.tags ?? [])].filter(Boolean).join(" · ");
  const hasLive = Boolean(project.live);
  const liveLabel = project.live?.includes("apps.apple.com")
    ? "Open on App Store"
    : "Visit live site";

  return (
    <header className="story-head rise">
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
              className="story-btn story-btn--primary"
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
            >
              {liveLabel}
            </a>
          )}
          {project.repo && (
            <a
              className={hasLive ? "story-btn story-btn--secondary" : "story-btn story-btn--primary"}
              href={`https://github.com/${PERSON.github}/${project.repo}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View source on GitHub
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

      {project.screen && (
        <HeroMedia
          src={project.screen}
          alt={`${project.name} interface preview`}
          kind={project.platform ?? "web"}
        />
      )}
    </header>
  );
}
