import { Link } from "react-router-dom";
import { MaterialIcon } from "../ui/MaterialIcon";
import { useAppSelector } from "../../store/hooks";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface px-6">
      <div className="flex flex-1 items-center gap-4">
        <button
          type="button"
          className="text-primary transition-colors hover:text-primary-fixed lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <MaterialIcon name="menu" />
        </button>

        <div className="relative hidden max-w-md flex-1 lg:block">
          <MaterialIcon
            name="search"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-on-surface-variant"
          />
          <input
            type="text"
            placeholder="Search entity ID, club, or manager..."
            className="w-full rounded border border-outline-variant bg-surface-container-low py-1.5 pr-3 pl-9 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 text-on-surface-variant">
        <button
          type="button"
          className="relative transition-colors hover:text-primary"
          aria-label="Notifications"
        >
          <MaterialIcon name="notifications" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full border border-surface bg-error" />
        </button>
        <Link
          to="/admin/settings"
          className="transition-colors hover:text-primary"
          aria-label="Settings"
        >
          <MaterialIcon name="settings" />
        </Link>
        <div className="ml-2 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-high">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <MaterialIcon name="person" className="text-sm text-on-surface-variant" />
          )}
        </div>
      </div>
    </header>
  );
};
