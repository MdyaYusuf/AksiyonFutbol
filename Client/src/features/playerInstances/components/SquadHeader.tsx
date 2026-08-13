import type { SquadPositionFilter } from "../utils/squadHelpers";
import {
  getSquadFilterChipClassName,
  POSITION_FILTERS,
} from "../utils/squadHelpers";

interface SquadHeaderProps {
  positionFilter: SquadPositionFilter;
  onPositionFilterChange: (filter: SquadPositionFilter) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export const SquadHeader = ({
  positionFilter,
  onPositionFilterChange,
  searchQuery,
  onSearchQueryChange,
}: SquadHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h2 className="mb-1 text-headline-md text-on-surface">First Team Squad</h2>
        <p className="text-body-sm text-on-surface-variant">
          Manage your roster, monitor fitness, and negotiate contracts.
        </p>
      </div>

      <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:items-end">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search players..."
          className="w-full rounded border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary sm:w-64"
        />
        <div className="flex flex-wrap gap-2">
          {POSITION_FILTERS.map((filter) => {
            const isActive = positionFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => onPositionFilterChange(filter)}
                className={getSquadFilterChipClassName(filter, isActive)}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
