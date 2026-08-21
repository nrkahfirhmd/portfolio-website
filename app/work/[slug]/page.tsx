import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/lib/content";
import { SectionLabel } from "../../components/section-label";
import { Chip } from "../../components/chip";

const statusTone = {
  live: "accent",
  "coming-soon": "ink",
  archive: "accent-soft",
} as const;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return { title: "Not found" };
  }

  return {
    title: `${project.name} — Kv`,
    description: project.tagline,
  };
}

export default async function WorkDetail({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-10 sm:px-8">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-label text-ink-muted transition-colors duration-150 hover:text-accent"
        >
          <span aria-hidden="true" className="text-accent">
            ~$
          </span>{" "}
          cd ..
        </Link>
        <span className="font-mono text-label text-ink-muted">Kv</span>
      </header>

      <main className="flex flex-col gap-12 pt-20">
        <section className="flex flex-col gap-6">
          <SectionLabel command={`cat work/${project.slug}.md`} />
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="font-mono text-heading font-medium text-ink">
                {project.name}
              </h1>
              <Chip tone={statusTone[project.status]}>{project.status}</Chip>
            </div>
            <p className="font-mono text-tagline text-ink-muted">
              {project.tagline}
            </p>
            <p className="font-mono text-caption uppercase tracking-wider text-ink-faint">
              {project.period}
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <p className="max-w-xl font-mono text-body text-ink">
            {project.description}
          </p>
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-body text-accent transition-colors duration-150 hover:text-accent-hover"
            >
              visit project
            </a>
          ) : null}
        </section>

        {project.highlights?.length ? (
          <section aria-labelledby="highlights-label">
            <SectionLabel id="highlights-label" command="cat highlights.md" />
            <ul className="mt-6 flex flex-col gap-3">
              {project.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="font-mono text-body text-ink-muted"
                >
                  <span aria-hidden="true" className="mr-2 text-accent">
                    -
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="stack-label">
          <SectionLabel id="stack-label" command="ls stack/" />
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li key={item}>
                <Chip tone="accent-soft">{item}</Chip>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
