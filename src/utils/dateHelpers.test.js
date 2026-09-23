import { describe, it, expect } from "vitest";
import { dateKey, isClosed, isPastSlot, formatDateHuman, genBookingNumber } from "./dateHelpers";

describe("dateKey", () => {
  it("форматирует дату как YYYY-MM-DD с ведущими нулями", () => {
    expect(dateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(dateKey(new Date(2026, 11, 31))).toBe("2026-12-31");
  });
});

describe("isClosed", () => {
  it("понедельник — выходной", () => {
    expect(isClosed(new Date(2026, 8, 21))).toBe(true); // 21 сентября 2026 — понедельник
  });
  it("остальные дни рабочие", () => {
    expect(isClosed(new Date(2026, 8, 22))).toBe(false);
    expect(isClosed(new Date(2026, 8, 27))).toBe(false); // воскресенье
  });
});

describe("isPastSlot", () => {
  const now = new Date(2026, 8, 23, 14, 0); // 23.09.2026, 14:00

  it("прошедшее время сегодня — прошло", () => {
    expect(isPastSlot("2026-09-23", "12:30", now)).toBe(true);
  });
  it("ровно текущее время считается прошедшим", () => {
    expect(isPastSlot("2026-09-23", "14:00", now)).toBe(true);
  });
  it("будущее время сегодня — доступно", () => {
    expect(isPastSlot("2026-09-23", "14:30", now)).toBe(false);
  });
  it("любое время завтра — доступно", () => {
    expect(isPastSlot("2026-09-24", "12:00", now)).toBe(false);
  });
  it("любое время вчера — прошло", () => {
    expect(isPastSlot("2026-09-22", "22:00", now)).toBe(true);
  });
});

describe("formatDateHuman", () => {
  it("выводит число, месяц и день недели по-русски", () => {
    expect(formatDateHuman("2026-09-23")).toBe("23 сентября, среда");
  });
});

describe("genBookingNumber", () => {
  it("имеет формат АТ-ГГГГММДД-NNNN", () => {
    expect(genBookingNumber()).toMatch(/^АТ-\d{8}-\d{4}$/);
  });
});
