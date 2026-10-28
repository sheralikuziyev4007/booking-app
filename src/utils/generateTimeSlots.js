// Seating time grid from the restaurant config (12:00–22:00 every 30 minutes by default)
import { RESTAURANT } from "../config/restaurant";

export function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function fromMinutes(total) {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function generateTimeSlots(first = RESTAURANT.firstSeating, last = RESTAURANT.lastSeating, step = RESTAURANT.slotStepMinutes) {
  const slots = [];
  for (let t = toMinutes(first); t <= toMinutes(last); t += step) slots.push(fromMinutes(t));
  return slots;
}

export const ALL_SLOTS = generateTimeSlots();
