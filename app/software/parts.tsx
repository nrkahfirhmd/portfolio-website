import Link from "next/link";
import { PERSON } from "@/content/site";
import type { Project } from "./projects";

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
        <Link href={`/software/work/${project.slug}`}>Read the story</Link>
      )}
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
  );
}
