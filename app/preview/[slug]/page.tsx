import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { projects } from "@/lib/content";
import { Editor } from "../editor";

// Swap `work` -> `preview` in any story URL to edit that file's MDX live:
// /work/platform-gateway  ->  /preview/platform-gateway
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
  if (!projects.some((project) => project.slug === slug)) notFound();

  const relPath = join("content", "work", `${slug}.mdx`);
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
