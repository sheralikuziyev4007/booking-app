import { describe, it, expect } from "vitest";
import { validateBookingForm } from "./validation";

const valid = { name: "Alisher", phone: "+998 90 123 45 67", email: "user@mail.com", guests: 2, comment: "" };

describe("validateBookingForm", () => {
  it("valid data → no errors", () => {
    expect(validateBookingForm(valid)).toEqual({});
    expect(validateBookingForm({ ...valid, phone: "+1 212 555 0123" })).toEqual({});
  });

  it("name too short", () => {
    expect(validateBookingForm({ ...valid, name: " A " }).name).toBe("nameShort");
  });

  it("invalid phone", () => {
    expect(validateBookingForm({ ...valid, phone: "123" }).phone).toBe("phoneInvalid");
    expect(validateBookingForm({ ...valid, phone: "abc-def-ghij" }).phone).toBe("phoneInvalid");
  });

  it("invalid email", () => {
    expect(validateBookingForm({ ...valid, email: "user@mail" }).email).toBe("emailInvalid");
    expect(validateBookingForm({ ...valid, email: "user mail.com" }).email).toBe("emailInvalid");
  });

  it("party size outside 1–10", () => {
    expect(validateBookingForm({ ...valid, guests: 0 }).guests).toBe("guestsRange");
    expect(validateBookingForm({ ...valid, guests: 11 }).guests).toBe("guestsRange");
    expect(validateBookingForm({ ...valid, guests: 10 })).toEqual({});
  });
});
