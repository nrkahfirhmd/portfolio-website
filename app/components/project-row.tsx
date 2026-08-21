import Link from "next/link";
import type { Project } from "@/lib/content";
import { Chip } from "./chip";

const statusTone: Record<Project["status"], "accent" | "ink" | "accent-soft"> =
  {
    live: "accent",
    "coming-soon": "ink",
    archive: "accent-soft",
  };

export function ProjectRow({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group -mx-4 flex flex-col gap-2 rounded-lg border-y border-border px-4 py-5 transition-[color,transform,box-shadow] duration-150 hover:-translate-y-1 hover:border-accent hover:shadow-glow-accent"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-mono text-body font-medium text-ink">
          {project.name}
        </h3>
        <Chip tone={statusTone[project.status]}>{project.status}</Chip>
      </div>
      <p className="font-mono text-label text-ink-muted">{project.tagline}</p>
      <p className="font-mono text-caption uppercase tracking-wider text-ink-faint">
        {project.period}
      </p>
    </Link>
  );
}
