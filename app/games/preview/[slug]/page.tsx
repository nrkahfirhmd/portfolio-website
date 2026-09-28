import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { Editor } from "../../../story/editor";
import { STAGES } from "../../games";
import { StageHeader } from "../../stage-header";
import "../../games.css";
import "../../../story/story.css";

// Swap `stage` -> `preview` in any devlog URL to edit that file's MDX live:
// /games/stage/body-count  ->  /games/preview/body-count
//
// Dev-only. The 404 below is the security boundary — runtime MDX evaluation
// runs arbitrary code, and `readFile` on a request-controlled path has no
// place in production.
export default async function PreviewStagePage({
  params,
}: PageProps<"/games/preview/[slug]">) {
  if (process.env.NODE_ENV === "production") notFound();

  const { slug } = await params;

  // Whitelist against known stages before touching the filesystem — this is
  // what stops `slug` being a path-traversal payload. A stage with no devlog
  // file yet also 404s, below; create content/games/<slug>.mdx first.
  if (!STAGES.some((s) => s.slug === slug)) notFound();

  const relPath = join("content", "games", `${slug}.mdx`);
  let source: string;
  try {
    source = await readFile(join(process.cwd(), relPath), "utf8");
  } catch {
    notFound();
  }

  return (
    <Editor
      initialSource={source}
      storageKey={`mdx-preview-draft:games:${slug}`}
      filePath={relPath}
      header={<StageHeader slug={slug} />}
    />
  );
}
