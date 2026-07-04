import { skipToken } from "@reduxjs/toolkit/query";
import { useState } from "react";
import { useGetCurrentUserClubQuery } from "../../clubs/clubsApiSlice";
import { FixturesHeader } from "../components/FixturesHeader";
import { MatchWeekSection } from "../components/MatchWeekSection";
import { useGetMatchesByClubIdQuery } from "../matchesApiSlice";
import {
  filterMatchesByStatus,
  groupMatchesByWeek,
  type FixtureStatusFilter,
} from "../utils/fixturesHelpers";

export const FixturesPage = () => {
  const [statusFilter, setStatusFilter] = useState<FixtureStatusFilter>("all");
  const { data: club, isLoading: isClubLoading } = useGetCurrentUserClubQuery();
  const { data: matches = [], isLoading: isMatchesLoading } =
    useGetMatchesByClubIdQuery(club?.id ?? skipToken);

  const isLoading = isClubLoading || isMatchesLoading;

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

  const filteredMatches = filterMatchesByStatus(matches, statusFilter);
  const weekGroups = groupMatchesByWeek(filteredMatches);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <FixturesHeader
        club={club}
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
