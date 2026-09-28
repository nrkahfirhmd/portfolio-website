import { notFound } from "next/navigation";
import { Editor } from "../../story/editor";
import "../games.css";
import "../../story/story.css";

const STARTER = `export const metadata = { title: "Draft" };

<StageHeader slug="body-count" />

The opening paragraph. Write the way the finished devlog should read — the
preview uses the same components and styles as /games/stage/[slug].

## The first heading

<Points>
  <Point title="One point">Short parallel copy.</Point>
  <Point title="Another">The column count follows the child count.</Point>
</Points>

<Figure caption="Screenshot goes here." />

<Callout>One line worth pulling out of the flow.</Callout>
`;

// Dev-only freeform scratchpad. Per-devlog editing lives at
// /games/preview/[slug]. The route file still ships in a production build,
// so the guarantee that arbitrary MDX is never evaluated on the live site is
// this request-time 404 — not the bundler.
export default function PreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Editor initialSource={STARTER} storageKey="mdx-preview-draft:games" />;
}
