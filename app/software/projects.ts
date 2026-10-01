// TODO(kv): draft selection, pulled from public GitHub repos. Swap, reorder,
// or rewrite freely. Newest first; the page renders them as a `git log`.
//
// `sha` is the repo's latest commit at the time this was written and
// `languages` is GitHub's bytes-per-language for the repo. Both are real,
// neither updates itself: refresh with
//   gh api repos/nrkahfirhmd/<repo>/commits?per_page=1 --jq '.[0].sha[:7]'
//   gh api repos/nrkahfirhmd/<repo>/languages

export type Project = {
  /** GitHub repo name under nrkahfirhmd. Also the React key. */
  repo: string;
  name: string;
  /** One line, conventional-commit voice. The log's subject line. */
  message: string;
  /** Shown when the entry is expanded. Plain facts, no metrics. */
  body: string;
  sha: string;
  /** Human period, e.g. "Aug 2026" or "Dec 2025 – Feb 2026". */
  period: string;
  /** Extra git-style refs beside the hash (`tag: live` is added from `live`). */
  refs?: string[];
  live?: string;
  languages: Record<string, number>;
  /** Tile image on /software, in public/. Width and height are the file's
   * own, so the masonry keeps its aspect ratio. Without one the tile shows
   * the system diagram. */
  cover?: { src: string; width: number; height: number };
  /** How the pieces connect, drawn as a diagram. Only parts the body (or the
   * story) actually names — no invented components. `x`/`y` are grid cells. */
  system: {
    nodes: { id: string; label: string; sub?: string; x: number; y: number }[];
    edges: [from: string, to: string][];
  };
};

/** Current role, shown under the name on /software. `null` hides the line. */
export const CURRENT: { role: string; company: string; companyUrl: string } | null = {
  role: "Junior iOS Developer",
  company: "Apple Developer Academy",
  companyUrl: "https://developeracademy.apps.binus.ac.id/bali/",
};

