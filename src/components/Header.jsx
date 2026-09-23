import Button from "./ui/Button";

export default function Header({ showBookingsButton, onOpenBookings }) {
  return (
    <div className="flex justify-between items-end mb-6">
      <div>
        <p className="font-display text-2xl font-bold text-gold m-0">Ресторан «Атлас»</p>
        <p className="text-xs text-muted mt-0.5">Бронирование столика</p>
      </div>
      {showBookingsButton && (
        <Button variant="secondary" size="sm" onClick={onOpenBookings}>
          Мои брони
        </Button>
      )}
    </div>
  );
}
