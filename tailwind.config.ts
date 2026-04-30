import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        foreground: "#ededed",
        primary: "#0A0A0F",
        accent1: "#6EE7F7",
        accent2: "#FF6B6B",
        accent3: "#A855F7",
        accent4: "#F7931E",
        surface: "rgba(255,255,255,0.03)",
      },
      fontFamily: {
        display: ["var(--font-clash-display)", "sans-serif"],
        body: ["var(--font-cabinet-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
