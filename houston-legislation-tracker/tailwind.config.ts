import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F6F9",
        card: "#FFFFFF",
        ink: "#0F1B2D",
        soft: "#46536A", // secondary text, 7:1 on paper
        rule: "#D9DEE7",
        wash: "#E9EDF4",
        brand: {
          DEFAULT: "#1F3FA6",
          dark: "#142B78",
          tint: "#E4EAFB",
        },
        brick: {
          DEFAULT: "#A9401C",
          tint: "#F8E7DF",
        },
        go: { DEFAULT: "#1B6448", tint: "#DFF1E8" },
        amber: { DEFAULT: "#7A5800", tint: "#F8EBC8" },
        alert: { DEFAULT: "#9B1C1C", tint: "#F9E1E1" },
      },
      fontFamily: {
        sans: ['"Schibsted Grotesk Variable"', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ['"Source Serif 4 Variable"', "Georgia", "Cambria", '"Times New Roman"', "serif"],
      },
      maxWidth: {
        prose: "40rem",
      },
    },
  },
  plugins: [],
};

export default config;
