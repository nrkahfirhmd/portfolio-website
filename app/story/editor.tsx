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
import { useMDXComponents } from "@/mdx-components";

/** Turns render errors (bad syntax mid-keystroke, unknown header slug) into a message, not a blank pane. */
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
  /** The story's header, rendered above the output as the real page does. */
  header?: ReactNode;
};

export function Editor({ initialSource, storageKey, filePath, header }: EditorProps) {
  const [source, setSource] = useState(initialSource);
  const [rendered, setRendered] = useState<ReactNode>(null);
  const [error, setError] = useState<string | null>(null);
  const deferred = useDeferredValue(source);
  const mdxComponents = useMDXComponents();

  // On error, keep showing the last good render.
  const lastGood = useRef<ReactNode>(null);

  useEffect(() => {
    // Read after mount: in a useState initializer it would mismatch hydration.
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
    <main className="ed">
      <div className="ed-source">
        {filePath ? (
          <div className="ed-bar">
            <span>{filePath}</span>
            <button type="button" onClick={() => setSource(initialSource)}>
              Revert to file
            </button>
          </div>
        ) : null}

        <textarea
          value={source}
          onChange={(event) => setSource(event.target.value)}
          spellCheck={false}
          aria-label="MDX source"
        />
      </div>

      <div className="ed-output">
        {error ? <p className="ed-error">{error}</p> : null}
        <div className="ed-page">
          {header}
          <article className="prose">
            <RenderBoundary onError={setError}>{rendered}</RenderBoundary>
          </article>
        </div>
      </div>
    </main>
  );
}
