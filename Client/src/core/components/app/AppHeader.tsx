import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { UserAccountMenu } from "@/core/components/ui/UserAccountMenu";
import { formatCash } from "@/features/dashboard/utils/dashboardFormatters";

interface AppHeaderProps {
  cash?: number;
  cashSpendLocked?: boolean;
  legitimacy?: number;
  infamy?: number;
  onMenuClick: () => void;
}

export const AppHeader = ({
  cash,
  cashSpendLocked,
  legitimacy,
  infamy,
  onMenuClick,
}: AppHeaderProps) => {
  const showPresidentStats = legitimacy !== undefined || infamy !== undefined;

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

      <div className="flex items-center gap-4 sm:gap-6">
        {cash !== undefined && (
          <div className="flex items-center gap-1 font-data-mono text-data-mono text-primary">
            {cashSpendLocked ? (
              <MaterialIcon name="lock" className="text-sm text-on-surface-variant" />
            ) : null}
            {formatCash(cash)}
          </div>
        )}
        {showPresidentStats ? (
          <div className="flex items-center gap-3 sm:gap-4">
            {legitimacy !== undefined ? (
              <div
                className="font-data-mono text-data-mono text-violet-400"
                title="Legitimacy"
              >
                <span className="hidden sm:inline">Leg: </span>
                {legitimacy}
              </div>
            ) : null}
            {infamy !== undefined ? (
              <div
                className="font-data-mono text-data-mono text-secondary"
                title="Infamy"
              >
                <span className="hidden sm:inline">Inf: </span>
                {infamy}
              </div>
            ) : null}
          </div>
        ) : null}
        <div className="ml-2 border-l border-outline-variant pl-4">
          <UserAccountMenu settingsPath="/app/settings" />
        </div>
      </div>
    </header>
  );
};
