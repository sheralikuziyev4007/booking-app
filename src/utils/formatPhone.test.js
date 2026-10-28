import { describe, it, expect } from "vitest";
import { formatPhone, isValidPhone, nextPhoneValue } from "./formatPhone";

describe("formatPhone", () => {
  it("formats numbers from different countries", () => {
    expect(formatPhone("+998901234567")).toBe("+998 90 123 45 67");
    expect(formatPhone("+12125550123")).toBe("+1 212 555 0123");
    expect(formatPhone("+447911123456")).toBe("+44 7911 123456");
  });
  it("adds the plus and strips other symbols", () => {
    expect(formatPhone("998 (90) 123-45-67")).toBe("+998 90 123 45 67");
    expect(formatPhone("abc")).toBe("");
    expect(formatPhone("+")).toBe("+");
  });
  it("caps input at 15 digits", () => {
    expect(formatPhone("+1234567890123456789").replace(/\D/g, "")).toHaveLength(15);
  });
});

describe("nextPhoneValue", () => {
  it("backspace over a space removes the digit before it", () => {
    expect(nextPhoneValue("+998 90", "+998 90".slice(0, -1))).toBe("+998 9");
    expect(nextPhoneValue("+998 90 1", "+998 90 ")).toBe("+998 90");
  });
  it("normal typing just formats", () => {
    expect(nextPhoneValue("+998 9", "+998 90")).toBe("+998 90");
  });
});

describe("isValidPhone", () => {
  it("accepts complete valid numbers", () => {
    expect(isValidPhone("+998 90 123 45 67")).toBe(true);
    expect(isValidPhone("+1 212 555 0123")).toBe(true);
    expect(isValidPhone("+44 7911 123456")).toBe(true);
  });
  it("rejects incomplete or empty numbers", () => {
    expect(isValidPhone("+998 90 123")).toBe(false);
    expect(isValidPhone("")).toBe(false);
    expect(isValidPhone("+")).toBe(false);
  });
});
