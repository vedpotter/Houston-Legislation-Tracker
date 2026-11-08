import Link from "next/link";
import { formatDate } from "@/lib/format";
import { DemoBadge } from "./DemoBadge";
import type { ArticleMeta } from "@/lib/types";

const typeLabel: Record<ArticleMeta["articleType"], string> = {
  explainer: "Explainer",
  update: "Update",
  analysis: "Analysis",
  other: "Article",
};

export function ArticleRow({
  article,
  topicName,
  legislationTitle,
  lead = false,
  headingLevel = 3,
}: {
  article: ArticleMeta;
  topicName: string;
  legislationTitle?: string;
  lead?: boolean;
  headingLevel?: 2 | 3;
}) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="group relative py-6">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-soft">
        <time dateTime={article.publishedDate} className="font-semibold text-ink">
          {formatDate(article.publishedDate)}
        </time>
        <span
          className={`rounded px-1.5 py-0.5 text-xs font-bold ${
            article.articleType === "update" ? "bg-brick-tint text-brick" : "bg-brand-tint text-brand-dark"
          }`}
        >
          {typeLabel[article.articleType]}
        </span>
        <span>{topicName}</span>
        <span>{article.readingTime} min read</span>
        {article.demo && <DemoBadge />}
      </p>
      <H className={`mt-2 font-extrabold leading-tight ${lead ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"}`}>
        <Link
          href={`/articles/${article.slug}`}
          className="after:absolute after:inset-0 after:content-[''] group-hover:text-brand focus-visible:outline-offset-[-3px]"
        >
          {article.title}
        </Link>
      </H>
      <p className={`mt-2 max-w-prose text-soft ${lead ? "text-lg" : ""}`}>{article.summary}</p>
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="font-semibold text-brand group-hover:underline" aria-hidden="true">
          Read Article →
        </span>
        {legislationTitle && <span className="text-soft">Tracking: {legislationTitle}</span>}
      </p>
    </article>
  );
}
