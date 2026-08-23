import type { ClubResponse } from "../../clubs/clubTypes";
import { getClubDisplayName } from "../../clubs/utils/clubDisplayName";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import {
  FIXTURE_SCOPE_FILTERS,
  getFixtureScopeChipClassName,
  type FixtureScopeFilter,
  type FixtureStatusFilter,
} from "../utils/fixturesHelpers";

interface FixturesHeaderProps {
  club: ClubResponse;
  scopeFilter: FixtureScopeFilter;
  onScopeFilterChange: (filter: FixtureScopeFilter) => void;
  statusFilter: FixtureStatusFilter;
  onStatusFilterChange: (filter: FixtureStatusFilter) => void;
}

export const FixturesHeader = ({
  club,
  scopeFilter,
  onScopeFilterChange,
  statusFilter,
  onStatusFilterChange,
}: FixturesHeaderProps) => {
  return (
    <div className="space-y-4 border-b border-surface-container-highest pb-6">
      <div>
        <h2 className="text-[32px] leading-10 font-extrabold tracking-tight text-on-surface lg:text-display-lg lg:leading-[56px]">
          Fixtures & Results
        </h2>
        <p className="mt-1 text-body-lg text-on-surface-variant">
          {club.divisionName} · {getClubDisplayName(club)}
        </p>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-outline-variant bg-surface-container p-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          {FIXTURE_SCOPE_FILTERS.map((option) => {
            const isActive = scopeFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onScopeFilterChange(option.value)}
                className={getFixtureScopeChipClassName(isActive)}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as FixtureStatusFilter)
            }
            className="w-full cursor-pointer appearance-none rounded border border-outline-variant bg-surface-container-low py-1.5 pr-8 pl-3 text-body-sm text-on-surface outline-none focus:border-primary"
          >
            <option value="all">All Matches</option>
            <option value="played">Played</option>
            <option value="upcoming">Upcoming</option>
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
