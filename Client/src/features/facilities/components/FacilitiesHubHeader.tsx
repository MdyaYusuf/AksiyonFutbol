import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { formatCashFull } from "@/features/clubs/utils/clubOverviewHelpers";

interface FacilitiesHubHeaderProps {
  clubCash: number;
  morale: number;
}

export const FacilitiesHubHeader = ({ clubCash, morale }: FacilitiesHubHeaderProps) => {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-outline-variant pb-6 md:flex-row md:items-end">
      <div>
        <h1 className="mb-2 font-display-lg text-display-lg font-extrabold text-on-surface">
          Facilities
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Upgrade grounds that shape results
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="min-w-[140px] rounded-lg border border-outline-variant bg-surface-container-high p-4">
          <div className="mb-1 flex items-center gap-1 font-label-caps text-label-caps text-on-surface-variant">
            <MaterialIcon name="account_balance_wallet" className="text-sm" />
            Club Cash
          </div>
          <div className="font-stat-value text-stat-value text-primary">
            {formatCashFull(clubCash)}
          </div>
        </div>
        <div className="min-w-[140px] rounded-lg border border-outline-variant bg-surface-container-high p-4">
          <div className="mb-1 flex items-center gap-1 font-label-caps text-label-caps text-on-surface-variant">
            <MaterialIcon name="mood" className="text-sm" />
            Morale
          </div>
          <div className="font-stat-value text-stat-value text-on-surface">{morale}</div>
        </div>
      </div>
    </div>
  );
};
