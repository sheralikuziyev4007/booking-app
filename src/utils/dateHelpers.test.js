import { describe, it, expect } from "vitest";
import { dateKey, isClosed, isPastSlot, genBookingNumber } from "./dateHelpers";

describe("dateKey", () => {
  it("formats a date as YYYY-MM-DD with leading zeros", () => {
    expect(dateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(dateKey(new Date(2026, 11, 31))).toBe("2026-12-31");
  });
});

describe("isClosed", () => {
  it("Monday is the day off", () => {
    expect(isClosed(new Date(2026, 8, 21))).toBe(true); // Mon, Sep 21 2026
  });
  it("other days are open", () => {
    expect(isClosed(new Date(2026, 8, 22))).toBe(false);
    expect(isClosed(new Date(2026, 8, 27))).toBe(false); // Sunday
  });
});

describe("isPastSlot", () => {
  const now = new Date(2026, 8, 23, 14, 0); // Sep 23 2026, 14:00

  it("earlier today has passed", () => {
    expect(isPastSlot("2026-09-23", "12:30", now)).toBe(true);
  });
  it("the current minute counts as passed", () => {
    expect(isPastSlot("2026-09-23", "14:00", now)).toBe(true);
  });
  it("later today is available", () => {
    expect(isPastSlot("2026-09-23", "14:30", now)).toBe(false);
  });
  it("any time tomorrow is available", () => {
    expect(isPastSlot("2026-09-24", "12:00", now)).toBe(false);
  });
  it("any time yesterday has passed", () => {
    expect(isPastSlot("2026-09-22", "22:00", now)).toBe(true);
  });
});

describe("genBookingNumber", () => {
  it("has the AT-YYYYMMDD-NNNN format", () => {
    expect(genBookingNumber()).toMatch(/^AT-\d{8}-\d{4}$/);
    expect(genBookingNumber(new Date(2026, 8, 24))).toMatch(/^AT-20260924-\d{4}$/);
  });
});
