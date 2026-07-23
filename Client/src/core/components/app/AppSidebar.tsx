import { NavLink } from "react-router-dom";
import { MaterialIcon } from "../ui/MaterialIcon";
import { useAppSelector } from "../../store/hooks";

interface AppNavItem {
  to: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}

const navItems: AppNavItem[] = [
  { to: "/app/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/app/president", label: "President", icon: "account_balance" },
  { to: "/app/club", label: "Club", icon: "shield" },
  { to: "/app/facilities", label: "Facilities", icon: "domain" },
  { to: "/app/squad", label: "Squad", icon: "groups" },
  { to: "/app/tactics", label: "Tactics", icon: "strategy" },
  { to: "/app/transfers", label: "Transfers", icon: "swap_horiz" },
  { to: "/app/league", label: "League", icon: "military_tech" },
  { to: "/app/fixtures", label: "Fixtures", icon: "calendar_month" },
  { to: "/app/influence", label: "Influence", icon: "gavel" },
  { to: "/admin", label: "Admin", icon: "admin_panel_settings", adminOnly: true },
];

interface AppSidebarProps {
  divisionName?: string;
  mobileOpen: boolean;
  onClose: () => void;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-3 border-l-4 px-6 py-3 transition-colors",
    isActive
      ? "border-primary bg-surface-container-highest text-primary opacity-90"
      : "border-transparent text-on-surface-variant hover:bg-surface-variant",
  ].join(" ");

export const AppSidebar = ({ divisionName, mobileOpen, onClose }: AppSidebarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || user?.roleName === "Admin",
  );

  return (
    <>
      <nav
        className={[
          "fixed top-0 left-0 z-50 flex h-full w-[280px] flex-col border-r border-outline-variant bg-surface-container-low transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="border-b border-outline-variant px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-surface-variant bg-surface-container-high">
              <MaterialIcon name="sports_soccer" className="text-primary" />
            </div>
            <div>
              <h1 className="text-headline-md font-bold text-primary">AksiyonFutbol</h1>
              <div className="text-label-caps text-on-surface-variant">
                {divisionName ?? "Division"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1 overflow-y-auto py-4">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={navLinkClass}
              onClick={onClose}
            >
              {({ isActive }) => (
                <>
                  <MaterialIcon name={item.icon} filled={isActive} />
                  <span className={`text-body-sm ${isActive ? "font-semibold" : ""}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
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
