import type { Config } from "tailwindcss";

export default {
  darkMode: "class", // ← crucial for toggling via <html class="dark">
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
