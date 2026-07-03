interface ProgressBarProps {
  value: number;
  max?: number;
  colorClassName?: string;
}

export const ProgressBar = ({
  value,
  max = 100,
  colorClassName = "bg-primary-container",
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="h-1 overflow-hidden rounded-sm bg-background">
      <div
        className={`h-full ${colorClassName}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
