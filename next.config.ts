import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    // Lets a game cover point straight at itch.io's image CDN.
    remotePatterns: [{ protocol: "https", hostname: "img.itch.zone" }],
  },
};

// No remark/rehype plugins: they can't cross into Turbopack; mdx-components.tsx styles instead.
export default createMDX({})(nextConfig);
