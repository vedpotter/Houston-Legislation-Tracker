import Link from "next/link";
import { siteConfig } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { SocialLinks } from "@/components/SocialLinks";

export const metadata = pageMetadata({
  title: "About",
  description: "Houston Legislation Tracker is a student-created, nonpartisan project that explains legislation affecting Houston-area students and follows what happens next.",
  path: "/about",
});

const principles = [
  ["Accuracy", "We prioritize primary sources, such as bill text, agency documents, and court records. When we find an error, we correct it and say what changed."],
  ["Transparency", "Sources are linked on every legislation page and article. When a source is a group that supports or opposes a law, we label it that way."],
  ["Nonpartisanship", "We do not endorse political parties, candidates, or legislation. Arguments for and against a law are attributed to the people who make them."],
  ["Student focus", "We prioritize legislation with meaningful effects on students and young people, and we say plainly when the effects are not yet clear."],
];

export default function AboutPage() {
  return (
    <div className="wrap py-12 sm:py-16">
      <h1 className="text-4xl font-extrabold sm:text-5xl">About {siteConfig.name}</h1>

      <div className="mt-10 grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,42rem)_1fr]">
        <div className="space-y-14">
          <section aria-labelledby="what-h">
            <h2 id="what-h" className="text-2xl font-extrabold">What is Houston Legislation Tracker?</h2>
            <p className="mt-3 text-lg text-soft">
             hello my name is Ved
            </p>
          </section>

          <section aria-labelledby="why-h">
            <h2 id="why-h" className="text-2xl font-extrabold">Why was it created?</h2>
            <p className="mt-3 text-lg text-soft">Legislation can be difficult to follow for several reasons:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-lg text-soft">
              <li>Bills change as they move through the legislative process.</li>
              <li>Laws take effect at different times.</li>
              <li>Putting a law into practice can take months or years.</li>
              <li>News coverage is often fragmented across many stories.</li>
              <li>Students rarely have an easy place to learn what a law means for them.</li>
            </ul>
          </section>

          <section aria-labelledby="approach-h">
            <h2 id="approach-h" className="text-2xl font-extrabold">Our approach</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-lg text-soft">
              <li>We track legislation over time. Each law has a permanent page with a timeline and every update we publish.</li>
              <li>We explain complicated policy in plain English.</li>
              <li>We link to primary sources.</li>
              <li>We separate facts from political arguments: what the law says, what supporters say, what opponents say, what has happened, and what remains uncertain.</li>
              <li>We update legislation pages as new developments occur, and every page shows when it was last updated.</li>
            </ul>
          </section>
        </div>

        <aside className="lg:pt-2" aria-labelledby="principles-h">
          <h2 id="principles-h" className="text-2xl font-extrabold">Editorial principles</h2>
          <dl className="mt-5 space-y-5">
            {principles.map(([t, d]) => (
              <div key={t} className="border-l-4 border-brand bg-card py-3 pl-4 pr-4">
                <dt className="text-lg font-bold">{t}</dt>
                <dd className="mt-1 text-soft">{d}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-rule bg-card p-7" aria-labelledby="corr-h">
          <h2 id="corr-h" className="text-xl font-extrabold">Corrections</h2>
          <p className="mt-2 text-soft">
            If you spot a mistake or an out-of-date detail, tell us and we will check it against the source.
            {siteConfig.contactEmail && (
              <>
                {" "}Write to <a className="link" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
              </>
            )}
          </p>
          <p className="mt-3 text-soft">This site provides information, not legal advice.</p>
        </section>
        <section className="rounded-xl bg-brand-tint p-7" aria-labelledby="follow-h">
          <h2 id="follow-h" className="text-xl font-extrabold">Follow the Tracker</h2>
          <p className="mt-2 text-ink/80">Short explainers, legislative updates, and Houston policy news.</p>
          <div className="mt-4"><SocialLinks variant="buttons" /></div>
        </section>
      </div>

      <p className="mt-10">
        <Link href="/legislation" className="btn btn-primary">Explore Legislation</Link>
      </p>
    </div>
  );
}
