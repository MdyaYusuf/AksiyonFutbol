import { useRef, useState } from "react";
import { PlayerAttributePopover } from "../../playerInstances/components/PlayerAttributePopover";
import type { PlayerInstanceResponse } from "../../playerInstances/playerInstanceTypes";
import type { TeamFormation } from "../clubLineupTypes";
import {
  buildPitchRows,
  formatShortName,
  getPitchAccentClass,
  getPitchHoverClass,
  getPitchRatingTextClass,
  parseLineupDrag,
  serializeLineupDrag,
} from "../utils/tacticsHelpers";

interface TacticsPitchProps {
  formation: TeamFormation;
  starterIds: (string | null)[];
  playersById: Map<string, PlayerInstanceResponse>;
  selectedIndex: number | null;
  onSlotClick: (index: number, anchor: DOMRect) => void;
  onDropOnSlot: (index: number, playerId: string) => void;
}

export const TacticsPitch = ({
  formation,
  starterIds,
  playersById,
  selectedIndex,
  onSlotClick,
  onDropOnSlot,
}: TacticsPitchProps) => {
  const rows = buildPitchRows(formation);
  const dragOccurredRef = useRef(false);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  return (
    <div className="pitch-bg relative flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-lg md:min-h-0">
      <div className="pitch-line absolute inset-4 rounded-lg" />
      <div className="pitch-line absolute top-4 left-1/2 h-24 w-48 -translate-x-1/2 rounded-b-sm border-t-0" />
      <div className="pitch-line absolute bottom-4 left-1/2 h-24 w-48 -translate-x-1/2 rounded-t-sm border-b-0" />
      <div className="pitch-line absolute top-1/2 right-4 left-4 h-0 border-r-0 border-b-0 border-l-0" />
      <div className="pitch-line absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full" />

      <div className="relative z-10 flex h-full w-full flex-col justify-between py-6 md:py-10">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`z-10 flex w-full justify-evenly px-6 md:px-12 ${
              row.label === "FWD" && row.slotIndexes.length === 2
                ? "justify-center gap-3 md:gap-4"
                : ""
            } ${row.label === "MID" || row.label === "AM" ? "px-8 md:px-14" : ""} ${
              row.label === "DMC" ? "px-16 md:px-28" : ""
            } ${row.label === "DEF" ? "justify-between px-4 md:px-8" : ""}`}
          >
            {row.slotIndexes.map((slotIndex, visualIndex) => {
              const playerId = starterIds[slotIndex] ?? null;
              const player = playerId ? playersById.get(playerId) : undefined;
              const isSelected = selectedIndex === slotIndex;
              const isDropTarget = dropIndex === slotIndex;
              const accent = player
                ? getPitchAccentClass(player.position)
                : "border-outline-variant text-on-surface-variant";
              const hover = player
                ? getPitchHoverClass(player.position)
                : "group-hover:border-primary";
              const centerIndex = Math.floor(row.slotIndexes.length / 2);
              const raiseMid =
                row.label === "FWD" && visualIndex === centerIndex
                  ? "mt-2"
                  : row.label === "AM" && visualIndex === centerIndex
                    ? "-mt-3"
                    : row.label === "AM" && visualIndex !== centerIndex
                      ? "mt-4"
                      : row.label === "DMC"
                        ? "mt-1"
                        : row.label === "MID" && visualIndex === centerIndex
                          ? "mt-5"
                          : row.label === "DEF" &&
                              (visualIndex === 0 || visualIndex === row.slotIndexes.length - 1)
                            ? "-mt-3"
                            : "";

              return (
                <PlayerAttributePopover
                  key={`slot-${slotIndex}`}
                  player={player}
                  disabled={isSelected}
                  className={raiseMid}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    data-tactics-slot={slotIndex}
                    draggable={Boolean(player)}
                    onClick={(event) => {
                      if (dragOccurredRef.current) {
                        return;
                      }

                      onSlotClick(slotIndex, event.currentTarget.getBoundingClientRect());
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") {
                        return;
                      }

                      event.preventDefault();
                      onSlotClick(slotIndex, event.currentTarget.getBoundingClientRect());
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
                          kind: "starter",
                          index: slotIndex,
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
                      setDropIndex(slotIndex);
                    }}
                    onDragLeave={() => {
                      setDropIndex((current) => (current === slotIndex ? null : current));
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      setDropIndex(null);
                      const payload = parseLineupDrag(
                        event.dataTransfer.getData("text/plain"),
                      );
                      if (!payload) {
                        return;
                      }

                      onDropOnSlot(slotIndex, payload.playerId);
                    }}
                    className="group flex cursor-pointer flex-col items-center gap-1"
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full border-2 bg-surface-container-highest font-data-mono text-data-mono text-on-surface shadow-sm transition-colors ${accent} ${hover} ${
                        isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                      } ${isDropTarget ? "ring-2 ring-secondary ring-offset-2 ring-offset-background" : ""}`}
                    >
                      {player ? slotIndex + 1 : "·"}
                    </div>
                    <div
                      className={`rounded border border-outline-variant bg-surface-container-lowest px-2 py-0.5 font-data-mono text-[11px] ${
                        player ? "text-on-surface" : "text-on-surface-variant"
                      }`}
                    >
                      {player ? (
                        <>
                          {formatShortName(player.firstName, player.lastName)}
                          <span className={`ml-2 ${getPitchRatingTextClass(player.position)}`}>
                            {player.overallRating}
                          </span>
                        </>
                      ) : (
                        "Empty"
                      )}
                    </div>
                  </div>
                </PlayerAttributePopover>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
