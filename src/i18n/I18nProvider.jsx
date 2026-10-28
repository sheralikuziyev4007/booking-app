import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "./locales/en";
import ru from "./locales/ru";

export const LOCALES = { en, ru };
export const DEFAULT_LANG = "en";
const STORAGE_KEY = "atlas-lang";

// Saved choice → browser language → English
export function detectLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LOCALES[saved]) return saved;
  } catch {
    // localStorage can be unavailable (private mode, sandboxed iframe)
  }
  const nav = typeof navigator !== "undefined" ? navigator.language || "" : "";
  return nav.toLowerCase().startsWith("ru") ? "ru" : DEFAULT_LANG;
}

function lookup(messages, key) {
  return key.split(".").reduce((node, part) => (node == null ? undefined : node[part]), messages);
}

function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
}

// Builds translation helpers for one locale. Exported separately so it can be unit-tested without React.
export function createTranslator(lang) {
  const locale = LOCALES[lang] || LOCALES[DEFAULT_LANG];
  const rules = new Intl.PluralRules(locale.code);

  const t = (key, vars) => {
    const value = lookup(locale.messages, key);
    if (typeof value !== "string") {
      if (import.meta.env?.DEV) console.warn(`[i18n] Missing key "${key}" for "${locale.code}"`);
      return key;
    }
    return interpolate(value, vars);
  };

  // plural("guests", 3) → "guests" / "гостя"
  const plural = (key, n) => {
    const forms = locale.plurals[key];
    return forms[rules.select(n)] ?? forms.other;
  };

  // "2026-09-24" → "Thursday, September 24" / «24 сентября, четверг»
  const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const weekday = new Date(y, m - 1, d).getDay();
    return locale.formatDate(y, m - 1, d, weekday);
  };

  return { lang: locale.code, locale, t, plural, formatDate, formatTime: locale.formatTime };
}

const I18nContext = createContext(null);

export function I18nProvider({ initialLang, children }) {
  const [lang, setLangState] = useState(() => initialLang || detectLanguage());

  const setLang = useCallback((next) => {
    if (!LOCALES[next]) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore: the choice just won't survive a reload
    }
  }, []);

  const value = useMemo(() => ({ ...createTranslator(lang), setLang }), [lang, setLang]);

  // Keep <html lang>, title and description in sync for screen readers and SEO
  useEffect(() => {
    document.documentElement.lang = value.lang;
    document.title = value.t("meta.title");
    document.querySelector('meta[name="description"]')?.setAttribute("content", value.t("meta.description"));
  }, [value]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
