import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllArticles, getArticle, getLegislation, siteConfig, topicName } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { Prose } from "@/components/Prose";
import { SourceList } from "@/components/SourceList";
import { StatusBadge } from "@/components/StatusBadge";
import { HowWeReport } from "@/components/TrustBar";
import { DemoBanner } from "@/components/DemoBadge";
import { SocialLinks } from "@/components/SocialLinks";
import { ArticleRow } from "@/components/ArticleRow";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return pageMetadata({
    title: a.title,
    description: a.summary,
    path: `/articles/${a.slug}`,
    type: "article",
    publishedTime: a.publishedDate,
    modifiedTime: a.updatedDate ?? a.publishedDate,
  });
}

const h2 = "text-[1.6rem] font-bold leading-tight";

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { html } = await renderMarkdown(article.bodyMarkdown);
  const { bodyMarkdown: _b, ...a } = article;
  void _b;

  const legs = a.legislation.map((s) => getLegislation(s)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const mainLeg = legs[0];
  const siblings = mainLeg ? mainLeg.articles.filter((x) => x.slug !== a.slug) : [];
  const previous = siblings.filter((x) => x.publishedDate <= a.publishedDate && x.slug !== a.slug);
  const newer = siblings.filter((x) => x.publishedDate > a.publishedDate);
  const shown = new Set(siblings.map((x) => x.slug));
  const related = getAllArticles().filter((x) => x.slug !== a.slug && !shown.has(x.slug) && x.category === a.category).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.summary,
    datePublished: a.publishedDate,
    dateModified: a.updatedDate ?? a.publishedDate,
    author: { "@type": "Organization", name: a.author },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/articles/${a.slug}`,
  };

  return (
    <>
      {a.demo && <DemoBanner what="article" />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        <header className="border-b border-rule bg-card">
          <div className="wrap max-w-3xl py-10 sm:py-14 lg:mx-auto">
            <nav aria-label="Breadcrumb" className="text-sm text-soft">
              <ol className="flex flex-wrap gap-2">
                <li><Link href="/articles" className="hover:underline">Articles</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href={`/topics/${a.category}`} className="hover:underline">{topicName(a.category)}</Link></li>
              </ol>
            </nav>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.06] sm:text-5xl">{a.title}</h1>
            {a.subtitle && <p className="mt-4 font-serif text-xl leading-snug text-soft sm:text-[1.4rem]">{a.subtitle}</p>}
            <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
              <span>By {a.author}</span>
              <span>
                Published <time dateTime={a.publishedDate}>{formatDate(a.publishedDate)}</time>
              </span>
              {a.updatedDate && (
                <span>
                  Updated <time dateTime={a.updatedDate}>{formatDate(a.updatedDate)}</time>
                </span>
              )}
              <span>{a.readingTime} min read</span>
              <span>Sources: {a.sources.length}</span>
            </p>
          </div>
        </header>

        <div className="wrap max-w-3xl py-10 lg:mx-auto">
          {mainLeg && (
            <div className="mb-10 rounded-lg border border-brand/40 bg-brand-tint/60 p-4 sm:p-5">
              <p className="text-sm font-semibold text-soft">This article is part of the tracker for</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
                <Link href={`/legislation/${mainLeg.slug}`} className="text-lg font-extrabold hover:text-brand hover:underline">
                  {mainLeg.shortTitle} ({mainLeg.billNumber})
                </Link>
                <StatusBadge status={mainLeg.status} />
              </p>
              <p className="mt-2 text-sm text-soft">
                Last updated <time dateTime={mainLeg.lastUpdated}>{formatDate(mainLeg.lastUpdated)}</time>.{" "}
                <Link href={`/legislation/${mainLeg.slug}`} className="link">View the full tracker →</Link>
              </p>
            </div>
          )}

          {a.heroImage && (
            <figure className="mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.heroImage} alt={a.heroImageAlt ?? ""} className="h-auto w-full rounded-lg" />
              {a.heroImageCredit && <figcaption className="mt-2 text-sm text-soft">{a.heroImageCredit}</figcaption>}
            </figure>
          )}

          <Prose html={html} className="max-w-prose" />

          <section aria-labelledby="sources-h" className="mt-16">
            <h2 id="sources-h" className={h2}>Sources</h2>
            <p className="mb-6 mt-2 text-soft">Primary sources are listed first.</p>
            <SourceList sources={a.sources} />
          </section>

          {legs.length > 0 && (
            <section aria-labelledby="rel-leg-h" className="mt-16">
              <h2 id="rel-leg-h" className={h2}>Related legislation</h2>
              <ul className="mt-5 space-y-3">
                {legs.map((l) => (
                  <li key={l.slug} className="rounded-lg border border-rule bg-card p-4">
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <Link href={`/legislation/${l.slug}`} className="text-lg font-bold hover:text-brand hover:underline">
                        {l.shortTitle}
                      </Link>
                      <span className="text-soft">{l.billNumber}</span>
                      <StatusBadge status={l.status} />
                    </p>
                    <p className="mt-2 text-soft">{l.summary}</p>
                    <Link href={`/legislation/${l.slug}`} className="mt-2 inline-block font-semibold text-brand hover:underline">View Tracker →</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {previous.length > 0 && (
            <section aria-labelledby="prev-h" className="mt-16">
              <h2 id="prev-h" className={h2}>Previous updates</h2>
              <ul className="mt-2 divide-y divide-rule">
                {previous.map((p) => (
                  <li key={p.slug}><ArticleRow article={p} topicName={topicName(p.category)} /></li>
                ))}
              </ul>
            </section>
          )}

          {newer.length > 0 && (
            <section aria-labelledby="newer-h" className="mt-16">
              <h2 id="newer-h" className={h2}>Newer updates</h2>
              <ul className="mt-2 divide-y divide-rule">
                {newer.map((p) => (
                  <li key={p.slug}><ArticleRow article={p} topicName={topicName(p.category)} /></li>
                ))}
              </ul>
            </section>
          )}

          {related.length > 0 && (
            <section aria-labelledby="more-h" className="mt-16">
              <h2 id="more-h" className={h2}>More from this topic</h2>
              <ul className="mt-2 divide-y divide-rule">
                {related.map((p) => (
                  <li key={p.slug}><ArticleRow article={p} topicName={topicName(p.category)} /></li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-16 space-y-6">
            <HowWeReport />
            <div className="rounded-lg bg-brand-tint p-5">
              <h2 className="text-lg font-bold">Follow the Tracker</h2>
              <p className="mt-1 text-soft">Short explainers and updates on social media.</p>
              <div className="mt-3"><SocialLinks /></div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
