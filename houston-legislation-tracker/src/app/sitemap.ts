import type { MetadataRoute } from "next";
import { getAllArticles, getAllLegislation, siteConfig } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const pages = ["", "/legislation", "/articles", "/topics", "/about"].map((p) => ({ url: `${base}${p}` }));
  const legislation = getAllLegislation().filter((l) => !l.demo).map((l) => ({
    url: `${base}/legislation/${l.slug}`,
    lastModified: l.lastUpdated,
  }));
  const articles = getAllArticles().filter((a) => !a.demo).map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: a.updatedDate ?? a.publishedDate,
  }));
  const topics = siteConfig.topics.map((t) => ({ url: `${base}/topics/${t.slug}` }));
  return [...pages, ...legislation, ...articles, ...topics];
}
