import { MaterialIcon } from "../ui/MaterialIcon";
import { UserAccountMenu } from "../ui/UserAccountMenu";
import { formatCash } from "../../../features/dashboard/utils/dashboardFormatters";

interface AppHeaderProps {
  cash?: number;
  reputation?: number;
  onMenuClick: () => void;
}

export const AppHeader = ({ cash, reputation, onMenuClick }: AppHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface px-6">
      <div className="flex items-center gap-4">
        <div className="hidden items-center rounded border border-outline-variant bg-background px-3 py-1.5 md:flex">
          <MaterialIcon name="search" className="mr-2 text-sm text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search players, clubs..."
            className="w-48 border-none bg-transparent p-0 text-body-sm text-on-surface caret-primary outline-none placeholder:text-on-surface-variant focus:outline-none focus:ring-0"
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
        <div className="ml-2 border-l border-outline-variant pl-4">
          <UserAccountMenu settingsPath="/app/settings" />
        </div>
      </div>
    </header>
  );
};
