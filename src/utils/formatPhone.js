// International phone input: the user types any number with a country code,
// we format it as they type and validate it against libphonenumber metadata.
import { AsYouType, isValidPhoneNumber } from "libphonenumber-js/min";

// E.164 allows at most 15 digits
const MAX_DIGITS = 15;

export function phoneDigits(raw) {
  return String(raw ?? "").replace(/\D/g, "").slice(0, MAX_DIGITS);
}

// "998901234567" / "+998 (90) 123-45-67" → "+998 90 123 45 67"
export function formatPhone(raw) {
  const digits = phoneDigits(raw);
  if (!digits) return String(raw ?? "").trim().startsWith("+") ? "+" : "";
  return new AsYouType().input(`+${digits}`);
}

// onChange helper. Deleting a space or dash would be undone by re-formatting,
// so when only a formatting character disappeared we remove the digit before it.
export function nextPhoneValue(prev, raw) {
  if (raw.length < prev.length && phoneDigits(raw) === phoneDigits(prev)) {
    return formatPhone(phoneDigits(raw).slice(0, -1));
  }
  return formatPhone(raw);
}

export function isValidPhone(raw) {
  const digits = phoneDigits(raw);
  return digits.length > 0 && isValidPhoneNumber(`+${digits}`);
}
