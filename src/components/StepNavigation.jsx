import Button from "./ui/Button";
import Icon from "./ui/Icon";
import { useI18n } from "../i18n/I18nProvider";

// Bottom bar for steps 1–4: Back / Next / Confirm booking.
export default function StepNavigation({ step, nextDisabled, onBack, onNext, onConfirm }) {
  const { t } = useI18n();

  return (
    <div className="mt-3 flex items-center justify-between border-t border-edge pt-3">
      <Button
        variant="secondary"
        onClick={onBack}
        disabled={step === 1}
        className={step === 1 ? "invisible" : "visible"}
      >
        {t("nav.back")}
      </Button>
      {step < 4 ? (
        <Button onClick={onNext} disabled={nextDisabled}>
          {t("nav.next")}
        </Button>
      ) : (
        <Button onClick={onConfirm}>
          <Icon name="check" size={16} />
          {t("nav.confirm")}
        </Button>
      )}
    </div>
  );
}
