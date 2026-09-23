import { describe, it, expect } from "vitest";
import { generateTimeSlots, ALL_SLOTS } from "./generateTimeSlots";

describe("generateTimeSlots", () => {
  it("по умолчанию 12:00–22:00 с шагом 30 минут (21 слот)", () => {
    expect(ALL_SLOTS).toHaveLength(21);
    expect(ALL_SLOTS[0]).toBe("12:00");
    expect(ALL_SLOTS[1]).toBe("12:30");
    expect(ALL_SLOTS.at(-1)).toBe("22:00");
  });

  it("последний слот ровно в конце рабочего дня, без 22:30", () => {
    expect(ALL_SLOTS).not.toContain("22:30");
  });

  it("поддерживает другой шаг", () => {
    expect(generateTimeSlots(10, 12, 60)).toEqual(["10:00", "11:00", "12:00"]);
  });
});
