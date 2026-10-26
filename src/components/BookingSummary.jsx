import Row from "./ui/Row";
import StepHeading from "./ui/StepHeading";
import { formatDateHuman } from "../utils/dateHelpers";

export default function BookingSummary({ date, time, formData }) {
  return (
    <div>
      <StepHeading title="Проверьте данные брони" hint="Убедитесь, что всё верно, перед подтверждением" />

      <div className="rounded-2xl border border-edge bg-surface px-5">
        <Row label="Дата" value={formatDateHuman(date)} />
        <Row label="Время" value={time} />
        <Row label="Имя" value={formData.name} />
        <Row label="Телефон" value={formData.phone} />
        <Row label="Email" value={formData.email} />
        <Row label="Гостей" value={formData.guests} />
        {formData.comment && <Row label="Комментарий" value={formData.comment} />}
      </div>
    </div>
  );
}
