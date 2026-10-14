"use client";

import { useThemeMode } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { theme, cycleTheme } = useThemeMode();

  return (
    <button
      onClick={cycleTheme}
      className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-[var(--text)] backdrop-blur transition hover:bg-white/20"
      aria-label="Toggle theme"
    >
      {theme === "light" ? "LIGHT" : theme === "dark" ? "DARK" : "ULTRA"}
    </button>
  );
}
