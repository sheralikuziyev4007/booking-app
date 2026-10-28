// Table availability. A booking holds one table for RESTAURANT.seatingMinutes from its start time.
// For a new party we look for the smallest table type that fits and still has a free table
// for the whole seating, so big tables are not wasted on couples while small ones are free.
import { RESTAURANT } from "../config/restaurant";
import { toMinutes } from "./generateTimeSlots";

const TABLES = [...RESTAURANT.tables].sort((a, b) => a.seats - b.seats);

// Smallest table type that can seat the party (used for bookings saved before tables existed)
export function tableSizeFor(guests, tables = TABLES) {
  return tables.find((t) => t.seats >= guests)?.seats ?? null;
}

// Two seatings overlap when their starts are closer than one seating length
export function seatingsOverlap(timeA, timeB, seatingMinutes = RESTAURANT.seatingMinutes) {
  return Math.abs(toMinutes(timeA) - toMinutes(timeB)) < seatingMinutes;
}

// Returns the seat count of the table to assign, or null when nothing fits.
// `bookings` may include cancelled ones — they are ignored here.
export function findFreeTable(bookings, date, time, guests, { tables = TABLES, seatingMinutes = RESTAURANT.seatingMinutes } = {}) {
  const used = {};
  for (const b of bookings) {
    if (b.status === "cancelled" || b.date !== date) continue;
    if (!seatingsOverlap(b.time, time, seatingMinutes)) continue;
    const size = b.tableSize ?? tableSizeFor(b.guests, tables);
    used[size] = (used[size] || 0) + 1;
  }
  const free = tables.find((t) => t.seats >= guests && (used[t.seats] || 0) < t.count);
  return free ? free.seats : null;
}
