import Button from "./ui/Button";
import { useI18n } from "../i18n/I18nProvider";

const STATUS_STYLES = {
  upcoming: "text-success border-success/50 bg-successBg",
  past: "text-muted border-edge",
  cancelled: "text-muted border-edge",
};

export function bookingStatus(booking, now = new Date()) {
  if (booking.status === "cancelled") return "cancelled";
  return new Date(`${booking.date}T${booking.time}`) < now ? "past" : "upcoming";
}

// One booking in the "My bookings" list.
export default function BookingCard({ booking, onCancel }) {
  const { t, plural, formatDate, formatTime } = useI18n();
  const status = bookingStatus(booking);
  const upcoming = status === "upcoming";

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl border border-edge bg-surface px-5 py-4 ${
        upcoming ? "" : "opacity-70"
      }`}
    >
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2.5">
          <span className="text-xs tabular-nums text-muted">{booking.number}</span>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
            {t(`list.${status}`)}
          </span>
        </div>
        <p className="m-0 font-display text-2xl font-semibold leading-tight text-ink">{formatDate(booking.date)}</p>
        <p className="m-0 mt-1 text-sm tabular-nums text-ink/85">
          {formatTime(booking.time)} · {booking.guests} {plural("guests", booking.guests)}
        </p>
        <p className="m-0 mt-0.5 truncate text-[13px] text-muted">{booking.name}</p>
      </div>
      {upcoming && (
        <Button variant="danger" size="sm" className="shrink-0" onClick={() => onCancel(booking.id)}>
          {t("list.cancel")}
        </Button>
      )}
    </div>
  );
}
