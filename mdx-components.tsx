import type { MDXComponents } from "mdx/types";
import { storyComponents } from "@/app/components/story-components";

// Required by @next/mdx (App Router). The one map every `.mdx` story renders
// through — imported directly by the /preview editor too, so preview and the
// real /work pages can't drift.
export function useMDXComponents(): MDXComponents {
  return storyComponents;
}
