import { Link } from "react-router-dom";
import { MaterialIcon } from "../ui/MaterialIcon";
import { useAppSelector } from "../../store/hooks";
import { formatCash } from "../../../features/dashboard/utils/dashboardFormatters";

interface AppHeaderProps {
  cash?: number;
  reputation?: number;
  onMenuClick: () => void;
}

export const AppHeader = ({ cash, reputation, onMenuClick }: AppHeaderProps) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface px-6">
      <div className="flex items-center gap-4">
        <div className="hidden items-center rounded border border-outline-variant bg-background px-3 py-1.5 focus-within:border-primary md:flex">
          <MaterialIcon name="search" className="mr-2 text-sm text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search players, clubs..."
            className="w-48 border-none bg-transparent p-0 text-body-sm text-on-surface placeholder:text-on-surface-variant focus:ring-0"
          />
        </div>
        <button
          type="button"
          className="text-on-surface transition-colors hover:text-primary lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <MaterialIcon name="menu" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        {cash !== undefined && (
          <div className="font-data-mono text-data-mono text-primary">{formatCash(cash)}</div>
        )}
        {reputation !== undefined && (
          <div className="font-data-mono text-data-mono text-on-surface-variant">
            Rep: {reputation}
          </div>
        )}
        <div className="ml-2 flex items-center gap-3 border-l border-outline-variant pl-4">
          <button
            type="button"
            className="relative text-on-surface-variant transition-colors hover:text-primary"
            aria-label="Notifications"
          >
            <MaterialIcon name="notifications" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
          </button>
          <Link
            to="/app/settings"
            className="text-on-surface-variant transition-colors hover:text-primary"
            aria-label="Settings"
          >
            <MaterialIcon name="settings" />
          </Link>
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-high">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <MaterialIcon name="person" className="text-on-surface-variant text-sm" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
