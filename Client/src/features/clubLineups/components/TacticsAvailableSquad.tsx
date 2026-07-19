import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { PlayerInstanceResponse } from "../../playerInstances/playerInstanceTypes";
import { getPositionBadgeClassName, getPositionLabel } from "../../playerInstances/utils/squadHelpers";
import { groupPlayersByPosition } from "../utils/tacticsHelpers";

interface TacticsAvailableSquadProps {
  players: PlayerInstanceResponse[];
  onPlayerClick: (playerId: string) => void;
  onSave: () => void;
  isSaving: boolean;
  canSave: boolean;
}

export const TacticsAvailableSquad = ({
  players,
  onPlayerClick,
  onSave,
  isSaving,
  canSave,
}: TacticsAvailableSquadProps) => {
  const groups = groupPlayersByPosition(players);

  const sections: { title: string; items: PlayerInstanceResponse[] }[] = [
    { title: "Forwards", items: groups.forwards },
    { title: "Midfielders", items: groups.midfielders },
    { title: "Defenders", items: groups.defenders },
    { title: "Goalkeepers", items: groups.goalkeepers },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low md:w-80 md:shrink-0">
      <div className="flex items-center justify-between border-b border-outline-variant p-4">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Available Squad</h3>
        <MaterialIcon name="filter_list" className="text-sm text-on-surface-variant" />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-2">
        {sections.map((section) =>
          section.items.length === 0 ? null : (
            <div key={section.title}>
              <h4 className="mb-2 px-2 font-label-caps text-label-caps text-on-surface-variant">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((player) => (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => onPlayerClick(player.id)}
                    className="group flex w-full items-center justify-between rounded p-2 text-left transition-colors hover:bg-surface-variant"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded border border-outline-variant bg-surface-container-highest font-data-mono text-[10px] ${getPositionBadgeClassName(player.position)}`}
                      >
                        {getPositionLabel(player.position)}
                      </div>
                      <span className="font-body-sm text-on-surface">
                        {player.firstName.charAt(0)}. {player.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {player.isInjured && (
                        <span className="rounded bg-error-container px-1.5 py-0.5 text-[10px] font-bold text-on-error-container">
                          INJ
                        </span>
                      )}
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-container/20 font-data-mono text-[11px] text-primary">
                        {player.overallRating}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ),
        )}

        {players.length === 0 && (
          <p className="px-2 py-6 text-center text-body-sm text-on-surface-variant">
            All players are in the lineup or on the bench.
          </p>
        )}
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
