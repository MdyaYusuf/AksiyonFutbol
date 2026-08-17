import type { SquadPositionFilter } from "../../playerInstances/utils/squadHelpers";
import {
  getSquadFilterChipClassName,
  POSITION_FILTERS,
} from "../../playerInstances/utils/squadHelpers";
import {
  DRAFT_TIER_FILTERS,
  type DraftTierFilter,
} from "../utils/draftBoardHelpers";

interface DraftCatalogToolbarProps {
  positionFilter: SquadPositionFilter;
  onPositionFilterChange: (filter: SquadPositionFilter) => void;
  tierFilter: DraftTierFilter;
  onTierFilterChange: (tier: DraftTierFilter) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export const DraftCatalogToolbar = ({
  positionFilter,
  onPositionFilterChange,
  tierFilter,
  onTierFilterChange,
  searchQuery,
  onSearchQueryChange,
}: DraftCatalogToolbarProps) => {
  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={searchQuery}
        onChange={(event) => onSearchQueryChange(event.target.value)}
        placeholder="Search catalog..."
        className="w-full rounded border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary"
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

      <div className="flex flex-wrap gap-2">
        {DRAFT_TIER_FILTERS.map((option) => {
          const isActive = tierFilter === option.value;

          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onTierFilterChange(option.value)}
              className={`rounded-full border px-3 py-1 font-label-caps text-label-caps transition-colors ${
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-outline-variant bg-surface-container text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
