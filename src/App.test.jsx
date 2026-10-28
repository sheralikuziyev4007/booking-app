// Integration test: the whole booking flow in jsdom (clock frozen at Wed, Sep 23 2026, 14:00)
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import App from "./App";
import { I18nProvider } from "./i18n/I18nProvider";

const STORAGE_KEY = "atlas-restaurant-bookings";
const click = (el) => fireEvent.click(el);
const btn = (name) => screen.getByRole("button", { name });
const renderApp = (lang = "en") =>
  render(
    <I18nProvider initialLang={lang}>
      <App />
    </I18nProvider>
  );

function setNow(y, mo, d, h, mi) {
  vi.setSystemTime(new Date(y, mo, d, h, mi));
}

function setGuests(n) {
  const current = Number(screen.getByRole("status").textContent);
  const diff = n - current;
  const name = diff > 0 ? "More guests" : "Fewer guests";
  for (let i = 0; i < Math.abs(diff); i++) click(btn(name));
}

async function fillDetails(name = "Alisher") {
  fireEvent.change(await screen.findByLabelText("Name"), { target: { value: name } });
  fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "+998901234567" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@mail.com" } });
}

async function book({ day = "Thursday, September 24", time, guests = 2 }) {
  click(btn(day));
  click(btn("Next"));
  setGuests(guests);
  click(btn(time));
  click(btn("Next"));
  await fillDetails();
  click(btn("Next"));
  await screen.findByText("Review your booking");
  click(btn("Confirm booking"));
  await screen.findByText("Booking confirmed");
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ toFake: ["Date"] });
  setNow(2026, 8, 23, 14, 0); // Wed, Sep 23 2026, 14:00
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("booking flow", () => {
  it("calendar: Mondays and past dates are disabled, today is available", () => {
    renderApp();
    expect(screen.getByText("September 2026")).toBeTruthy();
    expect(btn("Monday, September 28").disabled).toBe(true); // day off
    expect(btn("Tuesday, September 22").disabled).toBe(true); // past
    expect(btn("Wednesday, September 23").disabled).toBe(false); // today
    expect(btn("Thursday, September 24").disabled).toBe(false);
    expect(btn("Previous month").disabled).toBe(true);
  });

  it("past slots are disabled for today", () => {
    renderApp();
    click(btn("Wednesday, September 23"));
    click(btn("Next"));
    expect(btn("12:00 PM").disabled).toBe(true);
    expect(btn("2:00 PM").disabled).toBe(true);
    expect(btn("2:30 PM").disabled).toBe(false);
    expect(btn("10:00 PM").disabled).toBe(false);
  });

  it("after 22:00 today is disabled", () => {
    setNow(2026, 8, 23, 22, 30);
    renderApp();
    expect(btn("Wednesday, September 23").disabled).toBe(true);
    expect(btn("Thursday, September 24").disabled).toBe(false);
  });

  it("cannot continue without a date/time; the form is validated", async () => {
    renderApp();
    expect(btn("Next").disabled).toBe(true);
    click(btn("Thursday, September 24"));
    click(btn("Next"));
    expect(btn("Next").disabled).toBe(true);
    click(btn("6:30 PM"));
    click(btn("Next"));
    await screen.findByLabelText("Name");
    click(btn("Next")); // empty form → errors, stay on step 3
    expect(await screen.findByText("Enter your name (at least 2 characters).")).toBeTruthy();
    expect(screen.getByText("Enter a valid phone number with country code.")).toBeTruthy();
    expect(screen.getByText("Enter a valid email address.")).toBeTruthy();
    expect(screen.getByLabelText("Name").getAttribute("aria-invalid")).toBe("true");

    // typing clears that field's error only
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Al" } });
    expect(screen.queryByText("Enter your name (at least 2 characters).")).toBeNull();
    expect(screen.getByText("Enter a valid email address.")).toBeTruthy();
  });

  it("phone input formats international numbers as you type", async () => {
    renderApp();
    click(btn("Thursday, September 24"));
    click(btn("Next"));
    click(btn("6:30 PM"));
    click(btn("Next"));
    const phone = await screen.findByLabelText("Phone");
    fireEvent.change(phone, { target: { value: "12125550123" } });
    expect(phone.value).toBe("+1 212 555 0123");
  });

  it("booking → success → list → cancel", async () => {
    renderApp();
    await book({ time: "6:30 PM", guests: 3 });
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ date: "2026-09-24", time: "18:30", guests: 3, tableSize: 4 });
    expect(screen.getByText(/^AT-\d{8}-\d{4}$/)).toBeTruthy();

    click(btn("My bookings"));
    expect(screen.getByText(/6:30 PM · 3 guests/)).toBeTruthy();
    expect(screen.getByText("Upcoming")).toBeTruthy();

    click(btn("Cancel"));
    expect(screen.getByText("Cancelled")).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))[0].status).toBe("cancelled");
  });

  it("table capacity: the only 10-seat table blocks overlapping seatings for big parties only", async () => {
    renderApp();
    await book({ time: "6:30 PM", guests: 10 });

    click(btn("New booking")); // from the success screen
    click(btn("Thursday, September 24"));
    click(btn("Next"));
    setGuests(10);
    expect(btn("6:30 PM").disabled).toBe(true);
    expect(btn("5:00 PM").disabled).toBe(true); // 17:00–19:00 overlaps 18:30
    expect(btn("4:30 PM").disabled).toBe(false); // ends exactly at 18:30
    expect(btn("8:30 PM").disabled).toBe(false); // starts when the first seating ends

    setGuests(2);
    expect(btn("6:30 PM").disabled).toBe(false); // smaller tables are still free
  });

  it("increasing the party clears a time that no longer fits", async () => {
    renderApp();
    await book({ time: "6:30 PM", guests: 10 });
    click(btn("New booking"));
    click(btn("Thursday, September 24"));
    click(btn("Next"));
    click(btn("6:30 PM"));
    expect(btn("6:30 PM").getAttribute("aria-pressed")).toBe("true");
    setGuests(10);
    expect(btn("6:30 PM").getAttribute("aria-pressed")).toBe("false");
    expect(btn("Next").disabled).toBe(true);
  });

  it("no booking is created if the slot passed while the form was filled", async () => {
    renderApp();
    click(btn("Wednesday, September 23"));
    click(btn("Next"));
    click(btn("3:00 PM"));
    click(btn("Next"));
    await fillDetails();
    click(btn("Next"));
    await screen.findByText("Review your booking");

    setNow(2026, 8, 23, 15, 10); // the slot has started
    click(btn("Confirm booking"));

    expect(await screen.findByText("This time is no longer available. Please choose another one.")).toBeTruthy();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(btn("3:00 PM").disabled).toBe(true);
  });

  it("corrupted localStorage data does not break the app", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ broken: true }));
    renderApp();
    expect(screen.getByText("September 2026")).toBeTruthy();
  });

  it("Back returns to the previous step and keeps the selection", async () => {
    renderApp();
    click(btn("Thursday, September 24"));
    click(btn("Next"));
    click(btn("1:00 PM"));
    click(btn("Back"));
    expect((await screen.findByRole("button", { name: "Thursday, September 24" })).getAttribute("aria-pressed")).toBe("true");
  });
});

