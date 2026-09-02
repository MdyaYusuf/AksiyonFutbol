import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { formatTransferWage } from "@/features/transfers/utils/transferMarketHelpers";
import { formatDealFee, type DealsTab } from "@/features/transfers/utils/myDealsHelpers";

interface MyDealsSummaryProps {
  tab: DealsTab;
  totalFee: number;
  totalWage: number;
  pendingCount: number;
}

export const MyDealsSummary = ({
  tab,
  totalFee,
  totalWage,
  pendingCount,
}: MyDealsSummaryProps) => {
  const isOutgoing = tab === "outgoing";

  return (
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
  );
};
