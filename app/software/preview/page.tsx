import { notFound } from "next/navigation";
import { Editor } from "../../story/editor";
import "../software.css";
import "../../story/story.css";

const STARTER = `export const metadata = { title: "Draft" };

<ArticleHeader slug="omawe" />

The opening paragraph. Write the way the finished story should read — the
preview uses the same components and styles as /software/work/[slug].

## The first heading

> A pull quote renders in the flourish serif.

<Points>
  <Point title="One point">Short parallel copy.</Point>
  <Point title="Another">The column count follows the child count.</Point>
</Points>

<Figure caption="Diagram goes here." />

<Callout>One line worth pulling out of the flow.</Callout>
`;

// Dev-only freeform MDX scratchpad; the route still ships, so this 404 keeps MDX evaluation off production.
export default function PreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Editor initialSource={STARTER} storageKey="mdx-preview-draft" />;
}
