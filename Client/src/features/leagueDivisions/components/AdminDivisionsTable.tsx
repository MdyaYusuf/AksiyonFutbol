import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { LeagueDivisionResponse } from "@/features/leagueDivisions/leagueDivisionTypes";
import {
  getGroupDisplayLabel,
  getTierBadgeLabel,
  getTierDotClassName,
} from "@/features/leagueDivisions/utils/adminLeagueDivisionsHelpers";

interface AdminDivisionsTableProps {
  divisions: LeagueDivisionResponse[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (currentPage: number) => void;
  onEdit: (divisionId: number) => void;
  onDelete: (divisionId: number) => void;
  onAdvanceWeek: (divisionId: number) => void;
  advancingDivisionId?: number | null;
}

export const AdminDivisionsTable = ({
  divisions,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onEdit,
  onDelete,
  onAdvanceWeek,
  advancingDivisionId,
}: AdminDivisionsTableProps) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container-high shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-highest">
              <th className="w-1/3 px-4 py-3 text-label-caps font-bold text-on-surface-variant">
                Division Name
              </th>
              <th className="w-1/6 px-4 py-3 text-label-caps font-bold text-on-surface-variant">
                Tier
              </th>
              <th className="w-1/6 px-4 py-3 text-label-caps font-bold text-on-surface-variant">
                Group
              </th>
              <th className="px-4 py-3 text-center text-label-caps font-bold text-on-surface-variant">
                Teams Count
              </th>
              <th className="px-4 py-3 text-center text-label-caps font-bold text-on-surface-variant">
                MW
              </th>
              <th className="px-4 py-3 text-right text-label-caps font-bold text-on-surface-variant">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-body-sm text-on-surface">
            {divisions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-on-surface-variant">
                  No divisions found.
                </td>
              </tr>
            ) : (
              divisions.map((division) => (
                <tr
                  key={division.id}
                  className="group border-b border-outline-variant transition-colors last:border-b-0 hover:bg-surface-container-highest"
                >
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${getTierDotClassName(division.tier)}`}
                      />
                      {division.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded border border-outline-variant bg-surface-variant px-2 py-0.5 font-data-mono text-[11px] text-on-surface-variant">
                      {getTierBadgeLabel(division.tier)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {getGroupDisplayLabel(division.groupNumber)}
                  </td>
                  <td className="px-4 py-3 text-center font-data-mono text-data-mono">
                    {division.clubCount ?? 0}
                  </td>
                  <td className="px-4 py-3 text-center font-data-mono text-data-mono">
                    {division.currentMatchWeek}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
                      <button
                        type="button"
                        title="Process match week"
                        onClick={() => onAdvanceWeek(division.id)}
                        disabled={advancingDivisionId === division.id}
                        className="text-on-surface-variant transition-colors hover:text-primary disabled:opacity-50"
                      >
                        <MaterialIcon name="fast_forward" className="text-[18px]" />
                      </button>
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => onEdit(division.id)}
                        className="text-on-surface-variant transition-colors hover:text-primary"
                      >
                        <MaterialIcon name="edit" className="text-[18px]" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => onDelete(division.id)}
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

      <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-highest p-3 text-[10px] text-label-caps text-on-surface-variant">
        <span>
          Showing {rangeStart}-{rangeEnd} of {totalCount} divisions
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1 transition-colors hover:text-on-surface disabled:opacity-50"
            aria-label="Previous page"
          >
            <MaterialIcon name="chevron_left" className="text-[16px]" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1 transition-colors hover:text-on-surface disabled:opacity-50"
            aria-label="Next page"
          >
            <MaterialIcon name="chevron_right" className="text-[16px]" />
          </button>
        </div>
      </div>
    </div>
  );
};
