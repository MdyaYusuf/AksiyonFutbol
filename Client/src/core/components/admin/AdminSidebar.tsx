import { NavLink } from "react-router-dom";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";

interface AdminNavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

const navItems: AdminNavItem[] = [
  { to: "/admin", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/admin/league-divisions", label: "League Divisions", icon: "account_tree" },
  { to: "/admin/season-end", label: "Season End", icon: "event_repeat" },
  { to: "/admin/base-players", label: "Base Players", icon: "person_search" },
  { to: "/admin/referees", label: "Referees", icon: "gavel" },
  { to: "/admin/clubs", label: "Clubs", icon: "shield" },
  { to: "/admin/player-instances", label: "Player Instances", icon: "groups" },
  { to: "/admin/matches", label: "Matches", icon: "sports_soccer" },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-3 border-l-4 px-4 py-3 transition-colors",
    isActive
      ? "border-primary bg-surface-container-highest text-primary opacity-90"
      : "border-transparent text-on-surface-variant hover:bg-surface-variant",
  ].join(" ");

export const AdminSidebar = ({ mobileOpen, onClose }: AdminSidebarProps) => {
  return (
    <>
      <nav
        className={[
          "fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-outline-variant bg-surface-container-low transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="border-b border-outline-variant px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-outline-variant bg-surface-variant">
              <MaterialIcon name="admin_panel_settings" className="text-primary" filled />
            </div>
            <div>
              <h1 className="text-headline-sm font-bold text-primary leading-tight">AksiyonFutbol</h1>
              <p className="text-body-sm text-on-surface-variant">Admin Console</p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navLinkClass}
              onClick={onClose}
            >
              {({ isActive }) => (
                <>
                  <MaterialIcon name={item.icon} filled={isActive} className="text-lg" />
                  <span className={`text-body-sm ${isActive ? "font-semibold" : ""}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="border-t border-outline-variant p-4">
          <NavLink
            to="/app/dashboard"
            className="flex items-center gap-2 text-body-sm text-on-surface-variant transition-colors hover:text-primary"
            onClick={onClose}
          >
            <MaterialIcon name="arrow_back" className="text-base" />
            Back to App
          </NavLink>
        </div>
      </nav>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};
