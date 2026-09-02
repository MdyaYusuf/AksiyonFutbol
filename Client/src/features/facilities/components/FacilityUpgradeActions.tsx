import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { CashAmount } from "@/core/components/ui/CashAmount";
import { getActionLockedPresentation } from "@/features/actions/utils/actionPresentationHelpers";

interface FacilityUpgradeActionsProps {
  upgradeCost: number;
  canAfford: boolean;
  cashSpendLocked?: boolean;
  isMaxLevel: boolean;
  isSubmitting: boolean;
  onConfirm: () => void;
}

export const FacilityUpgradeActions = ({
  upgradeCost,
  canAfford,
  cashSpendLocked = false,
  isMaxLevel,
  isSubmitting,
  onConfirm,
}: FacilityUpgradeActionsProps) => {
  const canConfirm = !isMaxLevel && canAfford && !isSubmitting;
  const insufficientPresentation = getActionLockedPresentation("Insufficient funds.");
  const cashLockedPresentation = getActionLockedPresentation("Cash is locked during your live match.");

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-outline-variant bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full gap-6 sm:w-auto">
        <div className="flex flex-col">
          <span className="mb-1 font-label-caps text-label-caps text-on-surface-variant">
            Upgrade Cost
          </span>
          <span className="font-stat-value text-stat-value">
            {isMaxLevel ? (
              <span className="text-on-surface">—</span>
            ) : (
              <CashAmount
                amount={upgradeCost}
                className="font-stat-value text-stat-value font-bold"
              />
            )}
          </span>
        </div>
        <div className="hidden h-10 w-px bg-outline-variant sm:block" />
        <div className="flex flex-col">
          <span className="mb-1 font-label-caps text-label-caps text-on-surface-variant">
            Build Time
          </span>
          <span className="flex items-center gap-1 font-stat-value text-stat-value text-on-surface">
            <MaterialIcon name="bolt" className="text-[18px]" />
            Immediate
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
        <button
          type="button"
          disabled={!canConfirm}
          onClick={onConfirm}
          className="flex w-full items-center justify-center gap-2 rounded bg-primary px-6 py-3 font-label-caps text-label-caps text-on-primary shadow-[0_4px_14px_rgba(34,197,94,0.3)] transition-colors hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:w-auto"
        >
          <MaterialIcon name="build" className="text-[18px]" />
          {isSubmitting
            ? "Upgrading..."
            : isMaxLevel
              ? "Max Level"
              : "Confirm Upgrade"}
        </button>
        {!isMaxLevel && cashSpendLocked ? (
          <div
            className={[
              "flex w-full items-center justify-center gap-2 rounded border px-3 py-2.5 font-body-sm text-body-sm font-semibold normal-case sm:w-auto",
              cashLockedPresentation.buttonClassName,
            ].join(" ")}
          >
            <MaterialIcon
              name="lock"
              className={["text-[14px]", cashLockedPresentation.iconClassName].join(" ")}
            />
            Locked during your live match.
          </div>
        ) : null}
        {!isMaxLevel && !canAfford && !cashSpendLocked ? (
          <div
            className={[
              "flex w-full items-center justify-center gap-2 rounded border px-3 py-2.5 font-body-sm text-body-sm font-semibold normal-case sm:w-auto",
              insufficientPresentation.buttonClassName,
            ].join(" ")}
          >
            <MaterialIcon
              name="lock"
              className={["text-[14px]", insufficientPresentation.iconClassName].join(" ")}
            />
            Insufficient funds.
          </div>
        ) : null}
      </div>
    </div>
  );
};
