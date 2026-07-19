import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { PlayerInstanceResponse } from "../../playerInstances/playerInstanceTypes";
import { getPositionRoleLabel } from "../utils/matchDayHelpers";
import { formatShortName } from "../utils/tacticsHelpers";

interface MatchDayStartingXiProps {
  starterIds: (string | null)[];
  playersById: Map<string, PlayerInstanceResponse>;
  availablePlayers: PlayerInstanceResponse[];
  selectedIndex: number | null;
  formationLabel: string;
  onSelectStarter: (index: number) => void;
  onSwapIn: (playerId: string) => void;
}

export const MatchDayStartingXi = ({
  starterIds,
  playersById,
  availablePlayers,
  selectedIndex,
  formationLabel,
  onSelectStarter,
  onSwapIn,
}: MatchDayStartingXiProps) => {
  const filledCount = starterIds.filter(Boolean).length;
  const fitReplacements = availablePlayers.filter((player) => !player.isInjured);

  return (
    <div className="flex min-h-[320px] flex-col rounded-lg border border-outline-variant bg-surface-container-low xl:min-h-0">
      <div className="flex items-center justify-between border-b border-outline-variant p-4">
        <h3 className="font-label-caps text-label-caps text-on-surface-variant">
          Starting XI ({filledCount}/11)
        </h3>
        <span className="rounded bg-surface-container px-2 py-1 text-xs text-on-surface">
          {formationLabel}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {starterIds.map((playerId, index) => {
          const player = playerId ? playersById.get(playerId) : undefined;
          const isSelected = selectedIndex === index;
          const isInjured = player?.isInjured === true;

          return (
            <button
              key={`xi-row-${index}`}
              type="button"
              onClick={() => onSelectStarter(index)}
              className={`flex w-full cursor-pointer items-center justify-between border-b border-outline-variant p-3 text-left transition-colors hover:bg-surface-variant ${
                isInjured ? "bg-error-container/10" : ""
              } ${isSelected ? "bg-surface-variant" : ""}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-4 text-right font-data-mono text-data-mono text-on-surface-variant">
                  {index + 1}
                </span>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-surface-container ${
                    isInjured ? "border-error" : "border-outline-variant"
                  }`}
                >
                  {isInjured ? (
                    <MaterialIcon name="local_hospital" className="text-sm text-error" />
                  ) : (
                    <MaterialIcon
                      name="person"
                      className="text-sm text-on-surface-variant"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <div
                    className={`truncate font-body-sm text-body-sm font-bold ${
                      isInjured ? "text-error" : "text-on-surface"
                    }`}
                  >
                    {player
                      ? formatShortName(player.firstName, player.lastName)
                      : "Empty slot"}
                  </div>
                  <div className="text-[10px] text-on-surface-variant">
                    {player ? getPositionRoleLabel(player.position) : "Select a player"}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {player && (
                  <div className="rounded border border-outline-variant bg-surface px-2 py-0.5 text-[10px] font-bold text-on-surface">
                    OVR {player.overallRating}
                  </div>
                )}
                <MaterialIcon
                  name="swap_horiz"
                  className={`text-sm ${
                    isSelected ? "text-primary" : "text-on-surface-variant"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {selectedIndex != null && (
        <div className="border-t border-outline-variant">
          <div className="px-4 py-2 font-label-caps text-label-caps text-on-surface-variant">
            Swap in
          </div>
          <div className="max-h-40 overflow-y-auto">
            {fitReplacements.length === 0 ? (
              <p className="px-4 pb-3 text-body-sm text-on-surface-variant">
                No fit replacements available.
              </p>
            ) : (
              fitReplacements.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => onSwapIn(player.id)}
                  className="flex w-full items-center justify-between border-b border-outline-variant/60 px-4 py-2 text-left transition-colors last:border-b-0 hover:bg-surface-variant"
                >
                  <div>
                    <div className="font-body-sm text-body-sm text-on-surface">
                      {formatShortName(player.firstName, player.lastName)}
                    </div>
                    <div className="text-[10px] text-on-surface-variant">
                      {getPositionRoleLabel(player.position)}
                    </div>
                  </div>
                  <span className="font-data-mono text-data-mono text-primary">
                    {player.overallRating}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
