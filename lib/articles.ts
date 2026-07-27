import { projects, type Project } from "@/lib/projects";

/* ---------- rich inline model ---------- */

export type Inline =
    | string
    | { b: string } // bold
    | { i: string } // italic
    | { code: string } // inline code
    | { link: { text: string; href: string } };

/* ---------- block model (Notion / Medium-like) ---------- */

export type Block =
    | { type: "heading"; id: string; text: string }
    | { type: "paragraph"; content: Inline[] }
    | { type: "quote"; content: Inline[]; cite?: string }
    | { type: "code"; lang: string; code: string }
    | { type: "image"; src: string; alt: string; caption?: string }
    | { type: "list"; ordered: boolean; items: Inline[][] }
    | { type: "callout"; tone: "info" | "warn" | "success"; content: Inline[] }
    | { type: "divider" };

export interface Article {
    lede: string;
    readMinutes: number;
    blocks: Block[];
}

/* ---------- flagship, hand-written ---------- */

const ledgerGrid: Article = {
    lede: "How a weekend spreadsheet hack turned into a real-time finance engine — and everything it taught me about sync, conflict, and trust.",
    readMinutes: 6,
    blocks: [
        {
            type: "heading",
            id: "the-spark",
            text: "The spark",
        },
        {
            type: "paragraph",
            content: [
                "It started with a complaint. A friend running a small studio was juggling ",
                { b: "three different spreadsheets" },
                " to track invoices, and none of them agreed with each other. Numbers drifted. Money went missing on paper. I thought: how hard could a ",
                { i: "single source of truth" },
                " really be?",
            ],
        },
        {
            type: "paragraph",
            content: [
                "Turns out — hard. But the fun kind of hard.",
            ],
        },
        {
            type: "quote",
            content: [
                "A spreadsheet is a database that lied to you about being a document.",
            ],
            cite: "Something I scribbled at 2am",
        },
        {
            type: "heading",
            id: "the-architecture",
            text: "The architecture",
        },
        {
            type: "paragraph",
            content: [
                "The core is a grid of cells, each one a tiny reactive node. When you edit ",
                { code: "A1" },
                ", every formula that depends on it recomputes — and only those. The trick was modelling dependencies as a directed graph and walking it in topological order.",
            ],
        },
        {
            type: "code",
            lang: "typescript",
            code: `function recompute(cell: Cell, graph: DepGraph) {
  const order = topoSort(graph.from(cell));
  for (const node of order) {
    node.value = evaluate(node.formula, graph);
    node.emit("changed");
  }
}`,
        },
        {
            type: "callout",
            tone: "info",
            content: [
                "Topological sort guarantees you never evaluate a cell before its inputs are ready. Cycles? Those get flagged as ",
                { code: "#CIRCULAR" },
                " — same as Excel.",
            ],
        },
        {
            type: "heading",
            id: "the-hard-part",
            text: "The hard part: sync",
        },
        {
            type: "paragraph",
            content: [
                "Two people editing the same cell at the same time is where dreams go to die. I reached for ",
                { b: "CRDTs" },
                " — conflict-free replicated data types — so edits merge deterministically without a central lock.",
            ],
        },
        {
            type: "list",
            ordered: true,
            items: [
                [{ b: "Local-first" }, ": edits apply instantly, no round-trip."],
                [{ b: "Eventually consistent" }, ": peers converge on the same state."],
                [{ b: "Offline-tolerant" }, ": close the laptop, reopen, it catches up."],
            ],
        },
        {
            type: "image",
            src: "/home/mac.png",
            alt: "Ledger Grid running on a laptop",
            caption: "The final build — editing feels instant even across a flaky connection.",
        },
        {
            type: "callout",
            tone: "warn",
            content: [
                "CRDTs are magic until you need ",
                { i: "ordered" },
                " lists. Rows that reorder under concurrent edits nearly broke me. Budget a week just for that.",
            ],
        },
        {
            type: "heading",
            id: "what-i-learned",
            text: "What I learned",
        },
        {
            type: "paragraph",
            content: [
                "Sync is a ",
                { b: "trust problem" },
                " wearing an engineering costume. People don't care how clever the merge is — they care that the number they typed is still there tomorrow. Everything else is plumbing.",
            ],
        },
        {
            type: "quote",
            content: [
                "Ship the boring guarantee first. Delight is what's left after nothing breaks.",
            ],
        },
    ],
};

export const articles: Record<string, Article> = {
    "01": ledgerGrid,
};

/* ---------- default builder for projects without a hand-written story ---------- */

export function getArticle(project: Project): Article {
    const explicit = articles[project.id];
    if (explicit) return explicit;

    return {
        lede: project.blurb,
        readMinutes: 3,
        blocks: [
            { type: "heading", id: "overview", text: "Overview" },
            {
                type: "paragraph",
                content: [
                    project.blurb,
                    " Built as a ",
                    { b: project.role },
                    " project in ",
                    { b: project.year },
                    ", it lives at the intersection of curiosity and shipping.",
                ],
            },
            {
                type: "quote",
                content: [
                    "Every project here started as a question I couldn't stop poking at.",
                ],
            },
            { type: "heading", id: "the-stack", text: "The stack" },
            {
                type: "paragraph",
                content: [
                    "Under the hood, ",
                    { b: project.title },
                    " runs on a deliberately small toolset:",
                ],
            },
            {
                type: "list",
                ordered: false,
                items: project.stack.map((tech) => [{ code: tech } as Inline]),
            },
            {
                type: "image",
                src: project.cover,
                alt: `${project.title} showcase`,
                caption: `${project.title} — ${project.category}`,
            },
            {
                type: "callout",
                tone: "success",
                content: [
                    "Full write-up coming soon. This is a placeholder story generated from the project's metadata.",
                ],
            },
        ],
    };
}

export function articleHeadings(article: Article) {
    return article.blocks
        .filter((b): b is Extract<Block, { type: "heading" }> => b.type === "heading")
        .map((b) => ({ id: b.id, text: b.text }));
}

export { projects };
