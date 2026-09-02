import type { ReactNode } from "react";

interface ActionCardStat {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}

interface ActionCardStatsPanelProps {
  stats: ActionCardStat[];
  columns?: 2 | 4;
}

export const ActionCardStatsPanel = ({
  stats,
  columns = 4,
}: ActionCardStatsPanelProps) => {
  const gridClass =
    columns === 2
      ? "grid grid-cols-2 gap-2"
      : "grid grid-cols-2 gap-2 sm:grid-cols-4";

  return (
    <div
      className={[
        "mb-4 rounded border border-[#334155] bg-surface p-2",
        gridClass,
      ].join(" ")}
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={[
            "text-center",
            index > 0 ? "border-[#334155] sm:border-l" : "",
            index === 1 ? "border-l" : "",
          ].join(" ")}
        >
          <div className="font-label-caps text-[10px] uppercase text-on-surface-variant">
            {stat.label}
          </div>
          <div
            className={[
              "font-data-mono text-data-mono",
              stat.valueClassName ?? "text-on-surface",
            ].join(" ")}
          >
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};
