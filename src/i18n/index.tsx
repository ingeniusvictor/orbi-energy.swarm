import React, { createContext, useContext, useState, useEffect } from "react";
import { SupportedLanguage, TranslationSchema } from "./types";
import { es } from "./es";
import { en } from "./en";

const translations: Record<SupportedLanguage, TranslationSchema> = {
  es,
  en
};

let globalLanguage: SupportedLanguage = "es";

try {
  const saved = localStorage.getItem("orbiEnergySwarm.language") as SupportedLanguage;
  if (saved === "es" || saved === "en") {
    globalLanguage = saved;
  }
} catch (e) {
  // Silently ignore
}

const listeners = new Set<() => void>();

export function getActiveLanguage(): SupportedLanguage {
  return globalLanguage;
}

export function setActiveLanguage(lang: SupportedLanguage) {
  if (lang === "es" || lang === "en") {
    globalLanguage = lang;
    try {
      localStorage.setItem("orbiEnergySwarm.language", lang);
    } catch (e) {
      // ignore
    }
    listeners.forEach((l) => l());
  }
}

export function t(key: string, variables?: Record<string, string | number>): string {
  const lang = globalLanguage;
  let resolved = getNestedValue(translations[lang], key);

  if (resolved === undefined) {
    resolved = getNestedValue(translations["es"], key);
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[i18n] Missing key "${key}" for language "${lang}", fell back to "es"`);
    }
  }

  if (resolved === undefined) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[i18n] Missing key "${key}" in both "${lang}" and "es" fallback`);
    }
    return key;
  }

  if (typeof resolved !== "string") {
    return String(resolved);
  }

  let result = resolved;
  if (variables) {
    Object.entries(variables).forEach(([k, v]) => {
      result = result.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    });
  }
  return result;
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

const LanguageContext = createContext<{
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: typeof t;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<SupportedLanguage>(globalLanguage);

  useEffect(() => {
    const handleUpdate = () => {
      setLang(globalLanguage);
    };
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const changeLanguage = (newLang: SupportedLanguage) => {
    setActiveLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language: lang, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useGameTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: globalLanguage,
      setLanguage: setActiveLanguage,
      t
    };
  }
  return context;
}

export function formatNumber(num: number): string {
  const lang = globalLanguage;
  try {
    return new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-US").format(num);
  } catch (e) {
    return String(num);
  }
}
