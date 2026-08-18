import type { SquadPositionFilter } from "../../playerInstances/utils/squadHelpers";
import {
  getSquadFilterChipClassName,
  POSITION_FILTERS,
} from "../../playerInstances/utils/squadHelpers";
import {
  DRAFT_TIER_FILTERS,
  type DraftTierFilter,
} from "../utils/draftBoardHelpers";
import { getDraftTierFilterChipClassName } from "../../transfers/utils/freeAgentHelpers";

interface DraftCatalogToolbarProps {
  positionFilter: SquadPositionFilter;
  onPositionFilterChange: (filter: SquadPositionFilter) => void;
  tierFilter: DraftTierFilter;
  onTierFilterChange: (tier: DraftTierFilter) => void;
}

export const DraftCatalogToolbar = ({
  positionFilter,
  onPositionFilterChange,
  tierFilter,
  onTierFilterChange,
}: DraftCatalogToolbarProps) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-outline-variant bg-surface-container/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
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

        <div className="flex flex-wrap justify-end gap-1.5">
          {DRAFT_TIER_FILTERS.map((option) => {
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
    </div>
  );
};
