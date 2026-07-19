import type { PlayerInstanceResponse } from "../../playerInstances/playerInstanceTypes";
import { formatShortName } from "../utils/tacticsHelpers";

interface TacticsBenchProps {
  slotIds: (string | null)[];
  playersById: Map<string, PlayerInstanceResponse>;
  selectedIndex: number | null;
  onSlotClick: (index: number) => void;
}

export const TacticsBench = ({
  slotIds,
  playersById,
  selectedIndex,
  onSlotClick,
}: TacticsBenchProps) => {
  return (
    <div className="flex h-24 items-center gap-2 overflow-x-auto rounded-lg border border-outline-variant bg-surface-container-low p-3">
      <div className="w-12 shrink-0 font-label-caps text-label-caps text-on-surface-variant">
        BENCH
      </div>
      {slotIds.map((playerId, index) => {
        const player = playerId ? playersById.get(playerId) : undefined;
        const isSelected = selectedIndex === index;

        return (
          <button
            key={`bench-${index}`}
            type="button"
            onClick={() => onSlotClick(index)}
            className={`group flex min-w-[60px] shrink-0 flex-col items-center gap-1 ${
              isSelected ? "opacity-100" : ""
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border bg-surface-container-lowest font-data-mono text-data-mono transition-colors ${
                isSelected
                  ? "border-primary text-primary"
                  : "border-outline-variant text-on-surface-variant group-hover:border-primary"
              }`}
            >
              {player ? index + 12 : "·"}
            </div>
            <div className="max-w-[64px] truncate font-data-mono text-[10px] text-on-surface-variant">
              {player ? player.lastName : "Empty"}
            </div>
            {player && (
              <span className="sr-only">
                {formatShortName(player.firstName, player.lastName)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
