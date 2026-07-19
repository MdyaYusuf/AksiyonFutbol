import type { PlayerInstanceResponse } from "../../playerInstances/playerInstanceTypes";
import type { TeamFormation } from "../clubLineupTypes";
import {
  buildPitchRows,
  formatShortName,
  getPitchAccentClass,
  getPitchHoverClass,
  getPitchRatingTextClass,
} from "../utils/tacticsHelpers";

interface TacticsPitchProps {
  formation: TeamFormation;
  starterIds: (string | null)[];
  playersById: Map<string, PlayerInstanceResponse>;
  selectedIndex: number | null;
  onSlotClick: (index: number) => void;
}

export const TacticsPitch = ({
  formation,
  starterIds,
  playersById,
  selectedIndex,
  onSlotClick,
}: TacticsPitchProps) => {
  const rows = buildPitchRows(formation);

  return (
    <div className="pitch-bg relative flex min-h-[420px] flex-1 flex-col overflow-hidden rounded-lg md:min-h-0">
      <div className="pitch-line absolute inset-4 rounded-lg" />
      <div className="pitch-line absolute top-4 left-1/2 h-24 w-48 -translate-x-1/2 rounded-b-sm border-t-0" />
      <div className="pitch-line absolute bottom-4 left-1/2 h-24 w-48 -translate-x-1/2 rounded-t-sm border-b-0" />
      <div className="pitch-line absolute top-1/2 right-4 left-4 h-0 border-r-0 border-b-0 border-l-0" />
      <div className="pitch-line absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full" />

      <div className="relative z-10 flex h-full w-full flex-col justify-between py-6 md:py-8">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`z-10 flex w-full justify-evenly px-6 md:px-12 ${
              row.label === "MID" ? "px-10 md:px-16" : ""
            } ${row.label === "DEF" ? "justify-between px-4 md:px-8" : ""}`}
          >
            {row.slotIndexes.map((slotIndex, visualIndex) => {
              const playerId = starterIds[slotIndex] ?? null;
              const player = playerId ? playersById.get(playerId) : undefined;
              const isSelected = selectedIndex === slotIndex;
              const accent = player
                ? getPitchAccentClass(player.position)
                : "border-outline-variant text-on-surface-variant";
              const hover = player
                ? getPitchHoverClass(player.position)
                : "group-hover:border-primary";
              const raiseMid =
                row.label === "FWD" && visualIndex === Math.floor(row.slotIndexes.length / 2)
                  ? "mt-3"
                  : row.label === "MID" && visualIndex === Math.floor(row.slotIndexes.length / 2)
                    ? "mt-5"
                    : row.label === "DEF" && (visualIndex === 0 || visualIndex === row.slotIndexes.length - 1)
                      ? "-mt-3"
                      : "";

              return (
                <button
                  key={`slot-${slotIndex}`}
                  type="button"
                  onClick={() => onSlotClick(slotIndex)}
                  className={`group flex cursor-pointer flex-col items-center gap-1 ${raiseMid}`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-surface-container-highest font-data-mono text-data-mono text-on-surface shadow-sm transition-colors ${accent} ${hover} ${
                      isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                    }`}
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
                        <span className={`ml-1 ${getPitchRatingTextClass(player.position)}`}>
                          {player.overallRating}
                        </span>
                      </>
                    ) : (
                      "Empty"
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
