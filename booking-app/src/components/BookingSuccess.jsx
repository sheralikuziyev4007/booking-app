import Button from "./ui/Button";
import Row from "./ui/Row";
import { formatDateHuman } from "../utils/dateHelpers";

export default function BookingSuccess({ booking, onGoToBookings, onNewBooking }) {
  return (
    <div className="text-center py-2">
      <div className="w-[52px] h-[52px] rounded-full bg-successBg text-success flex items-center justify-center text-2xl mx-auto mb-4">
        ✓
      </div>
      <p className="font-display text-xl text-ink mb-1">Бронь подтверждена</p>
      <p className="text-[13px] text-muted mb-6">Мы ждём вас в указанное время</p>

      <div className="max-w-[320px] mx-auto bg-surface2 rounded-lg border border-dashed border-goldDim px-5 py-5 text-left">
        <Row label="Номер брони" value={booking.number} />
        <Row label="Дата" value={formatDateHuman(booking.date)} />
        <Row label="Время" value={booking.time} />
        <Row label="Имя" value={booking.name} />
        <Row label="Гостей" value={booking.guests} />
      </div>

      <div className="flex gap-2.5 justify-center mt-6">
        <Button variant="secondary" onClick={onNewBooking}>
          Новая бронь
        </Button>
        <Button onClick={onGoToBookings}>Мои брони</Button>
      </div>
    </div>
  );
}
