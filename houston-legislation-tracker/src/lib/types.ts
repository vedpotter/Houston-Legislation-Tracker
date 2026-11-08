export const STATUSES = [
  "Introduced",
  "In Committee",
  "Passed Legislature",
  "Signed",
  "Vetoed",
  "In Effect",
  "Challenged in Court",
  "Blocked",
  "Expired",
  "Repealed",
  "Other",
] as const;
export type Status = (typeof STATUSES)[number];

export const GOV_LEVELS = ["Federal", "State", "County", "City", "School District"] as const;

export type SourceType = "primary" | "reporting" | "party";

export interface Source {
  title: string;
  url: string;
  publisher?: string;
  type: SourceType;
  placeholder?: boolean;
}

export type TimelineType =
  | "introduced"
  | "committee"
  | "passed"
  | "signed"
  | "effective"
  | "court"
  | "implementation"
  | "update"
  | "other";

export interface TimelineEvent {
  date: string; // "2025-06-21", "2025-06" or "2025"
  title: string;
  description: string;
  type: TimelineType;
  source?: { label?: string; url: string };
}

export interface Topic {
  slug: string;
  name: string;
  description: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  contactEmail?: string;
  social: { platform: string; url: string; placeholder?: boolean }[];
  topics: Topic[];
}

export interface Legislation {
  slug: string;
  title: string;
  shortTitle: string;
  billNumber: string;
  session: string;
  governmentLevel: string;
  jurisdiction: string;
  category: string; // topic slug
  status: Status;
  statusNote?: string;
  introductionDate?: string;
  effectiveDate?: string;
  lastUpdated: string; // computed
  summary: string;
  studentImpact?: string;
  officialSource?: { label: string; url: string };
  sponsors: string[];
  timeline: TimelineEvent[];
  sources: Source[];
  tags: string[];
  relatedLegislation: string[];
  demo: boolean;
  featured: boolean;
  bodyMarkdown: string;
  // filled in after articles are loaded:
  articles: ArticleMeta[];
}

export interface ArticleMeta {
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  author: string;
  publishedDate: string;
  updatedDate?: string;
  category: string;
  tags: string[];
  legislation: string[];
  articleType: "explainer" | "update" | "analysis" | "other";
  readingTime: number;
  heroImage?: string;
  heroImageAlt?: string;
  heroImageCredit?: string;
  sources: Source[];
  demo: boolean;
  featured: boolean;
}

export interface Article extends ArticleMeta {
  bodyMarkdown: string;
}
