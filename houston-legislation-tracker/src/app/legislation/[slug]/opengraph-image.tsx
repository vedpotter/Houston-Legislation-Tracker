import { getAllLegislation, getLegislation } from "@/lib/content";
import { renderOg, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Legislation tracker page";

export function generateStaticParams() {
  return getAllLegislation().map((l) => ({ slug: l.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = getLegislation(slug);
  return renderOg({
    kicker: l ? `${l.billNumber}  |  ${l.status}` : "Legislation",
    title: l?.shortTitle ?? "Legislation",
    footer: "Legislation tracker",
  });
}
