import type { DraftTier } from "../../basePlayers/basePlayerTypes";
import type { SquadPositionFilter } from "../../playerInstances/utils/squadHelpers";
import { TransferMarketToolbar } from "./TransferMarketToolbar";
import type { FreeAgentSortOption } from "../utils/freeAgentHelpers";
import {
  FREE_AGENT_SORT_OPTIONS,
  FREE_AGENT_TIER_FILTERS,
  getDraftTierFilterChipClassName,
} from "../utils/freeAgentHelpers";

interface FreeAgentMarketToolbarProps {
  positionFilter: SquadPositionFilter;
  onPositionFilterChange: (filter: SquadPositionFilter) => void;
  tierFilter: DraftTier | "ALL";
  onTierFilterChange: (tier: DraftTier | "ALL") => void;
  sortOption: FreeAgentSortOption;
  onSortOptionChange: (sort: FreeAgentSortOption) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export const FreeAgentMarketToolbar = ({
  positionFilter,
  onPositionFilterChange,
  tierFilter,
  onTierFilterChange,
  sortOption,
  onSortOptionChange,
  searchQuery,
  onSearchQueryChange,
}: FreeAgentMarketToolbarProps) => {
  return (
    <div className="flex flex-col gap-4">
      <TransferMarketToolbar
        positionFilter={positionFilter}
        onPositionFilterChange={onPositionFilterChange}
        sortOption={sortOption}
        onSortOptionChange={(sort) => onSortOptionChange(sort as FreeAgentSortOption)}
        searchQuery={searchQuery}
        onSearchQueryChange={onSearchQueryChange}
        sortOptions={FREE_AGENT_SORT_OPTIONS}
        searchPlaceholder="Search free agents..."
      />

      <div className="flex flex-wrap gap-2">
        {FREE_AGENT_TIER_FILTERS.map((option) => {
          const isActive = tierFilter === option.value;

          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onTierFilterChange(option.value)}
              className={getDraftTierFilterChipClassName(option.value, isActive)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
