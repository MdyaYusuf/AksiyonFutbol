import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { SquadPositionFilter } from "../../playerInstances/utils/squadHelpers";
import { getSquadFilterChipClassName } from "../../playerInstances/utils/squadHelpers";
import {
  TRANSFER_POSITION_FILTERS,
  TRANSFER_SORT_OPTIONS,
  type TransferMarketSortOption,
} from "../utils/transferMarketHelpers";

interface TransferMarketToolbarProps {
  positionFilter: SquadPositionFilter;
  onPositionFilterChange: (filter: SquadPositionFilter) => void;
  sortOption: TransferMarketSortOption;
  onSortOptionChange: (sort: TransferMarketSortOption) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export const TransferMarketToolbar = ({
  positionFilter,
  onPositionFilterChange,
  sortOption,
  onSortOptionChange,
  searchQuery,
  onSearchQueryChange,
}: TransferMarketToolbarProps) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-outline-variant bg-surface-container p-4 md:flex-row md:items-center">
      <div className="flex flex-wrap items-center gap-2">
        {TRANSFER_POSITION_FILTERS.map((filter) => {
          const isActive = positionFilter === filter;
          const label = filter === "FWD" ? "ST" : filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => onPositionFilterChange(filter)}
              className={getSquadFilterChipClassName(filter, isActive)}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row md:w-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search players, clubs..."
          className="w-full rounded border border-outline-variant bg-surface-container-low px-3 py-1.5 text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary sm:w-56"
        />
        <div className="relative w-full sm:w-48">
          <select
            value={sortOption}
            onChange={(event) =>
              onSortOptionChange(event.target.value as TransferMarketSortOption)
            }
            className="w-full appearance-none rounded border border-outline-variant bg-surface-container-low py-1.5 pr-8 pl-3 text-body-sm text-on-surface outline-none focus:border-primary"
          >
            {TRANSFER_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <MaterialIcon
            name="expand_more"
            className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[18px] text-on-surface-variant"
          />
        </div>
      </div>
    </div>
  );
};
