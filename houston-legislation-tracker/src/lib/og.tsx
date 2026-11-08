import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** One shared layout for all social-sharing images (Open Graph). */
export function renderOg({ kicker, title, footer }: { kicker: string; title: string; footer?: string }) {
  const size = title.length > 90 ? 52 : title.length > 55 ? 64 : 76;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0F1B2D",
          color: "#FFFFFF",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 14, height: 56, background: "#F0A27F", borderRadius: 4 }} />
          <div style={{ fontSize: 32, fontWeight: 700, opacity: 0.9 }}>{kicker}</div>
        </div>
        <div style={{ fontSize: size, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5, display: "flex" }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, opacity: 0.85 }}>
          <span>Houston Legislation Tracker</span>
          <span>{footer ?? ""}</span>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
