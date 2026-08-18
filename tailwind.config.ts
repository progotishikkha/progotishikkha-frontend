import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        bengali: ["var(--font-bengali)", "sans-serif"],
      },
      colors: {
        brand: {
          navy: "#0B2559",   // logo ring / text
          blue: "#2E86EB",   // logo book blue
          gold: "#F5A623",   // logo sunburst
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#2E86EB",
          700: "#1D4ED8",
          900: "#0B2559",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "glass": "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
