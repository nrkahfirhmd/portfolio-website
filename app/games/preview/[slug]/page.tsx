import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { Editor } from "../../../story/editor";
import { STAGES } from "@/content/site";
import { StageHeader } from "../../stage-header";
import "../../games.css";
import "../../../story/story.css";

// Live MDX editor for one file: /games/stage/body-count -> /games/preview/body-count. Dev-only: the 404 is the security boundary (evaluating MDX runs code).
export default async function PreviewStagePage({
  params,
}: PageProps<"/games/preview/[slug]">) {
  if (process.env.NODE_ENV === "production") notFound();

  const { slug } = await params;

  // Whitelist the slug before touching the filesystem: no path traversal.
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
