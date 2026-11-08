"use client";

import { useMemo, useState } from "react";
import { LegislationCard, type LegislationCardData } from "./LegislationCard";
import { STATUSES } from "@/lib/types";

type Sort = "recent" | "oldest" | "title";

const selectClass =
  "h-12 w-full rounded-md border border-rule bg-card px-3 text-base font-medium text-ink";

export function LegislationBrowser({
  items,
  topics,
}: {
  items: LegislationCardData[];
  topics: { slug: string; name: string }[];
}) {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("");
  const [session, setSession] = useState("");
  const [status, setStatus] = useState("");
  const [level, setLevel] = useState("");
  const [within, setWithin] = useState("");
  const [sort, setSort] = useState<Sort>("recent");

  const sessions = useMemo(() => [...new Set(items.map((i) => i.session))].sort().reverse(), [items]);
  const levels = useMemo(() => [...new Set(items.map((i) => i.governmentLevel))].sort(), [items]);
  const statuses = useMemo(() => STATUSES.filter((s) => items.some((i) => i.status === s)), [items]);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const cutoff = within ? new Date(Date.now() - Number(within) * 86400000).toISOString().slice(0, 10) : "";
    const filtered = items.filter((i) => {
      if (topic && i.category !== topic && !i.tags.includes(topic)) return false;
      if (session && i.session !== session) return false;
      if (status && i.status !== status) return false;
      if (level && i.governmentLevel !== level) return false;
      if (cutoff && i.lastUpdated < cutoff) return false;
      if (terms.length) {
        const hay = [i.title, i.shortTitle, i.billNumber, i.summary, i.categoryName, i.tags.join(" ")].join(" ").toLowerCase();
        return terms.every((t) => hay.includes(t));
      }
      return true;
    });
    return filtered.sort((a, b) =>
      sort === "title"
        ? a.shortTitle.localeCompare(b.shortTitle)
        : sort === "oldest"
          ? a.lastUpdated.localeCompare(b.lastUpdated)
          : b.lastUpdated.localeCompare(a.lastUpdated),
    );
  }, [items, q, topic, session, status, level, within, sort]);

  const active = q || topic || session || status || level || within;
  const clear = () => {
    setQ(""); setTopic(""); setSession(""); setStatus(""); setLevel(""); setWithin("");
  };

  return (
    <div>
      <div className="rounded-lg border border-rule bg-card p-4 sm:p-5">
        <div>
          <label htmlFor="leg-q" className="mb-1 block text-sm font-semibold">
            Search by bill number, name, or keyword
          </label>
          <input
            id="leg-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="For example: SB 10, phones, prayer"
            className="h-12 w-full rounded-md border border-rule bg-paper px-4 text-base placeholder:text-soft"
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="f-topic" className="mb-1 block text-sm font-semibold">Topic</label>
            <select id="f-topic" className={selectClass} value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="">All topics</option>
              {topics.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="f-status" className="mb-1 block text-sm font-semibold">Status</label>
            <select id="f-status" className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Any status</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="f-session" className="mb-1 block text-sm font-semibold">Legislative session</label>
            <select id="f-session" className={selectClass} value={session} onChange={(e) => setSession(e.target.value)}>
              <option value="">All sessions</option>
              {sessions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="f-level" className="mb-1 block text-sm font-semibold">Government level</label>
            <select id="f-level" className={selectClass} value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">All levels</option>
              {levels.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="f-within" className="mb-1 block text-sm font-semibold">Updated</label>
            <select id="f-within" className={selectClass} value={within} onChange={(e) => setWithin(e.target.value)}>
              <option value="">Any time</option>
              <option value="30">In the last 30 days</option>
              <option value="90">In the last 90 days</option>
              <option value="365">In the last year</option>
            </select>
          </div>
          <div>
            <label htmlFor="f-sort" className="mb-1 block text-sm font-semibold">Sort by</label>
            <select id="f-sort" className={selectClass} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="recent">Most recently updated</option>
              <option value="oldest">Least recently updated</option>
              <option value="title">Name, A to Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p aria-live="polite" className="font-semibold">
          {results.length} {results.length === 1 ? "law" : "laws"} found
        </p>
        {active && (
          <button type="button" onClick={clear} className="btn btn-secondary min-h-[44px] px-4 py-1.5 text-base">
            Clear filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <ul className="mt-4 grid gap-5 md:grid-cols-2">
          {results.map((i) => (
            <li key={i.slug}>
              <LegislationCard item={i} headingLevel={2} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-ink/30 bg-card p-8 text-center">
          <p className="text-lg font-bold">No legislation matches those filters.</p>
          <p className="mt-1 text-soft">Try removing a filter or searching a different word.</p>
        </div>
      )}
    </div>
  );
}
