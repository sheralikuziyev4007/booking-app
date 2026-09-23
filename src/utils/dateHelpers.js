// Вспомогательные функции для работы с датами

export const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
export const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

// Родительный падеж — для дат вида «23 сентября»
export const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

export function pad(n) {
  return String(n).padStart(2, "0");
}

export function dateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function sameDay(a, b) {
  return dateKey(a) === dateKey(b);
}

// Понедельник — выходной день ресторана
export function isClosed(d) {
  return d.getDay() === 1;
}

// Слот уже прошёл (актуально для сегодняшней даты).
// Строка вида "2026-09-23T14:30" без часового пояса трактуется как локальное время.
export function isPastSlot(dateStr, time, now = new Date()) {
  return new Date(`${dateStr}T${time}`) <= now;
}

export function formatDateHuman(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const days = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
  return `${d} ${MONTHS_GENITIVE[m - 1]}, ${days[dt.getDay()]}`;
}

export function genBookingNumber() {
  const rnd = Math.floor(1000 + Math.random() * 9000);
  const d = new Date();
  return `АТ-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${rnd}`;
}
