# MDX Preview — dev-only story editor

A dev-only route that renders MDX from a `<textarea>` live, using the same
component map and `.prose` styles the real `/work/[slug]` pages use. It exists so
a story can be drafted with instant feedback without the
edit-file → save → Fast-Refresh loop, and without a second editor window.
`/preview/<slug>` mirrors `/work/<slug>` — swap the segment to edit that story.

This doc doubles as a **port guide**: the [Porting checklist](#porting-checklist)
isolates every repo-specific line so the feature can be lifted into another
Next.js + MDX portfolio.

## Non-goals

- **Not a CMS.** No save, no file writes, no auth, no media upload. Draft here,
  paste the text back into `app/work/<slug>/page.mdx` when done.
- **Not shipped.** Never reachable in a production build (see [Security](#security)).
- **Not a replacement** for viewing the real route — the real page is still the
  source of truth for layout, metadata, `generateStaticParams`, and anything
  that depends on the URL.

## Prerequisites in the host repo

| Needs | This repo | Why |
|---|---|---|
| Next.js App Router | 16.3.1 | server page reads the file, client component compiles |
| MDX stories on the filesystem | `app/work/<slug>/page.mdx` | `[slug]` route reads the raw text |
| A shared MDX component map | root `mdx-components.tsx` exporting `useMDXComponents()` | preview imports the *same* map, so it can't drift from prod |
| `@mdx-js/mdx` resolvable | `3.1.1`, transitive via `@next/mdx` | `evaluate()` — the browser-side compiler |
| A styling hook for article body | `.prose` class in `globals.css` | preview wraps output in the same class |
| A slug registry | `PROJECTS[]` in `app/projects.ts` | whitelist before `readFile` (path-traversal guard) |

If `@mdx-js/mdx` is not already in the tree (no `@next/mdx`), add it explicitly:
`npm i -D @mdx-js/mdx`.

## Routes

| Path | File | Editor opens with |
|---|---|---|
| `/preview` | `app/preview/page.tsx` | freeform starter template |
| `/preview/[slug]` | `app/preview/[slug]/page.tsx` | the raw text of `app/work/<slug>/page.mdx` |

- **Dev-only gate, first line of each page module:**
  `if (process.env.NODE_ENV === "production") notFound();`
  Runtime MDX evaluation executes arbitrary JS/JSX, and the `[slug]` route calls
  `readFile` on a request-derived path; the gate is what keeps both off the
  public site. A build-time check alone is not enough because the route file
  still ships — `notFound()` at request time is the guarantee.
- `[slug]` is **whitelisted against `PROJECTS` slugs before any filesystem
  access** — an unknown slug 404s, so `slug` can never be a path-traversal
  payload. `readFile` failure also 404s.
- The `Editor` is a shared client component; the two pages differ only in the
  `initialSource` / `storageKey` / `filePath` props they pass.
- Not linked from anywhere. Typed URL only. No `metadata` export.

## How it works

```
textarea (raw MDX)
  → useDeferredValue (keeps typing responsive; no manual timer)
  → evaluate(source, { ...jsxRuntime, baseUrl, useMDXComponents })   // @mdx-js/mdx
  → <Content components={mdxComponents} />
  → rendered inside <article class="prose"> in a right-hand pane
```

- `evaluate` from `@mdx-js/mdx` compiles **and** runs MDX in the browser, no
  build step. Production JSX runtime (`react/jsx-runtime`) with
  `development: false` (the default) — pass `Fragment`, `jsx`, `jsxs`, which the
  `import * as runtime` spread supplies.
- `baseUrl: import.meta.url` is required or `evaluate` throws on any `import` /
  `export … from` in the source and on `import.meta`.
- `useMDXComponents` is passed to `evaluate` **and** the result is passed as
  `components=` to the compiled component. Bare tags in the MDX
  (`<ArticleHeader>`, `<Kicker>`, …) resolve from that map with no import in the
  source — same as the real `.mdx` pages.
- MDX files declare `export const metadata = {...}` at the top. `evaluate`
  returns it as a named export; ignored.

## Layout & persistence

- Two panes, `lg:grid-cols-2`, `h-[calc(100dvh-4rem)] overflow-hidden` (the
  `4rem` is the sticky navbar; panes scroll internally so the page doesn't).
- Client component (`"use client"`) — all local state + browser compilation.
- `/preview` seeds the starter template; `/preview/[slug]` seeds the file text.
- `[slug]` route shows a top bar: file path + **Revert to file** button
  (`setSource(initialSource)`, discards the draft).
- `localStorage` draft, keyed `mdx-preview-draft:<slug>` so stories don't
  collide. Read/write in try/catch; renders fine with nothing stored. A stored
  draft wins over `initialSource` on load. Per-browser, never leaves the machine.

## Error handling

- `evaluate` in a `.catch`: on failure, keep the last good render (`lastGood`
  ref) and show the message in a sticky strip above the preview — a syntax error
  mid-edit must not blank the pane. The message carries `line:col`.
- `RenderBoundary` (class error boundary) around the output: an
  `<ArticleHeader slug="x" />` typed with an unknown slug calls the slug lookup,
  which **throws** — that lands as a message, not a route crash. Boundary resets
  when the source changes.
- `next/image` inside components works client-side in dev. Remote `src` still
  needs a host in `next.config.ts` `images.remotePatterns` — same as the real
  page.

## Security

Runtime MDX evaluation = running arbitrary code from the editor. Acceptable
because:

1. Both routes 404 in production (`NODE_ENV` gate, first line of each page).
2. In dev the only input is the developer's own keystrokes and one whitelisted
   file read.

Rules:

- No network fetch of MDX source, no `?src=` query param. The `[slug]` route
  reads exactly one file — `app/work/<slug>/page.mdx` — and only after `slug`
  matched a registry entry. Do not widen the path or take it from the request.
- No **save to file** button. Draft → paste back by hand. A write path makes
  this a different, higher-risk tool.

## Gotchas hit while building

- **`params` is a `Promise`** in this Next version — `const { slug } = await params`,
  and the page is `async`.
- **`react-hooks/set-state-in-effect`** flags the localStorage-read effect. It
  stays (with an `eslint-disable-next-line`): a `useState` initializer also runs
  during hydration and would render the draft over the server's `initialSource`
  — a hydration mismatch. The effect + one extra render is correct.
- **`useMDXComponents()` can't be called in the `.then` callback**
  (`react-hooks/rules-of-hooks`). Call it once at component top level, close over
  the result.
- **`--color-danger` is not in the `@theme inline` block**, so there is no
  `text-danger` utility — the error strip uses `style={{ color: "var(--color-danger)" }}`.
  Check which of your semantic tokens are actually mapped to utilities.
- **`100dvh` not `100vh`** for the pane height, or mobile browser chrome clips
  the editor.

## Porting checklist

Every line that assumes *this* repo, and what to change:

| In | Line | Swap for your repo |
|---|---|---|
| `[slug]/page.tsx` | `import { PROJECTS } from "../../projects"` | your slug registry |
| `[slug]/page.tsx` | `PROJECTS.some((p) => p.slug === slug)` | your "is this a real story" check |
| `[slug]/page.tsx` | `join("app", "work", slug, "page.mdx")` | your story file path shape |
| `[slug]/page.tsx` | `PageProps<"/preview/[slug]">` | keep in sync with the route folder name |
| `editor.tsx` | `import { useMDXComponents } from "../../mdx-components"` | path to your component map |
| `editor.tsx` | `STARTER` template body | tags your component map actually provides |
| `editor.tsx` | `className="… prose …"` | your article-body class |
| `editor.tsx` | `bg-surface-sunken`, `border-border`, `text-ink*`, `px-gutter`, `text-caption`, `hover:text-accent` | your token utilities, or plain Tailwind |
| `editor.tsx` | `h-[calc(100dvh-4rem)]` | your header height (or `100dvh` if no fixed header) |
| `editor.tsx` | `var(--color-danger)` | your error color |
| both pages | `if (process.env.NODE_ENV === "production") notFound()` | keep verbatim — this is the security boundary |

Not repo-specific, keep as-is: `evaluate` call + `baseUrl`, `RenderBoundary`,
the deferred-value + last-good-render pattern, the `localStorage` try/catch, the
whitelist-before-`readFile` ordering.

## Full source

### `app/preview/editor.tsx`

```tsx
"use client";

import { evaluate } from "@mdx-js/mdx";
import {
  Component,
  type ReactNode,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import * as runtime from "react/jsx-runtime";
import { useMDXComponents } from "../../mdx-components";

export const STARTER = `export const metadata = { title: "Draft" };

<ArticleHeader slug="retrieval-engine" />

<Figure caption="System diagram goes here." />

The opening paragraph. Write the way the finished story should read — the
preview uses the same components and \`.prose\` styles as \`/work/[slug]\`.

<Kicker>Problem</Kicker>

## The first heading

<Points>
  <Point title="One point">Short parallel copy.</Point>
  <Point title="Another">The grid column count follows the child count.</Point>
</Points>
`;

// A syntax error mid-keystroke must not blank the pane, and ArticleHeader throws
// on an unknown slug — both need to land as a message, not a route crash.
class RenderBoundary extends Component<
  { children: ReactNode; onError: (message: string) => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    this.props.onError(error instanceof Error ? error.message : String(error));
  }

  componentDidUpdate(prev: { children: ReactNode }) {
    // Reset once the offending source has changed.
    if (prev.children !== this.props.children && this.state.failed) {
      this.setState({ failed: false });
    }
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type EditorProps = {
  /** Text the editor opens with when no local draft is stored. */
  initialSource: string;
  /** localStorage key for the draft — per-slug so stories don't collide. */
  storageKey: string;
  /** Shown in the top bar; the file the draft should be pasted back into. */
  filePath?: string;
};

export function Editor({ initialSource, storageKey, filePath }: EditorProps) {
  const [source, setSource] = useState(initialSource);
  const [rendered, setRendered] = useState<ReactNode>(null);
  const [error, setError] = useState<string | null>(null);
  const deferred = useDeferredValue(source);
  const mdxComponents = useMDXComponents();

  // Keep the last good tree mounted so an error shows the previous render
  // rather than an empty column.
  const lastGood = useRef<ReactNode>(null);

  useEffect(() => {
    // Read after mount, not in a useState initializer: the initializer also
    // runs during hydration and would render the draft over server-rendered
    // initialSource, a hydration mismatch. One extra render is the price.
    try {
      const stored = localStorage.getItem(storageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored !== null) setSource(stored);
    } catch {
      // private mode / blocked storage — start from initialSource.
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, source);
    } catch {
      // non-fatal
    }
  }, [storageKey, source]);

  useEffect(() => {
    let cancelled = false;

    evaluate(deferred, {
      ...runtime,
      baseUrl: import.meta.url,
      useMDXComponents,
    })
      .then((mod) => {
        if (cancelled) return;
        const Content = mod.default;
        const tree = <Content components={mdxComponents} />;
        lastGood.current = tree;
        setRendered(tree);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
        setRendered(lastGood.current);
      });

    return () => {
      cancelled = true;
    };
  }, [deferred, mdxComponents]);

  return (
    // Navbar is a 4rem sticky header; the two panes take the rest of the
    // viewport and scroll internally, so the page itself does not scroll.
    <main className="w-full grid lg:grid-cols-2 h-[calc(100dvh-4rem)] overflow-hidden">
      <div className="flex h-full flex-col border-r border-border">
        {filePath ? (
          <div className="flex items-center justify-between border-b border-border bg-surface-sunken px-gutter py-2 text-caption text-ink-muted">
            <span className="font-mono">{filePath}</span>
            <button
              type="button"
              onClick={() => setSource(initialSource)}
              className="font-medium tracking-wider uppercase hover:text-accent"
            >
              Revert to file
            </button>
          </div>
        ) : null}

        <textarea
          value={source}
          onChange={(event) => setSource(event.target.value)}
          spellCheck={false}
          className="h-full w-full flex-1 resize-none bg-surface-sunken p-gutter font-mono text-label leading-relaxed text-ink outline-none"
          aria-label="MDX source"
        />
      </div>

      <div className="relative h-full overflow-y-auto">
        {error ? (
          <p
            className="sticky top-0 z-10 bg-surface-sunken px-gutter py-2 font-mono text-caption"
            style={{ color: "var(--color-danger)" }}
          >
            {error}
          </p>
        ) : null}

        <article className="prose px-gutter py-gutter-lg">
          <RenderBoundary onError={setError}>{rendered}</RenderBoundary>
        </article>
      </div>
    </main>
  );
}
```

### `app/preview/page.tsx`

```tsx
import { notFound } from "next/navigation";
import { Editor, STARTER } from "./editor";

// Dev-only freeform scratchpad. Per-story editing lives at /preview/[slug].
// The route file still ships in a production build, so the guarantee that
// arbitrary MDX is never evaluated on the live site is this request-time 404 —
// not the bundler. See docs/mdx-preview.md § Security.
export default function PreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Editor initialSource={STARTER} storageKey="mdx-preview-draft" />;
}
```

### `app/preview/[slug]/page.tsx`

```tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { PROJECTS } from "../../projects";
import { Editor } from "../editor";

// Swap `work` -> `preview` in any story URL to edit that file's MDX live:
// /work/retrieval-engine  ->  /preview/retrieval-engine
//
// Dev-only. The 404 below is the security boundary — runtime MDX evaluation
// runs arbitrary code, and `readFile` on a request-controlled path has no place
// in production. See docs/mdx-preview.md § Security.
export default async function PreviewStoryPage({
  params,
}: PageProps<"/preview/[slug]">) {
  if (process.env.NODE_ENV === "production") notFound();

  const { slug } = await params;

  // Whitelist against known slugs before touching the filesystem — this is what
  // stops `slug` being a path-traversal payload.
  if (!PROJECTS.some((project) => project.slug === slug)) notFound();

  const relPath = join("app", "work", slug, "page.mdx");
  let source: string;
  try {
    source = await readFile(join(process.cwd(), relPath), "utf8");
  } catch {
    notFound();
  }

  return (
    <Editor
      initialSource={source}
      storageKey={`mdx-preview-draft:${slug}`}
      filePath={relPath}
    />
  );
}
```

## Open questions

- Slug picker: let the editor pick which registry slug `ArticleHeader` renders
  against (a `<select>` that rewrites the starter line), or leave it to the
  writer to type? Lean: leave it to the writer.
- Section rail (`StoryNav`) in the preview too, or is the reading column enough?
  The rail reads `article.prose > h2` from the DOM, so it would work unchanged —
  but it is chrome, not content. Lean: skip it.
