import DayCell from "./DayCell";
import Button from "./ui/Button";
import Icon from "./ui/Icon";
import StepHeading from "./ui/StepHeading";
import { useI18n } from "../i18n/I18nProvider";
import { dateKey, sameDay, isClosed, isPastSlot } from "../utils/dateHelpers";
import { ALL_SLOTS } from "../utils/generateTimeSlots";
import { RESTAURANT } from "../config/restaurant";

// findTable(date, time, guests) → seat count | null. A day is full when no upcoming slot has a table even for one guest.
export default function Calendar({ month, onMonthChange, selectedDate, onSelect, findTable }) {
  const { t, locale } = useI18n();
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // week starts on Monday
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d));

  const canGoBack = !(month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth());

  return (
    <div>
      <StepHeading title={t("calendar.title")} hint={t("calendar.hint")} />

      <div className="rounded-2xl border border-edge bg-surface p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between">
          <Button
            variant="icon"
            size="icon"
            aria-label={t("calendar.prevMonth")}
            disabled={!canGoBack}
            onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          >
            <Icon name="chevronLeft" />
          </Button>
          <span aria-live="polite" className="font-display text-2xl font-semibold text-ink">
            {locale.months[month.getMonth()]} {month.getFullYear()}
          </span>
          <Button
            variant="icon"
            size="icon"
            aria-label={t("calendar.nextMonth")}
            onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          >
            <Icon name="chevronRight" />
          </Button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1">
          {locale.weekdaysShort.map((w) => (
            <div key={w} className="py-0.5 text-center text-xs font-medium text-muted">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const key = dateKey(d);
            const isToday = sameDay(d, today);
            const past = d < today;
            const closed = isClosed(d);

            let dayOver = false;
            let fullyBooked = false;
            if (!past && !closed) {
              const upcoming = ALL_SLOTS.filter((time) => !isPastSlot(key, time, now));
              dayOver = upcoming.length === 0;
              fullyBooked = !dayOver && upcoming.every((time) => findTable(key, time, RESTAURANT.minGuests) === null);
            }
            const disabled = past || closed || fullyBooked || dayOver;

            let title = "";
            if (closed) title = t("calendar.closed");
            else if (fullyBooked) title = t("calendar.fullyBooked");
            else if (dayOver) title = t("calendar.dayOver");
            else if (past) title = t("calendar.past");

            return (
              <DayCell
                key={i}
                date={d}
                title={title}
                disabled={disabled}
                isToday={isToday}
                selected={selectedDate === key}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-surface2 ring-1 ring-edge" />
          {t("calendar.legendAvailable")}
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-gold" />
          {t("calendar.legendSelected")}
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border border-dashed border-[#566A5D]" />
          {t("calendar.legendUnavailable")}
        </div>
      </div>
    </div>
  );
}
