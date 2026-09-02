import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import {
  getPositionBadgeClassName,
  getPositionLabel,
} from "@/features/playerInstances/utils/squadHelpers";
import type { BasePlayerResponse } from "@/features/basePlayers/basePlayerTypes";
import {
  getAttributeTextClassName,
  getBasePlayerDisplayName,
  getOverallBadgeClassName,
  getPreferredFootLabel,
} from "@/features/basePlayers/utils/adminBasePlayersHelpers";

interface AdminBasePlayersTableProps {
  players: BasePlayerResponse[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (currentPage: number) => void;
  onEdit: (playerId: string) => void;
  onDelete: (playerId: string) => void;
}

export const AdminBasePlayersTable = ({
  players,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onEdit,
  onDelete,
}: AdminBasePlayersTableProps) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="overflow-hidden rounded border border-outline-variant bg-surface-container-high">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="border-b border-outline-variant bg-surface-container-low">
            <tr className="text-label-caps text-on-surface-variant">
              <th className="w-8 px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Pos</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Nat</th>
              <th className="px-4 py-3">Foot</th>
              <th className="px-4 py-3 text-center">ATT</th>
              <th className="px-4 py-3 text-center">DEF</th>
              <th className="px-4 py-3 text-center">MID</th>
              <th className="px-4 py-3 text-center">OVR</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant font-data-mono text-data-mono">
            {players.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-10 text-center text-body-sm text-on-surface-variant"
                >
                  No base players found.
                </td>
              </tr>
            ) : (
              players.map((player, index) => (
                <tr
                  key={player.id}
                  className="group h-table-row-height transition-colors hover:bg-surface-variant"
                >
                  <td className="px-4 py-2 text-on-surface-variant">
                    {rangeStart + index}
                  </td>
                  <td className="px-4 py-2 font-medium text-on-surface">
                    {getBasePlayerDisplayName(
                      player.defaultFirstName,
                      player.defaultLastName,
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center justify-center rounded px-2 py-0.5 text-[10px] font-bold ${getPositionBadgeClassName(player.position)}`}
                    >
                      {getPositionLabel(player.position)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-on-surface-variant">{player.age}</td>
                  <td className="px-4 py-2 text-on-surface-variant">
                    {player.nationality?.trim() || "—"}
                  </td>
                  <td className="px-4 py-2 text-on-surface-variant">
                    {getPreferredFootLabel(player.preferredFoot)}
                  </td>
                  <td
                    className={`px-4 py-2 text-center ${getAttributeTextClassName(player.attackPower)}`}
                  >
                    {player.attackPower}
                  </td>
                  <td
                    className={`px-4 py-2 text-center ${getAttributeTextClassName(player.defenseStrength)}`}
                  >
                    {player.defenseStrength}
                  </td>
                  <td
                    className={`px-4 py-2 text-center ${getAttributeTextClassName(player.midfieldControl)}`}
                  >
                    {player.midfieldControl}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div
                      className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs font-bold ${getOverallBadgeClassName(player.overallRating)}`}
                    >
                      {player.overallRating}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => onEdit(player.id)}
                        className="text-on-surface-variant transition-colors hover:text-primary"
                      >
                        <MaterialIcon name="edit" className="text-[18px]" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => onDelete(player.id)}
                        className="text-on-surface-variant transition-colors hover:text-error"
                      >
                        <MaterialIcon name="delete" className="text-[18px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container px-4 py-3">
        <span className="text-xs text-on-surface-variant">
          Showing {rangeStart}-{rangeEnd} of {totalCount} players
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded p-1 text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface disabled:opacity-50"
            aria-label="Previous page"
          >
            <MaterialIcon name="chevron_left" className="text-[20px]" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded p-1 text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface disabled:opacity-50"
            aria-label="Next page"
          >
            <MaterialIcon name="chevron_right" className="text-[20px]" />
          </button>
        </div>
      </div>
    </div>
  );
};
