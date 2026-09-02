import { MaterialIcon } from "@/core/components/ui/MaterialIcon";

interface MatchDayInjuryBannerProps {
  injuredCount: number;
}

export const MatchDayInjuryBanner = ({ injuredCount }: MatchDayInjuryBannerProps) => {
  if (injuredCount <= 0) {
    return null;
  }

  const playerLabel = injuredCount === 1 ? "player is" : "players are";

  return (
    <div className="flex items-start gap-3 rounded-lg border border-error/50 bg-error-container p-4">
      <MaterialIcon name="warning" className="text-error" />
      <div>
        <h3 className="font-body-sm text-body-sm font-bold text-on-error-container">
          {injuredCount} selected {playerLabel} injured
        </h3>
        <p className="mt-1 font-body-sm text-body-sm text-on-error-container/80">
          Review your starting XI and bench before confirming the match lineup.
        </p>
      </div>
    </div>
  );
};