describe("browser history", () => {
  it("the browser Back and Forward buttons move between steps", async () => {
    renderApp();
    click(btn("Thursday, September 24"));
    click(btn("Next"));
    click(btn("1:00 PM"));
    click(btn("Next"));
    await screen.findByLabelText("Name");

    window.history.back();
    expect((await screen.findByRole("button", { name: "1:00 PM" })).getAttribute("aria-pressed")).toBe("true");

    window.history.back();
    expect(await screen.findByText("September 2026")).toBeTruthy();

    window.history.forward();
    expect(await screen.findByText("Thursday, September 24")).toBeTruthy(); // time step heading
  });

  it("Forward cannot skip a step whose data is missing", async () => {
    renderApp();
    click(btn("Thursday, September 24"));
    click(btn("Next"));
    click(btn("1:00 PM"));
    click(btn("Next"));
    await screen.findByLabelText("Name");
    click(btn("Next")); // invalid form: stays on step 3
    window.history.back();
    await screen.findByRole("button", { name: "1:00 PM" });
    window.history.back();
    await screen.findByText("September 2026");
    click(btn("Friday, September 25")); // new date clears the time
    window.history.forward();
    await waitFor(() => expect(screen.getByText("Friday, September 25")).toBeTruthy()); // step 2, not the form
    expect(screen.queryByLabelText("Name")).toBeNull();
  });

  it("Back from the confirmation starts a new booking instead of re-opening the old one", async () => {
    renderApp();
    await book({ time: "6:30 PM" });
    window.history.back();
    expect(await screen.findByText("September 2026")).toBeTruthy();
    expect(btn("Thursday, September 24").getAttribute("aria-pressed")).toBe("false");
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toHaveLength(1);
  });

  it("My bookings has a Back button that returns to the booking in progress", async () => {
    renderApp();
    click(btn("Thursday, September 24"));
    click(btn("Next"));
    click(btn("1:00 PM"));
    click(btn("My bookings"));
    expect(screen.getByText("You have no bookings yet.")).toBeTruthy();
    click(btn("Back"));
    expect((await screen.findByRole("button", { name: "1:00 PM" })).getAttribute("aria-pressed")).toBe("true");
  });
});

describe("language switch", () => {
  it("switches the whole UI to Russian and remembers the choice", () => {
    renderApp("en");
    click(btn("Русский"));
    expect(screen.getByText("Сентябрь 2026")).toBeTruthy();
    expect(btn("Далее")).toBeTruthy();
    expect(btn("24 сентября, четверг").disabled).toBe(false);
    expect(document.documentElement.lang).toBe("ru");
    expect(localStorage.getItem("atlas-lang")).toBe("ru");

    click(btn("24 сентября, четверг"));
    click(btn("Далее"));
    expect(btn("18:30")).toBeTruthy(); // 24-hour time in Russian
  });

  it("Russian plural forms in the bookings list", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: "1", number: "AT-1", date: "2026-09-30", time: "12:00", name: "Тест", guests: 1, status: "active" },
        { id: "2", number: "AT-2", date: "2026-09-30", time: "13:00", name: "Тест", guests: 5, status: "active" },
      ])
    );
    renderApp("ru");
    click(btn("Мои брони"));
    expect(screen.getByText(/· 1 гость$/)).toBeTruthy();
    expect(screen.getByText(/· 5 гостей$/)).toBeTruthy();
  });
});
