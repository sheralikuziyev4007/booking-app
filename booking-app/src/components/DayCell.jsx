import { dateKey, formatDateHuman } from "../utils/dateHelpers";

// Одна ячейка календаря. Сама не решает, доступна ли дата, — это делает Calendar.
export default function DayCell({ date, selected, disabled, isToday, title, onSelect }) {
  const key = dateKey(date);

  const stateClasses = selected
    ? "bg-gold border-gold text-[#20180A]"
    : disabled
    ? "bg-transparent border-transparent text-[#4C594F] opacity-55 line-through cursor-not-allowed"
    : "bg-surface2 border-transparent text-ink cursor-pointer";

  return (
    <button
      type="button"
      title={title}
      aria-label={formatDateHuman(key)}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect(key)}
      className={`relative aspect-square rounded-md text-[13px] font-mono border
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold
        ${stateClasses}`}
    >
      {date.getDate()}
      {isToday && !selected && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />
      )}
    </button>
  );
}
