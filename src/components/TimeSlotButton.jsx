// Кнопка одного временного слота (например, «18:30»).
export default function TimeSlotButton({ time, selected, disabled, onSelect }) {
  const stateClasses = selected
    ? "bg-gold border-gold text-[#20180A]"
    : disabled
    ? "bg-transparent border-edge text-[#4C594F] opacity-50 line-through cursor-not-allowed"
    : "bg-surface2 border-edge text-ink cursor-pointer";

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={() => onSelect(time)}
      className={`py-2.5 rounded-md font-mono text-[13px] border
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold
        ${stateClasses}`}
    >
      {time}
    </button>
  );
}
