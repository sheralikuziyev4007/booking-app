// Text input or textarea (as="textarea") with error highlighting.
// The id links the control to its error or hint text (rendered by Field) via aria-describedby.

export default function Input({ as: Tag = "input", id, error, hint, className = "", ...props }) {
  const describedBy = id ? (error ? `${id}-error` : hint ? `${id}-hint` : undefined) : undefined;
  return (
    <Tag
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      className={`box-border w-full rounded-xl border bg-surface2 px-4 py-2 font-body text-base text-ink outline-none
        transition-colors placeholder:text-muted/55 focus:border-gold focus:ring-1 focus:ring-gold/40 sm:text-[15px]
        ${error ? "border-danger" : "border-edge"} ${className}`}
      {...props}
    />
  );
}
