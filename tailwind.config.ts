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
        brand: {
          gold: "#d4af37",
          dark: "#1a1a1a",
          darker: "#0f0f0f",
          border: "#2a2a2a",
          price: "#e67e22",
        },
      },
      fontFamily: {
        sans: ["PingFang SC", "Microsoft YaHei", "Helvetica Neue", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
