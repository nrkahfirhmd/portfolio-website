import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the VPS deploy; see DEPLOY.md.
  output: "standalone",
  // Old URLs from before software and games merged into /work.
  async redirects() {
    return [
      { source: "/software", destination: "/work", permanent: true },
      { source: "/games", destination: "/work", permanent: true },
      { source: "/software/work/:slug", destination: "/work/article/:slug", permanent: true },
      { source: "/games/stage/:slug", destination: "/work/article/:slug", permanent: true },
    ];
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    // Lets a game cover point straight at itch.io's image CDN.
    remotePatterns: [{ protocol: "https", hostname: "img.itch.zone" }],
  },
};

// No remark/rehype plugins: they can't cross into Turbopack; mdx-components.tsx styles instead.
export default createMDX({})(nextConfig);
