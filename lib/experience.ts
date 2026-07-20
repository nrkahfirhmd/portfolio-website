/**
 * Content for the Experience story page.
 * Placeholder narrative — edit entries here, the UI adapts automatically.
 */

export type ExperienceKind = "career" | "volunteer" | "project" | "community";

/** Cell footprint inside the bento grid (6-column base). */
export type BentoSize = "lg" | "tall" | "wide" | "sm";

export interface ExperienceEntry {
    period: string;
    title: string;
    org: string;
    kind: ExperienceKind;
    /** One-line hook shown above the story. */
    summary: string;
    /** Two-to-three sentence narrative, written in first person. */
    story: string;
    skills: string[];
    /** Optional pull-quote: a takeaway or a number worth bragging about. */
    highlight?: string;
    /** Bento only: extra article paragraphs for the expanded view. */
    body?: string[];
    /** Bento only: cover image under /public. Falls back to generated art. */
    image?: string;
    /** Bento only: grid footprint. */
    size?: BentoSize;
}

export interface ExperienceChapter {
    id: string;
    number: string;
    title: string;
    tagline: string;
    /** "timeline" = career spine; "bento" = interactive image grid. */
    layout: "timeline" | "bento";
    entries: ExperienceEntry[];
}

export const experienceChapters: ExperienceChapter[] = [
    {
        id: "career",
        number: "01",
        title: "The Craft",
        tagline: "The jobs that turned curiosity into a profession.",
        layout: "timeline",
        entries: [
            {
                period: "2023 — Now",
                title: "Software Engineer",
                org: "Product team · Jakarta",
                kind: "career",
                summary: "Shipping features people actually use.",
                story:
                    "I joined a small product team where every release lands in front of real users the same week. I learned to argue with data, cut scope without cutting quality, and treat the UI as part of the product's personality — not decoration.",
                skills: ["React", "Next.js", "TypeScript", "Design systems"],
                highlight: "From idea to production in weekly cycles.",
            },
            {
                period: "2021 — 2023",
                title: "Junior Developer",
                org: "First real codebase",
                kind: "career",
                summary: "Where tutorials ended and engineering began.",
                story:
                    "My first professional codebase was older than my framework knowledge — and that was the best thing that could have happened. Legacy code taught me to read before I write, and that a boring, reliable fix beats a clever rewrite.",
                skills: ["JavaScript", "REST APIs", "Git", "Debugging"],
            },
        ],
    },
    {
        id: "off-the-clock",
        number: "02",
        title: "Off the Clock",
        tagline:
            "Volunteering, side quests, and communities — one big playground. Filter it, drag it, poke it.",
        layout: "bento",
        entries: [
            {
                period: "2022 — Now",
                title: "Coding Mentor",
                org: "Community bootcamp",
                kind: "volunteer",
                size: "lg",
                summary: "Teaching beginners the things I wish someone had told me.",
                story:
                    "One evening a week I mentor career-switchers through their first projects. Explaining closures at 9pm to someone who started coding a month ago is the fastest way to find out what you actually understand.",
                body: [
                    "The cohort is a mix: an accountant, a nurse, a barista — all betting a year of evenings on a new career. My job isn't to lecture; it's to sit next to their code and ask the questions a senior would ask, gently.",
                    "The best sessions end with me saying almost nothing. Someone explains their own bug out loud, catches it mid-sentence, and fixes it. That moment — when the debugger becomes internal — is what I show up for.",
                ],
                skills: ["Mentoring", "Code review", "Public speaking"],
                highlight: "Every mentee who ships their first project counts double.",
            },
            {
                period: "2021",
                title: "Tech Volunteer",
                org: "Local nonprofit",
                kind: "volunteer",
                size: "tall",
                summary: "A website that helped a cause, not a metric.",
                story:
                    "I rebuilt a nonprofit's site so donations stopped requiring a phone call. Small budget, huge constraint list — it taught me that the simplest solution that works is a feature, not a compromise.",
                body: [
                    "No design team, no budget, one weekend a month. Every feature had to justify itself in donations or hours saved for the two staff members who ran everything.",
                ],
                skills: ["Web fundamentals", "Accessibility", "Working with non-tech teams"],
            },
            {
                period: "2024 — Now",
                title: "This Portfolio",
                org: "Ongoing side project",
                kind: "project",
                size: "lg",
                summary: "The site you are scrolling right now.",
                story:
                    "A playground for motion design, custom cursors, and opinions about color. Every animation here went through ten versions you will never see — which is exactly the point of a side project.",
                body: [
                    "It started as a résumé with a URL. Then the cursor got a personality, the nav became a collage, and the color theme learned to rotate on a sushi button. Scope creep — but the fun kind.",
                    "Everything here is a bet that personality beats polish. If a component doesn't make me grin during testing, it gets rewritten until it does.",
                ],
                skills: ["Framer Motion", "Tailwind CSS", "Interaction design"],
            },
            {
                period: "2023",
                title: "Hackathon Finalist",
                org: "48-hour build",
                kind: "project",
                size: "tall",
                summary: "A working prototype and three hours of sleep.",
                story:
                    "Two days, one team, zero scope discipline at the start. We cut half the features on day two and finished with something that demoed cleanly — my favorite lesson in ruthless prioritization.",
                body: [
                    "Hour 30 was the turning point: we deleted the feature we loved most because it wasn't the feature the judges needed to see. It hurt. It worked.",
                ],
                skills: ["Rapid prototyping", "Teamwork", "Pitching"],
                highlight: "Top finalist out of dozens of teams.",
            },
            {
                period: "2019 — 2021",
                title: "Student Organization Lead",
                org: "Campus tech club",
                kind: "community",
                size: "lg",
                summary: "Herding volunteers is harder than herding processes.",
                story:
                    "I ran events, budgets, and a team of people who could quit at any moment — because they were volunteers. It taught me that leadership is mostly logistics, and motivation is a design problem.",
                body: [
                    "The club had thirty members, four committees, and exactly zero obligation to listen to me. Every event that happened, happened because someone felt ownership — my actual job was manufacturing that feeling.",
                ],
                skills: ["Leadership", "Event planning", "Budgeting"],
            },
            {
                period: "2023",
                title: "Meetup Speaker",
                org: "Local dev community",
                kind: "community",
                size: "sm",
                summary: "First talk, sweaty palms, great questions.",
                story:
                    "I gave a talk on frontend animation to a room of strangers. The slides were fine; the Q&A was better. Nothing sharpens an opinion like defending it in public.",
                body: [
                    "Preparing the talk taught me more than giving it — you can't put a hand-wave on a slide. Every 'it just works' had to become a diagram.",
                ],
                skills: ["Public speaking", "Community"],
            },
            {
                period: "Ongoing",
                title: "Language Study",
                org: "Self-directed",
                kind: "community",
                size: "sm",
                summary: "窟 — because interfaces aren't the only systems worth learning.",
                story:
                    "Studying a new writing system rewires how you think about symbols, hierarchy, and meaning — which is secretly just typography homework.",
                body: [
                    "Stroke order is a design system. Radicals are components. Somewhere between flashcard #400 and #401 I realized I was just learning another kind of grid.",
                ],
                skills: ["Discipline", "Cross-cultural curiosity"],
            },
        ],
    },
];

export const experienceStats = [
    { value: 4, suffix: "+", label: "Years building software" },
    { value: 12, suffix: "+", label: "Projects shipped" },
    { value: 20, suffix: "+", label: "People mentored" },
    { value: 3, suffix: "", label: "Communities served" },
];
