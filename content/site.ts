// The portfolio's content, all in one place. Edit this file to change what
// the site says; the pages only decide how it looks.
//
// Not in here: long-form stories and devlogs, which are MDX files in
// content/software/<repo>.mdx and content/games/<slug>.mdx (list them in
// STORY_REPOS / STORY_SLUGS below), and images, video, and music, which go
// in public/ and are referenced by path.

import type { Stage } from "@/app/games/games";
import type { Gateway } from "@/app/gateways";
import type { JourneyStop } from "@/app/journey/types";
import type { Project } from "@/app/software/projects";
import type { SideQuest, SideQuestPhoto } from "@/app/side-quests/types";
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

/** The index's portfolio cards. */
export const GATEWAYS: Gateway[] = [
  {
    slug: "software",
    name: "Software Engineering",
    desc: "Software that earns its place in your day, and feels like it was made for you.",
  },
  {
    slug: "games",
    name: "Game Development",
    desc: "Great games stayed with me. I'm making ones that stay with you.",
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

// Projects, newest first; field docs on the Project type (app/software/projects.ts).
export const PROJECTS: Project[] = [
  {
    slug: "omawe",
    name: "Omawe",
    cover: "/project-media/SE/omawe_bg.jpg",
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
    slug: "bitd-dashboard",
    name: "BITD Dashboard",
    cover: "/project-media/SE/bitd_bg.jpg",
    screen: "/project-media/SE/bitd_capture.jpg",
    platform: "web",
    tagline: "The operations dashboard for a Jakarta internet provider, and the ISPs it hosts",
    body: "A landing site plus admin and customer portals for BITD, an internet provider in the Jakarta area. Staff manage customers, packages, invoices, and support tickets, and provision subscribers straight onto MikroTik routers over RADIUS. The same platform hosts other ISPs as tenants, each with its own branded landing site.",
    period: "May 2026 – now",
    tags: ["freelance"],
    role: "Backend Engineer & Infra, team of 2",
    stack: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "Redis", "MikroTik"],
    live: "https://project.bitd.my.id",
  },
  {
    slug: "katamata",
    name: "KataMata",
    cover: "/project-media/SE/katamata_bg.jpg",
    screen: "/project-media/SE/katamata_recording.mp4",
    platform: "mobile",
    tagline: "Word collecting for expats learning the language of where they live",
    body: "An iOS app for expats who need the everyday language of the country they're living in. Collect a word and KataMata translates it, explains it, and shows how it's used, generated with Apple's Foundation Models.",
    period: "May – Jun 2026",
    tags: ["Apple Developer Academy"],
    role: "iOS Applied AI Engineer, team of 6",
    stack: ["SwiftUI", "Apple Foundation Models"],
  },
  {
    slug: "deqrypt",
    name: "DeQRypt",
    cover: "/project-media/SE/deqrypt_bg.jpg",
    screen: "/project-media/SE/deqrypt_capture.jpg",
    platform: "mobile",
    tagline: "Scan a QR, pay with DeFi, and let an AI agent put idle crypto to work",
    body: "A Base app that pays QR invoices straight from a DeFi position: a router contract swaps and settles in one atomic transaction. An AI agent built on LangChain and Gemini reads plain-language requests like \"invest my idle ETH\" and suggests lending moves, in a consultant mode that never signs anything unsafe on its own.",
    period: "Dec 2025 – Feb 2026",
    tags: ["hackathon", "Base Hackathon"],
    role: "AI Agent Architect & Backend Engineer, team of 5",
    stack: ["Next.js", "FastAPI", "LangChain", "Gemini", "Solidity", "Base"],
    live: "https://deqrypt.vercel.app",
    repo: "base-hackathon",
  },
  {
    slug: "coretax-scraper",
    name: "Coretax Scraper",
    cover: "/project-media/SE/coretax_bg.jpg",
    logo: "/project-media/SE/coretax_logo.png",
    tagline: "A Chrome extension that automates pulling tax data out of Coretax",
    body: "The tax team used to export Coretax data by hand, one table page at a time. This extension does the extraction for them, cutting manual processing time by 97.5%: from 10 minutes to under 15 seconds per task.",
    period: "Oct – Dec 2025",
    tags: ["internship"],
    role: "Automation Engineer & Data Analyst, solo",
    stack: ["JavaScript", "Chrome Extension (Manifest V3)"],
  },
  {
    slug: "mpi-k8s-performance",
    name: "Performance Analysis MPI on K8s",
    cover: "/project-media/SE/perfanalysis_bg.jpg",
    logo: "/project-media/SE/perf_analysis.png",
    tagline: "Does MPI pay a price for running on Kubernetes? Benchmarked against bare metal",
    body: "A study of what containerising HPC workloads costs. The same MPI jobs, a LAMMPS molecular-dynamics simulation (500,000 atoms) and the OSU latency benchmark, ran at 1 to 32 processes on bare metal and on Kubernetes, and an interactive dashboard compares runtime, scaling, and message latency side by side.",
    period: "Sep – Dec 2025",
    tags: ["coursework", "Guriang HPC"],
    role: "Data Analyst, team of 3",
    stack: ["MPI", "Kubernetes", "LAMMPS", "Python", "Dash", "Plotly"],
  },
  {
    slug: "sobat-warung",
    name: "Sobat Warung",
    cover: "/project-media/SE/sobat_bg.jpg",
    logo: "/project-media/SE/sobat_logo.png",
    tagline: "A WhatsApp assistant that helps small shop owners run their warung",
    body: "A WhatsApp chatbot for warung owners. They register their shop and log daily sales just by chatting, and in return get a forecast of what will sell and which products to bundle, drawn from sales history, holidays, and fuel prices.",
    period: "Aug 2025",
    tags: ["competition", "COMPFEST 2025"],
    role: "Backend Developer & Machine Learning Engineer, team of 3",
    stack: ["FastAPI", "MongoDB", "Twilio", "Darts", "LightGBM", "FP-Growth"],
  },
  {
    slug: "prabu-2025",
    name: "Prabu 2025",
    cover: "/project-media/SE/prabu_bg.jpg",
    screen: "/project-media/SE/prabu_capture.png",
    platform: "web",
    tagline: "The website for the 2025 university orientation, used by 5,000+ new students",
    body: "The orientation's home on the web: the university's profile, the learning material new students work through, and the place they hand in their orientation tasks.",
    period: "Jun – Aug 2025",
    tags: ["freelance"],
    role: "Lead Frontend Engineer, team of 5",
    stack: ["Next.js"],
  },
  {
    slug: "14th-grand-summit",
    name: "14th Grand Summit",
    cover: "/project-media/SE/gs14_bg.jpg",
    screen: "/project-media/SE/gs14_recording.mp4",
    platform: "web",
    tagline: "Registration and participant dashboard for Grand Summit, StudentsxCEOs Bandung's annual student business case competition",
    body: "The website for the 14th Grand Summit, StudentsxCEOs Bandung's annual event for undergraduates from national and international universities. Teams read up on the Business Case and Mini Case Competitions, register in a guided multi-step form, and follow their entry from a participant dashboard.",
    period: "Mar – Aug 2025",
    tags: ["volunteering"],
    role: "Project Manager, team of 7",
    stack: ["Next.js", "Express.js", "Google Sheets & Drive API"],
  },
  {
    slug: "himatif-apps-v2",
    name: "Himatif Apps v2",
    cover: "/project-media/SE/himatif_bg.jpg",
    screen: "/project-media/SE/himatif_recording.mp4",
    platform: "web",
    tagline: "A superapp for Universitas Padjadjaran's Informatics Engineering student association",
    body: "Himatif's web superapp keeps the association's records in one place: members, competitions, events, and more. Version 2 rebuilds it on a current stack, with Next.js and Express.js.",
    period: "Feb – Dec 2025",
    tags: ["freelance"],
    role: "Project Manager, team of 3",
    stack: ["Next.js", "Express.js"],
    live: "https://apps.himatif.org",
  },
  {
    slug: "nyisa",
    name: "Nyisa",
    cover: "/project-media/SE/nyisa_bg.jpg",
    screen: "/project-media/SE/nyisa_capture.png",
    platform: "web",
    tagline: "Restaurants' leftover food, sold before it goes to waste",
    body: "A web marketplace where restaurants list surplus food that's still perfectly edible, and customers pick it up at lower prices. Browse by restaurant or dish, add to cart, and order, so less good food ends up thrown away.",
    period: "Feb – Jun 2025",
    tags: ["coursework"],
    role: "Backend Developer & AI Engineer, team of 6",
    stack: ["React", "Express.js"],
  },
  {
    slug: "agriclime",
    name: "AgriClime",
    cover: "/project-media/SE/agriclime_bg.jpg",
    logo: "/project-media/SE/agriclime_logo.png",
    tagline: "Weather forecasts and alerts that help farmers plan around the climate",
    body: "An Android app that helps farmers plan around the weather. A forecasting model predicts the next hours from the last day of hourly readings for their location, and a classifier labels the conditions ahead, served to the app through a Flask API.",
    period: "Nov – Dec 2024",
    tags: ["Bangkit capstone"],
    role: "Backend & Machine Learning Engineer, team of 7",
    stack: ["TensorFlow", "Keras", "Flask", "Kotlin"],
    repo: "agriclime-ml",
  },
  {
    slug: "dekorin",
    name: "Dekorin",
    cover: "/project-media/SE/dekorin_bg.jpg",
    logo: "/project-media/SE/dekorin_logo.png",
    tagline: "A marketplace for booking home-decoration vendors",
    body: "An e-commerce platform for booking home-decoration services: furniture layout, lighting, and more. Customers browse vendors' offerings, ask questions, and send requests; vendors accept, reject, and complete orders from their own dashboard and list new services.",
    period: "Jul – Aug 2024",
    tags: ["competition", "ISC Diesco 2024"],
    role: "Project Manager & Full-stack Developer, team of 5",
    stack: ["Laravel", "PHP", "Blade"],
    repo: "isc-diesco",
  },
  {
    slug: "nabawi-habits",
    name: "Nabawi Habits",
    cover: "/project-media/SE/nabawi_bg.jpg",
    screen: "/project-media/SE/nabawi_recording.mp4",
    platform: "web",
    tagline: "A landing page on living the Prophet Muhammad's way: heart, body, and mind",
    body: "A single-page site, built for the Festida Unida Gontor 2024 landing page competition, that walks through the Prophet Muhammad's habits for a healthy heart, body, and mind. Each tip is paired with the hadith or Qur'an verse it comes from.",
    period: "Jan 2024",
    tags: ["competition", "5th of 60+ teams"],
    role: "Frontend Developer, team of 3",
    stack: ["HTML", "CSS", "JavaScript"],
    live: "https://nabawihabits.vercel.app",
  },
];

/** Projects with a long-form story at content/software/<slug>.mdx. */
export const STORY_REPOS = new Set<string>([
  "omawe",
  "katamata",
  "himatif-apps-v2",
  "prabu-2025",
  "14th-grand-summit",
  "coretax-scraper",
  "nabawi-habits",
  "sobat-warung",
  "dekorin",
  "nyisa",
  "agriclime",
  "deqrypt",
  "bitd-dashboard",
  "mpi-k8s-performance",
]);

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
// or "music". Media: `cover` (image / poster / album art) sits in front,
// `bg` behind it blurred (without a `bg`, the cover is blurred in instead),
// plus `video` and `audio`. Two tile shapes: square (the default) and
// `wide: true`, where the front shows on a screen. A `locked` entry always
// sits last.
export const STAGES: Stage[] = [
  {
    id: "1-1",
    slug: "warnet",
    name: "WarNet: War on The Bandwidth",
    blurb:
      "A comedy stealth sim set in an early-2000s Indonesian internet café. Sneak an enormous download to 100% before your session runs out, without the operator catching on.",
    genre: "Stealth / Survival",
    engine: "Unity",
    platforms: "Browser, Windows, macOS",
    role: "Game Designer & Music Composer, team of 8",
    jam: "GameSeed 2026, top 90 of 260, themes \"So Absurd, It's Cool\" and \"Childhood Dreams\"",
    status: "Done",
    year: "2026",
    cover: "/project-media/GD/warnet_cover.png",
    wide: true,
    play: "https://batangkayu.itch.io/237-warnet-tunggu-aku-buat-game-nanti-pc",
  },
  {
    id: "1-2",
    slug: "body-count",
    name: "Body Count: Shibuya Crossing",
    blurb:
      "A crowd-spotting casual game on Shibuya's rush-hour crossing. Read the target's hair, shirt, pants, and bag, tap the one person who matches, and hit each wave's score before your catches run out.",
    genre: "Casual / Arcade",
    engine: "Unity",
    platforms: "Browser, iOS (TestFlight)",
    role: "Music Composer & Game Programmer, team of 4",
    jam: "Very Disco Game Jam Vol. 3 (Apple Developer Academy, Asia Pacific), 6th of 46, theme \"Compact\"",
    status: "Done",
    year: "2026",
    cover: "/project-media/GD/bc_cover.png",
    play: "https://batangkayu.itch.io/body-count-shibuya-crossing",
  },
  // TODO(kv): cover and `play` once they exist.
  {
    id: "1-3",
    slug: "akar-fehu",
    name: "Project Akar Fehu",
    blurb:
      "Batang Kayu Studio's first full-scale game: a narrative-driven puzzle game, built for release on Steam rather than for a jam.",
    genre: "Narrative puzzle",
    engine: "Godot",
    platforms: "PC (Steam)",
    year: "2027",
    role: "Lead game designer, team of 12",
    status: "In development",
  },
];

/** Entries with a devlog at content/games/<slug>.mdx. */
export const STORY_SLUGS = new Set<string>(["warnet", "body-count"]);

// ============================================================
// SIDE QUESTS — /side-quests, the door at the bottom left of the index
// ============================================================

export const SIDE_QUESTS = {
  title: "Kahfi R — Side Quests",
  description: "The stories beyond work: teaching, leading, competing, and the things built out of boredom.",
  heading: "Side Quests",
  tagline: "My career tells only part of the story. These are the side quests and experiences beyond work that shaped how I think, create, and show up.",
  /** The flip card at the end of the grid. */
  funFact:
    "I don't want to be known for one thing. I want to collect experiences that make me a better and more interesting person.",
};

// The story cards, in grid order. `kind` is "career", "volunteer", "project",
// or "community" (a filter chip each); `size` is the cell: "lg" 4x2, "tall"
// 2x2, "wide" 6x1, "sm" 2x1. `image` is a cover in public/; without one the
// card gets generated art.
export const SIDE_QUEST_ENTRIES: SideQuest[] = [
  {
    period: "2024",
    title: "Practicum Assistant",
    org: "Department of Computer Science Padjadjaran University",
    kind: "volunteer",
    size: "lg",
    summary:
      "Learning that teaching is as much about patience and empathy as it is about code.",
    story:
      "I stepped into the role of practicum assistant for Web Programming and Data Structures, responsible for guiding more than 40 students through two demanding courses. Preparing modules, delivering weekly sessions, reviewing assignments, and mentoring final projects taught me that explaining an idea clearly is often harder than understanding it yourself.",
    body: [
      "Across the semester, I taught topics ranging from HTML, CSS, JavaScript, PHP, APIs, web servers, and the CodeIgniter 4 framework to C++ pointers, linked lists, stacks, queues, and graphs. Beyond the lectures, I held consultation sessions, designed weekly exercises, and helped students overcome the bugs and roadblocks that inevitably appeared.",
      "Every student learned differently. Some needed technical direction, while others simply needed confidence to keep going. Adapting my communication, staying patient under pressure, and solving problems together became just as important as teaching programming itself. The experience shaped my leadership, emotional awareness, and ability to break complex ideas into something approachable.",
    ],
    skills: ["Mentoring", "Code Review", "Public Speaking"],
    highlight:
      "The most rewarding moments were watching students become confident enough to solve problems without needing my help.",
  },
  {
    period: "2025 — Now",
    title: "This Portfolio",
    org: "Product of Boredom",
    kind: "project",
    size: "lg",
    summary: "The site you are scrolling and playing around right now.",
    story:
      "Most portfolios focus on what someone has built. I wanted mine to explain why I built those things and how I think along the way. That's why this site is written as a story instead of a résumé, so visitors leave understanding not only my work, but the person behind it.",
    body: [
      "Every interaction, animation, and paragraph exists for a reason. Rather than listing technologies and achievements, I wanted to create an experience that reflects how I approach problems: with curiosity, intention, and attention to detail. In many ways, this portfolio is a product as much as it is a personal website.",
      "Skills alone rarely make someone memorable. Two people can know the same framework, use the same tools, and build similar products. What makes the difference is how they think, communicate, and make decisions. This portfolio is my attempt to show those parts, not just tell you they exist."
    ],
    skills: ["Storytelling", "Interaction Design"],
    highlight:
      "Anyone can list their skills. I wanted to show the person using them.",
  },
  {
    period: "2024",
    title: "Lead",
    org: "Character Building Season 2024",
    kind: "volunteer",
    size: "tall",
    summary:
      "Learning that leadership is often about balancing people before projects.",
    story:
      "As Project Officer for Character Building Season, I led a committee of more than 70 people to design and deliver our department's orientation programme for incoming students. It was my first experience leading an organisation of this scale, where every decision had an impact on participants, committees, and university stakeholders alike.",
    body: [
      "Together with the Human Resource Management team, I shaped the programme around three core values—PRIMER: Proactive, Innovative, and Responsive. Beyond coordinating the event, I learned how to align different expectations, make decisions under uncertainty, manage my own energy, and create an environment where over 90 freshmen felt supported throughout their transition into university life. By the end, 98% of participants successfully completed the programme."
    ],
    skills: ["Leadership", "Public Speaking", "Stakeholder Management"],
    highlight:
      "The programme wasn't measured by how smoothly it ran, but by how confidently 90+ freshmen began their university journey.",
    image: "/side-quests/cbs.jpg"
  },
  {
    period: "2025 - Now",
    title: "Competitionist",
    org: "Part of Pushing Myself to The Brink",
    kind: "project",
    size: "tall",
    summary:
      "Using competitions as a playground to test ideas, challenge my limits, and measure how far I still have to go.",
    story:
      "People often say, 'Maximise your potential.' For me, competitions are how I do that. They give me the freedom to build products, validate ideas, and solve problems that rarely fit within the boundaries of university courses or day-to-day work. Every competition is an excuse to experiment and, when I make it far enough, to learn from people who consistently perform at the highest level.",
    body: [
      "The truth is that qualifying as a finalist, let alone winning, has been far harder than I expected. But that's exactly why I keep coming back. Every rejection exposes a gap I hadn't seen before, whether it's in my technical skills, product thinking, teamwork, or storytelling. I'm still grinding, still iterating, and still chasing the next opportunity, not because I expect every attempt to succeed, but because my curiosity hasn't been satisfied yet."
    ],
    skills: ["Rapid Prototyping", "Teamwork", "Pitching", "Ideation"],
    highlight:
      "The goal was never to collect trophies, it was to become someone capable of earning them.",
    image: "/side-quests/compe.jpg"
  },
  {
    period: "2026 - Now",
    title: "Game Developer",
    org: "Product of Boredom",
    kind: "project",
    size: "sm",
    summary:
      "Exploring game development by understanding why some games stay with us long after we stop playing them.",
    story:
      "Game development is my newest obsession. It began with playing games simply for fun, but eventually I found myself asking a different question: why do some games become masterpieces while others are quickly forgotten? Breaking down those experiences led me to game design, where I could study the systems, emotions, and decisions that make a game truly memorable.",
    body: [
      "I'm still early in this journey, but every prototype is an experiment in creating meaningful experiences. More than building mechanics, I want to create the same sense of wonder, attachment, and lasting memories that the games I love have given me. If a player walks away remembering how they felt rather than what they clicked, I've done something right."
    ],
    skills: ["Game Design", "Interaction Design", "Player Engagement"],
  },
  {
    period: "Ongoing",
    title: "Public Speaking Study",
    org: "Part of Pushing Myself to The Brink",
    kind: "project",
    size: "sm",
    summary:
      "Studying communication as a skill to connect, influence, and adapt, not simply to speak with confidence.",
    story:
      "Public speaking started as a way to become more confident, but it quickly became something much deeper. The more I learned, the more I realised that speaking isn't about being heard, it's about making sure the message reaches the person on the other side.",
    body: [
      "Today, I study how words shape perception, how stories make ideas memorable, and how different audiences require different approaches. Every conversation is an opportunity to practise choosing better words, communicating with intention, and adapting to the people in front of me rather than expecting them to adapt to me."
    ],
    skills: ["Public Speaking", "Communication"],
  },
];

/** The swipeable album cell. Photos in public/side-quests/. */
export const SIDE_QUEST_ALBUM: SideQuestPhoto[] = [
  { caption: "1st Time as A Lead", image: "/side-quests/gathering.jpg" },
  { caption: "One of the memorable experience in College", image: "/side-quests/po_cbs.jpg" },
  { caption: "The best friends that accompanied me along the journey", image: "/side-quests/bfr.jpg" },
  { caption: "Apple Developer Academy Kick-Off", image: "/side-quests/academy.jpg" },
  { caption: "Currently Building: Omawe", image: "/side-quests/omawe.jpg" },
];

/** The draggable polaroids cell. */
export const SIDE_QUEST_KEEPSAKES: SideQuestPhoto[] = [
  { caption: "hike", image: "/side-quests/hike.jpg" },
  { caption: "being a great friend", image: "/side-quests/growing.jpg" },
  { caption: "having fun", image: "/side-quests/fun.jpg" },
];

/** The draggable sticker pile ("Off-duty inventory"). */
export const SIDE_QUEST_STICKERS = [
  { src: "/side-quests/sushi.svg", alt: "Sushi sticker" },
  { src: "/side-quests/controller.svg", alt: "Game controller sticker" },
  { src: "/side-quests/billiard.svg", alt: "Billiard ball sticker" },
  { src: "/side-quests/shoe.svg", alt: "Running shoe sticker" },
];

// ============================================================
// JOURNEY — /journey, the path at the bottom right of the index
// ============================================================

export const JOURNEY = {
  title: "Kahfi R — Journey",
  description: "The path so far: the roles, the learning, and the competitions along the way.",
  heading: "Journey",
  tagline: "Every stop on the way here, newest first. The path keeps going.",
};

// The stops, in any order: the page groups them by `kind` and sorts each
// group by start date, newest first. "work" stops become the winding career
// path, "education" a list, and "competition" a grid of cards with the
// `result` as the headline.
// Every stop opens a story panel: `story` (paragraphs, one string each) and
// `image` (a photo in public/journey/) fill it; until then it says the
// story is still being written. A `when` ending in "now" marks the stop
// as current.
// TODO(kv): a story and photo for each stop.
export const JOURNEY_STOPS: JourneyStop[] = [
  // TODO(kv): placeholder. Start month, degree, and graduation date; 2022 is
  // from the praktikum-tiunpad-angkatan-2022 org.
  {
    when: "2022 – now",
    title: "Informatics undergraduate",
    place: "Universitas Padjadjaran",
    kind: "education",
  },
  // TODO(kv): placeholder. Month and result; from the aic-14 repo.
  {
    when: "2022",
    title: "AI Innovation Challenge",
    place: "COMPFEST 14",
    kind: "competition",
  },
  {
    when: "Jan 2024",
    title: "Landing page competition",
    place: "Festida, Universitas Darussalam Gontor",
    result: "5th overall",
    kind: "competition",
  },
  // TODO(kv): placeholder. Result; from the isc-diesco repo (Dekorin).
  {
    when: "Aug 2024",
    title: "Information System Competition",
    place: "Diesco 2024",
    kind: "competition",
  },
  {
    when: "Feb – Dec 2024",
    title: "Practicum Assistant",
    place: "Computer Science, Universitas Padjadjaran",
    kind: "work",
  },
  {
    when: "Nov – Dec 2024",
    title: "Bangkit Academy",
    place: "Machine Learning cohort",
    kind: "education",
  },
  {
    when: "Feb – Dec 2025",
    title: "Himatif Apps v2",
    place: "Freelance, Project Manager",
    kind: "work",
  },
  {
    when: "Jun – Aug 2025",
    title: "Prabu 2025",
    place: "Freelance, Lead Frontend Engineer",
    kind: "work",
  },
  {
    when: "Aug – Dec 2025",
    title: "Automation Engineer & Data Analyst",
    place: "PT Tunas Ridean (Tunas Group)",
    kind: "work",
  },
  {
    when: "Nov 2025 – Jan 2026",
    title: "System Engineer",
    place: "Guriang HPC Facility, Universitas Padjadjaran",
    kind: "work",
  },
  {
    when: "Mar 2026 – now",
    title: "Junior iOS Developer",
    place: "Apple Developer Academy @ BINUS, Bali",
    kind: "work",
  },
  {
    when: "May 2026 – now",
    title: "BITD",
    place: "Freelance, Backend Engineer & Infra",
    kind: "work",
  },
  {
    when: "Aug 2026 – now",
    title: "Game Developer",
    place: "Batang Kayu Studio",
    kind: "work",
  },
];
