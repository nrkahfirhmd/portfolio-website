import { PERSON } from "@/content/site";
import { SharedTitle } from "../page-transition";
import { projectBySlug } from "./projects";

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
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
  return (
    <header className="story-head rise">
      {meta.length > 0 && <p className="story-meta">{meta.join(" · ")}</p>}
      <SharedTitle name={`title-${project.slug}`}>
        <h1 className="story-title">{project.name}</h1>
      </SharedTitle>
      {project.tagline && <p className="story-msg">{project.tagline}</p>}
      {project.body && <p className="story-body">{project.body}</p>}
      {specifics.length > 0 && <p className="story-meta">{specifics.join(" · ")}</p>}
      <p className="show-links">
        {project.repo && (
          <a href={`https://github.com/${PERSON.github}/${project.repo}`}>
            Source <Arrow />
          </a>
        )}
        {project.live && (
          <a href={project.live}>
            {project.live.includes("apps.apple.com") ? "App Store" : "Live"} <Arrow />
          </a>
        )}
      </p>
    </header>
  );
}
