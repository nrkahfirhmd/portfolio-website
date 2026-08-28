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
