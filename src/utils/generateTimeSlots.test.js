import { describe, it, expect } from "vitest";
import { generateTimeSlots, ALL_SLOTS, toMinutes, fromMinutes } from "./generateTimeSlots";

describe("generateTimeSlots", () => {
  it("defaults to 12:00–22:00 every 30 minutes (21 slots)", () => {
    expect(ALL_SLOTS).toHaveLength(21);
    expect(ALL_SLOTS[0]).toBe("12:00");
    expect(ALL_SLOTS[1]).toBe("12:30");
    expect(ALL_SLOTS.at(-1)).toBe("22:00");
  });

  it("the last slot is exactly the last seating, no 22:30", () => {
    expect(ALL_SLOTS).not.toContain("22:30");
  });

  it("supports a custom range and step", () => {
    expect(generateTimeSlots("10:00", "12:00", 60)).toEqual(["10:00", "11:00", "12:00"]);
  });
});

describe("toMinutes / fromMinutes", () => {
  it("convert both ways", () => {
    expect(toMinutes("18:30")).toBe(1110);
    expect(fromMinutes(1110)).toBe("18:30");
    expect(fromMinutes(toMinutes("09:05"))).toBe("09:05");
  });
});
