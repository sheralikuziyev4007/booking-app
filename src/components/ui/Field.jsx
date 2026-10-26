// Подпись + содержимое поля + сообщение об ошибке.
// htmlFor должен совпадать с id элемента внутри — так подпись читается скринридерами.
import Icon from "./Icon";

export default function Field({ label, htmlFor, error, children }) {
  return (
    <div className="mb-3">
      <label htmlFor={htmlFor} className="mb-1 block text-[13px] font-medium text-muted">
        {label}
      </label>
      {children}
      {error && (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} className="mt-1.5 flex items-start gap-1.5 text-[13px] text-danger">
          <Icon name="alert" size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
