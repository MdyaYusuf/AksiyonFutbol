import { Link } from "react-router-dom";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import {
  getGroupDisplayLabel,
  type DivisionGlanceRow,
  type DivisionHealthStatus,
} from "@/features/admin/utils/adminDashboardHelpers";

interface AdminDivisionsGlanceTableProps {
  rows: DivisionGlanceRow[];
}

const statusStyles: Record<
  DivisionHealthStatus,
  { badgeClassName: string; dotClassName: string; icon: string }
> = {
  healthy: {
    badgeClassName: "bg-primary/10 border-primary/20 text-primary",
    dotClassName: "bg-primary",
    icon: "check_circle",
  },
  pending: {
    badgeClassName: "bg-secondary/10 border-secondary/20 text-secondary",
    dotClassName: "bg-secondary",
    icon: "schedule",
  },
  alert: {
    badgeClassName: "bg-error/10 border-error/20 text-error",
    dotClassName: "bg-error",
    icon: "error",
  },
};

export const AdminDivisionsGlanceTable = ({ rows }: AdminDivisionsGlanceTableProps) => {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface">
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low p-4">
        <h3 className="text-headline-sm text-on-surface">Divisions at a glance</h3>
        <Link
          to="/admin/league-divisions"
          className="text-label-caps text-primary transition-colors hover:text-primary-fixed"
        >
          Manage
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="p-8 text-center text-body-sm text-on-surface-variant">
          No divisions created yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-lowest text-label-caps text-on-surface-variant">
                <th className="px-4 py-3 font-medium whitespace-nowrap">Division Name</th>
                <th className="px-4 py-3 text-center font-medium">Tier</th>
                <th className="px-4 py-3 text-center font-medium">Group</th>
                <th className="px-4 py-3 text-center font-medium">Match Week</th>
                <th className="px-4 py-3 text-right font-medium">Clubs (H/B)</th>
                <th className="px-4 py-3 text-right font-medium">Unplayed</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
                <th className="w-10 px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-data-mono text-data-mono text-on-surface">
              {rows.map((row) => {
                const statusStyle = statusStyles[row.status];

                return (
                  <tr
                    key={row.id}
                    className="group h-table-row-height cursor-pointer transition-colors hover:bg-surface-variant"
                  >
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${statusStyle.dotClassName}`} />
                        <span className="font-body-sm font-medium text-body-sm">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center text-on-surface-variant">{row.tier}</td>
                    <td className="px-4 py-2 text-center text-on-surface-variant">
                      {getGroupDisplayLabel(row.groupNumber)}
                    </td>
                    <td className="px-4 py-2 text-center">{row.currentMatchWeek}</td>
                    <td className="px-4 py-2 text-right">
                      {row.totalClubs}{" "}
                      <span className="text-on-surface-variant opacity-70">
                        ({row.humanClubs}/{row.botClubs})
                      </span>
                    </td>
                    <td
                      className={[
                        "px-4 py-2 text-right",
                        row.unplayedThisWeek > 0 ? "text-secondary" : "",
                        row.status === "alert" ? "font-bold text-error" : "",
                      ].join(" ")}
                    >
                      {row.unplayedThisWeek}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] text-label-caps ${statusStyle.badgeClassName}`}
                        >
                          <MaterialIcon name={statusStyle.icon} className="text-[12px]" />
                          {row.statusLabel}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        to="/admin/league-divisions"
                        className="inline-flex opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label={`Open ${row.name}`}
                      >
                        <MaterialIcon
                          name="chevron_right"
                          className="text-[18px] text-on-surface-variant hover:text-primary"
                        />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
