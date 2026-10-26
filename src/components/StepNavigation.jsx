import Button from "./ui/Button";
import Icon from "./ui/Icon";

// Нижняя панель шагов 1–4: «Назад» / «Далее» / «Подтвердить бронирование».
export default function StepNavigation({ step, nextDisabled, onBack, onNext, onConfirm }) {
  return (
    <div className="mt-3 flex items-center justify-between border-t border-edge pt-3">
      <Button
        variant="secondary"
        onClick={onBack}
        disabled={step === 1}
        className={step === 1 ? "invisible" : "visible"}
      >
        Назад
      </Button>
      {step < 4 ? (
        <Button onClick={onNext} disabled={nextDisabled}>
          Далее
        </Button>
      ) : (
        <Button onClick={onConfirm}>
          <Icon name="check" size={16} />
          Подтвердить бронирование
        </Button>
      )}
    </div>
  );
}
