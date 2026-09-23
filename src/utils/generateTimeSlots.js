// Генерация сетки временных слотов ресторана (12:00–22:00, шаг 30 минут)

export function generateTimeSlots(startHour = 12, endHour = 22, stepMinutes = 30) {
  const slots = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      if (h === endHour && m > 0) continue;
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

export const ALL_SLOTS = generateTimeSlots();
