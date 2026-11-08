import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllLegislation, getLegislation, topicName, getTopic } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { toCard } from "@/lib/cards";
import { formatDate, pluralize } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { StatusBadge } from "@/components/StatusBadge";
import { Prose } from "@/components/Prose";
import { Timeline } from "@/components/Timeline";
import { SourceList } from "@/components/SourceList";
import { TrustBar, HowWeReport } from "@/components/TrustBar";
import { DemoBanner } from "@/components/DemoBadge";
import { LegislationCard } from "@/components/LegislationCard";
import { ExternalIcon } from "@/components/icons";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getAllLegislation().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const l = getLegislation(slug);
  if (!l) return {};
  return pageMetadata({
    title: `${l.shortTitle} (${l.billNumber})`,
    description: `${l.summary} Status: ${l.status}. Last updated ${formatDate(l.lastUpdated)}.`,
    path: `/legislation/${l.slug}`,
  });
}

const h2 = "text-[1.6rem] font-bold leading-tight";

export default async function LegislationPage({ params }: { params: Params }) {
  const { slug } = await params;
  const l = getLegislation(slug);
  if (!l) notFound();

  const { html, headings } = await renderMarkdown(l.bodyMarkdown);
  const latest = l.articles[0];
  const related = l.relatedLegislation.map((s) => getLegislation(s)).filter((x): x is NonNullable<typeof x> => Boolean(x));

  const toc = [
    ...headings,
    { id: "where-it-stands", text: "Where it stands" },
    { id: "updates", text: "All updates" },
    { id: "sources", text: "Sources" },
    ...(related.length ? [{ id: "related", text: "Related legislation" }] : []),
  ];

  return (
    <>
      {l.demo && <DemoBanner what="legislation page" />}

      <header className="border-b border-rule bg-card">
        <div className="wrap py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-soft">
            <ol className="flex flex-wrap gap-2">
              <li><Link href="/legislation" className="hover:underline">Legislation</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={`/topics/${l.category}`} className="hover:underline">{topicName(l.category)}</Link></li>
            </ol>
          </nav>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">{l.shortTitle}</h1>
          <p className="mt-3 max-w-3xl text-lg text-soft">{l.title}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="text-lg font-bold">{l.billNumber}</span>
            <span className="text-soft">{l.session}</span>
            <StatusBadge status={l.status} />
          </div>
          <div className="mt-5 border-t border-rule pt-4">
            <TrustBar lastUpdated={l.lastUpdated} sources={l.sources} />
          </div>
          {l.statusNote && (
            <p className="mt-5 max-w-3xl rounded-md border-l-4 border-brick bg-brick-tint px-4 py-3 text-base">
              <strong>Where things stand:</strong> {l.statusNote}
            </p>
          )}
        </div>
      </header>

      <div className="wrap grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 max-w-[44rem]">
          {/* Latest update */}
          <section aria-labelledby="latest-update" className="rounded-lg border border-brand/40 bg-brand-tint/60 p-5 sm:p-6">
            <h2 id="latest-update" className="text-lg font-bold">Latest update</h2>
            {latest ? (
              <>
                <p className="mt-1 text-sm font-semibold text-soft">
                  <time dateTime={latest.publishedDate}>{formatDate(latest.publishedDate)}</time>
                </p>
                <p className="mt-1 text-xl font-extrabold leading-snug">{latest.title}</p>
                <p className="mt-2 text-soft">{latest.summary}</p>
                <Link href={`/articles/${latest.slug}`} className="mt-3 inline-block font-semibold text-brand hover:underline">
                  Read the full update →
                </Link>
              </>
            ) : (
              <p className="mt-1 text-soft">No articles have been published about this legislation yet.</p>
            )}
          </section>

          <Prose html={html} className="mt-10" />

          {/* Timeline */}
          <section id="where-it-stands" aria-labelledby="where-h" className="mt-16">
            <h2 id="where-h" className={h2}>Where it stands</h2>
            <p className="mt-2 text-soft">Oldest event first. The latest event is marked.</p>
            <div className="mt-8">
              <Timeline events={l.timeline} />
            </div>
          </section>

          {/* All updates */}
          <section id="updates" aria-labelledby="updates-h" className="mt-16">
            <h2 id="updates-h" className={h2}>All updates</h2>
            <p className="mt-2 text-soft">
              {pluralize(l.articles.length, "article")} about this legislation, newest first.
            </p>
            {l.articles.length > 0 ? (
              <ol className="mt-6 divide-y divide-rule border-y border-rule">
                {l.articles.map((a) => (
                  <li key={a.slug} className="py-5">
                    <p className="flex flex-wrap items-center gap-3 text-sm text-soft">
                      <time dateTime={a.publishedDate} className="font-semibold text-ink">{formatDate(a.publishedDate)}</time>
                      <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${a.articleType === "update" ? "bg-brick-tint text-brick" : "bg-brand-tint text-brand-dark"}`}>
                        {a.articleType === "update" ? "Update" : a.articleType === "explainer" ? "Explainer" : a.articleType === "analysis" ? "Analysis" : "Article"}
                      </span>
                    </p>
                    <h3 className="mt-1 text-xl font-bold leading-snug">
                      <Link href={`/articles/${a.slug}`} className="hover:text-brand hover:underline">{a.title}</Link>
                    </h3>
                    <p className="mt-1 text-soft">{a.summary}</p>
                    <Link href={`/articles/${a.slug}`} className="mt-2 inline-block font-semibold text-brand hover:underline">Read Article →</Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-soft">No updates have been published yet.</p>
            )}
          </section>

          {/* Sources */}
          <section id="sources" aria-labelledby="sources-h" className="mt-16">
            <h2 id="sources-h" className={h2}>Sources</h2>
            <p className="mt-2 mb-6 text-soft">Primary sources are listed first.</p>
            <SourceList sources={l.sources} />
          </section>

          {related.length > 0 && (
            <section id="related" aria-labelledby="related-h" className="mt-16">
              <h2 id="related-h" className={h2}>Related legislation</h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug}><LegislationCard item={toCard(r)} /></li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-16"><HowWeReport /></div>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="About this legislation">
          <div className="rounded-lg border border-rule bg-card p-5">
            <h2 className="text-lg font-bold">At a glance</h2>
            <dl className="mt-3 space-y-3 text-base">
              <div><dt className="text-sm font-semibold text-soft">Government level</dt><dd>{l.governmentLevel}, {l.jurisdiction}</dd></div>
              <div><dt className="text-sm font-semibold text-soft">Topic</dt><dd><Link href={`/topics/${l.category}`} className="link">{getTopic(l.category)?.name}</Link></dd></div>
              {l.effectiveDate && <div><dt className="text-sm font-semibold text-soft">Took effect</dt><dd>{formatDate(l.effectiveDate)}</dd></div>}
              {l.sponsors.length > 0 && (
                <div>
                  <dt className="text-sm font-semibold text-soft">Sponsors</dt>
                  <dd><ul>{l.sponsors.map((s) => <li key={s}>{s}</li>)}</ul></dd>
                </div>
              )}
              {l.studentImpact && (
                <div><dt className="text-sm font-semibold text-soft">For students</dt><dd>{l.studentImpact}</dd></div>
              )}
            </dl>
            {l.officialSource && (
              <a
                href={l.officialSource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-5 w-full text-center"
              >
                <span>Read the official text</span> <ExternalIcon />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>

          <nav aria-label="On this page" className="mt-6 hidden rounded-lg border border-rule bg-card p-5 lg:block">
            <h2 className="text-lg font-bold">On this page</h2>
            <ul className="mt-2 space-y-1">
              {toc.map((t) => (
                <li key={t.id}><a href={`#${t.id}`} className="block py-1 text-base text-soft hover:text-brand hover:underline">{t.text}</a></li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}
