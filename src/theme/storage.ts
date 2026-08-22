import { THEME_STORAGE_KEY, THEMES } from "./constants";
import type { Theme } from "./types";

export function getStoredTheme(): Theme {
  const rawTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (THEMES.includes(rawTheme as Theme)) {
    return rawTheme as Theme;
  }

  return "dark";
}

export function setStoredTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
