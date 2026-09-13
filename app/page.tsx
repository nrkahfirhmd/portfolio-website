import { profile, projects } from "@/lib/content";
import { ProjectRow } from "./components/project-row";
import { SectionLabel } from "./components/section-label";
import { SocialLinks } from "./components/social-links";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main
        id="top"
        className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-16 px-6 pt-20 pb-10 sm:px-8"
      >
        <section aria-labelledby="intro" className="flex flex-col gap-8">
          <h1
            id="intro"
            className="font-mono text-display font-bold leading-none tracking-tight text-ink"
          >
            {profile.name}
            <span className="ml-3 font-mono text-label font-medium text-ink-muted">
              {profile.pronunciation}
            </span>
          </h1>

          <p className="font-mono text-tagline text-ink-muted">
            <span className="text-accent">~$</span> {profile.role}
          </p>

          <p className="max-w-xl font-mono text-body text-ink">
            {profile.tagline.split(profile.flourish)[0]}
            <span className="font-flourish italic text-accent">
              {profile.flourish}
            </span>
            {profile.tagline.split(profile.flourish)[1]}
          </p>

          <p className="max-w-xl font-mono text-body text-ink-muted">
            {profile.bio}
          </p>

          <p className="font-mono text-label text-ink-muted">
            <span className="text-accent">~$</span> {profile.currently}
            <span aria-hidden="true" className="cursor-blink ml-1 inline-block">
              ▊
            </span>
          </p>
        </section>

        <section id="work" aria-labelledby="work-label" className="scroll-mt-8">
          <SectionLabel id="work-label" command="cat work.md" />
          <div className="mt-6 flex flex-col">
            {projects.map((project) => (
              <ProjectRow key={project.slug} project={project} />
            ))}
          </div>
        </section>

        <footer id="contact" aria-labelledby="contact-label" className="scroll-mt-8">
          <SectionLabel id="contact-label" command="contact" />
          <div className="mt-6 flex flex-col gap-5">
            <a
              href={`mailto:${profile.email}`}
              className="font-mono text-body text-accent transition-colors duration-150 hover:text-accent-hover"
            >
              {profile.email}
            </a>
            <SocialLinks />
          </div>
        </footer>
      </main>
    </div>
  );
}
