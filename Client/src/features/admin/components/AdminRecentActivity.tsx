import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import {
  formatRelativeTime,
  type ActivityType,
  type RecentActivityItem,
} from "@/features/admin/utils/adminDashboardHelpers";

interface AdminRecentActivityProps {
  items: RecentActivityItem[];
}

const activityConfig: Record<
  ActivityType,
  { icon: string; iconClassName: string; containerClassName: string }
> = {
  "match-created": {
    icon: "sports",
    iconClassName: "text-primary",
    containerClassName: "bg-primary/10 border-primary/20",
  },
  "club-created": {
    icon: "add_circle",
    iconClassName: "text-secondary",
    containerClassName: "bg-secondary/10 border-secondary/20",
  },
  "match-played": {
    icon: "scoreboard",
    iconClassName: "text-on-surface-variant",
    containerClassName: "bg-on-surface-variant/10 border-outline-variant",
  },
};

export const AdminRecentActivity = ({ items }: AdminRecentActivityProps) => {
  return (
    <div className="flex w-full flex-col rounded-lg border border-outline-variant bg-surface lg:w-3/5">
      <div className="flex items-center justify-between rounded-t-lg border-b border-outline-variant bg-surface-container-low p-4">
        <h3 className="text-headline-sm text-on-surface">Recent Activity</h3>
        <button
          type="button"
          className="text-label-caps text-primary transition-colors hover:text-primary-fixed"
        >
          View Logs
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center text-body-sm text-on-surface-variant">
          No recent activity yet.
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-outline-variant">
          {items.map((item) => {
            const config = activityConfig[item.type];

            return (
              <li
                key={item.id}
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-variant"
              >
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border ${config.containerClassName}`}
                >
                  <MaterialIcon
                    name={config.icon}
                    className={`text-[14px] ${config.iconClassName}`}
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-body-sm text-on-surface">{item.title}</span>
                  <span className="mt-0.5 font-data-mono text-[11px] text-on-surface-variant">
                    {formatRelativeTime(item.sortDate)} • {item.subtitle}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
