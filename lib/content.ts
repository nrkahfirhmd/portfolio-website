export type ProjectStatus = "live" | "coming-soon" | "archive";

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  period: string;
  status: ProjectStatus;
  stack: string[];
  href?: string;
  highlights?: string[];
};

export type Social = {
  key: "github" | "linkedin";
  label: string;
  href: string;
};

export const profile = {
  name: "Kahfi",
  role: "Systems Engineer",
  pronunciation: "/ˈkɑː.fi/",
  tagline: "I design the systems that keep everything running.",
  flourish: "everything",
  bio: "I work across infrastructure, automation, and observability behind the software people depend on. My focus is simple: reliability without complexity, and tooling that gets out of the way.",
  currently: "Currently focused on reliable, observable systems for small teams.",
  email: "nurkahfirahmada@gmail.com",
};

/** Slugs that have a long-form story at `content/work/<slug>.mdx`. */
export const storySlugs = new Set<string>(["platform-gateway"]);

export function getProject(slug: string): Project {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Unknown project slug: "${slug}"`);
  return project;
}

export const socials: Social[] = [
  { key: "github", label: "GitHub", href: "https://github.com/nrkahfirhmd" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/nrkahfirhmd" },
];

export const projects: Project[] = [
  {
    slug: "platform-gateway",
    name: "Platform Gateway",
    tagline: "Single entry point for a multi-service product surface.",
    description:
      "A routing and auth gateway that fronts several internal services with one stable URL, consistent auth, and shared observability.",
    period: "2024 — Present",
    status: "live",
    stack: ["Go", "Docker", "Kubernetes", "Prometheus"],
    href: "https://example.com",
    highlights: [
      "Reduced request latency by 34% by moving auth checks out of the hot path.",
      "Unified tracing across five services with OpenTelemetry.",
      "Introduced zero-downtime deploys for the gateway itself.",
    ],
  },
  {
    slug: "fleet-provisioner",
    name: "Fleet Provisioner",
    tagline: "Immutable server provisioning for disposable test fleets.",
    description:
      "A Nix-based provisioning pipeline that builds and tears down entire staging environments in minutes instead of hours.",
    period: "2023 — 2024",
    status: "archive",
    stack: ["Nix", "Terraform", "Bash", "CI/CD"],
    highlights: [
      "Cut environment spin-up from ~90 minutes to under 10.",
      "Eliminated configuration drift between staging and production.",
    ],
  },
  {
    slug: "signal-lens",
    name: "Signal Lens",
    tagline: "A small observability console for on-call teams.",
    description:
      "A focused dashboard that turns raw metrics into a calm, glanceable status view for the people holding the pager.",
    period: "2025",
    status: "coming-soon",
    stack: ["TypeScript", "Grafana", "Prometheus"],
  },
  {
    slug: "backup-verifier",
    name: "Backup Verifier",
    tagline: "Proves restores work before you need them.",
    description:
      "Scheduled restore drills that validate backups and report confidence scores, so recovery is a known quantity rather than a hope.",
    period: "2022 — 2023",
    status: "archive",
    stack: ["Python", "PostgreSQL", "Ansible"],
    highlights: [
      "Caught three silent backup failures before they reached production impact.",
    ],
  },
];
