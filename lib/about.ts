// Story content for the About ("Index") page.
// First-person, editable narrative. Swap copy freely — structure drives the
// scroll animation, not the exact words.

export interface Chapter {
    kanji: string;
    kicker: string;
    heading: string;
    body: string[];
}

export const intro = {
    // Big kinetic opener
    tagline: ["I build", "quiet software", "in a loud world."],
    kanji: "窟", // "den" / "cave" — the place where things get made
    name: "KAHFI",
    role: "Software Engineer · Maker · Perpetual Beginner",
    scrollCue: "scroll to enter the den",
};

export const chapters: Chapter[] = [
    {
        kanji: "始",
        kicker: "01 — Origin",
        heading: "It started with a broken thing",
        body: [
            "Before I wrote a single line, I took things apart. Remote controls, old radios, the family PC that never booted the same way twice.",
            "Curiosity was never a hobby. It was the whole personality. Software just gave that instinct an infinite room to run in.",
        ],
    },
    {
        kicker: "02 — Craft",
        kanji: "作",
        heading: "I care about the seams",
        body: [
            "Anyone can ship a screen. I obsess over the moments between screens — the transition, the empty state, the error nobody planned for.",
            "Good software feels obvious in hindsight and invisible in use. That gap between messy reality and calm interface is where I like to live.",
        ],
    },
    {
        kicker: "03 — Belief",
        kanji: "念",
        heading: "Small, sharp, and honest",
        body: [
            "I would rather ship one thing that works than ten that demo well. Constraints aren't the enemy of creativity — they're the point of it.",
            "Every project is a conversation with the person who'll use it. My job is to listen harder than I talk.",
        ],
    },
];

export const skills = [
    "TypeScript", "React", "Next.js", "Node", "Rust", "Go", "Python",
    "Postgres", "Systems Design", "AI / LLMs", "Design Systems", "Motion",
];

export const stats = [
    { value: 7, suffix: "+", label: "years making things" },
    { value: 40, suffix: "+", label: "projects shipped" },
    { value: 3, suffix: "am", label: "favorite build hour" },
    { value: 100, suffix: "%", label: "still learning" },
];

export const outro = {
    kanji: "縁",
    heading: "The door is open",
    body: "If you build things that matter — or want to — I'd like to hear about it.",
    cta: "Say hello",
};
