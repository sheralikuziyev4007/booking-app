import { describe, it, expect } from "vitest";
import { createTranslator, LOCALES } from "./I18nProvider";

// Collect "a.b.c" paths of every string in a messages tree
function keys(node, prefix = "") {
  return Object.entries(node).flatMap(([k, v]) => (typeof v === "string" ? [prefix + k] : keys(v, `${prefix}${k}.`)));
}

describe("dictionaries", () => {
  it("RU has exactly the same keys as EN", () => {
    expect(keys(LOCALES.ru.messages).sort()).toEqual(keys(LOCALES.en.messages).sort());
  });
});

describe("createTranslator", () => {
  const en = createTranslator("en");
  const ru = createTranslator("ru");

  it("translates and interpolates", () => {
    expect(en.t("nav.next")).toBe("Next");
    expect(ru.t("nav.next")).toBe("Далее");
    expect(en.t("brand.tables", { min: 1, max: 10 })).toBe("Tables for 1–10 guests");
  });

  it("returns the key for a missing message", () => {
    expect(en.t("nope.missing")).toBe("nope.missing");
  });

  it("falls back to English for an unknown language", () => {
    expect(createTranslator("de").lang).toBe("en");
  });

  it.each([
    [1, "guest", "гость"],
    [2, "guests", "гостя"],
    [5, "guests", "гостей"],
    [11, "guests", "гостей"],
    [21, "guests", "гость"],
    [22, "guests", "гостя"],
  ])("plural guests %i → %s / %s", (n, enWord, ruWord) => {
    expect(en.plural("guests", n)).toBe(enWord);
    expect(ru.plural("guests", n)).toBe(ruWord);
  });

  it("formats dates per language", () => {
    expect(en.formatDate("2026-09-24")).toBe("Thursday, September 24");
    expect(ru.formatDate("2026-09-24")).toBe("24 сентября, четверг");
  });

  it("formats time: 12-hour in English, 24-hour in Russian", () => {
    expect(en.formatTime("12:00")).toBe("12:00 PM");
    expect(en.formatTime("18:30")).toBe("6:30 PM");
    expect(en.formatTime("00:15")).toBe("12:15 AM");
    expect(ru.formatTime("18:30")).toBe("18:30");
  });
});
