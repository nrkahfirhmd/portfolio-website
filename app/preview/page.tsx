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
