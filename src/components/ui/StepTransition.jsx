// Плавное появление содержимого шага. key пересоздаёт блок при смене шага — анимация играет заново.

export default function StepTransition({ stepKey, children }) {
  return (
    <div key={stepKey} className="animate-step-in">
      {children}
    </div>
  );
}
