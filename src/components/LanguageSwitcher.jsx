import { LOCALES, useI18n } from "../i18n/I18nProvider";

// Segmented EN / RU switch. Each option is a real button with aria-pressed for screen readers.
export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div role="group" aria-label={t("header.language")} className="flex rounded-lg border border-edge p-0.5">
      {Object.values(LOCALES).map((locale) => {
        const active = locale.code === lang;
        return (
          <button
            key={locale.code}
            type="button"
            lang={locale.code}
            aria-label={locale.name}
            aria-pressed={active}
            onClick={() => setLang(locale.code)}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold
              ${active ? "bg-gold text-[#1B1405]" : "cursor-pointer text-muted hover:text-ink"}`}
          >
            {locale.label}
          </button>
        );
      })}
    </div>
  );
}
