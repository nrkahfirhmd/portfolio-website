import Image from "next/image";
import Link from "next/link";
import { CURRENT, PROJECTS, STACK, type Project } from "./projects";

export default function Home() {
  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-gutter">
      <Intro />
      <Work />
    </main>
  );
}

function Intro() {
  return (
    <section className="py-gutter-lg max-w-3xl">
      <p className="mt-stack-sm text-tagline max-w-lg">
        Hi! I'm Kahfi and I design and ship AI systems that{" "}
        <em className="font-flourish font-medium text-ink">earns its place</em>
      </p>

      <p className="mt-stack text-label text-ink-muted">
        Currently {CURRENT.role} @ {" "}
        <a
          href={CURRENT.companyUrl}
          className="text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors duration-150"
        >
          {CURRENT.company}
        </a>
        .
      </p>

      {CURRENT.openToWork ? <OpenToWorkBadge /> : null}
    </section>
  );
}

function OpenToWorkBadge() {
  return (
    <a
      href="#contact"
      className="mt-stack-sm inline-flex items-center gap-2 rounded-full border border-accent bg-accent-soft px-3 py-1 text-caption font-medium tracking-wide text-accent-active hover:bg-accent-soft-hover transition-colors duration-150"
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />
        <span className="relative inline-flex size-2 rounded-full bg-accent" />
      </span>
      Open to work
    </a>
  );
}

function Work() {
  return (
    <section id="work" className="pb-gutter-lg scroll-mt-16">
      <h2 className="text-caption font-medium tracking-wider uppercase text-ink-muted">
        Selected work
      </h2>

      <div className="mt-stack-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack-xs auto-rows-[minmax(11rem,auto)]">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
        <StackPanel />
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const hasImage = Boolean(project.image);
  const hasArticle = project.hasArticle !== false;

  if (!hasArticle && !project.live) {
    throw new Error(
      `Project "${project.slug}" has hasArticle: false but no live URL to link to.`,
    );
  }

  return (
    // A project with a write-up goes to the story; a link-only project (no
    // article, just something live to show off) goes straight to `live`.
    // Content is absolutely positioned over the image, so the card carries no
    // in-flow height of its own — it fills whatever the grid track gives it
    // (the auto-rows floor, or double that plus gap on the featured tile).
    <Link
      href={hasArticle ? `/work/${project.slug}` : project.live!}
      data-cursor={hasArticle ? "Read the story" : "See the project"}
      data-cursor-icon={hasArticle ? "eye" : "arrow"}
      className={`card group relative block ${project.span}`}
    >
      {hasImage ? (
        <Image
          src={project.image!}
          alt={project.imageAlt ?? ""}
          fill
          sizes="(min-width: 64rem) 25vw, 50vw"
          className="object-cover transition-transform duration-[420ms] ease-[var(--motion-ease-playful)] group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
        />
      ) : (
        // No image yet: a flat sunken fill keeps the tile from reading as
        // broken while the name still anchors bottom-left, ink on ink.
        <div className="absolute inset-0 bg-surface-sunken" />
      )}

      {/* Scrim only when there is a photo under it — the name needs to read
          against arbitrary image content, not against our own flat fill. */}
      {hasImage ? (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, color-mix(in srgb, var(--color-border-strong) 80%, transparent) 0%, transparent 60%)",
          }}
        />
      ) : null}

      <div className="absolute top-[var(--spacing-stack-xs)] right-[var(--spacing-stack-xs)]">
        {project.comingSoon ? (
          <span className="chip">Soon</span>
        ) : (
          <span
            aria-hidden
            className="card-affordance motion-arrow group-hover:text-accent-active group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-[420ms] ease-[var(--motion-ease-playful)]"
          >
            {/* An SVG, not the "↗" glyph: that character sits off-centre in
                its own em box in every font, so flex-centering the span still
                looked lopsided. A drawn path centers for real. */}
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </span>
        )}
      </div>

      <h3
        // pr leaves room for the top-right badge to its own line; sized down
        // on narrow cards so a two-word name wrapping to two lines at the
        // featured size can't grow tall enough to reach it from the bottom.
        className={`absolute inset-x-0 bottom-0 pl-gutter pr-10 py-gutter font-medium tracking-tight ${
          project.featured ? "text-label sm:text-heading" : "text-caption sm:text-tagline"
        } ${hasImage ? "text-accent-foreground" : "text-ink"}`}
      >
        {project.name}
      </h3>
    </Link>
  );
}

function StackPanel() {
  return (
    <div className="panel p-gutter flex flex-col md:col-span-2">
      <h3 className="text-caption font-medium tracking-wider uppercase text-ink-muted">
        Stack
      </h3>

      <ul className="mt-stack-xs grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-label text-ink-muted">
        {STACK.map(({ name, icon }) => (
          <li key={name} className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="currentColor"
              className="shrink-0 text-ink"
              aria-hidden
            >
              <path d={icon.path} />
            </svg>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
