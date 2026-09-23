// Строка «подпись — значение» для карточек проверки и подтверждения брони.

export default function Row({ label, value }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-edge text-[13px] last:border-b-0">
      <span className="text-muted">{label}</span>
      <span className="text-ink font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
}
