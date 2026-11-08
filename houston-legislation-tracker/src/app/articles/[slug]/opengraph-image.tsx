import { getAllArticles, getArticle } from "@/lib/content";
import { renderOg, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Article";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  return renderOg({ kicker: "Article", title: a?.title ?? "Article", footer: "Nonpartisan reporting" });
}
