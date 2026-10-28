import { dateKey } from "../utils/dateHelpers";
import { useI18n } from "../i18n/I18nProvider";

// One calendar cell. It does not decide availability itself — Calendar does.
export default function DayCell({ date, selected, disabled, isToday, title, onSelect }) {
  const { formatDate } = useI18n();
  const key = dateKey(date);

  const stateClasses = selected
    ? "bg-gold text-[#1B1405] font-semibold"
    : disabled
    ? "text-[#566A5D] cursor-not-allowed"
    : "bg-surface2 text-ink cursor-pointer hover:bg-edge";

  return (
    <button
      type="button"
      title={title}
      aria-label={formatDate(key)}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect(key)}
      className={`relative mx-auto aspect-square w-full max-w-10 rounded-full text-sm tabular-nums transition-colors
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold
        ${stateClasses}`}
    >
      {date.getDate()}
      {isToday && (
        <span
          className={`absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${selected ? "bg-[#1B1405]" : "bg-gold"}`}
        />
      )}
    </button>
  );
}
