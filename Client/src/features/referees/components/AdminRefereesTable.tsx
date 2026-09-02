import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { RefereeResponse } from "@/features/referees/refereeTypes";
import {
  getBriberyBarClassName,
  getBriberyTextClassName,
  getPersonalityBadgeClassName,
  getPersonalityLabel,
} from "@/features/referees/utils/adminRefereesHelpers";

interface AdminRefereesTableProps {
  referees: RefereeResponse[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (currentPage: number) => void;
  onEdit: (refereeId: number) => void;
  onDelete: (refereeId: number) => void;
}

export const AdminRefereesTable = ({
  referees,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onEdit,
  onDelete,
}: AdminRefereesTableProps) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded border border-outline-variant bg-surface-container shadow-sm">
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 border-b border-outline-variant bg-surface-container-high">
            <tr>
              <th className="px-4 py-3 text-label-caps font-medium text-on-surface-variant">
                Name
              </th>
              <th className="px-4 py-3 text-label-caps font-medium text-on-surface-variant">
                Personality
              </th>
              <th className="px-4 py-3 text-label-caps font-medium text-on-surface-variant">
                Bribery Difficulty
              </th>
              <th className="hidden px-4 py-3 text-label-caps font-medium text-on-surface-variant md:table-cell">
                Biography
              </th>
              <th className="px-4 py-3 text-right text-label-caps font-medium text-on-surface-variant">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {referees.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-body-sm text-on-surface-variant"
                >
                  No referees found.
                </td>
              </tr>
            ) : (
              referees.map((referee) => (
                <tr
                  key={referee.id}
                  className="group transition-colors hover:bg-surface-container-highest"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-variant">
                        <MaterialIcon
                          name="person"
                          className="text-[18px] text-on-surface-variant"
                        />
                      </div>
                      <span className="font-medium text-on-surface">
                        {referee.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-bold ${getPersonalityBadgeClassName(referee.personalityType)}`}
                    >
                      {getPersonalityLabel(referee.personalityType)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-16 overflow-hidden rounded bg-surface-container-lowest">
                        <div
                          className={`h-full ${getBriberyBarClassName(referee.briberyDifficulty)}`}
                          style={{
                            width: `${Math.min(100, Math.max(0, referee.briberyDifficulty))}%`,
                          }}
                        />
                      </div>
                      <span
                        className={`font-data-mono text-data-mono ${getBriberyTextClassName(referee.briberyDifficulty)}`}
                      >
                        {referee.briberyDifficulty}
                      </span>
                    </div>
                  </td>
                  <td className="hidden max-w-[200px] truncate px-4 py-3 text-xs text-on-surface-variant md:table-cell">
                    {referee.biography?.trim() || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => onEdit(referee.id)}
                        className="p-1 text-on-surface-variant transition-colors hover:text-secondary"
                      >
                        <MaterialIcon name="edit" className="text-[18px]" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => onDelete(referee.id)}
                        className="p-1 text-on-surface-variant transition-colors hover:text-error"
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

      <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-high p-3 text-xs text-on-surface-variant">
        <span>
          Showing {rangeStart}-{rangeEnd} of {totalCount} Referees
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded px-2 py-1 transition-colors hover:bg-surface-variant disabled:opacity-50"
          >
            Prev
          </button>
          <span className="rounded bg-surface-variant px-2 py-1 text-on-surface">
            {currentPage}
          </span>
          <span className="px-1">/</span>
          <span className="px-1">{totalPages}</span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded px-2 py-1 transition-colors hover:bg-surface-variant disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
