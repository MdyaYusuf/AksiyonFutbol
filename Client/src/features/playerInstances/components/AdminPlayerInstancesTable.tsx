import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { formatCash } from "@/features/dashboard/utils/dashboardFormatters";
import { getClubInitials } from "@/features/clubs/utils/adminClubsHelpers";
import {
  getOverallBadgeClassName,
  getPlayerInitials,
  getPositionBadgeClassName,
  getPositionLabel,
} from "@/features/playerInstances/utils/squadHelpers";
import type { PlayerInstanceResponse } from "@/features/playerInstances/playerInstanceTypes";
import { getInjuryStatusLabel } from "@/features/playerInstances/utils/adminPlayerInstancesHelpers";

interface AdminPlayerInstancesTableProps {
  players: PlayerInstanceResponse[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (currentPage: number) => void;
  onFilterByClub: (clubId: string) => void;
  onEdit: (playerId: string) => void;
  onDelete: (playerId: string) => void;
}

export const AdminPlayerInstancesTable = ({
  players,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onFilterByClub,
  onEdit,
  onDelete,
}: AdminPlayerInstancesTableProps) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-col overflow-hidden rounded border border-outline-variant bg-surface-container-low">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-highest">
              <th className="px-4 py-3 text-label-caps font-bold text-on-surface-variant">
                Player
              </th>
              <th className="px-4 py-3 text-label-caps font-bold text-on-surface-variant">Club</th>
              <th className="w-16 px-4 py-3 text-label-caps font-bold text-on-surface-variant">
                Pos
              </th>
              <th className="w-16 px-4 py-3 text-label-caps font-bold text-on-surface-variant">
                Age
              </th>
              <th className="w-16 px-4 py-3 text-label-caps font-bold text-on-surface-variant">
                OVR
              </th>
              <th className="px-4 py-3 text-label-caps font-bold text-on-surface-variant">
                Status
              </th>
              <th className="px-4 py-3 text-center text-label-caps font-bold text-on-surface-variant">
                G/A
              </th>
              <th className="px-4 py-3 text-right text-label-caps font-bold text-on-surface-variant">
                Value
              </th>
              <th className="px-4 py-3 text-right text-label-caps font-bold text-on-surface-variant">
                Wage
              </th>
              <th className="px-4 py-3 text-right text-label-caps font-bold text-on-surface-variant">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant text-body-sm text-on-surface">
            {players.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-on-surface-variant">
                  No player instances found.
                </td>
              </tr>
            ) : (
              players.map((player) => (
                <tr
                  key={player.id}
                  className="group h-table-row-height transition-colors hover:bg-surface-variant"
                >
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface-container-highest text-label-caps font-bold text-on-surface">
                        {getPlayerInitials(player.firstName, player.lastName)}
                      </div>
                      <span className="font-semibold">
                        {player.firstName} {player.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => onFilterByClub(player.clubId)}
                      className="flex items-center gap-2 text-on-surface-variant transition-colors hover:text-primary"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-outline-variant bg-surface-container-highest text-[8px] font-bold">
                        {getClubInitials(player.clubName)}
                      </div>
                      <span>{player.clubName}</span>
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${getPositionBadgeClassName(player.position)}`}
                    >
                      {getPositionLabel(player.position)}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-data-mono text-data-mono">{player.age}</td>
                  <td className="px-4 py-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded font-data-mono text-[12px] font-bold ${getOverallBadgeClassName(player.overallRating)}`}
                    >
                      {player.overallRating}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {player.isInjured ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-error/30 bg-error/10 px-2 py-1 text-[10px] font-bold text-error">
                        <MaterialIcon name="medical_services" className="text-[12px]" />
                        {getInjuryStatusLabel(player)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                        <MaterialIcon name="check_circle" className="text-[12px]" />
                        Available
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center font-data-mono text-data-mono">
                    {player.seasonGoals} / {player.seasonAssists}
                  </td>
                  <td className="px-4 py-2 text-right font-data-mono text-data-mono text-on-surface-variant">
                    {formatCash(player.marketValue)}
                  </td>
                  <td className="px-4 py-2 text-right font-data-mono text-data-mono text-on-surface-variant">
                    {formatCash(player.wage)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity lg:opacity-50 lg:group-hover:opacity-100">
                      <button
                        type="button"
                        title="Filter club squad"
                        onClick={() => onFilterByClub(player.clubId)}
                        className="text-on-surface-variant transition-colors hover:text-primary"
                      >
                        <MaterialIcon name="groups" className="text-lg" />
                      </button>
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => onEdit(player.id)}
                        className="text-on-surface-variant transition-colors hover:text-secondary"
                      >
                        <MaterialIcon name="edit" className="text-lg" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => onDelete(player.id)}
                        className="text-on-surface-variant transition-colors hover:text-error"
                      >
                        <MaterialIcon name="delete" className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-highest p-3 text-body-sm text-on-surface-variant">
        <span>
          Showing {rangeStart} to {rangeEnd} of {totalCount} players
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded border border-outline-variant px-2 py-1 transition-colors hover:bg-surface-variant disabled:opacity-50"
            aria-label="Previous page"
          >
            <MaterialIcon name="chevron_left" className="text-sm" />
          </button>
          <span className="rounded border border-outline-variant bg-surface-variant px-3 py-1 font-bold text-primary">
            {currentPage}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded border border-outline-variant px-2 py-1 transition-colors hover:bg-surface-variant disabled:opacity-50"
            aria-label="Next page"
          >
            <MaterialIcon name="chevron_right" className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};
