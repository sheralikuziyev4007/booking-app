// Валидация полей формы бронирования

export const PHONE_RE = /^[+]?[0-9\s().-]{9,17}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateBookingForm(formData) {
  const errors = {};

  if (!formData.name.trim() || formData.name.trim().length < 2) {
    errors.name = "Введите имя (минимум 2 символа).";
  }
  if (!PHONE_RE.test(formData.phone.trim())) {
    errors.phone = "Введите корректный номер телефона.";
  }
  if (!EMAIL_RE.test(formData.email.trim())) {
    errors.email = "Введите корректный email.";
  }
  if (formData.guests < 1 || formData.guests > 10) {
    errors.guests = "Количество гостей должно быть от 1 до 10.";
  }

  return errors;
}
