export type ProjectCategory = "Software" | "AI" | "System";

export interface Project {
    id: string;
    title: string;
    blurb: string;
    category: ProjectCategory;
    year: string;
    role: string;
    stack: string[];
    /** Showcase image (transparent PNG works best — placeholder until real shots land). */
    cover: string;
    href?: string;
}

export const projects: Project[] = [
    {
        id: "01",
        title: "Ledger Grid",
        blurb: "Real-time finance dashboard with an editable spreadsheet engine and instant sync.",
        category: "Software",
        year: "2025",
        role: "Full-stack",
        stack: ["Next.js", "tRPC", "Postgres"],
        cover: "/home/mac.png",
        href: "#",
    },
    {
        id: "02",
        title: "Sushi OS",
        blurb: "A playful component library and design system powering this very portfolio.",
        category: "Software",
        year: "2025",
        role: "Design Engineer",
        stack: ["React", "Tailwind", "Motion"],
        cover: "/home/mac.png",
        href: "#",
    },
    {
        id: "03",
        title: "Muse",
        blurb: "Local-first RAG assistant that turns scattered notes into a searchable second brain.",
        category: "AI",
        year: "2024",
        role: "ML Engineer",
        stack: ["Python", "LLM", "Vector DB"],
        cover: "/home/iphone.png",
        href: "#",
    },
    {
        id: "04",
        title: "Frame Sense",
        blurb: "On-device vision model that captions and clusters photos without leaving your phone.",
        category: "AI",
        year: "2024",
        role: "Research",
        stack: ["PyTorch", "CoreML", "Swift"],
        cover: "/home/glasses.png",
        href: "#",
    },
    {
        id: "05",
        title: "Quill Kernel",
        blurb: "A tiny preemptive scheduler and memory allocator written from scratch in Rust.",
        category: "System",
        year: "2023",
        role: "Systems",
        stack: ["Rust", "x86", "QEMU"],
        cover: "/home/hand.png",
        href: "#",
    },
    {
        id: "06",
        title: "Wormhole",
        blurb: "Peer-to-peer file relay with hole-punching and zero-config encrypted transfer.",
        category: "System",
        year: "2023",
        role: "Networking",
        stack: ["Go", "gRPC", "WebRTC"],
        cover: "/home/iphone.png",
        href: "#",
    },
];

export const workCategories: ProjectCategory[] = ["Software", "AI", "System"];

/**
 * Category color tokens. Each category borrows one step of the active theme
 * palette; the accent is the only saturated ink on the surface, and the washes
 * are the same hue diluted almost to nothing.
 */
export const categoryAccent: Record<ProjectCategory, string> = {
    Software: "bg-primary",
    AI: "bg-secondary",
    System: "bg-tertiary",
};

/** Faint hero wash behind an article title. */
export const categoryWash: Record<ProjectCategory, string> = {
    Software: "from-primary/12",
    AI: "from-secondary/12",
    System: "from-tertiary/12",
};

/** Corner tint on a project card showcase. */
export const categoryTint: Record<ProjectCategory, string> = {
    Software: "from-primary/15",
    AI: "from-secondary/15",
    System: "from-tertiary/15",
};
