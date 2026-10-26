// Текстовое поле или textarea (as="textarea") с подсветкой ошибки.
// error — текст ошибки; id нужен, чтобы связать поле с сообщением через aria-describedby.

export default function Input({ as: Tag = "input", id, error, className = "", ...props }) {
  return (
    <Tag
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={`box-border w-full rounded-xl border bg-surface2 px-4 py-2 font-body text-base text-ink outline-none
        transition-colors placeholder:text-muted/55 focus:border-gold focus:ring-1 focus:ring-gold/40 sm:text-[15px]
        ${error ? "border-danger" : "border-edge"} ${className}`}
      {...props}
    />
  );
}
