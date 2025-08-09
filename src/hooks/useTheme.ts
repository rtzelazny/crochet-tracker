import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    return saved ?? "system";
  });

  // Apply class based on current choice
  useEffect(() => {
    const root = document.documentElement;

    const apply = (isDark: boolean) => {
      root.classList.toggle("dark", isDark);
    };

    if (theme === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => apply(mql.matches);
      handler(); // set initial
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    } else {
      apply(theme === "dark");
    }
  }, [theme]);

  // Persist preference (remove for system)
  useEffect(() => {
    if (theme === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
