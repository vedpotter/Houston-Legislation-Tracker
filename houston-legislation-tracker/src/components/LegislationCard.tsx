import Link from "next/link";
import { StatusBadge, statusStripe } from "./StatusBadge";
import { DemoBadge } from "./DemoBadge";
import { formatDate } from "@/lib/format";
import type { Status } from "@/lib/types";

export interface LegislationCardData {
  slug: string;
  shortTitle: string;
  title: string;
  billNumber: string;
  session: string;
  category: string;
  categoryName: string;
  governmentLevel: string;
  status: Status;
  summary: string;
  lastUpdated: string;
  tags: string[];
  demo: boolean;
}

export function LegislationCard({ item, headingLevel = 3 }: { item: LegislationCardData; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-rule bg-card">
      <span className={`absolute inset-y-0 left-0 w-1.5 ${statusStripe[item.status]}`} aria-hidden="true" />
      <div className="flex flex-1 flex-col gap-3 py-5 pl-7 pr-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-soft">
          <span className="font-semibold text-ink">{item.billNumber}</span>
          <span>{item.categoryName}</span>
          {item.demo && <DemoBadge />}
        </div>
        <H className="text-xl font-bold leading-snug">
          <Link
            href={`/legislation/${item.slug}`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-brand focus-visible:outline-offset-[-3px]"
          >
            {item.shortTitle}
          </Link>
        </H>
        <div>
          <StatusBadge status={item.status} />
        </div>
        <p className="text-base text-soft">{item.summary}</p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-2">
          <p className="text-sm text-soft">
            <span className="block">{item.session}</span>
            <span className="block">
              Last updated <time dateTime={item.lastUpdated}>{formatDate(item.lastUpdated)}</time>
            </span>
          </p>
          <span className="whitespace-nowrap font-semibold text-brand group-hover:underline" aria-hidden="true">
            Read Tracker →
          </span>
        </div>
      </div>
    </article>
  );
}
