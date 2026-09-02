import { useRef, useState } from "react";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { PlayerAttributePopover } from "@/features/playerInstances/components/PlayerAttributePopover";
import type { PlayerInstanceResponse } from "@/features/playerInstances/playerInstanceTypes";
import {
  getPositionBadgeClassName,
  getPositionLabel,
} from "@/features/playerInstances/utils/squadHelpers";
import {
  formatShortName,
  parseLineupDrag,
  serializeLineupDrag,
} from "@/features/clubLineups/utils/tacticsHelpers";

interface TacticsBenchProps {
  slotIds: (string | null)[];
  playersById: Map<string, PlayerInstanceResponse>;
  selectedIndex: number | null;
  onSlotClick: (index: number, anchor: DOMRect) => void;
  onDropOnSlot: (index: number, playerId: string) => void;
  onSave: () => void;
  isSaving: boolean;
  canSave: boolean;
}

export const TacticsBench = ({
  slotIds,
  playersById,
  selectedIndex,
  onSlotClick,
  onDropOnSlot,
  onSave,
  isSaving,
  canSave,
}: TacticsBenchProps) => {
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const dragOccurredRef = useRef(false);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low md:w-72 md:shrink-0">
      <div className="border-b border-outline-variant p-4">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Bench</h3>
        <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
          Drag onto the pitch, or click a slot to pick a player.
        </p>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {slotIds.map((playerId, index) => {
          const player = playerId ? playersById.get(playerId) : undefined;
          const isDropTarget = dropIndex === index;
          const isSelected = selectedIndex === index;

          return (
            <PlayerAttributePopover
              key={`bench-${index}`}
              player={player}
              disabled={isSelected}
              className="block w-full"
            >
              <div
                role="button"
                tabIndex={0}
                data-tactics-bench-slot={index}
                draggable={Boolean(player)}
                onClick={(event) => {
                  if (dragOccurredRef.current) {
                    return;
                  }

                  onSlotClick(index, event.currentTarget.getBoundingClientRect());
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") {
                    return;
                  }

                  event.preventDefault();
                  onSlotClick(index, event.currentTarget.getBoundingClientRect());
                }}
                onDragStart={(event) => {
                  if (!playerId) {
                    event.preventDefault();
                    return;
                  }

                  dragOccurredRef.current = true;
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData(
                    "text/plain",
                    serializeLineupDrag({
                      kind: "bench",
                      index,
                      playerId,
                    }),
                  );
                }}
                onDragEnd={() => {
                  setDropIndex(null);
                  window.setTimeout(() => {
                    dragOccurredRef.current = false;
                  }, 0);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  setDropIndex(index);
                }}
                onDragLeave={() => {
                  setDropIndex((current) => (current === index ? null : current));
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setDropIndex(null);
                  const payload = parseLineupDrag(event.dataTransfer.getData("text/plain"));
                  if (!payload) {
                    return;
                  }

                  onDropOnSlot(index, payload.playerId);
                }}
                className={`flex w-full items-center justify-between rounded p-2 ${
                  player ? "cursor-grab" : "cursor-pointer border border-dashed border-outline-variant"
                } ${isDropTarget ? "bg-surface-variant" : ""} ${
                  isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                }`}
              >
                {player ? (
                  <>
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`inline-flex h-6 w-8 shrink-0 items-center justify-center rounded text-label-caps ${getPositionBadgeClassName(player.position)}`}
                      >
                        {getPositionLabel(player.position)}
                      </span>
                      <span className="truncate font-body-sm text-on-surface">
                        {formatShortName(player.firstName, player.lastName)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {player.isInjured ? (
                        <span className="rounded bg-error-container px-1.5 py-0.5 text-[10px] font-bold text-on-error-container">
                          INJ
                        </span>
                      ) : null}
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-container/20 font-data-mono text-[11px] text-primary">
                        {player.overallRating}
                      </div>
                    </div>
                  </>
                ) : (
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Empty bench slot
                  </span>
                )}
              </div>
            </PlayerAttributePopover>
          );
        })}
      </div>

      <div className="border-t border-outline-variant bg-surface-container-highest p-4">
        <button
          type="button"
          onClick={onSave}
          disabled={!canSave || isSaving}
          className="flex w-full items-center justify-center gap-2 rounded bg-primary-container px-4 py-2 font-body-sm font-bold text-on-primary-container transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MaterialIcon name="save" className="text-sm" />
          {isSaving ? "Saving..." : "Save Lineup"}
        </button>
      </div>
    </div>
  );
};
