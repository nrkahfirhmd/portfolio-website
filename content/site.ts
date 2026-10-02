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

// Projects, newest first. Only `slug` and `name` are required; add the rest
// as you write it up. A `live` link to the App Store is labelled "App Store".
// `system` is a diagram shown until a project has a `cover` image.
// `platform: "mobile"` makes a tall tile (two cells down) for phone screenshots;
// `platform: "web"` makes a wide one (two cells across) for browser ones.
// Media, in public/: `cover` is the blurred backdrop, `screen` the video or
// image on the device. Without a platform, `logo` makes a square tile with
// the logo over the backdrop.
export const PROJECTS: Project[] = [
  {
    slug: "omawe",
    name: "Omawe",
    cover: { src: "/project-media/SE/omawe_bg.jpg", width: 675, height: 1200 },
    screen: "/project-media/SE/omawe_recording.mp4",
    platform: "mobile",
    tagline: "Group trips, without the \"where are you?\" texts",
    body: "An iOS app that turns passive location sharing into active trip awareness. Everyone heading to the same place shows up on the Lock Screen and in the Dynamic Island as on the way, running late, or arrived, so the group knows when to leave without sending a single message.",
    period: "Jun 2026 – now",
    tags: ["Apple Developer Academy", "on the App Store"],
    role: "Project Manager, team of 5",
    stack: ["Swift", "Go"],
    live: "https://apps.apple.com/id/app/omawe-group-trip-tracker/id6788641544",
  },
  {
    slug: "katamata",
    name: "KataMata",
    cover: { src: "/project-media/SE/katamata_bg.jpg", width: 400, height: 800 },
    screen: "/project-media/SE/katamata_recording.mp4",
    platform: "mobile",
    tagline: "Word collecting for expats learning the language of where they live",
    body: "An iOS app for expats who need the everyday language of the country they're living in. Collect a word and KataMata translates it, explains it, and shows how it's used, generated with Apple's Foundation Models.",
    period: "May – Jun 2026",
    tags: ["Apple Developer Academy"],
    role: "iOS Applied AI Engineer",
    stack: ["SwiftUI", "Apple Foundation Models"],
  },
  {
    slug: "himatif-apps-v2",
    name: "Himatif Apps v2",
    cover: { src: "/project-media/SE/himatif_bg.jpg", width: 563, height: 364 },
    screen: "/project-media/SE/himatif_capture.png",
    platform: "web",
    tagline: "A superapp for Universitas Padjadjaran's Informatics Engineering student association",
    body: "Himatif's web superapp keeps the association's records in one place: members, competitions, events, and more. Version 2 rebuilds it on a current stack, with Next.js and Express.js.",
    period: "Feb – Dec 2025",
    tags: ["freelance"],
    role: "Project Manager",
    stack: ["Next.js", "Express.js"],
    live: "https://apps.himatif.org",
  },
  {
    slug: "prabu-2025",
    name: "Prabu 2025",
    cover: { src: "/project-media/SE/prabu_bg.jpg", width: 1200, height: 675 },
    logo: "/project-media/SE/prabu_logo.png",
    tagline: "The website for the 2025 university orientation, used by 5,000+ new students",
    body: "The orientation's home on the web: the university's profile, the learning material new students work through, and the place they hand in their orientation tasks.",
    period: "Jun – Aug 2025",
    tags: ["freelance"],
    role: "Lead Frontend Engineer",
    stack: ["Next.js"],
  },
  {
    slug: "14th-grand-summit",
    name: "14th Grand Summit",
    cover: { src: "/project-media/SE/gs14_bg.jpg", width: 735, height: 420 },
    logo: "/project-media/SE/gs14_logo.png",
    tagline: "Registration and participant dashboard for Grand Summit, StudentsxCEOs Bandung's annual student business case competition",
    body: "The website for the 14th Grand Summit, StudentsxCEOs Bandung's annual event for undergraduates from national and international universities. Teams read up on the Business Case and Mini Case Competitions, register in a guided multi-step form, and follow their entry from a participant dashboard.",
    period: "Mar – Aug 2025",
    tags: ["volunteering"],
    role: "Project Manager, team of 7",
    stack: ["Next.js", "Express.js", "Google Sheets & Drive API"],
  },
  {
    slug: "coretax-scraper",
    name: "Coretax Scraper",
    cover: { src: "/project-media/SE/coretax_bg.jpg", width: 735, height: 414 },
    logo: "/project-media/SE/coretax_logo.png",
    tagline: "A Chrome extension that automates pulling tax data out of Coretax",
    body: "The tax team used to export Coretax data by hand, one table page at a time. This extension does the extraction for them, cutting manual processing time by 97.5%: from 10 minutes to under 15 seconds per task.",
    period: "Oct – Dec 2025",
    tags: ["internship"],
    role: "Automation Engineer & Data Analyst, solo",
    stack: ["JavaScript", "Chrome Extension (Manifest V3)"],
  },
];

/** Projects with a long-form story at content/software/<slug>.mdx. */
export const STORY_REPOS = new Set<string>(["omawe", "katamata", "himatif-apps-v2", "prabu-2025", "14th-grand-summit", "coretax-scraper"]);

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
    slug: "warnet",
    name: "WarNet: War on The Bandwidth",
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
    id: "1-2",
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
  // TODO(kv): fill in details.
  { id: "1-3", slug: "akar-fehu", name: "Project Akar Fehu", blurb: "", status: "In development" },
];

/** Entries with a devlog at content/games/<slug>.mdx. */
export const STORY_SLUGS = new Set<string>(["warnet", "body-count"]);
