import { useId } from "react";
import Button from "./ui/Button";
import Icon from "./ui/Icon";
import { useI18n } from "../i18n/I18nProvider";
import { RESTAURANT } from "../config/restaurant";

// Party size stepper: − [n] +
export default function GuestPicker({ value, onChange }) {
  const { t, plural } = useI18n();
  const id = useId();
  const { minGuests: min, maxGuests: max } = RESTAURANT;

  return (
    <div className="mb-3">
      <span id={`${id}-label`} className="mb-1 block text-[13px] font-medium text-muted">
        {t("time.partySize")}
      </span>
      <div role="group" aria-labelledby={`${id}-label`} className="flex items-center gap-4">
        <Button
          variant="iconFilled"
          size="icon"
          aria-label={t("time.decrease")}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Icon name="minus" />
        </Button>
        <output aria-live="polite" className="w-9 text-center font-display text-4xl font-semibold leading-none tabular-nums">
          {value}
        </output>
        <Button
          variant="iconFilled"
          size="icon"
          aria-label={t("time.increase")}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <Icon name="plus" />
        </Button>
        <span className="text-[13px] text-muted">
          {plural("guests", value)} ({t("time.max", { max })})
        </span>
      </div>
    </div>
  );
}
