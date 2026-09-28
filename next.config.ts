import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // .mdx alongside the usual extensions so `import "...story.mdx"` resolves.
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    // Game covers on /games are served from itch.io's image CDN rather than
    // copied into public/, so they stay in sync with the itch pages.
    remotePatterns: [{ protocol: "https", hostname: "img.itch.zone" }],
  },
};

// No remark/rehype plugins — the component map in mdx-components.tsx does the
// styling, and plugin functions can't cross into Turbopack anyway.
export default createMDX({})(nextConfig);
