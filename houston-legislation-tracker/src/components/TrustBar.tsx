import { formatDate } from "@/lib/format";
import { CheckIcon } from "./icons";
import type { Source } from "@/lib/types";

/** Small credibility labels: freshness, number of sources, and whether primary sources are linked. */
export function TrustBar({ lastUpdated, sources, label = "Last updated" }: { lastUpdated?: string; sources: Source[]; label?: string }) {
  const real = sources.filter((s) => !s.placeholder);
  const hasPrimary = real.some((s) => s.type === "primary");
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink">
      {lastUpdated && (
        <li>
          {label}: <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
        </li>
      )}
      <li>Sources: {sources.length}</li>
      {hasPrimary && (
        <li className="inline-flex items-center gap-1.5 text-go">
          <CheckIcon /> Primary source available
        </li>
      )}
    </ul>
  );
}

export function HowWeReport() {
  return (
    <aside className="rounded-lg border border-rule bg-card p-5" aria-label="How we report">
      <h2 className="text-base font-bold">How we report</h2>
      <p className="mt-1 text-base text-soft">
        We separate three things: the text of a law, claims made by people who support or oppose it, and reporting about what has happened. We link to primary sources when we can and correct errors when we find them.
      </p>
    </aside>
  );
}
