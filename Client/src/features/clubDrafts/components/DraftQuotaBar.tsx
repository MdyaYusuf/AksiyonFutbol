import { getPositionLabel } from "../../playerInstances/utils/squadHelpers";
import type { DraftQuota } from "../clubDraftTypes";

interface DraftQuotaBarProps {
  quotas: DraftQuota[];
}

export const DraftQuotaBar = ({ quotas }: DraftQuotaBarProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {quotas.map((quota) => {
        const isFilled = quota.remaining === 0;

        return (
          <div
            key={quota.position}
            className={`rounded-full border px-3 py-1.5 font-label-caps text-label-caps ${
              isFilled
                ? "border-primary bg-primary/10 text-primary"
                : "border-outline-variant bg-surface-container text-on-surface-variant"
            }`}
          >
            {getPositionLabel(quota.position)} {quota.selected}/{quota.required}
          </div>
        );
      })}
    </div>
  );
};
