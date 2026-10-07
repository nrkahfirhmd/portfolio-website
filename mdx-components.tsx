import type { MDXComponents } from "mdx/types";
import { StageHeader } from "@/app/games/stage-header";
import { ArticleHeader } from "@/app/software/story-components";
import { baseComponents } from "@/app/story/components";

// Required by @next/mdx: the components every .mdx renders with, shared with the preview editor so the two can't drift.
export function useMDXComponents(): MDXComponents {
  return { ...baseComponents, ArticleHeader, StageHeader };
}
