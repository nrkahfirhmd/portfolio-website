import type { MDXComponents } from "mdx/types";
import { ArticleHeader } from "@/app/software/story-components";
import { baseComponents } from "@/app/story/components";

// Required by @next/mdx (App Router). The one map every `.mdx` story renders
// through — imported by the shared preview editor too, so preview and the
// real story pages can't drift. Shared blocks plus each section's header.
export function useMDXComponents(): MDXComponents {
  return { ...baseComponents, ArticleHeader };
}
