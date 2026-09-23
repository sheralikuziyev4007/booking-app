import Row from "./ui/Row";
import { formatDateHuman } from "../utils/dateHelpers";

export default function BookingSummary({ date, time, formData }) {
  return (
    <div>
      <p className="font-display text-[17px] text-ink mb-1">Проверьте данные брони</p>
      <p className="text-xs text-muted mb-4">Убедитесь, что всё верно, перед подтверждением</p>

      <div className="bg-surface2 rounded-lg px-4">
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
