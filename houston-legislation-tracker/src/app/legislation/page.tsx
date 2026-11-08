import { getAllLegislation, siteConfig } from "@/lib/content";
import { toCard } from "@/lib/cards";
import { LegislationBrowser } from "@/components/LegislationBrowser";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Legislation",
  description: "Browse every law and bill tracked by Houston Legislation Tracker. Filter by topic, status, session, and government level.",
  path: "/legislation",
});

export default function LegislationIndex() {
  const items = getAllLegislation().map(toCard);
  return (
    <div className="wrap py-12 sm:py-16">
      <h1 className="text-4xl font-extrabold sm:text-5xl">Legislation</h1>
      <p className="mt-3 max-w-prose text-lg text-soft">
        Every law and bill we track, with its current status and the date we last updated it. Open one to see its timeline, sources, and every article we have published about it.
      </p>
      <div className="mt-10">
        <LegislationBrowser items={items} topics={siteConfig.topics.map((t) => ({ slug: t.slug, name: t.name }))} />
      </div>
    </div>
  );
}
