import Button from "./ui/Button";
import { formatDateHuman } from "../utils/dateHelpers";
import { guestsWord } from "../utils/plural";

function statusOf(booking) {
  if (booking.status === "cancelled") return { label: "Отменена", color: "text-muted border-edge" };
  const dt = new Date(`${booking.date}T${booking.time}`);
  if (dt < new Date()) return { label: "Прошедшая", color: "text-muted border-edge" };
  return { label: "Предстоящая", color: "text-success border-success/50 bg-successBg" };
}

// Карточка одной брони в списке «Мои брони».
export default function BookingCard({ booking, onCancel }) {
  const st = statusOf(booking);
  const upcoming = st.label === "Предстоящая";

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl border border-edge bg-surface px-5 py-4 ${
        upcoming ? "" : "opacity-70"
      }`}
    >
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2.5">
          <span className="text-xs tabular-nums text-muted">{booking.number}</span>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${st.color}`}>{st.label}</span>
        </div>
        <p className="m-0 font-display text-2xl font-semibold leading-tight text-ink">{formatDateHuman(booking.date)}</p>
        <p className="m-0 mt-1 text-sm tabular-nums text-ink/85">
          {booking.time} · {booking.guests} {guestsWord(booking.guests)}
        </p>
        <p className="m-0 mt-0.5 truncate text-[13px] text-muted">{booking.name}</p>
      </div>
      {upcoming && (
        <Button variant="danger" size="sm" className="shrink-0" onClick={() => onCancel(booking.id)}>
          Отменить
        </Button>
      )}
    </div>
  );
}
