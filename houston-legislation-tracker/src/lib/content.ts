import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import site from "../../content/site.json";
import {
  STATUSES,
  type Article,
  type ArticleMeta,
  type Legislation,
  type SiteConfig,
  type Source,
  type Status,
  type TimelineEvent,
  type Topic,
} from "./types";

/**
 * This file is the "database". It reads the Markdown files in /content
 * when the site is built and turns them into data the pages can use.
 * If a file is filled in wrong, the build stops with a plain-English error
 * that names the file and the field, so bad content never goes live.
 */

export const siteConfig = site as SiteConfig;
const CONTENT_DIR = path.join(process.cwd(), "content");

// ---------- helpers ----------

function fail(file: string, message: string): never {
  throw new Error(`\n\nCONTENT ERROR in ${file}\n  ${message}\n`);
}

/** YAML turns 2026-09-20 into a Date. We want it back as text. */
function dateText(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

function requireString(data: Record<string, unknown>, key: string, file: string): string {
  const v = data[key];
  if (typeof v !== "string" || !v.trim()) fail(file, `Missing required field "${key}".`);
  return v.trim();
}

function asArray<T = string>(v: unknown): T[] {
  if (v === undefined || v === null || v === "") return [];
  return (Array.isArray(v) ? v : [v]) as T[];
}

function parseSources(raw: unknown, file: string): Source[] {
  return asArray<Record<string, unknown>>(raw).map((s, i) => {
    if (!s || typeof s.title !== "string" || typeof s.url !== "string") {
      fail(file, `Source #${i + 1} needs both a "title" and a "url".`);
    }
    const type = (s.type as string) ?? "reporting";
    if (!["primary", "reporting", "party"].includes(type)) {
      fail(file, `Source "${s.title}" has type "${type}". Use primary, reporting, or party.`);
    }
    return {
      title: s.title as string,
      url: s.url as string,
      publisher: s.publisher as string | undefined,
      type: type as Source["type"],
      placeholder: Boolean(s.placeholder),
    };
  });
}

function parseTimeline(raw: unknown, file: string): TimelineEvent[] {
  const events = asArray<Record<string, unknown>>(raw).map((e, i) => {
    const date = dateText(e.date);
    if (!date || typeof e.title !== "string") fail(file, `Timeline event #${i + 1} needs a "date" and a "title".`);
    const src = e.source as { label?: string; url?: string } | undefined;
    return {
      date,
      title: e.title as string,
      description: typeof e.description === "string" ? e.description.trim() : "",
      type: ((e.type as string) ?? "other") as TimelineEvent["type"],
      source: src && src.url ? { label: src.label, url: src.url } : undefined,
    } as TimelineEvent;
  });
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

function readDir(sub: string): { slug: string; file: string; data: Record<string, unknown>; content: string }[] {
  const dir = path.join(CONTENT_DIR, sub);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const parsed = matter(raw);
      return { slug: f.replace(/\.md$/, ""), file: `content/${sub}/${f}`, data: parsed.data, content: parsed.content };
    });
}

const topicSlugs = new Set(siteConfig.topics.map((t) => t.slug));

function checkTopic(slug: string, file: string) {
  if (!topicSlugs.has(slug)) {
    fail(file, `category "${slug}" is not a known topic. Valid topics: ${[...topicSlugs].join(", ")}. (Topics are defined in content/site.json.)`);
  }
}

// ---------- loading (cached for the build) ----------

let cache: { legislation: Legislation[]; articles: Article[] } | null = null;

