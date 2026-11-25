import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { PROJECTS, STORY_SLUGS } from "@/content/site";
import { StageHeader } from "@/app/games/stage-header";
import { ArticleHeader } from "@/app/software/story-components";
import { Editor } from "@/app/story/editor";
import "@/app/games/games.css";
import "@/app/story/story.css";

// Live MDX editor for one file: /work/article/omawe -> /work/preview/omawe. Dev-only: the 404 is the security boundary (evaluating MDX runs code).
export default async function PreviewArticlePage({ params }: PageProps<"/work/preview/[slug]">) {
  if (process.env.NODE_ENV === "production") notFound();

  const { slug } = await params;

  // Whitelist the slug before touching the filesystem: no path traversal.
  const isProject = PROJECTS.some((p) => p.slug === slug);
  if (!isProject && !STORY_SLUGS.has(slug)) notFound();

  const relPath = join("content", isProject ? "software" : "games", `${slug}.mdx`);
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
      header={isProject ? <ArticleHeader slug={slug} /> : <StageHeader slug={slug} />}
    />
  );
}
