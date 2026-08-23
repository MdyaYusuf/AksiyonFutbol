import { skipToken } from "@reduxjs/toolkit/query";
import { useMemo, useState } from "react";
import { useGetCurrentUserClubQuery } from "../../clubs/clubsApiSlice";
import { FixturesHeader } from "../components/FixturesHeader";
import { MatchWeekSection } from "../components/MatchWeekSection";
import { useGetMatchesByDivisionIdQuery } from "../matchesApiSlice";
import {
  filterMatchesByScope,
  filterMatchesByStatus,
  groupMatchesByWeek,
  type FixtureScopeFilter,
  type FixtureStatusFilter,
} from "../utils/fixturesHelpers";
import { filterCurrentSeasonMatches } from "../utils/seasonHelpers";

export const FixturesPage = () => {
  const [scopeFilter, setScopeFilter] = useState<FixtureScopeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<FixtureStatusFilter>("all");
  const { data: club, isLoading: isClubLoading } = useGetCurrentUserClubQuery();
  const { data: matches = [], isLoading: isMatchesLoading } =
    useGetMatchesByDivisionIdQuery(club?.divisionId ?? skipToken);

  const isLoading = isClubLoading || isMatchesLoading;

  const weekGroups = useMemo(() => {
    if (!club) {
      return [];
    }

    const seasonMatches = filterCurrentSeasonMatches(
      matches,
      club.divisionCurrentSeason,
      club.divisionId,
    );
    const scopedMatches = filterMatchesByScope(seasonMatches, scopeFilter, club.id);
    const filteredMatches = filterMatchesByStatus(scopedMatches, statusFilter);
    return groupMatchesByWeek(filteredMatches);
  }, [club, matches, scopeFilter, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Fikstür yükleniyor...
      </div>
    );
  }

  if (!club) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Kulüp bulunamadı.
      </div>
    );
  }

  if (!club.divisionId) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        No division fixtures available yet.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <FixturesHeader
        club={club}
        scopeFilter={scopeFilter}
        onScopeFilterChange={setScopeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {weekGroups.length === 0 ? (
        <div className="rounded-lg border border-outline-variant bg-surface-container-low px-6 py-12 text-center text-body-sm text-on-surface-variant">
          No fixtures found for this filter.
        </div>
      ) : (
        <div className="space-y-8">
          {weekGroups.map((group) => (
            <MatchWeekSection key={group.matchWeek} group={group} clubId={club.id} />
          ))}
        </div>
      )}
    </div>
  );
};
