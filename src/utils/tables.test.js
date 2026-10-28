import { describe, it, expect } from "vitest";
import { findFreeTable, seatingsOverlap, tableSizeFor } from "./tables";

const TABLES = [
  { seats: 2, count: 1 },
  { seats: 4, count: 1 },
];
const opts = { tables: TABLES, seatingMinutes: 120 };
const booking = (time, guests, extra = {}) => ({ date: "2026-09-24", time, guests, status: "active", ...extra });

describe("tableSizeFor", () => {
  it("picks the smallest table that fits", () => {
    expect(tableSizeFor(1, TABLES)).toBe(2);
    expect(tableSizeFor(3, TABLES)).toBe(4);
    expect(tableSizeFor(5, TABLES)).toBeNull();
  });
});

describe("seatingsOverlap", () => {
  it("overlaps inside the seating window only", () => {
    expect(seatingsOverlap("18:00", "19:30", 120)).toBe(true);
    expect(seatingsOverlap("18:00", "20:00", 120)).toBe(false);
    expect(seatingsOverlap("20:00", "18:00", 120)).toBe(false);
  });
});

describe("findFreeTable", () => {
  it("empty restaurant → smallest fitting table", () => {
    expect(findFreeTable([], "2026-09-24", "18:00", 2, opts)).toBe(2);
    expect(findFreeTable([], "2026-09-24", "18:00", 3, opts)).toBe(4);
  });

  it("upgrades to a bigger table when the small one is taken", () => {
    const list = [booking("18:00", 2, { tableSize: 2 })];
    expect(findFreeTable(list, "2026-09-24", "18:30", 2, opts)).toBe(4);
  });

  it("returns null when every fitting table is taken", () => {
    const list = [booking("18:00", 2, { tableSize: 2 }), booking("18:00", 4, { tableSize: 4 })];
    expect(findFreeTable(list, "2026-09-24", "19:00", 1, opts)).toBeNull();
  });

  it("frees the table after the seating ends", () => {
    const list = [booking("18:00", 2, { tableSize: 2 }), booking("18:00", 4, { tableSize: 4 })];
    expect(findFreeTable(list, "2026-09-24", "20:00", 2, opts)).toBe(2);
  });

  it("ignores cancelled bookings and other dates", () => {
    const list = [
      booking("18:00", 4, { tableSize: 4, status: "cancelled" }),
      booking("18:00", 4, { tableSize: 4, date: "2026-09-25" }),
    ];
    expect(findFreeTable(list, "2026-09-24", "18:00", 4, opts)).toBe(4);
  });

  it("handles legacy bookings without tableSize", () => {
    const list = [booking("18:00", 3)]; // → table for 4
    expect(findFreeTable(list, "2026-09-24", "18:00", 3, opts)).toBeNull();
    expect(findFreeTable(list, "2026-09-24", "18:00", 2, opts)).toBe(2);
  });
});
