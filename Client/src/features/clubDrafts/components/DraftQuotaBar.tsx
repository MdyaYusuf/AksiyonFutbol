import { PlayerPosition } from "@/features/basePlayers/basePlayerTypes";
import { getPositionLabel } from "@/features/playerInstances/utils/squadHelpers";
import type { DraftQuota } from "@/features/clubDrafts/clubDraftTypes";

interface DraftQuotaBarProps {
  quotas: DraftQuota[];
}

const getQuotaChipClassName = (
  position: PlayerPosition,
  isFilled: boolean,
): string => {
  if (position === PlayerPosition.Forward) {
    if (isFilled) {
      return "border-secondary/50 bg-secondary/15 text-secondary";
    }

    return "border-secondary/30 bg-transparent text-secondary/80";
  }

  if (position === PlayerPosition.Midfielder) {
    if (isFilled) {
      return "border-tertiary/50 bg-tertiary/15 text-tertiary";
    }

    return "border-tertiary/30 bg-transparent text-tertiary/80";
  }

  if (position === PlayerPosition.Defender) {
    if (isFilled) {
      return "border-sky-500/50 bg-sky-500/12 text-sky-300";
    }

    return "border-sky-500/30 bg-transparent text-sky-300/80";
  }

  if (isFilled) {
    return "border-teal-400/50 bg-teal-400/12 text-teal-300";
  }

  return "border-teal-400/30 bg-transparent text-teal-300/80";
};

export const DraftQuotaBar = ({ quotas }: DraftQuotaBarProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {quotas.map((quota) => {
        const isFilled = quota.remaining === 0;

        return (
          <div
            key={quota.position}
            className={`rounded-full border px-3 py-1.5 font-label-caps text-label-caps ${getQuotaChipClassName(quota.position, isFilled)}`}
          >
            {getPositionLabel(quota.position)} {quota.selected}/{quota.required}
          </div>
        );
      })}
    </div>
  );
};
