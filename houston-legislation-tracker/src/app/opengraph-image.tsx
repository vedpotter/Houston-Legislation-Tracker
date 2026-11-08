import { renderOg, ogSize } from "@/lib/og";
import { siteConfig } from "@/lib/content";

export const size = ogSize;
export const contentType = "image/png";
export const alt = siteConfig.name;

export default function Image() {
  return renderOg({ kicker: "Nonpartisan and student-created", title: siteConfig.tagline });
}
