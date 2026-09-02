import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { ActionsCashAmount } from "@/features/actions/components/ActionsCashAmount";
import type { ActionsPresidentSummary } from "@/features/actions/actionTypes";
import { ActionsPresidentSummaryCard } from "@/features/actions/components/ActionsPresidentSummaryCard";
import { getHeatDescription, getHeatLabel } from "@/features/actions/utils/actionsHubHelpers";

interface ActionsSummaryGridProps {
  clubCash: number;
  suspicion: number;
  maxSuspicion: number;
  president?: ActionsPresidentSummary | null;
}

export const ActionsSummaryGrid = ({
  clubCash,
  suspicion,
  maxSuspicion,
  president,
}: ActionsSummaryGridProps) => {
  const heatLabel = getHeatLabel(suspicion, maxSuspicion);
  const heatPercent =
    maxSuspicion > 0
      ? Math.min(100, Math.round((suspicion / maxSuspicion) * 100))
      : 0;

  return (
    <div className="mb-8 grid grid-cols-1 gap-card-gap md:grid-cols-12">
      {president ? (
        <ActionsPresidentSummaryCard president={president} />
      ) : (
        <div className="col-span-1 rounded-lg border border-outline-variant bg-surface-container p-5 md:col-span-6">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            No president profile loaded.
          </p>
        </div>
      )}

      <div className="group relative col-span-1 flex flex-col items-center justify-center overflow-hidden rounded-lg border border-outline-variant bg-surface-container p-5 md:col-span-3">
        <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
        <MaterialIcon
          name="account_balance"
          className="absolute top-2 right-2 text-[48px] text-primary/10"
        />
        <span className="mb-2 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
          Available Funds
        </span>
        <ActionsCashAmount
          amount={clubCash}
          className="font-data-mono text-[32px] leading-tight font-bold tracking-tighter text-primary"
        />
      </div>

      <div className="relative col-span-1 flex flex-col justify-between overflow-hidden rounded-lg border border-outline-variant bg-surface-container p-5 md:col-span-3">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-error/50 to-transparent" />
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="mb-0.5 font-headline-sm text-headline-sm text-on-surface">Heat</h3>
            <span className="font-data-mono text-data-mono font-bold text-error">
              {suspicion}/{maxSuspicion}
            </span>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-error/20 bg-error/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-error">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-error" />
            {heatLabel.toUpperCase()}
          </span>
        </div>
        <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-surface-variant">
          <div className="h-full bg-error" style={{ width: `${heatPercent}%` }} />
        </div>
        <p className="text-[12px] leading-snug text-on-surface-variant">
          {getHeatDescription(suspicion, maxSuspicion)}
        </p>
      </div>
    </div>
  );
};
