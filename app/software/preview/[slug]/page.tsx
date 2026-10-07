import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/content/site";
import { Editor } from "../../../story/editor";
import { ArticleHeader } from "../../story-components";
import "../../software.css";
import "../../../story/story.css";

// Live MDX editor for one file: /software/work/omawe -> /software/preview/omawe. Dev-only: the 404 is the security boundary (evaluating MDX runs code).
export default async function PreviewStoryPage({
  params,
}: PageProps<"/software/preview/[slug]">) {
  if (process.env.NODE_ENV === "production") notFound();

  const { slug } = await params;

  // Whitelist the slug before touching the filesystem: no path traversal.
  if (!PROJECTS.some((p) => p.slug === slug)) notFound();

  const relPath = join("content", "software", `${slug}.mdx`);
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
      header={<ArticleHeader slug={slug} />}
    />
  );
}
