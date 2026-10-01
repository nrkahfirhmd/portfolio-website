// The portfolio's content, all in one place. Edit this file to change what
// the site says; the pages only decide how it looks.
//
// Not in here: long-form stories and devlogs, which are MDX files in
// content/software/<repo>.mdx and content/games/<slug>.mdx (list them in
// STORY_REPOS / STORY_SLUGS below), and images, video, and music, which go
// in public/ and are referenced by path.

import type { Stage } from "@/app/games/games";
import type { Gateway } from "@/app/gateways";
import type { Project } from "@/app/software/projects";
import type { IconName } from "@/app/socials";

// ============================================================
// YOU
// ============================================================

export const PERSON = {
  name: "Kahfi Rahmada",
  /** Article tab titles read "<shortName> — <article title>". */
  shortName: "Kahfi R",
  /** GitHub handle: source links and the live activity island. */
  github: "nrkahfirhmd",
  /** Shows the pulsing "Open to work" badge. */
  openToWork: true,
};

/** Contact links, in footer order. `icon` picks the drawing. */
export const SOCIALS: { label: string; href: string; icon: IconName }[] = [
  { label: "GitHub", href: "https://github.com/nrkahfirhmd", icon: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nrkahfirhmd/", icon: "linkedin" },
  { label: "Email", href: "mailto:nurkahfirahmada@gmail.com", icon: "email" },
  { label: "itch.io", href: "https://firanda.itch.io", icon: "itch" },
];

// ============================================================
// INDEX — the landing page at /
// ============================================================

export const HOME = {
  /** Browser tab title and search snippet for the whole site. */
  title: "Kahfi's Portfolio",
  description: "Kahfi Rahmada. Creating systems that think, play, and solves problem.",
  /** Words in [brackets] become the clickable green sparks. */
  tagline: "I make software [behave] and games [misbehave], on [purpose].",
  /** The muted line under the tagline. */
  roles: "Full-stack engineer, AI tinkerer, Game maker.",
  /** What you're building right now: the island shows how many, and lists
   * them when opened. */
  nowBuilding: ["Project Akar Fehu", "Final Challenge ADA", "Omawe"],
};

/** The two portfolio cards. `live: false` shows a "soon" chip and a
 * placeholder page with the blurb. */
export const GATEWAYS: Gateway[] = [
  {
    slug: "software",
    name: "Software Engineering",
    desc: "Software that earns its place in your day, and feels like it was made for you.",
    blurb:
      "Applied models, agent systems, and infrastructure work — the unglamorous engineering that turns a demo into something people can rely on at 3am.",
    live: true,
  },
  {
    slug: "games",
    name: "Game Development",
    desc: "Great games stayed with me. I'm making ones that stay with you.",
    blurb:
      "Systems-driven games, the tools built to make them, and physics toys that exist mostly because they were fun to write.",
    live: true,
  },
];

// ============================================================
// SOFTWARE ENGINEERING — /software
// ============================================================

export const SOFTWARE = {
  title: "Kahfi R — Software Engineering",
  description:
    "Software engineering work by Kahfi Rahmada: web apps, backends, smart contracts, and data systems.",
  summary:
    "I build software that makes everyday life a little better, with the small details that make it feel like home. Mobile, web, backend, blockchain, AI: whatever the product needs, I take it to done.",
  workHeading: "Selected work",
};

/** Current role, shown under the name. `null` hides the line. */
export const CURRENT: { role: string; company: string; companyUrl: string } | null = {
  role: "Junior iOS Developer",
  company: "Apple Developer Academy",
  companyUrl: "https://developeracademy.apps.binus.ac.id/bali/",
};

// Projects, newest first. `languages` is GitHub's bytes per language and
// doesn't update itself; refresh with
//   gh api repos/<github>/<repo>/languages
// `system` is the diagram shown until a project has a `cover` image.
export const PROJECTS: Project[] = [
  {
    repo: "custom-photobooth",
    name: "Custom Photobooth",
    tagline: "Self-hosted event photobooth that runs on the guest's own phone",
    body: "Guests open a link on their own phone, take a strip of photos, preview it, and get it emailed to them. Every event is its own workspace with its own name, frame, photo count, and email sender.",
    period: "Aug 2026",
    languages: { TypeScript: 125247, CSS: 34356 },
    system: {
      nodes: [
        { id: "event", label: "Event workspace", sub: "name, frame, count", x: 0, y: 0 },
        { id: "phone", label: "Guest's phone", sub: "opens the link", x: 0, y: 1 },
        { id: "strip", label: "Photo strip", sub: "shoot + preview", x: 1, y: 1 },
        { id: "email", label: "Email", sub: "event's sender", x: 2, y: 1 },
      ],
      edges: [["event", "strip"], ["phone", "strip"], ["strip", "email"]],
    },
  },
  {
    repo: "base-hackathon",
    name: "DeQRypt",
    tagline: "Scan-to-pay QR payments and a lending pool on Base",
    body: "A hackathon build on Base Sepolia: a multi-asset lending pool and an atomic payment router in Solidity, a Python/FastAPI backend that listens to on-chain events, and a LangChain + Gemini agent that manages a portfolio from plain-language requests.",
    period: "Dec 2025 – Feb 2026",
    tags: ["hackathon"],
    live: "https://deqrypt.vercel.app",
    languages: { TypeScript: 201729, Python: 63129, Solidity: 31665 },
    system: {
      nodes: [
        { id: "qr", label: "QR payment", sub: "mUSDC, mIDRX", x: 0, y: 0 },
        { id: "router", label: "Payment router", sub: "Solidity", x: 1, y: 0 },
        { id: "pool", label: "Lending pool", sub: "Solidity", x: 1, y: 1 },
        { id: "api", label: "Event listener", sub: "Python, FastAPI", x: 2, y: 0 },
        { id: "agent", label: "Portfolio agent", sub: "LangChain, Gemini", x: 3, y: 0 },
        { id: "web", label: "Web app", sub: "TypeScript", x: 3, y: 1 },
      ],
      edges: [["qr", "router"], ["router", "api"], ["pool", "api"], ["api", "agent"], ["api", "web"]],
    },
  },
  {
    repo: "hpc-dashboard",
    name: "HPC Dashboard",
    tagline: "Dashboard for MPI performance analysis on Kubernetes",
    // TODO(kv): one or two lines on what it measured and what it showed.
    body: "A dashboard for analysing how MPI workloads perform when they are scheduled on a Kubernetes cluster.",
    period: "Dec 2025",
    languages: { Python: 19963, "Jupyter Notebook": 3285 },
    system: {
      nodes: [
        { id: "mpi", label: "MPI workload", x: 0, y: 0 },
        { id: "k8s", label: "Kubernetes", sub: "scheduled", x: 1, y: 0 },
        { id: "data", label: "Performance", sub: "Python, notebooks", x: 2, y: 0 },
        { id: "dash", label: "Dashboard", sub: "analysis", x: 3, y: 0 },
      ],
      edges: [["mpi", "k8s"], ["k8s", "data"], ["data", "dash"]],
    },
  },
  {
    repo: "kamus-aksara-kawi",
    name: "Kamus Aksara Kawi",
    tagline: "Kawi script dictionary on a SPARQL knowledge graph",
    body: "A dictionary for Old Javanese (Kawi) script. Entries live as RDF in Apache Jena Fuseki on a Google Cloud VM and are queried with SPARQL; the front end is Streamlit.",
    period: "Jun 2025",
    live: "https://kamus-aksara-kawi.streamlit.app/",
    languages: { Python: 13936 },
    system: {
      nodes: [
        { id: "rdf", label: "Kawi entries", sub: "RDF", x: 0, y: 0 },
        { id: "fuseki", label: "Jena Fuseki", sub: "Google Cloud VM", x: 1, y: 0 },
        { id: "sparql", label: "SPARQL", sub: "queries", x: 2, y: 0 },
        { id: "ui", label: "Streamlit", sub: "Python", x: 3, y: 0 },
      ],
      edges: [["rdf", "fuseki"], ["fuseki", "sparql"], ["sparql", "ui"]],
    },
  },
  {
    repo: "isc-diesco",
    name: "Dekorin",
    tagline: "Marketplace for booking home-decoration vendors",
    body: "An e-commerce platform for booking home-decoration services such as furniture layout and lighting, built in Laravel for the ISC Tech Dev competition at Diesco 2024.",
    period: "Jul – Aug 2024",
    tags: ["competition"],
    languages: { Blade: 155763, PHP: 78959, CSS: 49334 },
    system: {
      nodes: [
        { id: "customer", label: "Customer", x: 0, y: 0 },
        { id: "app", label: "Dekorin", sub: "Laravel, Blade", x: 1, y: 0 },
        { id: "booking", label: "Booking", x: 2, y: 0 },
        { id: "vendor", label: "Decor vendor", sub: "layout, lighting", x: 3, y: 0 },
      ],
      edges: [["customer", "app"], ["app", "booking"], ["booking", "vendor"]],
    },
  },
];

/** Projects with a long-form story at content/software/<repo>.mdx. */
export const STORY_REPOS = new Set<string>(["base-hackathon"]);

// ============================================================
// GAME DEVELOPMENT — /games
// ============================================================

export const GAMES = {
  title: "Kahfi R — Game Development",
  description:
    "Games by Kahfi Rahmada with Batang Kayu Studio: stealth comedy, crowd-spotting puzzles, and whatever's next in the forge.",
  role: "Game Developer",
  summary:
    "I make games that stay with you long after the credits roll. Design, code, art, sound: whatever it needs, I take it to done.",
  libraryHeading: "Library",
  /** Last line of the credits footer. */
  thanks: "Thanks for playing.",
};

export const STUDIO = {
  name: "Batang Kayu Studio",
  url: "https://batangkayu.itch.io",
};

// The library, oldest to newest. `kind` is "game" (default), "art", "video",
// or "music". Media: `cover` (image / poster / album art), `video`, `audio`.
// The newest entry with a cover leads; a `locked` entry always sits last.
export const STAGES: Stage[] = [
  {
    id: "1-1",
    slug: "coralscape-ar",
    name: "CoralScape AR",
    blurb: "An augmented-reality coral reef built in Unity, with custom shaders doing the underwater look.",
    engine: "Unity",
    platforms: "Mobile AR",
    status: "Cleared",
    year: "2025",
    repo: "coralscape-ar",
  },
  {
    id: "1-2",
    slug: "warnet",
    name: "WarNet",
    blurb:
      "A 2D comedy stealth sim set in an early-2000s Indonesian internet café. Sneak an enormous download to 100% before your session runs out, without the operator catching on.",
    genre: "Stealth / survival",
    engine: "Unity",
    platforms: "Browser, Windows, macOS",
    role: "Game designer",
    jam: "GameSeed",
    status: "In development",
    cover: "https://img.itch.zone/aW1nLzI4MjY5NjExLnBuZw==/original/BZF7%2BY.png",
    play: "https://batangkayu.itch.io/237-warnet-tunggu-aku-buat-game-nanti-pc",
  },
  {
    id: "1-3",
    slug: "body-count",
    name: "Body Count: Shibuya Crossing",
    blurb:
      "A crowd-spotting puzzle on Shibuya's rush-hour crossing. Read the target's hair, shirt, pants, and bag, tap the one person who matches, and hit each wave's score before your catches run out.",
    genre: "Puzzle",
    engine: "Unity",
    platforms: "Browser, macOS, iOS (TestFlight)",
    jam: "Theme: Compact",
    status: "In development",
    year: "2026",
    cover: "https://img.itch.zone/aW1nLzMwMjk0Mzc3LnBuZw==/original/IZKj17.png",
    play: "https://batangkayu.itch.io/body-count-shibuya-crossing",
  },
  {
    id: "1-4",
    slug: "green-sapphire",
    name: "Project Green Sapphire",
    blurb: "A Godot project in active development. Details stay under wraps until there's something to play.",
    engine: "Godot",
    status: "In progress",
    year: "2026",
    repo: "project-green-sapphire",
  },
  {
    id: "1-5",
    slug: "next",
    name: "???",
    blurb: "The next level is still being built. Follow the studio on itch.io to catch it the day it opens.",
    status: "Locked",
    locked: true,
  },
];

/** Entries with a devlog at content/games/<slug>.mdx. */
export const STORY_SLUGS = new Set<string>(["coralscape-ar", "warnet", "body-count", "green-sapphire"]);
