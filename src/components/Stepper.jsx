import Icon from "./ui/Icon";
import { useI18n } from "../i18n/I18nProvider";

const STEPS = ["date", "time", "details", "review"];

// Step indicator. On phones only the current step shows its label so everything fits in one row.
export default function Stepper({ step }) {
  const { t } = useI18n();

  return (
    <ol className="m-0 mb-4 flex list-none items-center p-0" aria-label={t("steps.label")}>
      {STEPS.map((id, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        const last = i === STEPS.length - 1;
        return (
          <li key={id} aria-current={active ? "step" : undefined} className={`flex items-center ${last ? "" : "flex-1"}`}>
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
                {t(`steps.${id}`)}
              </span>
            </span>
            {!last && <span className={`mx-3 h-px flex-1 transition-colors ${done ? "bg-gold" : "bg-edge"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
