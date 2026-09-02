import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { AdminProjectedMovementRow } from "@/features/seasonTransitions/utils/adminProcessSeasonEndHelpers";
import { getClubInitial } from "@/features/seasonTransitions/utils/endOfSeasonHelpers";

interface AdminSeasonEndMoversTableProps {
  divisionName: string;
  rows: AdminProjectedMovementRow[];
  totalClubCount: number;
  showAll: boolean;
  onToggleShowAll: () => void;
}

const directionBadge = (kind: AdminProjectedMovementRow["kind"]) => {
  if (kind === "champion") {
    return {
      icon: "trophy",
      iconClass: "text-secondary",
      label: "Champion",
      badgeClass: "border-secondary/20 bg-secondary/10 text-secondary",
    };
  }

  if (kind === "promoted") {
    return {
      icon: "arrow_upward",
      iconClass: "text-primary",
      label: "Promoted",
      badgeClass: "border-primary/20 bg-primary/10 text-primary",
    };
  }

  if (kind === "relegated") {
    return {
      icon: "arrow_downward",
      iconClass: "text-error",
      label: "Relegated",
      badgeClass: "border-error/20 bg-error/10 text-error",
    };
  }

  return {
    icon: "remove",
    iconClass: "text-on-surface-variant",
    label: "Stayed",
    badgeClass: "border-outline-variant bg-surface-container-low text-on-surface-variant",
  };
};

export const AdminSeasonEndMoversTable = ({
  divisionName,
  rows,
  totalClubCount,
  showAll,
  onToggleShowAll,
}: AdminSeasonEndMoversTableProps) => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-high p-4">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          Projected Movement: {divisionName}
        </h3>
        <span className="rounded border border-outline-variant bg-surface-container-lowest px-2 py-1 font-data-mono text-xs text-on-surface-variant">
          Group ladder
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="w-12 p-3 font-label-caps text-label-caps uppercase text-on-surface-variant">
                Status
              </th>
              <th className="p-3 font-label-caps text-label-caps uppercase text-on-surface-variant">
                Club
              </th>
              <th className="p-3 text-right font-label-caps text-label-caps uppercase text-on-surface-variant">
                Pts
              </th>
              <th className="p-3 font-label-caps text-label-caps uppercase text-on-surface-variant">
                Direction
              </th>
              <th className="p-3 font-label-caps text-label-caps uppercase text-on-surface-variant">
                New Division
              </th>
            </tr>
          </thead>
          <tbody className="font-data-mono text-data-mono text-on-surface">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-on-surface-variant">
                  No projected movements for this division.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const badge = directionBadge(row.kind);

                return (
                  <tr
                    key={`${row.kind}-${row.clubId}`}
                    className="border-b border-surface-variant hover:bg-surface-variant"
                  >
                    <td className="p-3 text-center">
                      <MaterialIcon name={badge.icon} className={`text-sm ${badge.iconClass}`} />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded border border-outline-variant bg-surface-container-high text-[10px] font-bold">
                          {getClubInitial(row.clubName)}
                        </div>
                        {row.clubName}
                      </div>
                    </td>
                    <td className="p-3 text-right">{row.points}</td>
                    <td className="p-3">
                      <span
                        className={`rounded border px-2 py-1 text-xs ${badge.badgeClass}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-3 text-on-surface-variant">{row.newDivisionLabel}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalClubCount > 0 ? (
        <div className="border-t border-outline-variant bg-surface-container-lowest p-3 text-center">
          <button
            type="button"
            onClick={onToggleShowAll}
            className="flex w-full items-center justify-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-primary"
          >
            <MaterialIcon
              name={showAll ? "expand_less" : "expand_more"}
              className="text-sm"
            />
            {showAll ? "Show movers only" : `View All ${totalClubCount} Clubs`}
          </button>
        </div>
      ) : null}
    </div>
  );
};
