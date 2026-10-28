import Row from "./ui/Row";
import StepHeading from "./ui/StepHeading";
import { useI18n } from "../i18n/I18nProvider";

export default function BookingSummary({ date, time, tableSize, formData }) {
  const { t, formatDate, formatTime } = useI18n();

  return (
    <div>
      <StepHeading title={t("review.title")} hint={t("review.hint")} />

      <div className="rounded-2xl border border-edge bg-surface px-5">
        <Row label={t("fields.date")} value={formatDate(date)} />
        <Row label={t("fields.time")} value={formatTime(time)} />
        <Row label={t("fields.guests")} value={formData.guests} />
        {tableSize && <Row label={t("fields.table")} value={t("table", { seats: tableSize })} />}
        <Row label={t("fields.name")} value={formData.name} />
        <Row label={t("fields.phone")} value={formData.phone} />
        <Row label={t("fields.email")} value={formData.email} />
        {formData.comment && <Row label={t("fields.comment")} value={formData.comment} />}
      </div>
    </div>
  );
}
