import type { MetadataRoute } from "next";
import { PROJECTS, SITE_URL, STORY_SLUGS } from "@/content/site";

const PAGES = ["/", "/work", "/about", "/journey", "/side-quests", "/story"];

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = [...PROJECTS.map((p) => p.slug), ...STORY_SLUGS].map((slug) => `/work/article/${slug}`);
  return [...PAGES, ...articles].map((path) => ({ url: `${SITE_URL}${path}` }));
}
