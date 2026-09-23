const STEPS = ["Дата", "Время", "Данные", "Проверка"];

export default function Stepper({ step }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-[30px] h-[30px] rounded-full flex items-center justify-center font-mono text-xs border transition-all
                  ${active ? "bg-gold border-gold text-[#20180A]" : done ? "border-gold text-gold" : "border-edge text-muted"}`}
              >
                {done ? "✓" : String(n).padStart(2, "0")}
              </div>
              <span className={`text-[11px] tracking-wide whitespace-nowrap ${active ? "text-gold" : "text-muted"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-[18px] ${done ? "bg-gold" : "bg-edge"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
