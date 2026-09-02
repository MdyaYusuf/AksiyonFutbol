import { Link } from "react-router-dom";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";

interface MatchDayContextBarProps {
  matchWeek: number;
  venueLabel: "Home" | "Away";
  opponentName: string;
  kickoffLabel: string;
}

export const MatchDayContextBar = ({
  matchWeek,
  venueLabel,
  opponentName,
  kickoffLabel,
}: MatchDayContextBarProps) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-4 md:flex-row md:items-center">
      <div className="flex items-center gap-3">
        <MaterialIcon name="event" className="text-primary" />
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          Match Week {matchWeek} • {venueLabel} vs {opponentName} • Kickoff {kickoffLabel}
        </h2>
      </div>
      <div className="flex items-center gap-3 rounded border border-outline-variant bg-surface-container px-4 py-2">
        <MaterialIcon name="tune" className="text-sm text-on-surface-variant" />
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Using club default lineup
        </span>
        <Link
          to="/app/tactics"
          className="ml-2 font-label-caps text-label-caps text-primary hover:underline"
        >
          Edit defaults
        </Link>
      </div>
    </div>
  );
};
