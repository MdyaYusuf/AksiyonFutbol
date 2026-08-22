import {
  DEAL_STATUS_FILTER_OPTIONS,
  getDealStatusFilterChipClassName,
  type DealStatusFilter,
} from "../utils/myDealsHelpers";

interface MyDealsToolbarProps {
  statusFilters: DealStatusFilter[];
  onToggleStatusFilter: (filter: DealStatusFilter) => void;
}

export const MyDealsToolbar = ({
  statusFilters,
  onToggleStatusFilter,
}: MyDealsToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-outline-variant bg-surface-container p-4">
      {DEAL_STATUS_FILTER_OPTIONS.map((option) => {
        const isActive = statusFilters.includes(option.id);

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onToggleStatusFilter(option.id)}
            className={getDealStatusFilterChipClassName(option.id, isActive)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
