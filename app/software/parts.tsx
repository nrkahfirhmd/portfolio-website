import Link from "next/link";
import type { Project } from "./projects";

/** Width of a full diffstat bar, in `+` signs — git's own default is 60,
 * halved so the longest bar still fits a phone line. */
const BAR = 30;

/** git-style decorations beside a hash: `(HEAD -> main, tag: live, …)`. */
export function Refs({ project, head }: { project: Project; head?: boolean }) {
  const refs = [
    ...(head ? ["HEAD -> main"] : []),
    ...(project.live ? ["tag: live"] : []),
    ...(project.refs ?? []),
  ];
  if (!refs.length) return null;
  return (
    <span className="refs">
      {"("}
      {refs.map((r, i) => (
        <span key={r}>
          {i > 0 && ", "}
          <span className={r.startsWith("HEAD") ? "ref ref-head" : "ref"}>{r}</span>
        </span>
      ))}
      {")"}
    </span>
  );
}

/** Languages by share of the repo, drawn like `git diff --stat`. */
export function Diffstat({ project }: { project: Project }) {
  const total = Object.values(project.languages).reduce((a, b) => a + b, 0);
  const langs = Object.entries(project.languages).sort((a, b) => b[1] - a[1]);
  return (
    <div
      className="diffstat"
      role="table"
      aria-label={`Languages in ${project.name}, by share of code`}
    >
      {langs.map(([lang, bytes]) => {
        const share = bytes / total;
        return (
          <div className="diff-row" role="row" key={lang}>
            <span role="cell" className="diff-lang">{lang}</span>
            <span role="cell" className="diff-pct">{Math.round(share * 100)}%</span>
            <span role="cell" className="diff-bar" aria-hidden="true">
              {"+".repeat(Math.max(1, Math.round(share * BAR)))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function Arrow() {
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

export function BackArrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

/** Source / Live / (optionally) story links for one project. */
export function ProjectLinks({ project, story }: { project: Project; story?: boolean }) {
  return (
    <p className="show-links">
      {story && (
        <Link href={`/software/work/${project.repo}`}>Read the story</Link>
      )}
      <a href={`https://github.com/nrkahfirhmd/${project.repo}`}>
        Source <Arrow />
      </a>
      {project.live && (
        <a href={project.live}>
          Live <Arrow />
        </a>
      )}
    </p>
  );
}
