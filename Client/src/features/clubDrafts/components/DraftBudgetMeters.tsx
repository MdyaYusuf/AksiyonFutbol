import { ProgressBar } from "../../../core/components/ui/ProgressBar";
import { formatSquadMoney } from "../../playerInstances/utils/squadHelpers";
import type { ClubDraftState } from "../clubDraftTypes";

interface DraftBudgetMetersProps {
  draft: ClubDraftState;
}

const getMeterColor = (remaining: number, total: number): string => {
  if (total <= 0) {
    return "bg-primary-container";
  }

  const ratio = remaining / total;

  if (ratio <= 0.15) {
    return "bg-error";
  }

  if (ratio <= 0.35) {
    return "bg-secondary";
  }

  return "bg-primary-container";
};

export const DraftBudgetMeters = ({ draft }: DraftBudgetMetersProps) => {
  const cashSpent = Math.max(0, draft.cash - draft.remainingCash);
  const wageCommitted = Math.max(0, draft.wageBudget - draft.remainingWageBudget);

  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="flex flex-col gap-2 rounded-xl border border-outline-variant bg-surface-container/60 p-4">
        <div className="flex items-center justify-between">
          <span className="text-label-caps text-on-surface-variant">Remaining Cash</span>
          <span className="font-data-mono text-data-mono text-on-surface">
            {formatSquadMoney(draft.remainingCash)} / {formatSquadMoney(draft.cash)}
          </span>
        </div>
        <ProgressBar
          value={draft.remainingCash}
          max={Math.max(1, draft.cash)}
          colorClassName={getMeterColor(draft.remainingCash, draft.cash)}
          trackClassName="bg-surface-container-highest"
        />
        <p className="text-body-sm text-on-surface-variant">
          Used {formatSquadMoney(cashSpent)} of {formatSquadMoney(draft.cash)}
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-outline-variant bg-surface-container/60 p-4">
        <div className="flex items-center justify-between">
          <span className="text-label-caps text-on-surface-variant">Remaining Wage Budget</span>
          <span className="font-data-mono text-data-mono text-on-surface">
            {formatSquadMoney(draft.remainingWageBudget)} / {formatSquadMoney(draft.wageBudget)}
          </span>
        </div>
        <ProgressBar
          value={draft.remainingWageBudget}
          max={Math.max(1, draft.wageBudget)}
          colorClassName={getMeterColor(draft.remainingWageBudget, draft.wageBudget)}
          trackClassName="bg-surface-container-highest"
        />
        <p className="text-body-sm text-on-surface-variant">
          Used {formatSquadMoney(wageCommitted)} of {formatSquadMoney(draft.wageBudget)}
        </p>
      </div>
    </div>
  );
};
