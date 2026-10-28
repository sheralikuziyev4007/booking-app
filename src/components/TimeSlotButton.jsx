import { useI18n } from "../i18n/I18nProvider";

// One seating time button ("6:30 PM" / «18:30»). `time` stays in 24h "HH:MM" internally.
export default function TimeSlotButton({ time, selected, disabled, onSelect }) {
  const { formatTime } = useI18n();
  const stateClasses = selected
    ? "bg-gold border-gold text-[#1B1405] font-semibold"
    : disabled
    ? "bg-transparent border-transparent text-[#566A5D] line-through cursor-not-allowed"
    : "bg-surface2 border-edge text-ink cursor-pointer hover:border-gold";

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={() => onSelect(time)}
      className={`whitespace-nowrap rounded-xl border px-1 py-2 text-sm tabular-nums transition-colors
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold
        ${stateClasses}`}
    >
      {formatTime(time)}
    </button>
  );
}
