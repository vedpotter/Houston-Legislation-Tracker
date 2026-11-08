import { getAllArticles, getLegislation, topicName } from "@/lib/content";
import { ArticleRow } from "@/components/ArticleRow";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Articles",
  description: "Explainers and updates on the Texas and Houston-area laws that affect students, written in plain language with sources.",
  path: "/articles",
});

export default function ArticlesIndex() {
  const articles = getAllArticles();
  return (
    <div className="wrap py-12 sm:py-16">
      <h1 className="text-4xl font-extrabold sm:text-5xl">Articles</h1>
      <p className="mt-3 max-w-prose text-lg text-soft">
        Explainers and updates, newest first. Each one is connected to a legislation page so you can follow a law over time.
      </p>
      <ul className="mt-10 max-w-4xl divide-y divide-rule border-t-2 border-ink">
        {articles.map((a) => (
          <li key={a.slug}>
            <ArticleRow
              headingLevel={2}
              article={a}
              topicName={topicName(a.category)}
              legislationTitle={a.legislation[0] ? getLegislation(a.legislation[0])?.shortTitle : undefined}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
