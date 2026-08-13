interface ProgressBarProps {
  value: number;
  max?: number;
  colorClassName?: string;
  trackClassName?: string;
}

export const ProgressBar = ({
  value,
  max = 100,
  colorClassName = "bg-primary-container",
  trackClassName = "bg-background",
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`h-1 overflow-hidden rounded-sm ${trackClassName}`}>
      <div
        className={`h-full ${colorClassName}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
