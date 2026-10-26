import Button from "./ui/Button";
import BookingCard from "./BookingCard";

export default function MyBookingsList({ bookings, onCancel, onNewBooking }) {
  const sorted = [...bookings].sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));

  return (
    <div className="animate-step-in">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="m-0 font-display text-[30px] font-semibold leading-[1.05] text-ink">Мои брони</h2>
        <Button onClick={onNewBooking}>+ Новая бронь</Button>
      </div>

      {sorted.length === 0 && (
        <div className="rounded-2xl border border-dashed border-edge px-6 py-10 text-center">
          <p className="m-0 text-[15px] text-ink">У вас пока нет броней.</p>
          <p className="m-0 mt-1.5 text-[13px] text-muted">Выберите день и время — бронь появится здесь.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {sorted.map((b) => (
          <BookingCard key={b.id} booking={b} onCancel={onCancel} />
        ))}
      </div>
    </div>
  );
}
