import { LANGUAGE_STORAGE_KEY, LANGUAGES } from "./constants";
import type { Language } from "./types";

export function getStoredLanguage(): Language {
  const rawLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (LANGUAGES.includes(rawLanguage as Language)) {
    return rawLanguage as Language;
  }

  return "ru";
}

export function setStoredLanguage(language: Language): void {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}
