import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { formatCashFull } from "@/features/clubs/utils/clubOverviewHelpers";
import type { MatchInfluenceConfirmState } from "@/features/bribery/briberyTypes";
import { formatChancePercent } from "@/features/bribery/utils/matchInfluenceHelpers";

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
      <div>
        <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
          Heat
        </span>
        <span className="font-data-mono text-data-mono text-secondary">
          +{state.heatGenerated}
        </span>
      </div>
      <div>
        <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
          Detection %
        </span>
        <span className="font-data-mono text-data-mono text-error">
          {formatChancePercent(state.detectionChance)}
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
          Detection triggers a scandal: cash fine, squad morale hit, Legitimacy loss, and
          Infamy gain. All consequences are in-game fiction.
        </p>
      </div>
    </div>
  );
};
