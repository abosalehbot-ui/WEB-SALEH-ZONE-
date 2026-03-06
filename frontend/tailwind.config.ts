import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cairo", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        saleh: {
          bg: "#050505",
          surface: "#111111",
          card: "#111827",
          border: "#374151",
          text: "#D1D5DB",
          textMuted: "#9CA3AF",
          primary: "#5EEAD4",
          secondary: "#7DFC89",
          accent: "#EAB308",
          danger: "#EF4444",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(94, 234, 212, 0.25), 0 0 24px rgba(94, 234, 212, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
