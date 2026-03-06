"use client";

import { useEffect, useState } from "react";

import { THEMES, ThemeName, isThemeName } from "@/lib/theme/themes";

const STORAGE_KEY = "saleh-theme";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeName>("default");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isThemeName(saved)) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      document.documentElement.setAttribute("data-theme", "default");
    }
  }, []);

  const onChange = (nextTheme: ThemeName) => {
    setTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  return (
    <select
      value={theme}
      onChange={(event) => onChange(event.target.value as ThemeName)}
      className="h-9 rounded-lg border border-saleh-border bg-saleh-card px-2 text-xs text-saleh-text"
      aria-label="Theme"
    >
      {THEMES.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}
