import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { formatTransferWage } from "../utils/transferMarketHelpers";
import {
  formatDealFee,
  type DealStatusFilter,
  type DealsTab,
} from "../utils/myDealsHelpers";

interface MyDealsSummaryProps {
  tab: DealsTab;
  totalFee: number;
  totalWage: number;
  pendingCount: number;
  statusFilters: DealStatusFilter[];
  onToggleStatusFilter: (filter: DealStatusFilter) => void;
}

export const MyDealsSummary = ({
  tab,
  totalFee,
  totalWage,
  pendingCount,
  statusFilters,
  onToggleStatusFilter,
}: MyDealsSummaryProps) => {
  const isOutgoing = tab === "outgoing";

  const filterOptions: { id: DealStatusFilter; label: string }[] = [
    { id: "pending", label: "Pending Approval" },
    { id: "accepted", label: "Accepted/Finalized" },
    { id: "closed", label: "Rejected / Withdrawn" },
  ];

  return (
    <div className="space-y-6">
      <div className="group relative overflow-hidden rounded-lg border border-outline-variant/50 bg-surface-container-low p-5">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <h3 className="mb-4 flex items-center gap-2 font-label-caps text-label-caps text-on-surface-variant">
          <MaterialIcon name="analytics" className="text-sm" />
          {isOutgoing ? "Active Outgoing" : "Active Incoming"}
        </h3>
        <div className="space-y-4">
          <div>
            <span className="block font-data-mono text-data-mono text-on-surface-variant">
              {isOutgoing ? "Total Potential Fee" : "Total Bid Value"}
            </span>
            <span className="mt-1 block font-stat-value text-stat-value text-primary">
              {formatDealFee(totalFee)}
            </span>
          </div>
          <div>
            <span className="block font-data-mono text-data-mono text-on-surface-variant">
              {isOutgoing ? "Total Wage Relief" : "Total Wage Commitment"}
            </span>
            <span className="mt-1 block font-stat-value text-stat-value text-secondary">
              {formatTransferWage(totalWage)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-outline-variant/30 pt-3">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Pending Deals
            </span>
            <span className="rounded bg-surface-variant px-2 py-0.5 text-xs font-bold text-on-surface">
              {pendingCount}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-outline-variant/50 bg-surface-container-low p-5">
        <h3 className="mb-4 flex items-center gap-2 font-label-caps text-label-caps text-on-surface-variant">
          <MaterialIcon name="tune" className="text-sm" />
          Quick Filters
        </h3>
        <div className="space-y-2">
          {filterOptions.map((option) => {
            const checked = statusFilters.includes(option.id);

            return (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-surface-variant/50"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleStatusFilter(option.id)}
                  className="h-4 w-4 rounded border-outline-variant bg-surface text-primary focus:ring-primary focus:ring-offset-background"
                />
                <span className="font-body-sm text-body-sm text-on-surface">{option.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
