import Button from "./ui/Button";
import { formatDateHuman } from "../utils/dateHelpers";
import { guestsWord } from "../utils/plural";

function statusOf(booking) {
  if (booking.status === "cancelled") return { label: "Отменена", color: "text-muted border-muted" };
  const dt = new Date(`${booking.date}T${booking.time}`);
  if (dt < new Date()) return { label: "Прошедшая", color: "text-muted border-muted" };
  return { label: "Предстоящая", color: "text-success border-success" };
}

// Карточка одной брони в списке «Мои брони».
export default function BookingCard({ booking, onCancel }) {
  const st = statusOf(booking);

  return (
    <div className="bg-surface2 rounded-lg px-4 py-3.5 flex justify-between items-center gap-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-gold">{booking.number}</span>
          <span className={`text-[11px] rounded-full border px-2 py-0.5 ${st.color}`}>{st.label}</span>
        </div>
        <p className="text-[13px] text-ink m-0">
          {formatDateHuman(booking.date)} · {booking.time} · {booking.guests} {guestsWord(booking.guests)}
        </p>
        <p className="text-xs text-muted mt-0.5">{booking.name}</p>
      </div>
      {st.label === "Предстоящая" && (
        <Button variant="danger" size="sm" className="shrink-0" onClick={() => onCancel(booking.id)}>
          Отменить
        </Button>
      )}
    </div>
  );
}
