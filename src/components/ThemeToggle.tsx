import { useTheme } from "../hooks/useTheme";
import type { Theme } from "../hooks/useTheme";

const tabs: { key: Theme; label: string }[] = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "system", label: "System" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="tablist"
      aria-label="Theme"
      className="inline-flex rounded-lg border border-zinc-300 bg-white p-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
    >
      {tabs.map((t) => {
        const active = theme === t.key;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={active}
            onClick={() => setTheme(t.key)}
            className={[
              "px-3 py-1 rounded-md transition-colors",
              active
                ? "bg-zinc-200 dark:bg-zinc-800"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
