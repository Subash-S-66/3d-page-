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
        background: "var(--background)",
        foreground: "var(--foreground)",
        lobby: {
          bg: "#F0ECE4",
          text: "#1A1A1A"
        },
        redRoom: {
          bg: "#FF3D00",
          text: "#FFFFFF"
        },
        gallery: {
          bg: "#0A0A0A",
          accent: "#FF3D00"
        }
      },
      fontFamily: {
        display: ['var(--font-bebas-neue)', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      }
    },
  },
  plugins: [],
};
export default config;
