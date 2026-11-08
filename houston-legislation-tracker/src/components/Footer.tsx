import Link from "next/link";
import { siteConfig } from "@/lib/content";
import { SocialLinks } from "./SocialLinks";
import { Mark } from "./icons";

export function Footer() {
  return (
    <footer className="on-dark mt-24 border-t border-rule bg-ink text-white">
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-3 text-lg font-extrabold">
            <Mark /> {siteConfig.name}
          </p>
          <p className="mt-3 max-w-sm text-base text-white/80">{siteConfig.tagline} A nonpartisan, student-created guide to legislation that affects Houston-area students.</p>
        </div>
        <nav aria-label="Footer">
          <h2 className="text-base font-bold">Explore</h2>
          <ul className="mt-3 space-y-1 text-white/80">
            {[
              ["/legislation", "Legislation"],
              ["/articles", "Articles"],
              ["/topics", "Topics"],
              ["/search", "Search"],
              ["/about", "About and editorial principles"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-block py-1 hover:text-white hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-base font-bold">Follow the Tracker</h2>
          <div className="mt-3 text-white">
            <SocialLinks />
          </div>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="wrap py-5 text-sm text-white/70">
          {siteConfig.name} does not endorse political parties, candidates, or legislation. It is an information project, not legal advice.
        </p>
      </div>
    </footer>
  );
}
