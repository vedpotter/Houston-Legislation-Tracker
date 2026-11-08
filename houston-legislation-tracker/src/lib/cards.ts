import { topicName } from "./content";
import type { Legislation } from "./types";
import type { LegislationCardData } from "@/components/LegislationCard";

export function toCard(l: Legislation): LegislationCardData {
  return {
    slug: l.slug,
    shortTitle: l.shortTitle,
    title: l.title,
    billNumber: l.billNumber,
    session: l.session,
    category: l.category,
    categoryName: topicName(l.category),
    governmentLevel: l.governmentLevel,
    status: l.status,
    summary: l.summary,
    lastUpdated: l.lastUpdated,
    tags: l.tags,
    demo: l.demo,
  };
}
