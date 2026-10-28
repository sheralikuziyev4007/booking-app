import TimeSlotButton from "./TimeSlotButton";
import GuestPicker from "./GuestPicker";
import StepHeading from "./ui/StepHeading";
import { useI18n } from "../i18n/I18nProvider";
import { ALL_SLOTS } from "../utils/generateTimeSlots";
import { isPastSlot } from "../utils/dateHelpers";
import { RESTAURANT } from "../config/restaurant";

// Before 17:00 — lunch, from 17:00 — dinner
const GROUPS = [
  { id: "lunch", match: (time) => time < "17:00" },
  { id: "dinner", match: (time) => time >= "17:00" },
];

export default function TimeSlotGrid({ date, guests, onGuestsChange, selectedTime, onSelect, findTable }) {
  const { t, plural, formatDate } = useI18n();
  const now = new Date();
  const hours = RESTAURANT.seatingMinutes / 60;

  // A slot is unavailable when it has passed (today) or no table fits this party for the whole seating
  const slots = ALL_SLOTS.map((time) => ({
    time,
    disabled: isPastSlot(date, time, now) || findTable(date, time, guests) === null,
  }));
  const noneLeft = slots.every((s) => s.disabled);

  return (
    <div>
      <StepHeading title={formatDate(date)} hint={t("time.hint")} />

      <GuestPicker value={guests} onChange={onGuestsChange} />

      <div className="space-y-3">
        {GROUPS.map(({ id, match }) => (
          <section key={id}>
            <h3 className="m-0 mb-1.5 text-[13px] font-medium text-muted">{t(`time.${id}`)}</h3>
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

      {noneLeft ? (
        <p className="mt-2 text-[13px] text-danger">{t("time.noneLeft")}</p>
      ) : (
        <p className="mt-2 text-xs text-muted">{t("time.seatingNote", { duration: `${hours} ${plural("hours", hours)}` })}</p>
      )}
    </div>
  );
}
