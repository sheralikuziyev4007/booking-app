// Маска узбекского номера: +998 XX XXX XX XX (9 цифр после кода страны).
// Лишние символы отбрасываются, ввод длиннее номера обрезается.

export const PHONE_NATIONAL_LENGTH = 9;

// Только национальные цифры (без кода 998), максимум 9
export function phoneDigits(raw) {
  let digits = String(raw ?? "").replace(/\D/g, "");
  if (digits.startsWith("998")) digits = digits.slice(3);
  return digits.slice(0, PHONE_NATIONAL_LENGTH);
}

export function formatPhone(raw) {
  const d = phoneDigits(raw);
  if (!d) return "";
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return `+998 ${parts.join(" ")}`;
}

// Номер введён полностью: все 9 цифр
export function isCompletePhone(raw) {
  return phoneDigits(raw).length === PHONE_NATIONAL_LENGTH;
}
