import { describe, it, expect } from "vitest";
import { formatPhone, isCompletePhone } from "./formatPhone";

describe("formatPhone", () => {
  it("форматирует по мере ввода", () => {
    expect(formatPhone("9")).toBe("+998 9");
    expect(formatPhone("90123")).toBe("+998 90 123");
    expect(formatPhone("901234567")).toBe("+998 90 123 45 67");
  });
  it("понимает номер с кодом страны и вставку с символами", () => {
    expect(formatPhone("+998 (90) 123-45-67")).toBe("+998 90 123 45 67");
    expect(formatPhone("998901234567")).toBe("+998 90 123 45 67");
  });
  it("обрезает лишние цифры и убирает буквы", () => {
    expect(formatPhone("+998 90 123 45 67 8899")).toBe("+998 90 123 45 67");
    expect(formatPhone("abc")).toBe("");
  });
  it("стирание префикса очищает поле", () => {
    expect(formatPhone("+998 ")).toBe("");
  });
  it("проверяет полноту номера", () => {
    expect(isCompletePhone("+998 90 123 45 67")).toBe(true);
    expect(isCompletePhone("+998 90 123")).toBe(false);
  });
});
