// Booking form validation. Returns error codes; components translate them via t(`errors.${code}`).
import { isValidPhone } from "./formatPhone";
import { RESTAURANT } from "../config/restaurant";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateBookingForm(formData) {
  const errors = {};

  if (formData.name.trim().length < 2) errors.name = "nameShort";
  if (!isValidPhone(formData.phone)) errors.phone = "phoneInvalid";
  if (!EMAIL_RE.test(formData.email.trim())) errors.email = "emailInvalid";
  if (formData.guests < RESTAURANT.minGuests || formData.guests > RESTAURANT.maxGuests) errors.guests = "guestsRange";

  return errors;
}
