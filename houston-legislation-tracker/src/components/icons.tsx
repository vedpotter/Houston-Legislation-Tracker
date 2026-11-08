import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const SearchIcon = (p: P) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const MenuIcon = (p: P) => (
  <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const ExternalIcon = (p: P) => (
  <svg {...base} width={14} height={14} {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
);
export const InstagramIcon = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" /></svg>
);
export const YouTubeIcon = (p: P) => (
  <svg {...base} {...p}><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor" /></svg>
);
export const XIcon = (p: P) => (
  <svg {...base} {...p}><path d="M4 4l16 16M20 4 4 20" /></svg>
);
export const TikTokIcon = (p: P) => (
  <svg {...base} {...p}><path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 4c.3 2.4 1.9 4 4.5 4.2" /></svg>
);
export const CheckIcon = (p: P) => (
  <svg {...base} width={16} height={16} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);

const map: Record<string, (p: P) => React.ReactElement> = {
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  X: XIcon,
  YouTube: YouTubeIcon,
};
export function SocialIcon({ platform, ...p }: { platform: string } & P) {
  const Cmp = map[platform];
  return Cmp ? <Cmp {...p} /> : null;
}

/** The site mark: a route line with stops, echoing the timeline on each legislation page. */
export function Mark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#1F3FA6" />
      <path d="M11 7v18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M11 20c0-4 10-3 10-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="11" cy="8" r="3" fill="#fff" />
      <circle cx="11" cy="24" r="3" fill="#fff" />
      <circle cx="21" cy="11" r="3.2" fill="#F0A27F" stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}
