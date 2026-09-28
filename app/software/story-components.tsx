import { baseComponents } from "../story/components";
import { Diffstat, ProjectLinks, Refs } from "./parts";
import { projectByRepo } from "./projects";

/**
 * The story's title block, drawn as `git show <sha>`. `slug` is the repo name
 * and is looked up in the project registry, which **throws** on an unknown
 * value — in the preview that lands as an error message, not a crash.
 */
export function ArticleHeader({ slug }: { slug: string }) {
  const project = projectByRepo(slug);
  return (
    <header className="story-head">
      <p className="sw-cmd">
        <span aria-hidden="true">$ </span>git show {project.sha}
      </p>
      <h1 className="story-title">{project.name}</h1>
      <p className="story-msg">{project.message}</p>
      <p className="commit-line">
        <code className="sha">{project.sha}</code>
        <Refs project={project} />
        <span>{project.period}</span>
      </p>
      <Diffstat project={project} />
      <ProjectLinks project={project} />
    </header>
  );
}

/** Everything a software story can use: the shared blocks plus its header. */
export const storyComponents = { ...baseComponents, ArticleHeader };
