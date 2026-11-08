"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { SearchIcon } from "./icons";
import { formatDate } from "@/lib/format";

export interface SearchItemData {
  kind: "legislation" | "article" | "topic";
  title: string;
  url: string;
  description: string;
  meta: string[];
  haystack: string;
  date?: string;
}

const GROUPS: { kind: SearchItemData["kind"]; heading: string }[] = [
  { kind: "legislation", heading: "Legislation" },
  { kind: "article", heading: "Articles" },
  { kind: "topic", heading: "Topics" },
];

export function SearchClient({ index }: { index: SearchItemData[] }) {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    return index
      .filter((i) => terms.every((t) => i.haystack.includes(t)))
      .map((i) => ({ i, score: terms.reduce((n, t) => n + (i.title.toLowerCase().includes(t) ? 3 : 0), 0) }))
      .sort((a, b) => b.score - a.score || (b.i.date ?? "").localeCompare(a.i.date ?? ""))
      .map((r) => r.i);
  }, [q, index]);

  return (
    <div>
      <form role="search" aria-label="Search results" onSubmit={(e) => e.preventDefault()} className="relative">
        <label htmlFor="site-search" className="sr-only">Search legislation, articles, and topics</label>
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-soft" width={22} height={22} />
        <input
          id="site-search"
          type="search"
          autoFocus={!q}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try a bill number, a keyword, or a topic"
          className="h-14 w-full rounded-lg border border-ink/30 bg-card pl-12 pr-4 text-lg placeholder:text-soft"
        />
      </form>

      <p aria-live="polite" className="mt-4 font-semibold">
        {q.trim() === "" ? "Type to search." : `${results.length} ${results.length === 1 ? "result" : "results"} for “${q.trim()}”`}
      </p>

      {q.trim() !== "" && results.length === 0 && (
        <div className="mt-4 rounded-lg border border-dashed border-ink/30 bg-card p-8 text-center">
          <p className="text-lg font-bold">Nothing matched your search.</p>
          <p className="mt-1 text-soft">
            Check the spelling, or try a shorter word. You can also{" "}
            <Link href="/legislation" className="link">browse all legislation</Link>.
          </p>
        </div>
      )}

      <div className="mt-6 space-y-10">
        {GROUPS.map((g) => {
          const list = results.filter((r) => r.kind === g.kind);
          if (list.length === 0) return null;
          return (
            <section key={g.kind} aria-labelledby={`grp-${g.kind}`}>
              <h2 id={`grp-${g.kind}`} className="border-b-2 border-ink pb-2 text-lg font-extrabold">
                {g.heading} <span className="font-medium text-soft">({list.length})</span>
              </h2>
              <ul className="divide-y divide-rule">
                {list.map((r) => (
                  <li key={r.url} className="py-4">
                    <p className="flex flex-wrap gap-x-3 text-sm text-soft">
                      {r.meta.map((m) => <span key={m}>{m}</span>)}
                      {r.date && g.kind !== "topic" && <time dateTime={r.date}>{formatDate(r.date)}</time>}
                    </p>
                    <h3 className="mt-1 text-xl font-bold leading-snug">
                      <Link href={r.url} className="hover:text-brand hover:underline">{r.title}</Link>
                    </h3>
                    <p className="mt-1 max-w-prose text-soft">{r.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
