import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { UserAccountMenu } from "@/core/components/ui/UserAccountMenu";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
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
            className="w-full rounded border border-outline-variant bg-surface-container-low py-1.5 pr-3 pl-9 text-body-sm text-on-surface caret-primary outline-none placeholder:text-on-surface-variant/50 focus:border-outline-variant focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <UserAccountMenu settingsPath="/admin/settings" />
    </header>
  );
};
