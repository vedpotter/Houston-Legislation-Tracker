import { formatDate } from "@/lib/format";
import type { TimelineEvent } from "@/lib/types";
import { ExternalIcon } from "./icons";

/**
 * The timeline is drawn like a transit line: each event is a stop,
 * and the newest stop is filled in and tagged "Latest".
 */
export function Timeline({ events, compact = false }: { events: TimelineEvent[]; compact?: boolean }) {
  if (events.length === 0) {
    return <p className="text-soft">No timeline events have been added yet.</p>;
  }
  const last = events.length - 1;
  return (
    <ol className="relative">
      {events.map((e, i) => {
        const isLatest = i === last;
        return (
          <li key={`${e.date}-${e.title}`} className={`relative pl-11 ${i === last ? "" : compact ? "pb-5" : "pb-8"}`}>
            {/* the line */}
            {i !== last && <span className="absolute left-[11px] top-7 -bottom-1 w-[3px] bg-brand/30" aria-hidden="true" />}
            {/* the stop */}
            <span
              className={`absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-[3px] ${
                isLatest ? "border-brick bg-brick" : "border-brand bg-card"
              }`}
              aria-hidden="true"
            >
              {isLatest && <span className="h-2 w-2 rounded-full bg-white" />}
            </span>
            <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-soft">
              <time dateTime={e.date}>{formatDate(e.date)}</time>
              {isLatest && (
                <span className="rounded-full bg-brick-tint px-2 py-0.5 text-xs font-bold text-brick">Latest</span>
              )}
            </p>
            <h3 className={`${compact ? "text-base" : "text-lg"} font-bold leading-snug`}>{e.title}</h3>
            {!compact && e.description && <p className="mt-1 max-w-prose text-base text-soft">{e.description}</p>}
            {!compact && e.source && (
              <a
                href={e.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand underline decoration-brand/30 hover:decoration-brand"
              >
                Source: {e.source.label ?? "Link"} <ExternalIcon />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </li>
        );
      })}
    </ol>
  );
}
