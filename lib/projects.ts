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
