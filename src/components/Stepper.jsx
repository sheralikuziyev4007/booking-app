import Icon from "./ui/Icon";

const STEPS = ["Дата", "Время", "Данные", "Проверка"];

// Индикатор шагов. На телефоне подпись показана только у текущего шага, чтобы всё помещалось в строку.
export default function Stepper({ step }) {
  return (
    <ol className="m-0 mb-4 flex list-none items-center p-0" aria-label="Шаги бронирования">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        const last = i === STEPS.length - 1;
        return (
          <li key={label} aria-current={active ? "step" : undefined} className={`flex items-center ${last ? "" : "flex-1"}`}>
            <span className="flex items-center gap-2.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-[13px] font-medium tabular-nums transition-colors
                  ${active ? "border-gold bg-gold text-[#1B1405]" : done ? "border-gold text-gold" : "border-edge text-muted"}`}
              >
                {done ? <Icon name="check" size={15} /> : n}
              </span>
              <span
                className={`whitespace-nowrap text-[13px] ${active ? "font-medium text-ink" : "hidden text-muted sm:inline"}`}
              >
                {label}
              </span>
            </span>
            {!last && <span className={`mx-3 h-px flex-1 transition-colors ${done ? "bg-gold" : "bg-edge"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
