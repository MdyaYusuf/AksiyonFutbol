import { Link } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { ProgressBar } from "../../../core/components/ui/ProgressBar";
import type { ClubPresidentResponse } from "../../clubPresidents/clubPresidentTypes";
import { PresidentAttributesPanel } from "../../clubPresidents/components/PresidentAttributesPanel";
import type { ClubResponse } from "../../clubs/clubTypes";

interface PresidentSummaryCardProps {
  president?: ClubPresidentResponse;
  club?: ClubResponse;
}

export const PresidentSummaryCard = ({
  president,
  club,
}: PresidentSummaryCardProps) => {
  return (
    <div className="col-span-1 flex flex-col rounded-lg border border-outline-variant bg-surface-container-high p-4 md:col-span-4 lg:col-span-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-label-caps text-on-surface-variant">President</h2>
        <Link to="/app/president" className="text-on-surface-variant transition-colors hover:text-primary">
          <MaterialIcon name="more_horiz" className="text-sm" />
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded border border-outline-variant bg-background">
          <MaterialIcon name="account_balance" className="text-on-surface-variant" />
        </div>
        <div>
          <div className="text-headline-sm text-on-surface">
            {president?.name ?? "—"}
          </div>
          <div className="text-body-sm text-on-surface-variant">
            Manager Status:{" "}
            <span className="text-primary">{president?.title ?? "Active"}</span>
          </div>
        </div>
      </div>

      {president ? (
        <div className="mb-4">
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
        </div>
      ) : null}

      <div className="flex flex-1 flex-col justify-end space-y-4">
        <div>
          <div className="mb-1 flex justify-between">
            <span className="text-body-sm text-on-surface-variant">Legitimacy</span>
            <span className="font-data-mono text-data-mono text-primary">
              {president?.reputationPoints ?? 0}/100
            </span>
          </div>
          <ProgressBar value={president?.reputationPoints ?? 0} />
        </div>
        <div>
          <div className="mb-1 flex justify-between">
            <span className="text-body-sm text-on-surface-variant">Board Confidence</span>
            <span className="font-data-mono text-data-mono text-primary">
              {club?.discipline ?? 0}%
            </span>
          </div>
          <ProgressBar value={club?.discipline ?? 0} />
        </div>
        <div>
          <div className="mb-1 flex justify-between">
            <span className="text-body-sm text-on-surface-variant">Fan Support</span>
            <span className="font-data-mono text-data-mono text-secondary">
              {club?.morale ?? 0}%
            </span>
          </div>
          <ProgressBar
            value={club?.morale ?? 0}
            colorClassName="bg-secondary-container"
          />
        </div>
      </div>
    </div>
  );
};
