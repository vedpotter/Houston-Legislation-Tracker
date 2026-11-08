import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}: ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4F6F9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:font-bold focus:text-white"
        >
          Skip to main content
        </a>
        <Header name={siteConfig.name} social={siteConfig.social} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
