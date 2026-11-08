import Link from "next/link";
import {
  getFeaturedLegislation,
  getLatestUpdates,
  siteConfig,
  topicCounts,
  topicName,
} from "@/lib/content";
import { toCard } from "@/lib/cards";
import { LegislationCard } from "@/components/LegislationCard";
import { ArticleRow } from "@/components/ArticleRow";
import { StatusBadge } from "@/components/StatusBadge";
import { Timeline } from "@/components/Timeline";
import { SocialLinks } from "@/components/SocialLinks";
import { formatDate, pluralize } from "@/lib/format";

export default function HomePage() {
  const featured = getFeaturedLegislation(4);
  const spotlight = featured.find((l) => !l.demo) ?? featured[0];
  const updates = getLatestUpdates(4);
  const topics = topicCounts();

  return (
    <>
      {/* Hero */}
      <section className="grid-motif border-b border-rule">
        <div className="wrap grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="text-[2.75rem] font-extrabold leading-[1] tracking-tight sm:text-6xl lg:text-7xl">
              Houston Legislation Tracker
            </h1>
            <p className="mt-6 text-2xl font-bold text-brand-dark">{siteConfig.tagline}</p>
            <p className="mt-4 max-w-xl text-lg text-soft">{siteConfig.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/legislation" className="btn btn-primary">Explore Legislation</Link>
              <Link href="/articles" className="btn btn-secondary">Read the Latest</Link>
              <Link href="/about" className="link px-2 py-3">About the Project</Link>
            </div>
          </div>

          {spotlight && (
            <aside aria-labelledby="now-tracking" className="rounded-xl border border-rule bg-card p-6 shadow-[0_1px_0_rgba(15,27,45,0.06)] sm:p-7">
              <h2 id="now-tracking" className="text-base font-bold text-soft">Now tracking</h2>
              <p className="mt-2 text-2xl font-extrabold leading-tight">{spotlight.shortTitle}</p>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-soft">
                <span className="font-semibold text-ink">{spotlight.billNumber}</span>
                <StatusBadge status={spotlight.status} />
              </p>
              <div className="mt-6">
                <Timeline events={spotlight.timeline.slice(-4)} compact />
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
                <p className="text-sm text-soft">
                  Last updated <time dateTime={spotlight.lastUpdated}>{formatDate(spotlight.lastUpdated)}</time>
                </p>
                <Link href={`/legislation/${spotlight.slug}`} className="font-semibold text-brand hover:underline">
                  Read Tracker →
                </Link>
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* Featured legislation */}
      <section className="wrap pt-20" aria-labelledby="featured-h">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="featured-h" className="text-3xl font-extrabold sm:text-4xl">Featured legislation</h2>
          <Link href="/legislation" className="link">View all legislation →</Link>
        </div>
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {featured.map((l) => (
            <li key={l.slug}>
              <LegislationCard item={toCard(l)} />
            </li>
          ))}
        </ul>
      </section>

      {/* Latest updates */}
      <section className="wrap pt-20" aria-labelledby="latest-h">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="latest-h" className="text-3xl font-extrabold sm:text-4xl">Latest updates</h2>
          <Link href="/articles" className="link">All articles →</Link>
        </div>
        {updates.length > 0 ? (
          <div className="mt-6 grid gap-x-12 lg:grid-cols-[1.15fr_1fr]">
            <div className="border-t-2 border-ink">
              <ArticleRow
                lead
                article={updates[0].article}
                topicName={topicName(updates[0].article.category)}
                legislationTitle={updates[0].legislation?.shortTitle}
              />
            </div>
            <ul className="divide-y divide-rule border-t-2 border-ink">
              {updates.slice(1).map(({ article, legislation }) => (
                <li key={article.slug}>
                  <ArticleRow article={article} topicName={topicName(article.category)} legislationTitle={legislation?.shortTitle} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-6 text-soft">No articles have been published yet.</p>
        )}
      </section>

      {/* Topics */}
      <section className="wrap pt-20" aria-labelledby="topics-h">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="topics-h" className="text-3xl font-extrabold sm:text-4xl">Browse by topic</h2>
          <Link href="/topics" className="link">All topics →</Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {topics.map(({ topic, legislation, articles }) => {
            const empty = legislation === 0 && articles === 0;
            return (
              <li key={topic.slug}>
                <Link
                  href={`/topics/${topic.slug}`}
                  className={`flex h-full min-h-[92px] flex-col justify-between rounded-lg border bg-card p-4 hover:border-brand ${
                    empty ? "border-dashed border-ink/25" : "border-rule"
                  }`}
                >
                  <span className="text-lg font-bold leading-tight">{topic.name}</span>
                  <span className="mt-2 text-sm text-soft">
                    {empty ? "Coming soon" : `${pluralize(legislation, "law")}, ${pluralize(articles, "article")}`}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Why this exists */}
      <section className="wrap pt-20" aria-labelledby="why-h">
        <div className="grid gap-10 rounded-xl border border-rule bg-card p-7 sm:p-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 id="why-h" className="text-3xl font-extrabold sm:text-4xl">Why this exists</h2>
            <p className="mt-4 max-w-prose text-lg text-soft">
              Legislation is hard to follow. Bills change as they move. Laws take effect at different times. Courts and school boards shape what a law means in practice, sometimes months later. News coverage tends to catch one moment and move on.
            </p>
            <p className="mt-4 max-w-prose text-lg text-soft">
              {siteConfig.name} follows each law over time, so you can see what it says, what people argue about, and what has actually happened.
            </p>
          </div>
          <dl className="space-y-5 self-center">
            {[
              ["What the law says", "We summarize the text and link to the official source."],
              ["What people say", "Supporters and opponents are named and quoted as claims, not as facts."],
              ["What has happened", "Every update is dated, sourced, and added to the law's timeline."],
            ].map(([t, d]) => (
              <div key={t} className="border-l-4 border-brand pl-4">
                <dt className="text-lg font-bold">{t}</dt>
                <dd className="text-soft">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Social */}
      <section className="wrap pt-20" aria-labelledby="follow-h">
        <div className="rounded-xl bg-brand-tint p-7 sm:p-10">
          <h2 id="follow-h" className="text-3xl font-extrabold sm:text-4xl">Follow the Tracker</h2>
          <p className="mt-3 max-w-prose text-lg text-ink/80">Short explainers. Legislative updates. Houston politics and policy.</p>
          <div className="mt-6">
            <SocialLinks variant="buttons" />
          </div>
        </div>
      </section>
    </>
  );
}
