export interface Chapter {
    kanji: string;
    kicker: string;
    heading: string;
    body: string[];
}

export const intro = {
    tagline: ["Exploring", "the many ways", "technology creates value."],
    kanji: "窟", // "den" / "cave" — the place where things get made
    name: "KAHFI",
    role: "Technology Orchestrator · Currently In Training",
    scrollCue: "scroll to enter the cave",
};

export const chapters: Chapter[] = [
    {
        kanji: "始",
        kicker: "01 — Origin",
        heading: "It started always with a curiosity",
        body: [
            "Before I jumped into the technology field, I always questioned anything that interested me. Sometimes, I would go so far as to reverse engineer it.",
            "Curiosity was never a decision to make. It was my whole personality. Technology just gave that instinct an infinite room to run in."
        ],
    },
    {
        kicker: "02 — Craft",
        kanji: "作",
        heading: "I care a lot about the sense",
        body: [
            "Anyone can build features. I care about how they feel. Every interaction should be intentional, effortless, and leave people with the sense that someone truly cared.",
            "Software isn't just a collection of functions. It's the quiet work of turning complexity into clarity, one thoughtful decision at a time.",
        ],
    },
    {
        kicker: "03 — Belief",
        kanji: "念",
        heading: "Small, sharp, and honest",
        body: [
            "I'd rather ship one thing that truly works than ten things that only look good in a demo. Quality isn't about scale — it's about intention.",
            "Every product is a conversation with the person on the other side of the screen. My job is to listen first, then build with honesty and care.",
        ],
    },
];

export const skills = [
    "Python", "Tensorflow", "PyTorch", "Scikit-Learn",
    "TypeScript", "React", "Next.js", "NestJS", "Express.js", "PHP", "Laravel", "CodeIgniter",
    "Swift", "SwiftUI",
    "PostgreSQL", "MySQL", "MongoDB",
    "Bash", "Ubuntu", "Docker"
];

export const stats = [
    { value: 5, suffix: "+", label: "things brought to life" },
    { value: 100, suffix: "%", label: "built with intention" },
    { value: 24, suffix: "/7", label: "learning mindset" },
    { value: Infinity, suffix: "", label: "things to learn" },
];

export const outro = {
    kanji: "縁",
    heading: "The door is open",
    body: "“Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover.”",
    quoter: "- H. Jackson Brown Jr.",
    cta: "Say hello",
};
