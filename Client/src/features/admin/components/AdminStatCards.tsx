import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { AdminDashboardStats } from "@/features/admin/utils/adminDashboardHelpers";

interface AdminStatCardsProps {
  stats: AdminDashboardStats;
}

interface StatCardConfig {
  label: string;
  value: string;
  detail?: string;
  icon: string;
  iconClassName: string;
  valueClassName?: string;
  watermarkIcon: string;
}

export const AdminStatCards = ({ stats }: AdminStatCardsProps) => {
  const cards: StatCardConfig[] = [
    {
      label: "Total Divisions",
      value: String(stats.totalDivisions),
      icon: "account_tree",
      iconClassName: "text-primary",
      watermarkIcon: "hub",
    },
    {
      label: "Total Clubs",
      value: String(stats.totalClubs),
      detail: `${stats.humanClubs} HUM / ${stats.botClubs} BOT`,
      icon: "group_work",
      iconClassName: "text-secondary",
      watermarkIcon: "shield",
    },
    {
      label: "Unplayed Fixtures",
      value: String(stats.unplayedFixtures),
      icon: "warning",
      iconClassName: "text-error",
      valueClassName: "text-error",
      watermarkIcon: "sports_soccer",
    },
    {
      label: "Current Match Week",
      value: stats.currentMatchWeekLabel,
      icon: "event",
      iconClassName: "text-primary",
      watermarkIcon: "calendar_today",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-card-gap sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group relative flex h-24 flex-col justify-between overflow-hidden rounded-lg border border-outline-variant bg-surface p-4 transition-colors hover:bg-surface-variant"
        >
          <div className="absolute -top-4 -right-4 opacity-5 transition-opacity group-hover:opacity-10">
            <MaterialIcon name={card.watermarkIcon} className="text-[100px]" />
          </div>

          <div className="z-10 flex items-center justify-between">
            <span className="text-label-caps text-on-surface-variant">{card.label}</span>
            <MaterialIcon name={card.icon} className={`text-[18px] ${card.iconClassName}`} />
          </div>

          <div className="z-10 flex items-end justify-between">
            <span className={`text-stat-value ${card.valueClassName ?? "text-on-surface"}`}>
              {card.value}
            </span>
            {card.detail && (
              <span className="font-data-mono text-[11px] text-on-surface-variant">
                {card.detail}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
