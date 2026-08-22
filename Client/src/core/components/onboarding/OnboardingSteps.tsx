export type OnboardingStep = "president" | "club" | "draft";

const ONBOARDING_STEPS: { id: OnboardingStep; label: string }[] = [
  { id: "president", label: "01. Persona" },
  { id: "club", label: "02. Found Your Club" },
  { id: "draft", label: "03. Draft Your Squad" },
];

interface OnboardingStepsProps {
  currentStep: OnboardingStep;
  className?: string;
}

export const OnboardingSteps = ({ currentStep, className = "" }: OnboardingStepsProps) => {
  const currentIndex = ONBOARDING_STEPS.findIndex((step) => step.id === currentStep);
  const progressPercent = ((currentIndex + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <div className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}>
      <div className="h-1 overflow-hidden rounded-full bg-surface-container-highest">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="flex justify-between gap-2 text-[10px] text-label-caps sm:text-label-caps">
        {ONBOARDING_STEPS.map((step, index) => {
          let stepClassName = "text-on-surface-variant/60";

          if (index === currentIndex) {
            stepClassName = "text-primary";
          }
          else if (index < currentIndex) {
            stepClassName = "text-on-surface-variant";
          }

          return (
            <span key={step.id} className={stepClassName}>
              {step.label}
            </span>
          );
        })}
      </div>
    </div>
  );
};
