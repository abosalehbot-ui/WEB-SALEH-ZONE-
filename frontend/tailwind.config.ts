import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cairo", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        saleh: {
          bg: "rgb(var(--background) / <alpha-value>)",
          surface: "rgb(var(--surface) / <alpha-value>)",
          card: "rgb(var(--card) / <alpha-value>)",
          border: "rgb(var(--border) / <alpha-value>)",
          text: "rgb(var(--foreground) / <alpha-value>)",
          textMuted: "rgb(var(--muted) / <alpha-value>)",
          primary: "rgb(var(--primary) / <alpha-value>)",
          secondary: "rgb(var(--secondary) / <alpha-value>)",
          accent: "rgb(var(--accent) / <alpha-value>)",
          danger: "rgb(var(--danger) / <alpha-value>)"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(var(--primary), 0.25), 0 0 24px rgba(var(--primary), 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
