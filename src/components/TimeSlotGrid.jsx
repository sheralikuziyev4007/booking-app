import TimeSlotButton from "./TimeSlotButton";
import StepHeading from "./ui/StepHeading";
import { ALL_SLOTS } from "../utils/generateTimeSlots";
import { formatDateHuman, isPastSlot } from "../utils/dateHelpers";

// До 17:00 — обед, с 17:00 — ужин
const GROUPS = [
  { label: "Обед", match: (t) => t < "17:00" },
  { label: "Ужин", match: (t) => t >= "17:00" },
];

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
      <StepHeading title={formatDateHuman(date)} hint="Выберите время посадки" />

      <div className="space-y-3">
        {GROUPS.map(({ label, match }) => (
          <section key={label}>
            <h3 className="m-0 mb-1.5 text-[13px] font-medium text-muted">{label}</h3>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {slots
                .filter((s) => match(s.time))
                .map(({ time, disabled }) => (
                  <TimeSlotButton
                    key={time}
                    time={time}
                    disabled={disabled}
                    selected={selectedTime === time}
                    onSelect={onSelect}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>

      {noneLeft && (
        <p className="mt-2 text-[13px] text-danger">
          На эту дату свободных столиков не осталось. Пожалуйста, выберите другую дату.
        </p>
      )}
    </div>
  );
}
