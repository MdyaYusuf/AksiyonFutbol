import type { ClubDraftState, DraftCatalogPlayer } from "../clubDraftTypes";
import { DraftCatalogRow } from "./DraftCatalogRow";

interface DraftCatalogTableProps {
  players: DraftCatalogPlayer[];
  draft: ClubDraftState;
  busyPlayerId: string | null;
  onPick: (basePlayerId: string) => void;
  onRemove: (basePlayerId: string) => void;
}

export const DraftCatalogTable = ({
  players,
  draft,
  busyPlayerId,
  onPick,
  onRemove,
}: DraftCatalogTableProps) => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-high font-label-caps text-label-caps text-on-surface-variant">
              <th className="px-4 py-3 font-normal">Player</th>
              <th className="px-4 py-3 font-normal">Pos</th>
              <th className="px-4 py-3 font-normal">OVR</th>
              <th className="px-4 py-3 font-normal">Fee</th>
              <th className="px-4 py-3 font-normal">Wage</th>
              <th className="px-4 py-3 text-right font-normal">Action</th>
            </tr>
          </thead>
          <tbody className="font-data-mono text-data-mono text-on-surface">
            {players.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center font-body-sm text-body-sm text-on-surface-variant"
                >
                  No players match your filters.
                </td>
              </tr>
            ) : (
              players.map((player) => (
                <DraftCatalogRow
                  key={player.id}
                  player={player}
                  draft={draft}
                  isBusy={busyPlayerId === player.id}
                  onPick={onPick}
                  onRemove={onRemove}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
