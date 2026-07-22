import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { formatCashFull } from "../../clubs/utils/clubOverviewHelpers";
import type { MatchInfluenceConfirmState } from "../briberyTypes";
import { formatChancePercent } from "../utils/matchInfluenceHelpers";

interface ConfirmBribeSummaryProps {
  state: MatchInfluenceConfirmState;
}

export const ConfirmBribeSummary = ({ state }: ConfirmBribeSummaryProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg border border-outline-variant bg-surface-container-low p-4">
      <div>
        <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
          Match
        </span>
        <span className="font-body-lg text-body-lg text-on-background">
          {state.homeClubName} vs. {state.awayClubName}
        </span>
      </div>
      <div>
        <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
          Referee
        </span>
        <span className="font-body-lg text-body-lg text-on-background">
          {state.refereeName} ({state.refereePersonality})
        </span>
      </div>
      <div>
        <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
          Stake
        </span>
        <span className="font-data-mono text-data-mono text-secondary">
          {formatCashFull(state.amount)}
        </span>
      </div>
      <div>
        <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
          Success %
        </span>
        <span className="font-data-mono text-data-mono text-primary">
          {formatChancePercent(state.successChance)}
        </span>
      </div>
    </div>
  );
};

interface ConfirmBribeRiskNoteProps {
  title: string;
}

export const ConfirmBribeRiskNote = ({ title }: ConfirmBribeRiskNoteProps) => {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-error/30 bg-error-container/10 p-4">
      <MaterialIcon name="error" className="mt-0.5 text-error" />
      <div>
        <h3 className="mb-1 font-headline-sm text-headline-sm text-error">{title}</h3>
        <p className="font-body-sm text-body-sm text-error/80">
          Attempting to influence a high-profile match carries significant risk. Exposure could
          lead to a fine, point deduction, or managerial ban.
        </p>
      </div>
    </div>
  );
};
