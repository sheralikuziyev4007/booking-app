import Button from "./ui/Button";
import BookingCard from "./BookingCard";

export default function MyBookingsList({ bookings, onCancel, onNewBooking }) {
  const sorted = [...bookings].sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <p className="font-display text-[19px] text-ink">Мои брони</p>
        <Button onClick={onNewBooking}>+ Новая бронь</Button>
      </div>

      {sorted.length === 0 && <p className="text-[13px] text-muted">У вас пока нет броней.</p>}

      <div className="flex flex-col gap-2.5">
        {sorted.map((b) => (
          <BookingCard key={b.id} booking={b} onCancel={onCancel} />
        ))}
      </div>
    </div>
  );
}
