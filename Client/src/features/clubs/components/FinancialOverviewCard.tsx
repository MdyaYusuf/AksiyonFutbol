import { useMemo } from "react";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { CashAmount } from "@/core/components/ui/CashAmount";
import type { ClubResponse } from "@/features/clubs/clubTypes";
import {
  getClubWeeklyWageBill,
  getWageUtilizationBarClass,
  getWageUtilizationBarGlowClass,
  getWageUtilizationPercent,
} from "@/features/clubs/utils/clubOverviewHelpers";
import { useGetCurrentUserClubPlayersQuery } from "@/features/playerInstances/playerInstancesApiSlice";

interface FinancialOverviewCardProps {
  club: ClubResponse;
}

export const FinancialOverviewCard = ({ club }: FinancialOverviewCardProps) => {
  const { data: players = [], isLoading: isPlayersLoading } =
    useGetCurrentUserClubPlayersQuery();

  const weeklyWageBill = useMemo(() => {
    return getClubWeeklyWageBill(players);
  }, [players]);

  const wageUtilizationPercent = getWageUtilizationPercent(
    weeklyWageBill,
    club.wageBudget,
  );
  const wageUtilizationBarClass = getWageUtilizationBarClass(wageUtilizationPercent);
  const wageUtilizationBarGlowClass = getWageUtilizationBarGlowClass(wageUtilizationPercent);

  return (
    <div className="flex flex-col rounded-lg border border-outline-variant bg-surface-container-high p-6 xl:col-span-8">
      <h3 className="mb-6 flex items-center gap-2 text-headline-sm text-on-surface">
        <MaterialIcon name="account_balance_wallet" className="text-[20px] text-primary" />
        Financial Overview
      </h3>

      <div className="grid flex-1 grid-cols-1 gap-card-gap sm:grid-cols-2">
        <div className="flex flex-col justify-between rounded border border-outline-variant bg-surface p-4">
          <span className="text-label-caps text-on-surface-variant">Club Cash</span>
          <CashAmount
            amount={club.cash}
            className="mt-2 text-stat-value font-bold"
          />
          <div className="mt-1 font-data-mono text-[11px] text-on-surface-variant">
            Available for transfers, facilities, and actions
          </div>
        </div>

        <div className="flex flex-col justify-between rounded border border-outline-variant bg-surface p-4">
          <div className="mb-2 flex items-end justify-between gap-3">
            <span className="text-label-caps text-on-surface-variant">
              Weekly Wages
            </span>
            {isPlayersLoading ? (
              <span className="font-data-mono text-data-mono text-on-surface-variant">
                …
              </span>
            ) : (
              <span className="inline-flex items-baseline gap-1 font-stat-value text-stat-value">
                <CashAmount
                  amount={weeklyWageBill}
                  compact
                  className="font-bold"
                />
                <span className="text-on-surface-variant">/</span>
                <CashAmount
                  amount={club.wageBudget}
                  compact
                  neutral
                  className="font-bold"
                />
              </span>
            )}
          </div>
          <div className="h-1.5 overflow-hidden rounded bg-surface-container-highest">
            <div
              className={[
                "h-full",
                wageUtilizationBarClass,
                wageUtilizationBarGlowClass,
              ].join(" ")}
              style={{ width: `${wageUtilizationPercent}%` }}
            />
          </div>
          <div className="mt-1 font-data-mono text-[11px] text-on-surface-variant">
            Squad pay vs weekly wage cap
          </div>
        </div>
      </div>
    </div>
  );
};