function load() {
  if (cache) return cache;

  // Articles
  const articles: Article[] = readDir("articles").map(({ slug, file, data, content }) => {
    const category = requireString(data, "category", file);
    checkTopic(category, file);
    const words = content.trim().split(/\s+/).length;
    const type = (data.articleType as string) ?? "explainer";
    return {
      slug,
      title: requireString(data, "title", file),
      subtitle: typeof data.subtitle === "string" ? data.subtitle : undefined,
      summary: requireString(data, "summary", file),
      author: typeof data.author === "string" ? data.author : siteConfig.name,
      publishedDate: dateText(data.publishedDate) ?? fail(file, `Missing required field "publishedDate".`),
      updatedDate: dateText(data.updatedDate),
      category,
      tags: asArray(data.tags),
      legislation: asArray(data.legislation),
      articleType: (["explainer", "update", "analysis"].includes(type) ? type : "other") as Article["articleType"],
      readingTime: typeof data.readingTime === "number" ? data.readingTime : Math.max(1, Math.round(words / 220)),
      heroImage: typeof data.heroImage === "string" ? data.heroImage : undefined,
      heroImageAlt: typeof data.heroImageAlt === "string" ? data.heroImageAlt : undefined,
      heroImageCredit: typeof data.heroImageCredit === "string" ? data.heroImageCredit : undefined,
      sources: parseSources(data.sources, file),
      demo: Boolean(data.demo),
      featured: Boolean(data.featured),
      bodyMarkdown: content,
    };
  });

  // Legislation
  const legislation: Legislation[] = readDir("legislation").map(({ slug, file, data, content }) => {
    const category = requireString(data, "category", file);
    checkTopic(category, file);
    const status = requireString(data, "status", file) as Status;
    if (!STATUSES.includes(status)) fail(file, `status "${status}" is not allowed. Use one of: ${STATUSES.join(", ")}.`);
    const official = data.officialSource as { label?: string; url?: string } | undefined;
    return {
      slug,
      title: requireString(data, "title", file),
      shortTitle: requireString(data, "shortTitle", file),
      billNumber: requireString(data, "billNumber", file),
      session: requireString(data, "session", file),
      governmentLevel: requireString(data, "governmentLevel", file),
      jurisdiction: requireString(data, "jurisdiction", file),
      category,
      status,
      statusNote: typeof data.statusNote === "string" ? data.statusNote : undefined,
      introductionDate: dateText(data.introductionDate),
      effectiveDate: dateText(data.effectiveDate),
      lastUpdated: dateText(data.lastUpdated) ?? "",
      summary: requireString(data, "summary", file),
      studentImpact: typeof data.studentImpact === "string" ? data.studentImpact : undefined,
      officialSource: official && official.url ? { label: official.label ?? "Official source", url: official.url } : undefined,
      sponsors: asArray(data.sponsors),
      timeline: parseTimeline(data.timeline, file),
      sources: parseSources(data.sources, file),
      tags: asArray(data.tags),
      relatedLegislation: asArray(data.relatedLegislation),
      demo: Boolean(data.demo),
      featured: Boolean(data.featured),
      bodyMarkdown: content,
      articles: [],
    };
  });

  const legSlugs = new Set(legislation.map((l) => l.slug));

  // Connect articles to legislation, and check every link points somewhere real.
  for (const a of articles) {
    for (const s of a.legislation) {
      if (!legSlugs.has(s)) {
        fail(`content/articles/${a.slug}.md`, `"legislation: ${s}" does not match any file in content/legislation. The name must match the file name (without .md).`);
      }
    }
  }
  for (const l of legislation) {
    for (const s of l.relatedLegislation) {
      if (!legSlugs.has(s)) fail(`content/legislation/${l.slug}.md`, `relatedLegislation "${s}" does not match any file in content/legislation.`);
    }
    l.articles = articles
      .filter((a) => a.legislation.includes(l.slug))
      .sort(byNewest)
      .map(stripBody);
    // "Last updated" = the newest of: the date you typed, or any linked article date.
    const dates = [l.lastUpdated, ...l.articles.map((a) => a.updatedDate ?? a.publishedDate)].filter(Boolean);
    l.lastUpdated = dates.sort().reverse()[0] ?? "";
  }

  cache = { legislation, articles };
  return cache;
}

function stripBody(a: Article): ArticleMeta {
  const { bodyMarkdown: _omit, ...meta } = a;
  void _omit;
  return meta;
}

