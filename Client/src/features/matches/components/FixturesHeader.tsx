import type { ClubResponse } from "../../clubs/clubTypes";
import { getClubDisplayName } from "../../clubs/utils/clubDisplayName";
import type { FixtureStatusFilter } from "../utils/fixturesHelpers";

interface FixturesHeaderProps {
  club: ClubResponse;
  statusFilter: FixtureStatusFilter;
  onStatusFilterChange: (filter: FixtureStatusFilter) => void;
}

export const FixturesHeader = ({
  club,
  statusFilter,
  onStatusFilterChange,
}: FixturesHeaderProps) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b border-surface-container-highest pb-6 md:flex-row md:items-end">
      <div>
        <h2 className="text-[32px] leading-10 font-extrabold tracking-tight text-on-surface lg:text-display-lg lg:leading-[56px]">
          Fixtures & Results
        </h2>
        <p className="mt-1 text-body-lg text-on-surface-variant">
          {club.divisionName} · {getClubDisplayName(club)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded border border-outline-variant bg-surface-container-high px-3 py-2 text-body-sm text-on-surface">
          {club.divisionName}
        </span>
        <span className="rounded border border-outline-variant bg-surface-container-high px-3 py-2 text-body-sm text-on-surface">
          {getClubDisplayName(club)}
        </span>
        <select
          value={statusFilter}
          onChange={(event) =>
            onStatusFilterChange(event.target.value as FixtureStatusFilter)
          }
          className="cursor-pointer appearance-none rounded border border-outline-variant bg-surface-container-high px-3 py-2 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Matches</option>
          <option value="results">Results</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>
    </div>
  );
};
