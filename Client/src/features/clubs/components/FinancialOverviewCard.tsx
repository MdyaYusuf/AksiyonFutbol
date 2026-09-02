import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { ProgressBar } from "@/core/components/ui/ProgressBar";
import { formatCash } from "@/features/dashboard/utils/dashboardFormatters";
import type { ClubResponse } from "@/features/clubs/clubTypes";
import { formatCashFull } from "@/features/clubs/utils/clubOverviewHelpers";

interface FinancialOverviewCardProps {
  club: ClubResponse;
}

export const FinancialOverviewCard = ({ club }: FinancialOverviewCardProps) => {
  return (
    <div className="flex flex-col rounded-lg border border-outline-variant bg-surface-container-high p-6 xl:col-span-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-headline-sm text-on-surface">
          <MaterialIcon name="account_balance_wallet" className="text-[20px] text-primary" />
          Financial Overview
        </h3>
        <span className="cursor-default text-label-caps text-on-surface-variant">
          VIEW LEDGER
        </span>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-card-gap sm:grid-cols-3">
        <div className="flex flex-col justify-between rounded border border-outline-variant bg-surface p-4">
          <span className="text-label-caps text-on-surface-variant">Overall Balance</span>
          <div className="mt-2 text-stat-value text-on-surface">
            {formatCashFull(club.cash)}
          </div>
          <div className="mt-1 font-data-mono text-[11px] text-on-surface-variant">
            Available funds
          </div>
        </div>

        <div className="flex flex-col justify-between rounded border border-outline-variant bg-surface p-4">
          <span className="text-label-caps text-on-surface-variant">Transfer Budget</span>
          <div className="mt-2 text-stat-value text-on-surface">
            {formatCashFull(club.cash)}
          </div>
          <div className="mt-3">
            <ProgressBar value={100} colorClassName="bg-primary" />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded border border-outline-variant bg-surface p-4">
          <span className="text-label-caps text-on-surface-variant">Wage Budget (Weekly)</span>
          <div className="mt-2 flex items-baseline gap-1 text-stat-value text-on-surface">
            {formatCash(club.wageBudget)}
            <span className="font-data-mono text-data-mono text-on-surface-variant">
              weekly
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar value={club.wageBudget > 0 ? 100 : 0} colorClassName="bg-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
};
