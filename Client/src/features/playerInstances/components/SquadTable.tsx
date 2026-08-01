import type { PlayerInstanceResponse } from "../playerInstanceTypes";
import { SquadPlayerRow } from "./SquadPlayerRow";

interface SquadTableProps {
  players: PlayerInstanceResponse[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const SquadTable = ({
  players,
  totalCount,
  currentPage,
  pageSize,
  onPrevPage,
  onNextPage,
}: SquadTableProps) => {
  const showingFrom = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, totalCount);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low/70 shadow-sm backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="px-4 py-3 text-label-caps text-on-surface-variant">Pos</th>
              <th className="px-4 py-3 text-label-caps text-on-surface-variant">
                Player Name
              </th>
              <th className="px-4 py-3 text-label-caps text-on-surface-variant">Age</th>
              <th className="px-4 py-3 text-label-caps text-on-surface-variant">OVR</th>
              <th className="px-4 py-3 text-center text-label-caps text-on-surface-variant">
                Status
              </th>
              <th className="px-4 py-3 text-label-caps text-on-surface-variant">G / A / C</th>
              <th className="px-4 py-3 text-right text-label-caps text-on-surface-variant">
                Wage (pw)
              </th>
              <th className="px-4 py-3 text-right text-label-caps text-on-surface-variant">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant text-body-sm">
            {players.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-on-surface-variant"
                >
                  No players found for this filter.
                </td>
              </tr>
            ) : (
              players.map((player) => (
                <SquadPlayerRow key={player.id} player={player} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-low p-4 text-body-sm text-on-surface-variant">
        <div>
          Showing {showingFrom}-{showingTo} of {totalCount} players
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrevPage}
            disabled={!canGoPrev}
            className="rounded border border-outline-variant px-3 py-1 transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={onNextPage}
            disabled={!canGoNext}
            className="rounded border border-outline-variant px-3 py-1 transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
