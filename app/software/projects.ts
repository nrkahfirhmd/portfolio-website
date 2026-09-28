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
};

export const CURRENT = {
  role: "iOS Applied AI Engineer",
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
