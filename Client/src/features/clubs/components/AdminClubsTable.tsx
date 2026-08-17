import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { formatCash } from "../../dashboard/utils/dashboardFormatters";
import { getTierBadgeLabel } from "../../leagueDivisions/utils/adminLeagueDivisionsHelpers";
import type { ClubResponse } from "../clubTypes";
import {
  getClubInitials,
  getStatusBarColor,
  getTierBadgeClassName,
} from "../utils/adminClubsHelpers";

interface AdminClubsTableProps {
  clubs: ClubResponse[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (currentPage: number) => void;
  onEdit: (clubId: string) => void;
  onDelete: (clubId: string) => void;
}

const ConditionBars = ({
  morale,
  chemistry,
  discipline,
}: {
  morale: number;
  chemistry: number;
  discipline: number;
}) => (
  <div className="flex items-center gap-1.5">
    {[
      { value: morale, label: `Morale: ${morale}` },
      { value: chemistry, label: `Chemistry: ${chemistry}` },
      { value: discipline, label: `Discipline: ${discipline}` },
    ].map((item) => (
      <div
        key={item.label}
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high"
        title={item.label}
      >
        <div
          className={`h-full ${getStatusBarColor(item.value)}`}
          style={{ width: `${Math.min(100, Math.max(0, item.value))}%` }}
        />
      </div>
    ))}
  </div>
);

export const AdminClubsTable = ({
  clubs,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onEdit,
  onDelete,
}: AdminClubsTableProps) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface">
        <div className="overflow-auto">
          <table className="w-full border-collapse text-left whitespace-nowrap">
            <thead className="sticky top-0 z-10 border-b border-outline-variant bg-surface-container-high shadow-sm">
              <tr>
                <th className="w-64 px-4 py-3 text-label-caps text-on-surface-variant">
                  Club Name
                </th>
                <th className="px-4 py-3 text-label-caps text-on-surface-variant">Division</th>
                <th className="px-4 py-3 text-center text-label-caps text-on-surface-variant">
                  Tier
                </th>
                <th className="px-4 py-3 text-center text-label-caps text-on-surface-variant">
                  Type
                </th>
                <th className="px-4 py-3 text-label-caps text-on-surface-variant">President</th>
                <th className="px-4 py-3 text-right text-label-caps text-on-surface-variant">
                  Cash
                </th>
                <th className="px-4 py-3 text-right text-label-caps text-on-surface-variant">
                  Wage Budget
                </th>
                <th className="w-48 px-4 py-3 text-label-caps text-on-surface-variant">
                  Condition (M/C/D)
                </th>
                <th className="w-20 px-4 py-3 text-center text-label-caps text-on-surface-variant">
                  Act
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50 font-data-mono text-data-mono">
              {clubs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-body-sm text-on-surface-variant">
                    No clubs found.
                  </td>
                </tr>
              ) : (
                clubs.map((club) => (
                  <tr
                    key={club.id}
                    className={[
                      "group h-table-row-height transition-colors hover:bg-surface-variant/30",
                      club.isBot ? "bg-surface-container-lowest/50" : "",
                    ].join(" ")}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={[
                            "flex h-6 w-6 items-center justify-center rounded border border-outline-variant bg-surface-container-high",
                            club.isBot ? "text-on-surface-variant" : "text-xs font-bold text-primary",
                          ].join(" ")}
                        >
                          {club.isBot ? (
                            <MaterialIcon name="smart_toy" className="text-[14px]" />
                          ) : (
                            getClubInitials(club.name)
                          )}
                        </div>
                        <span
                          className={[
                            "font-medium",
                            club.isBot ? "text-on-surface-variant" : "text-on-surface",
                          ].join(" ")}
                        >
                          {club.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-on-surface-variant">
                      {club.divisionName ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-bold ${getTierBadgeClassName(club.divisionTier)}`}
                      >
                        {club.divisionTier != null ? getTierBadgeLabel(club.divisionTier) : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={[
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase",
                          club.isBot
                            ? "border-outline-variant bg-surface-container-highest text-on-surface-variant"
                            : "border-primary/20 bg-primary/10 text-primary",
                        ].join(" ")}
                      >
                        {club.isBot ? "Bot" : "Human"}
                      </span>
                    </td>
                    <td className="max-w-[120px] truncate px-4 py-2 text-on-surface-variant">
                      {club.isBot || !club.presidentName ? (
                        <span className="font-bold text-outline-variant">—</span>
                      ) : (
                        club.presidentName
                      )}
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-primary">
                      {formatCash(club.cash)}
                    </td>
                    <td className="px-4 py-2 text-right text-on-surface-variant">
                      {formatCash(club.wageBudget)}
                    </td>
                    <td className="px-4 py-2">
                      <ConditionBars
                        morale={club.morale}
                        chemistry={club.chemistry}
                        discipline={club.discipline}
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => onEdit(club.id)}
                          className="text-on-surface-variant transition-colors hover:text-primary"
                        >
                          <MaterialIcon name="edit" className="text-[18px]" />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => onDelete(club.id)}
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
      </div>

      <div className="flex shrink-0 items-center justify-between font-data-mono text-xs text-on-surface-variant">
        <span>
          Showing {rangeStart}-{rangeEnd} of {totalCount} clubs
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded border border-outline-variant p-1 transition-colors hover:bg-surface-variant disabled:opacity-50"
            aria-label="Previous page"
          >
            <MaterialIcon name="chevron_left" className="text-[16px]" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded border border-outline-variant p-1 transition-colors hover:bg-surface-variant disabled:opacity-50"
            aria-label="Next page"
          >
            <MaterialIcon name="chevron_right" className="text-[16px]" />
          </button>
        </div>
      </div>
    </div>
  );
};
