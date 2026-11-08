import type { Metadata } from "next";
import { siteConfig } from "./content";

/** Builds the title, description, canonical link and social-sharing tags for a page. */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      type,
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
