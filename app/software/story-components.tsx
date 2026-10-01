import { baseComponents } from "../story/components";
import { ProjectLinks } from "./parts";
import { projectBySlug } from "./projects";
import { SharedTitle } from "../page-transition";

/**
 * The story's title block: date and tags, name, one-liner, description,
 * role and stack, and links, each only once it's filled in. `slug` is looked up
 * in the project registry, which **throws** on an unknown value — in the preview
 * that lands as an error message, not a crash.
 */
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
      <ProjectLinks project={project} />
    </header>
  );
}

/** Everything a software story can use: the shared blocks plus its header. */
export const storyComponents = { ...baseComponents, ArticleHeader };
