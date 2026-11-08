import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { articlesInTopic, getLegislation, getTopic, legislationInTopic, siteConfig, topicName } from "@/lib/content";
import { toCard } from "@/lib/cards";
import { LegislationCard } from "@/components/LegislationCard";
import { ArticleRow } from "@/components/ArticleRow";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return siteConfig.topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTopic(slug);
  if (!t) return {};
  return pageMetadata({ title: `${t.name} legislation`, description: t.description, path: `/topics/${t.slug}` });
}

export default async function TopicPage({ params }: { params: Params }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const legislation = legislationInTopic(slug);
  const articles = articlesInTopic(slug);
  const recent = articles.slice(0, 3);

  return (
    <div className="wrap py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-soft">
        <Link href="/topics" className="hover:underline">Topics</Link> <span aria-hidden="true">/</span> {topic.name}
      </nav>
      <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{topic.name}</h1>
      <p className="mt-3 max-w-prose text-lg text-soft">{topic.description}</p>

      {legislation.length === 0 && articles.length === 0 ? (
        <div className="mt-10 max-w-xl rounded-lg border border-dashed border-ink/30 bg-card p-8">
          <p className="text-lg font-bold">We are not tracking legislation on this topic yet.</p>
          <p className="mt-1 text-soft">Check back soon, or browse the topics that already have content.</p>
          <Link href="/topics" className="btn btn-secondary mt-5">All topics</Link>
        </div>
      ) : (
        <>
          {recent.length > 0 && (
            <section className="mt-12" aria-labelledby="recent-h">
              <h2 id="recent-h" className="text-2xl font-extrabold">Most recent updates</h2>
              <ul className="mt-3 max-w-4xl divide-y divide-rule border-t-2 border-ink">
                {recent.map((a) => (
                  <li key={a.slug}>
                    <ArticleRow article={a} topicName={topicName(a.category)} legislationTitle={a.legislation[0] ? getLegislation(a.legislation[0])?.shortTitle : undefined} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-14" aria-labelledby="leg-h">
            <h2 id="leg-h" className="text-2xl font-extrabold">Legislation on this topic</h2>
            <ul className="mt-6 grid gap-5 md:grid-cols-2">
              {legislation.map((l) => (
                <li key={l.slug}><LegislationCard item={toCard(l)} /></li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
