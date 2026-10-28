// Date helpers. Language-specific formatting lives in src/i18n.
import { RESTAURANT } from "../config/restaurant";

export function pad(n) {
  return String(n).padStart(2, "0");
}

// Local date → "YYYY-MM-DD" (no UTC shift, unlike toISOString)
export function dateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function sameDay(a, b) {
  return dateKey(a) === dateKey(b);
}

// Restaurant's day off (Monday by default, see config)
export function isClosed(d) {
  return d.getDay() === RESTAURANT.closedWeekday;
}

// The slot has already started. "2026-09-23T14:30" without a timezone is parsed as local time.
export function isPastSlot(dateStr, time, now = new Date()) {
  return new Date(`${dateStr}T${time}`) <= now;
}

// "AT-20260924-4821": prefix, booking day, random part
export function genBookingNumber(now = new Date()) {
  const rnd = Math.floor(1000 + Math.random() * 9000);
  return `AT-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${rnd}`;
}
