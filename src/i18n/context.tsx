import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { dictionaries } from "./dictionaries";
import { getStoredLanguage, setStoredLanguage } from "./storage";
import type { Dictionary, Language } from "./types";

type LanguageContextValue = {
  language: Language;
  dictionary: Dictionary;
  t: Dictionary;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export function LanguageProvider({ children }: Props) {
  const [language, setLanguageState] = useState<Language>(() =>
    getStoredLanguage(),
  );

  const setLanguage = useCallback((nextLanguage: Language) => {
    setStoredLanguage(nextLanguage);
    setLanguageState(nextLanguage);

    document.documentElement.lang = nextLanguage;
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "ru" ? "en" : "ru");
  }, [language, setLanguage]);

  const dictionary = useMemo(() => dictionaries[language], [language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      dictionary,
      t: dictionary,
      setLanguage,
      toggleLanguage,
    };
  }, [language, dictionary, setLanguage, toggleLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }

  return context;
}
