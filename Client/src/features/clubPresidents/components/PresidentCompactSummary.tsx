import { Link } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { LegitimacyInfamyMeters } from "./LegitimacyInfamyMeters";
import { PresidentAttributesPanel } from "./PresidentAttributesPanel";

export interface PresidentCompactSummaryData {
  name: string;
  title?: string | null;
  reputationPoints: number;
  infamyPoints: number;
  maxLegitimacy?: number;
  maxInfamy?: number;
  charisma: number;
  authority: number;
  integrity: number;
  cunning: number;
  connections: number;
}

interface PresidentCompactSummaryProps {
  president: PresidentCompactSummaryData;
  className?: string;
  showAttributes?: boolean;
  showUnlockBadges?: boolean;
  showProfileLink?: boolean;
}

export const PresidentCompactSummary = ({
  president,
  className = "",
  showAttributes = true,
  showUnlockBadges = true,
  showProfileLink = true,
}: PresidentCompactSummaryProps) => {
  const title = president.title?.trim() || "Club President";

  return (
    <div
      className={[
        "flex h-full flex-col rounded-lg border border-outline-variant bg-surface-container-high p-4",
        className,
      ].join(" ")}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-label-caps text-label-caps text-on-surface-variant">
            President
          </div>
          <div className="truncate font-body-sm text-body-sm font-semibold text-on-surface">
            {president.name}
          </div>
          <div className="truncate text-body-sm text-on-surface-variant">{title}</div>
        </div>
        {showProfileLink ? (
          <Link
            to="/app/president"
            className="shrink-0 text-body-sm font-semibold text-primary hover:underline"
            aria-label="Open president profile"
          >
            <MaterialIcon name="arrow_forward" className="text-base" />
          </Link>
        ) : null}
      </div>

      {showAttributes ? (
        <PresidentAttributesPanel
          compact
          attributes={{
            charisma: president.charisma,
            authority: president.authority,
            integrity: president.integrity,
            cunning: president.cunning,
            connections: president.connections,
          }}
        />
      ) : null}

      <div className={showAttributes ? "mt-3" : ""}>
        <LegitimacyInfamyMeters
          compact
          showUnlockBadges={showUnlockBadges}
          legitimacy={president.reputationPoints}
          infamy={president.infamyPoints}
          maxLegitimacy={president.maxLegitimacy}
          maxInfamy={president.maxInfamy}
        />
      </div>
    </div>
  );
};
