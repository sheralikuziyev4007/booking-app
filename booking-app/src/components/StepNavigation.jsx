import Button from "./ui/Button";

// Нижняя панель шагов 1–4: «Назад» / «Далее» / «Подтвердить бронирование».
export default function StepNavigation({ step, nextDisabled, onBack, onNext, onConfirm }) {
  return (
    <div className="flex justify-between mt-6 border-t border-edge pt-[18px]">
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
        <Button onClick={onConfirm}>Подтвердить бронирование</Button>
      )}
    </div>
  );
}
