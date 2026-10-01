import { baseComponents } from "../story/components";
import { ProjectLinks } from "./parts";
import { projectByRepo } from "./projects";
import { SharedTitle } from "../page-transition";

/**
 * The story's title block: date and tags, name, one-liner, description,
 * languages, and links. `slug` is the repo name and is looked up in the
 * project registry, which **throws** on an unknown value — in the preview
 * that lands as an error message, not a crash.
 */
export function ArticleHeader({ slug }: { slug: string }) {
  const project = projectByRepo(slug);
  const languages = Object.entries(project.languages)
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang);
  return (
    <header className="story-head rise">
      <p className="story-meta">{[project.period, ...(project.tags ?? [])].join(" · ")}</p>
      <SharedTitle name={`title-${project.repo}`}>
        <h1 className="story-title">{project.name}</h1>
      </SharedTitle>
      <p className="story-msg">{project.tagline}</p>
      <p className="story-body">{project.body}</p>
      <p className="story-meta">{languages.join(" · ")}</p>
      <ProjectLinks project={project} />
    </header>
  );
}

/** Everything a software story can use: the shared blocks plus its header. */
export const storyComponents = { ...baseComponents, ArticleHeader };
