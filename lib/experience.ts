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
                period: "2024",
                title: "Practicum Assitant",
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
            // {
            //     period: "2022 — Now",
            //     title: "Coding Mentor",
            //     org: "Community bootcamp",
            //     kind: "volunteer",
            //     size: "lg",
            //     summary: "Teaching beginners the things I wish someone had told me.",
            //     story:
            //         "One evening a week I mentor career-switchers through their first projects. Explaining closures at 9pm to someone who started coding a month ago is the fastest way to find out what you actually understand.",
            //     body: [
            //         "The cohort is a mix: an accountant, a nurse, a barista — all betting a year of evenings on a new career. My job isn't to lecture; it's to sit next to their code and ask the questions a senior would ask, gently.",
            //         "The best sessions end with me saying almost nothing. Someone explains their own bug out loud, catches it mid-sentence, and fixes it. That moment — when the debugger becomes internal — is what I show up for.",
            //     ],
            //     skills: ["Mentoring", "Code review", "Public speaking"],
            //     highlight: "Every mentee who ships their first project counts double.",
            //     image: "/experiences/ada.png"
            // },
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
                org: "Character Bulding Season 2024",
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
                image: "/experiences/cbs.png"
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
                image: "/experiences/compe.png"
            },
            // {
            //     period: "2019 — 2021",
            //     title: "Student Organization Lead",
            //     org: "Campus tech club",
            //     kind: "community",
            //     size: "lg",
            //     summary: "Herding volunteers is harder than herding processes.",
            //     story:
            //         "I ran events, budgets, and a team of people who could quit at any moment — because they were volunteers. It taught me that leadership is mostly logistics, and motivation is a design problem.",
            //     body: [
            //         "The club had thirty members, four committees, and exactly zero obligation to listen to me. Every event that happened, happened because someone felt ownership — my actual job was manufacturing that feeling.",
            //     ],
            //     skills: ["Leadership", "Event planning", "Budgeting"],
            // },
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
    { caption: "1st Time as A Lead", image: "/experiences/album/gathering.png", tint: "from-primary to-secondary" },
    { caption: "One of the memorable experience in College", image: "/experiences/album/po_cbs.png", tint: "from-secondary to-tertiary" },
    { caption: "The best friends that accompanied me along the journey", image: "/experiences/album/bfr.png", tint: "from-tertiary to-quaternary" },
    { caption: "Apple Developer Academy Kick-Off", image: "/experiences/album/academy.png", tint: "from-quaternary to-primary" },
    { caption: "Currently Building: Omawe", image: "/experiences/album/omawe.png", tint: "from-primary to-tertiary" },
];

/** Draggable polaroid stack cell — scattered keepsakes. */
export const experiencePolaroids: ExperiencePhoto[] = [
    { caption: "hike", image: "/experiences/keepsakes/hike.png", tint: "from-primary to-secondary" },
    { caption: "being a great friend", image: "/experiences/keepsakes/growing.png", tint: "from-secondary to-quaternary" },
    { caption: "having fun", image: "/experiences/keepsakes/fun.png", tint: "from-tertiary to-primary" },
];