export const PROJECTS: Project[] = [
  {
    repo: "custom-photobooth",
    name: "Custom Photobooth",
    message: "feat: self-hosted event photobooth that runs on the guest's own phone",
    body: "Guests open a link on their own phone, take a strip of photos, preview it, and get it emailed to them. Every event is its own workspace with its own name, frame, photo count, and email sender.",
    sha: "495b53f",
    period: "Aug 2026",
    languages: { TypeScript: 125247, CSS: 34356 },
    system: {
      nodes: [
        { id: "event", label: "Event workspace", sub: "name, frame, count", x: 0, y: 0 },
        { id: "phone", label: "Guest's phone", sub: "opens the link", x: 0, y: 1 },
        { id: "strip", label: "Photo strip", sub: "shoot + preview", x: 1, y: 1 },
        { id: "email", label: "Email", sub: "event's sender", x: 2, y: 1 },
      ],
      edges: [["event", "strip"], ["phone", "strip"], ["strip", "email"]],
    },
  },
  {
    repo: "base-hackathon",
    name: "DeQRypt",
    message: "feat: scan-to-pay QR payments and a lending pool on Base",
    body: "A hackathon build on Base Sepolia: a multi-asset lending pool and an atomic payment router in Solidity, a Python/FastAPI backend that listens to on-chain events, and a LangChain + Gemini agent that manages a portfolio from plain-language requests.",
    sha: "ef026d0",
    period: "Dec 2025 – Feb 2026",
    refs: ["hackathon"],
    live: "https://deqrypt.vercel.app",
    languages: { TypeScript: 201729, Python: 63129, Solidity: 31665 },
    system: {
      nodes: [
        { id: "qr", label: "QR payment", sub: "mUSDC, mIDRX", x: 0, y: 0 },
        { id: "router", label: "Payment router", sub: "Solidity", x: 1, y: 0 },
        { id: "pool", label: "Lending pool", sub: "Solidity", x: 1, y: 1 },
        { id: "api", label: "Event listener", sub: "Python, FastAPI", x: 2, y: 0 },
        { id: "agent", label: "Portfolio agent", sub: "LangChain, Gemini", x: 3, y: 0 },
        { id: "web", label: "Web app", sub: "TypeScript", x: 3, y: 1 },
      ],
      edges: [["qr", "router"], ["router", "api"], ["pool", "api"], ["api", "agent"], ["api", "web"]],
    },
  },
  {
    repo: "hpc-dashboard",
    name: "HPC Dashboard",
    message: "feat: dashboard for MPI performance analysis on Kubernetes",
    // TODO(kv): one or two lines on what it measured and what it showed.
    body: "A dashboard for analysing how MPI workloads perform when they are scheduled on a Kubernetes cluster.",
    sha: "85e9a71",
    period: "Dec 2025",
    languages: { Python: 19963, "Jupyter Notebook": 3285 },
    system: {
      nodes: [
        { id: "mpi", label: "MPI workload", x: 0, y: 0 },
        { id: "k8s", label: "Kubernetes", sub: "scheduled", x: 1, y: 0 },
        { id: "data", label: "Performance", sub: "Python, notebooks", x: 2, y: 0 },
        { id: "dash", label: "Dashboard", sub: "analysis", x: 3, y: 0 },
      ],
      edges: [["mpi", "k8s"], ["k8s", "data"], ["data", "dash"]],
    },
  },
  {
    repo: "kamus-aksara-kawi",
    name: "Kamus Aksara Kawi",
    message: "feat: Kawi script dictionary on a SPARQL knowledge graph",
    body: "A dictionary for Old Javanese (Kawi) script. Entries live as RDF in Apache Jena Fuseki on a Google Cloud VM and are queried with SPARQL; the front end is Streamlit.",
    sha: "228f8d6",
    period: "Jun 2025",
    live: "https://kamus-aksara-kawi.streamlit.app/",
    languages: { Python: 13936 },
    system: {
      nodes: [
        { id: "rdf", label: "Kawi entries", sub: "RDF", x: 0, y: 0 },
        { id: "fuseki", label: "Jena Fuseki", sub: "Google Cloud VM", x: 1, y: 0 },
        { id: "sparql", label: "SPARQL", sub: "queries", x: 2, y: 0 },
        { id: "ui", label: "Streamlit", sub: "Python", x: 3, y: 0 },
      ],
      edges: [["rdf", "fuseki"], ["fuseki", "sparql"], ["sparql", "ui"]],
    },
  },
  {
    repo: "isc-diesco",
    name: "Dekorin",
    message: "feat: marketplace for booking home-decoration vendors",
    body: "An e-commerce platform for booking home-decoration services such as furniture layout and lighting, built in Laravel for the ISC Tech Dev competition at Diesco 2024.",
    sha: "05c75ee",
    period: "Jul – Aug 2024",
    refs: ["competition"],
    languages: { Blade: 155763, PHP: 78959, CSS: 49334 },
    system: {
      nodes: [
        { id: "customer", label: "Customer", x: 0, y: 0 },
        { id: "app", label: "Dekorin", sub: "Laravel, Blade", x: 1, y: 0 },
        { id: "booking", label: "Booking", x: 2, y: 0 },
        { id: "vendor", label: "Decor vendor", sub: "layout, lighting", x: 3, y: 0 },
      ],
      edges: [["customer", "app"], ["app", "booking"], ["booking", "vendor"]],
    },
  },
];

/** Repos with a long-form story at `content/software/<repo>.mdx`. */
export const STORY_REPOS = new Set<string>(["base-hackathon"]);

/** Throws on an unknown repo — in the MDX preview that lands as an error
 * message rather than a crash. */
export function projectByRepo(repo: string): Project {
  const found = PROJECTS.find((p) => p.repo === repo);
  if (!found) throw new Error(`Unknown project repo: "${repo}"`);
  return found;
}
