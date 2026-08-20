import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Story pages are authored as .mdx files under app/work/.
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

// No remark/rehype plugins: under Turbopack those have to be named as strings
// because functions cannot cross into Rust. Add them here as strings if needed.
export default createMDX({})(nextConfig);
