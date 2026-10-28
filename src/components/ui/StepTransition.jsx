// Smooth step entrance. Changing `key` remounts the block, so the animation replays on every step.

export default function StepTransition({ stepKey, children }) {
  return (
    <div key={stepKey} className="animate-step-in">
      {children}
    </div>
  );
}
