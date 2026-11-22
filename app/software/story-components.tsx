import { PERSON } from "@/content/site";
import { SharedTitle } from "../page-transition";
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

/** A software story's title block; each line shows once its field is filled in. */
export function ArticleHeader({ slug }: { slug: string }) {
  const project = projectBySlug(slug);
  const meta = [project.period, ...(project.tags ?? [])].filter(Boolean);
  const specifics = [project.role, ...(project.stack ?? [])].filter(Boolean);
  const hasActions = Boolean(project.live || project.repo);

  return (
    <header className="story-head">
      {meta.length > 0 && <p className="story-meta">{meta.join(" · ")}</p>}
      <SharedTitle name={`title-${project.slug}`}>
        <h1 className="story-title">{project.name}</h1>
      </SharedTitle>
      {project.tagline && <p className="story-msg">{project.tagline}</p>}
      {project.body && <p className="story-body">{project.body}</p>}
      {specifics.length > 0 && (
        <ul className="story-chips" aria-label="Role and technologies">
          {specifics.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {hasActions && (
        <div className="story-actions">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="story-action story-action--primary"
            >
              <span>{project.live.includes("apps.apple.com") ? "App Store" : "Visit Live"}</span>
              <Arrow />
            </a>
          )}
          {project.repo && (
            <a
              href={`https://github.com/${PERSON.github}/${project.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="story-action"
            >
              <span>Source</span>
              <Arrow />
            </a>
          )}
        </div>
      )}
    </header>
  );
}
