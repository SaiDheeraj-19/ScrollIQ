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
        primary: "#3b82f6", // blue-500
        secondary: "#8b5cf6", // violet-500
        accent: "#10b981", // emerald-500
        darkcard: "#1e293b", // slate-800
      },
    },
  },
  plugins: [],
};
export default config;
