// Подпись + содержимое поля + сообщение об ошибке.
// htmlFor должен совпадать с id элемента внутри — так подпись читается скринридерами.

export default function Field({ label, htmlFor, error, children }) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="block text-xs text-muted mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} className="text-xs text-danger mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
