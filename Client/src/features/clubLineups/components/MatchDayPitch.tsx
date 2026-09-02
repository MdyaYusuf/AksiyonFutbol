import type { PlayerInstanceResponse } from "@/features/playerInstances/playerInstanceTypes";
import type { TeamFormation } from "@/features/clubLineups/clubLineupTypes";
import {
  formatPitchSurname,
  getPlayerFitnessPercent,
} from "@/features/clubLineups/utils/matchDayHelpers";
import {
  buildPitchRows,
  getPitchAccentClass,
  getPitchHoverClass,
} from "@/features/clubLineups/utils/tacticsHelpers";

interface MatchDayPitchProps {
  formation: TeamFormation;
  starterIds: (string | null)[];
  playersById: Map<string, PlayerInstanceResponse>;
  selectedIndex: number | null;
  onSlotClick: (index: number) => void;
}

export const MatchDayPitch = ({
  formation,
  starterIds,
  playersById,
  selectedIndex,
  onSlotClick,
}: MatchDayPitchProps) => {
  const rows = buildPitchRows(formation);

  return (
    <div className="relative flex min-h-[480px] flex-1 flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low md:min-h-0">
      <div className="pointer-events-none absolute inset-8 rounded-sm border-2 border-outline-variant/30 bg-surface-container opacity-50">
        <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-outline-variant/30" />
        <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-outline-variant/30" />
        <div className="absolute top-0 left-1/2 h-32 w-64 -translate-x-1/2 border-2 border-t-0 border-outline-variant/30" />
        <div className="absolute bottom-0 left-1/2 h-32 w-64 -translate-x-1/2 border-2 border-b-0 border-outline-variant/30" />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col justify-between p-8">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex w-full justify-evenly ${
              row.label === "FWD" && row.slotIndexes.length === 2
                ? "justify-center gap-3"
                : ""
            } ${row.label === "AM" ? "px-6" : ""} ${row.label === "DMC" ? "px-16" : ""} ${
              row.label === "DEF" ? "justify-between px-2" : ""
            }`}
          >
            {row.slotIndexes.map((slotIndex, visualIndex) => {
              const playerId = starterIds[slotIndex] ?? null;
              const player = playerId ? playersById.get(playerId) : undefined;
              const isSelected = selectedIndex === slotIndex;
              const fitness = player ? getPlayerFitnessPercent(player) : 0;
              const isInjured = player?.isInjured === true;
              const accent = player
                ? getPitchAccentClass(player.position)
                : "border-outline-variant text-on-surface-variant";
              const hover = player
                ? getPitchHoverClass(player.position)
                : "group-hover:border-primary";
              const centerIndex = Math.floor(row.slotIndexes.length / 2);
              const raiseSlot =
                row.label === "AM" && visualIndex === centerIndex
                  ? "-mt-2"
                  : row.label === "AM" && visualIndex !== centerIndex
                    ? "mt-3"
                    : "";

              return (
                <button
                  key={`md-slot-${slotIndex}`}
                  type="button"
                  onClick={() => onSlotClick(slotIndex)}
                  className={`group flex cursor-pointer flex-col items-center gap-1 ${raiseSlot}`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-surface font-data-mono text-data-mono shadow-sm transition-colors ${accent} ${hover} ${
                      isSelected
                        ? "ring-2 ring-primary/40"
                        : isInjured
                          ? "border-error text-error"
                          : ""
                    }`}
                  >
                    {player ? slotIndex + 1 : "·"}
                  </div>
                  <div
                    className={`whitespace-nowrap rounded border bg-surface-variant px-2 py-1 text-[10px] font-bold tracking-wider shadow-sm ${
                      isInjured
                        ? "border-error text-error"
                        : "border-outline-variant text-on-surface"
                    }`}
                  >
                    {player
                      ? `${formatPitchSurname(player.firstName, player.lastName)}${
                          isInjured ? " (INJ)" : ""
                        }`
                      : "EMPTY"}
                  </div>
                  {player && (
                    <div className="mt-1 h-1 w-12 overflow-hidden rounded-full bg-surface-container">
                      <div
                        className={`h-full ${isInjured ? "bg-error" : "bg-primary"}`}
                        style={{ width: `${fitness}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
