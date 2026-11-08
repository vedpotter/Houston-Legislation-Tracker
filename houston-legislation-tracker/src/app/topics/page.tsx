import Link from "next/link";
import { topicCounts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { pluralize } from "@/lib/format";

export const metadata = pageMetadata({
  title: "Topics",
  description: "Browse Texas and Houston-area legislation and articles by topic, from education and student rights to voting and transportation.",
  path: "/topics",
});

export default function TopicsIndex() {
  const topics = topicCounts();
  return (
    <div className="wrap py-12 sm:py-16">
      <h1 className="text-4xl font-extrabold sm:text-5xl">Topics</h1>
      <p className="mt-3 max-w-prose text-lg text-soft">Each topic collects the laws we track and the articles we have published about them.</p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map(({ topic, legislation, articles }) => {
          const empty = legislation === 0 && articles === 0;
          return (
            <li key={topic.slug}>
              <Link
                href={`/topics/${topic.slug}`}
                className={`flex h-full flex-col rounded-lg border bg-card p-5 hover:border-brand ${empty ? "border-dashed border-ink/25" : "border-rule"}`}
              >
                <span className="text-xl font-bold">{topic.name}</span>
                <span className="mt-1 text-soft">{topic.description}</span>
                <span className="mt-auto pt-4 text-sm font-semibold text-ink">
                  {empty ? "Coming soon" : `${pluralize(legislation, "law")}, ${pluralize(articles, "article")}`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
