import Button from "./ui/Button";

export default function Header({ showBookingsButton, onOpenBookings }) {
  return (
    <header className="mb-3 flex min-h-[38px] items-center justify-between gap-4">
      <p className="m-0 text-sm text-muted">Бронирование столика</p>
      {showBookingsButton && (
        <Button variant="secondary" size="sm" onClick={onOpenBookings}>
          Мои брони
        </Button>
      )}
    </header>
  );
}
