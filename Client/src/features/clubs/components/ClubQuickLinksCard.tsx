import { Link } from "react-router-dom";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";

const quickLinks = [
  { to: "/app/squad", label: "Manage Squad", icon: "groups" },
  { to: "/app/fixtures", label: "View Fixtures", icon: "calendar_month" },
  { to: "/app/league", label: "League Table", icon: "table_chart" },
  { to: "/app/president", label: "Staff & Board", icon: "handshake" },
] as const;

export const ClubQuickLinksCard = () => {
  return (
    <div className="grid grid-cols-2 gap-card-gap xl:col-span-6">
      {quickLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="group flex flex-col items-center justify-center gap-3 rounded-lg border border-outline-variant bg-surface-container-high p-6 transition-colors hover:bg-surface-variant"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-surface-container-highest transition-colors group-hover:border-primary">
            <MaterialIcon
              name={link.icon}
              className="text-[24px] text-on-surface-variant transition-colors group-hover:text-primary"
            />
          </div>
          <span className="text-body-lg font-bold text-on-surface">{link.label}</span>
        </Link>
      ))}
    </div>
  );
};
