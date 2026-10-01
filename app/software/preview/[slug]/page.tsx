import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { PROJECTS } from "../../projects";
import { Editor } from "../../../story/editor";
import { ArticleHeader } from "../../story-components";
import "../../software.css";
import "../../../story/story.css";

// Swap `work` -> `preview` in any story URL to edit that file's MDX live:
// /software/work/base-hackathon  ->  /software/preview/base-hackathon
//
// Dev-only. The 404 below is the security boundary — runtime MDX evaluation
// runs arbitrary code, and `readFile` on a request-controlled path has no
// place in production.
export default async function PreviewStoryPage({
  params,
}: PageProps<"/software/preview/[slug]">) {
  if (process.env.NODE_ENV === "production") notFound();

  const { slug } = await params;

  // Whitelist against known repos before touching the filesystem — this is
  // what stops `slug` being a path-traversal payload. A repo with no story
  // file yet also 404s, below; create content/software/<repo>.mdx first.
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
