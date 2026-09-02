import { MaterialIcon } from "@/core/components/ui/MaterialIcon";

export const CASH_SPEND_LOCK_MESSAGE =
  "Club cash is locked until your live match finishes.";

export const CashSpendLockBanner = () => {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-secondary/30 bg-surface-variant p-4">
      <MaterialIcon name="lock" className="mt-0.5 text-secondary" />
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        {CASH_SPEND_LOCK_MESSAGE}
      </p>
    </div>
  );
};
