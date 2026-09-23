import TimeSlotButton from "./TimeSlotButton";
import { ALL_SLOTS } from "../utils/generateTimeSlots";
import { formatDateHuman, isPastSlot } from "../utils/dateHelpers";

export default function TimeSlotGrid({ date, selectedTime, onSelect, occupied }) {
  const now = new Date();
  // Слот недоступен, если он занят или время уже прошло (важно для сегодняшней даты)
  const slots = ALL_SLOTS.map((time) => ({
    time,
    disabled: occupied.includes(time) || isPastSlot(date, time, now),
  }));
  const noneLeft = slots.every((s) => s.disabled);

  return (
    <div>
      <p className="font-display text-[17px] text-ink mb-1">{formatDateHuman(date)}</p>
      <p className="text-xs text-muted mb-4">Выберите время посадки</p>

      <div className="grid grid-cols-4 gap-2">
        {slots.map(({ time, disabled }) => (
          <TimeSlotButton
            key={time}
            time={time}
            disabled={disabled}
            selected={selectedTime === time}
            onSelect={onSelect}
          />
        ))}
      </div>

      {noneLeft && (
        <p className="mt-3 text-xs text-danger">
          На эту дату свободных столиков не осталось. Пожалуйста, выберите другую дату.
        </p>
      )}
    </div>
  );
}
