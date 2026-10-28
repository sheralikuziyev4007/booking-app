// Step heading: large title + short hint below it.

export default function StepHeading({ title, hint }) {
  return (
    <div className="mb-3">
      <h2 className="m-0 font-display text-[30px] font-semibold leading-[1.05] text-ink">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}
