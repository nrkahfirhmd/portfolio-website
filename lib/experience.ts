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
        title: "Main Quest",
        tagline: "The experiences that turned passion into practice.",
        layout: "timeline",
        entries: [
            {
                period: "March 2026 - Now",
                title: "Junior iOS Developer",
                org: "Apple Developer Academy @ BINUS, Bali",
                kind: "career",
                summary:
                    "Selected from 15,000+ applicants to join the first international Apple Developer Academy in Asia, where I learned iOS development and product thinking through Challenge Based Learning.",
                story:
                    "The Academy reshaped how I learn and build. Beyond developing iOS apps with Swift, I embraced a product-first mindset, learned the Product Development Lifecycle, and built four applications through Challenge Based Learning in a collaborative environment.",
                skills: ["Swift", "SwiftUI", "Product Management"],
                highlight: "Selected from 15,000+ applicants for the first international Apple Developer Academy in Asia.",
            },
            {
                period: "December 2025 - February 2026",
                title: "System Engineer",
                org: "Guriang Computational Facility · Padjadjaran University",
                kind: "career",
                summary:
                    "Maintained and restored a high-performance computing server by upgrading system packages and deploying a Slurm cluster across six nodes.",
                story:
                    "Offered this project after a successful HPC course, I stepped into system engineering for the first time. Working directly with Ubuntu Server challenged me to adapt to a command-line environment while learning how to maintain production infrastructure and configure distributed computing systems.",
                skills: ["Ubuntu", "High Performance Computing", "Slurm"],
                highlight:
                    "Deployed and tested a 6-node Slurm cluster while restoring a high-performance computing server.",
            },
            {
                period: "August 2025 - December 2025",
                title: "Data Analyst & Automation",
                org: "PT Tunas Ridean · Jakarta",
                kind: "career",
                summary:
                    "Analyzed business processes and built automation tools that reduced manual work across multiple tax operations.",
                story:
                    "My first internship taught me how software can create real impact. I built automation tools used by Tax division, learned to iterate based on user feedback, and saw how AI and workflow automation can transform repetitive work into efficient processes.",
                skills: ["Data Analysis", "Work Automation", "Website Extension"],
                highlight:
                    "Built automation solutions that reduced processing time by up to 97.5% across tax division operations.",
            },
            {
                period: "September 2024 - January 2025",
                title: "Machine Learning Engineer",
                org: "Bangkit Academy · Remote",
                kind: "career",
                summary:
                    "Completed a 900+ hour AI and Machine Learning program with a final grade of 91.7, building a strong foundation in modern AI technologies.",
                story:
                    "My first formal experience in AI. Through an intensive curriculum backed by leading tech companies, I learned the fundamentals of machine learning and applied them to build software solutions using TensorFlow, NLP, computer vision, and generative AI.",
                skills: ["Tensorflow", "Time Series Forecasting", "AI Software Engineer"],
                highlight:
                    "Graduated with a 91.7 final grade after completing 900+ hours of AI and Machine Learning training.",
            },
            // {
            //     period: "2026 ()",
            //     title: "Junior iOS Developer",
            //     org: "Apple Developer Academy @ BINUS, Bali · Jakarta",
            //     kind: "career",
            //     summary: "Shipping features people actually use.",
            //     story:
            //         "I joined a small product team where every release lands in front of real users the same week. I learned to argue with data, cut scope without cutting quality, and treat the UI as part of the product's personality — not decoration.",
            //     skills: ["React", "Next.js", "TypeScript", "Design systems"],
            //     highlight: "From idea to production in weekly cycles.",
            // },
        ],
    },
    {
        id: "off-the-clock",
        number: "02",
        title: "Off the Clock",
        tagline:
            "A collection of stories worth exploring",
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
                image: "/experiences/ada.png"
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

/**
 * A photo, either a real file under /public or a generated placeholder frame.
 * Set `image` once you have real shots; until then `tint` + `caption` render
 * a captioned gradient so the layout is complete.
 */
export interface ExperiencePhoto {
    caption: string;
    /** Optional image path under /public. Falls back to a gradient frame. */
    image?: string;
    /** Tailwind gradient classes for the placeholder frame. */
    tint: string;
}

/** Swipeable carousel cell — the "moments" reel. */
export const experienceAlbum: ExperiencePhoto[] = [
    { caption: "Demo night, front row nerves", tint: "from-primary to-secondary" },
    { caption: "Whiteboard graveyard, 2am", tint: "from-secondary to-tertiary" },
    { caption: "First mentee ships to prod", tint: "from-tertiary to-quaternary" },
    { caption: "Meetup, mic in hand", tint: "from-quaternary to-primary" },
    { caption: "Hackathon team, hour 47", tint: "from-primary to-tertiary" },
];

/** Draggable polaroid stack cell — scattered keepsakes. */
export const experiencePolaroids: ExperiencePhoto[] = [
    { caption: "sushi run", tint: "from-primary to-secondary" },
    { caption: "game night", tint: "from-secondary to-quaternary" },
    { caption: "morning miles", tint: "from-tertiary to-primary" },
];
