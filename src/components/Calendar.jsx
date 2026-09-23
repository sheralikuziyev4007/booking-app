import DayCell from "./DayCell";
import Button from "./ui/Button";
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
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="icon"
          size="icon"
          aria-label="Предыдущий месяц"
          disabled={!canGoBack}
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
        >
          ‹
        </Button>
        <span className="font-display text-lg text-ink">
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </span>
        <Button
          variant="icon"
          size="icon"
          aria-label="Следующий месяц"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
        >
          ›
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-[11px] text-muted py-1">
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

      <div className="flex gap-4 mt-3.5 text-[11px] text-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-[3px] bg-surface2" />
          доступно
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-[3px] border border-edge" />
          закрыто / занято
        </div>
      </div>
    </div>
  );
}
