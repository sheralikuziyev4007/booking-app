import { describe, it, expect } from "vitest";
import { validateBookingForm } from "./validation";

const valid = { name: "Алишер", phone: "+998 90 123 45 67", email: "user@mail.com", guests: 2, comment: "" };

describe("validateBookingForm", () => {
  it("корректные данные — без ошибок", () => {
    expect(validateBookingForm(valid)).toEqual({});
  });

  it("слишком короткое имя", () => {
    expect(validateBookingForm({ ...valid, name: " А " }).name).toBeDefined();
  });

  it("некорректный телефон", () => {
    expect(validateBookingForm({ ...valid, phone: "123" }).phone).toBeDefined();
    expect(validateBookingForm({ ...valid, phone: "abc-def-ghij" }).phone).toBeDefined();
  });

  it("некорректный email", () => {
    expect(validateBookingForm({ ...valid, email: "user@mail" }).email).toBeDefined();
    expect(validateBookingForm({ ...valid, email: "user mail.com" }).email).toBeDefined();
  });

  it("количество гостей вне диапазона 1–10", () => {
    expect(validateBookingForm({ ...valid, guests: 0 }).guests).toBeDefined();
    expect(validateBookingForm({ ...valid, guests: 11 }).guests).toBeDefined();
    expect(validateBookingForm({ ...valid, guests: 10 })).toEqual({});
  });
});
