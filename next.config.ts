import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // .mdx alongside the usual extensions so `import "...story.mdx"` resolves.
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

// No remark/rehype plugins — the component map in mdx-components.tsx does the
// styling, and plugin functions can't cross into Turbopack anyway.
export default createMDX({})(nextConfig);
