import type { DraftTier } from "../../basePlayers/basePlayerTypes";
import type { SquadPositionFilter } from "../../playerInstances/utils/squadHelpers";
import { TransferMarketToolbar } from "./TransferMarketToolbar";
import type { FreeAgentSortOption } from "../utils/freeAgentHelpers";
import { FREE_AGENT_SORT_OPTIONS } from "../utils/freeAgentHelpers";

interface FreeAgentMarketToolbarProps {
  positionFilter: SquadPositionFilter;
  onPositionFilterChange: (filter: SquadPositionFilter) => void;
  tierFilter: DraftTier | "ALL";
  onTierFilterChange: (tier: DraftTier | "ALL") => void;
  sortOption: FreeAgentSortOption;
  onSortOptionChange: (sort: FreeAgentSortOption) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  transferBudget?: number;
  wageSpace?: number;
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
  transferBudget,
  wageSpace,
}: FreeAgentMarketToolbarProps) => {
  return (
    <TransferMarketToolbar
      positionFilter={positionFilter}
      onPositionFilterChange={onPositionFilterChange}
      sortOption={sortOption}
      onSortOptionChange={(sort) => onSortOptionChange(sort as FreeAgentSortOption)}
      searchQuery={searchQuery}
      onSearchQueryChange={onSearchQueryChange}
      sortOptions={FREE_AGENT_SORT_OPTIONS}
      searchPlaceholder="Search free agents..."
      tierFilter={tierFilter}
      onTierFilterChange={onTierFilterChange}
      transferBudget={transferBudget}
      wageSpace={wageSpace}
    />
  );
};
