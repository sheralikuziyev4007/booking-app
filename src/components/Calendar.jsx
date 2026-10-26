import DayCell from "./DayCell";
import Button from "./ui/Button";
import Icon from "./ui/Icon";
import StepHeading from "./ui/StepHeading";
import { WEEKDAYS, MONTHS, dateKey, sameDay, isClosed, isPastSlot } from "../utils/dateHelpers";
import { ALL_SLOTS } from "../utils/generateTimeSlots";

export default function Calendar({ month, onMonthChange, selectedDate, onSelect, occupancyMap }) {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // неделя начинается с понедельника
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d));

  const canGoBack = !(month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth());

  return (
    <div>
      <StepHeading title="Выберите день" hint="Понедельник — выходной, эти даты недоступны." />

      <div className="rounded-2xl border border-edge bg-surface p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between">
          <Button
            variant="icon"
            size="icon"
            aria-label="Предыдущий месяц"
            disabled={!canGoBack}
            onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          >
            <Icon name="chevronLeft" />
          </Button>
          <span className="font-display text-2xl font-semibold text-ink">
            {MONTHS[month.getMonth()]} {month.getFullYear()}
          </span>
          <Button
            variant="icon"
            size="icon"
            aria-label="Следующий месяц"
            onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          >
            <Icon name="chevronRight" />
          </Button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((w) => (
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
            const occupied = occupancyMap[key] || [];
            const fullyBooked = !closed && !past && occupied.length >= ALL_SLOTS.length;
            // Сегодня, но все слоты уже прошли (например, после 22:00)
            const dayOver = isToday && ALL_SLOTS.every((t) => isPastSlot(key, t, now));
            const disabled = past || closed || fullyBooked || dayOver;

            let title = "";
            if (closed) title = "Понедельник — выходной день";
            else if (fullyBooked) title = "Все места на эту дату заняты";
            else if (dayOver) title = "На сегодня время бронирования закончилось";
            else if (past) title = "Дата уже прошла";

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
          доступно
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-gold" />
          выбрано
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border border-dashed border-[#566A5D]" />
          закрыто / занято
        </div>
      </div>
    </div>
  );
}
