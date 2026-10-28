import Button from "./ui/Button";
import Row from "./ui/Row";
import { useI18n } from "../i18n/I18nProvider";

// Success screen: the booking as a ticket with a tear-off stub and the booking number.
export default function BookingSuccess({ booking, onGoToBookings, onNewBooking }) {
  const { t, formatDate, formatTime } = useI18n();

  return (
    <div className="py-1 text-center">
      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-successBg text-success">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m5 12.5 4.5 4.5L19 7.5" pathLength="1" strokeDasharray="1" className="animate-draw-check" />
        </svg>
      </div>
      <h2 className="m-0 font-display text-[38px] font-semibold leading-none text-ink">{t("success.title")}</h2>
      <p className="mb-4 mt-1.5 text-sm text-muted">{t("success.hint")}</p>

      <div className="relative mx-auto max-w-[380px] animate-ticket-in overflow-hidden rounded-2xl border border-edge bg-surface text-left">
        <div className="selvedge-x h-2" />

        <div className="px-6 pb-2 pt-3">
          <Row label={t("fields.date")} value={formatDate(booking.date)} />
          <Row label={t("fields.time")} value={formatTime(booking.time)} />
          <Row label={t("fields.name")} value={booking.name} />
          <Row label={t("fields.guests")} value={booking.guests} />
          {booking.tableSize && <Row label={t("fields.table")} value={t("table", { seats: booking.tableSize })} />}
        </div>

        {/* Tear-off line with side notches */}
        <div className="relative border-t border-dashed border-edge">
          <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full border border-edge bg-bg" />
          <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full border border-edge bg-bg" />
        </div>

        <div className="px-6 pb-4 pt-3 text-center">
          <p className="m-0 text-[13px] text-muted">{t("success.number")}</p>
          <p className="m-0 mt-1 font-display text-[28px] font-semibold tabular-nums tracking-wide text-gold">{booking.number}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <Button variant="secondary" onClick={onNewBooking}>
          {t("success.newBooking")}
        </Button>
        <Button onClick={onGoToBookings}>{t("header.myBookings")}</Button>
      </div>
    </div>
  );
}
