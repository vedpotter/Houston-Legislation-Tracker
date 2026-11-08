"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon, Mark, SearchIcon, SocialIcon } from "./icons";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/legislation", label: "Legislation" },
  { href: "/articles", label: "Articles" },
  { href: "/topics", label: "Topics" },
  { href: "/about", label: "About" },
];

interface Props {
  name: string;
  social: { platform: string; url: string }[];
}

export function Header({ name, social }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu after navigating
  useEffect(() => setOpen(false), [pathname]);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-card/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 rounded-md" aria-label={`${name}, home`}>
          <Mark />
          <span className="whitespace-nowrap text-lg font-extrabold leading-none tracking-tight sm:text-xl">{name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isCurrent(n.href) ? "page" : undefined}
              className={`rounded-md px-3 py-2 font-semibold hover:bg-wash ${
                isCurrent(n.href) ? "text-brand underline decoration-2 underline-offset-8" : "text-ink"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <form action="/search" role="search" aria-label="Site search" className="relative">
            <label htmlFor="header-search" className="sr-only">Search legislation, articles, and topics</label>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-soft" />
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder="Search"
              className="h-11 w-44 rounded-md border border-rule bg-paper pl-10 pr-3 text-base placeholder:text-soft focus:w-56"
            />
          </form>
          <ul className="hidden xl:flex">
            {social.map((s) => (
              <li key={s.platform}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.platform} (opens in a new tab)`}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-wash"
                >
                  <SocialIcon platform={s.platform} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-md hover:bg-wash lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <CloseIcon width={26} height={26} /> : <MenuIcon width={26} height={26} />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-rule bg-card lg:hidden">
          <div className="wrap space-y-4 py-4">
            <form action="/search" role="search" aria-label="Site search" className="relative">
              <label htmlFor="mobile-search" className="sr-only">Search legislation, articles, and topics</label>
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-soft" />
              <input
                id="mobile-search"
                name="q"
                type="search"
                placeholder="Search legislation and articles"
                className="h-12 w-full rounded-md border border-rule bg-paper pl-10 pr-3 text-base placeholder:text-soft"
              />
            </form>
            <nav aria-label="Main">
              <ul>
                {NAV.map((n) => (
                  <li key={n.href} className="border-b border-rule last:border-0">
                    <Link
                      href={n.href}
                      aria-current={isCurrent(n.href) ? "page" : undefined}
                      className={`flex min-h-[52px] items-center text-lg font-bold ${isCurrent(n.href) ? "text-brand" : ""}`}
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <ul className="flex gap-1">
              {social.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.platform} (opens in a new tab)`}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-md hover:bg-wash"
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
