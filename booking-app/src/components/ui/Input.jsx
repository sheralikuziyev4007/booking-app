// Текстовое поле или textarea (as="textarea") с подсветкой ошибки.
// error — текст ошибки; id нужен, чтобы связать поле с сообщением через aria-describedby.

export default function Input({ as: Tag = "input", id, error, className = "", ...props }) {
  return (
    <Tag
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={`w-full bg-surface2 border rounded-md px-3 py-2.5 text-sm text-ink outline-none font-body box-border
        focus:border-gold ${error ? "border-danger" : "border-edge"} ${className}`}
      {...props}
    />
  );
}
