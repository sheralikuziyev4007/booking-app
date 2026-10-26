// Строка «подпись — значение» для карточек проверки и подтверждения брони.

export default function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-6 border-b border-edge/70 py-2 text-sm last:border-b-0">
      <span className="text-muted">{label}</span>
      <span className="max-w-[62%] break-words text-right font-medium text-ink">{value}</span>
    </div>
  );
}