const articleDate = (a: { publishedDate: string; updatedDate?: string }) => a.publishedDate;
function byNewest(a: ArticleMeta, b: ArticleMeta) {
  return articleDate(b).localeCompare(articleDate(a)) || Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title);
}

// ---------- public API ----------

export function getAllLegislation(): Legislation[] {
  return [...load().legislation].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated) || a.title.localeCompare(b.title));
}

/** Featured items first, then real content before demo content, then newest. */
export function getFeaturedLegislation(limit = 4): Legislation[] {
  return [...getAllLegislation()]
    .sort((a, b) => Number(b.featured) - Number(a.featured) || Number(a.demo) - Number(b.demo) || b.lastUpdated.localeCompare(a.lastUpdated))
    .slice(0, limit);
}

export function getLegislation(slug: string): Legislation | undefined {
  return load().legislation.find((l) => l.slug === slug);
}

export function getAllArticles(): ArticleMeta[] {
  return load().articles.map(stripBody).sort(byNewest);
}

export function getArticle(slug: string): Article | undefined {
  return load().articles.find((a) => a.slug === slug);
}

export function getLegislationTitle(slug: string): string {
  return getLegislation(slug)?.shortTitle ?? slug;
}

export function getTopic(slug: string): Topic | undefined {
  return siteConfig.topics.find((t) => t.slug === slug);
}

export function topicName(slug: string): string {
  return getTopic(slug)?.name ?? slug;
}

/** Legislation is in a topic if its category is that topic OR it carries that topic as a tag. */
export function legislationInTopic(slug: string): Legislation[] {
  return getAllLegislation().filter((l) => l.category === slug || l.tags.includes(slug));
}

export function articlesInTopic(slug: string): ArticleMeta[] {
  const legSlugs = new Set(legislationInTopic(slug).map((l) => l.slug));
  return getAllArticles().filter(
    (a) => a.category === slug || a.tags.includes(slug) || a.legislation.some((s) => legSlugs.has(s)),
  );
}

export function topicCounts(): { topic: Topic; legislation: number; articles: number }[] {
  return siteConfig.topics.map((topic) => ({
    topic,
    legislation: legislationInTopic(topic.slug).length,
    articles: articlesInTopic(topic.slug).length,
  }));
}

/** Newest update per piece of legislation, for the homepage "Latest updates". */
export function getLatestUpdates(limit = 4): { article: ArticleMeta; legislation?: Legislation }[] {
  return getAllArticles()
    .slice(0, limit)
    .map((article) => ({ article, legislation: article.legislation[0] ? getLegislation(article.legislation[0]) : undefined }));
}

export interface SearchItem {
  kind: "legislation" | "article" | "topic";
  title: string;
  url: string;
  description: string;
  meta: string[];
  haystack: string; // lowercased text we search inside
  date?: string;
}

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const l of getAllLegislation()) {
    items.push({
      kind: "legislation",
      title: l.shortTitle,
      url: `/legislation/${l.slug}`,
      description: l.summary,
      meta: [l.billNumber, topicName(l.category)],
      haystack: [l.title, l.shortTitle, l.billNumber, l.summary, topicName(l.category), l.status, l.tags.join(" "), l.sponsors.join(" ")].join(" ").toLowerCase(),
      date: l.lastUpdated,
    });
  }
  for (const a of getAllArticles()) {
    items.push({
      kind: "article",
      title: a.title,
      url: `/articles/${a.slug}`,
      description: a.summary,
      meta: [topicName(a.category)],
      haystack: [a.title, a.subtitle ?? "", a.summary, topicName(a.category), a.tags.join(" ")].join(" ").toLowerCase(),
      date: a.publishedDate,
    });
  }
  for (const t of siteConfig.topics) {
    items.push({
      kind: "topic",
      title: t.name,
      url: `/topics/${t.slug}`,
      description: t.description,
      meta: ["Topic"],
      haystack: `${t.name} ${t.description}`.toLowerCase(),
    });
  }
  return items;
}
