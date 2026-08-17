import type { DraftTier } from "../../basePlayers/basePlayerTypes";
import type { SquadPositionFilter } from "../../playerInstances/utils/squadHelpers";
import { TransferMarketToolbar } from "./TransferMarketToolbar";
import type { FreeAgentSortOption } from "../utils/freeAgentHelpers";
import {
  FREE_AGENT_SORT_OPTIONS,
  FREE_AGENT_TIER_FILTERS,
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
