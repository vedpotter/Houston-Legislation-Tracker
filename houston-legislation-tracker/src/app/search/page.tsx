import { Suspense } from "react";
import { buildSearchIndex } from "@/lib/content";
import { SearchClient } from "@/components/SearchClient";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Search",
    description: "Search Houston Legislation Tracker for legislation, articles, and topics.",
    path: "/search",
  }),
  robots: { index: false },
};

export default function SearchPage() {
  const index = buildSearchIndex();
  return (
    <div className="wrap max-w-4xl py-12 sm:py-16 lg:mx-0">
      <h1 className="text-4xl font-extrabold sm:text-5xl">Search</h1>
      <p className="mb-8 mt-3 max-w-prose text-lg text-soft">Find legislation, articles, and topics. Results are grouped so you can tell them apart.</p>
      <Suspense fallback={<p className="text-soft">Loading search…</p>}>
        <SearchClient index={index} />
      </Suspense>
    </div>
  );
}
