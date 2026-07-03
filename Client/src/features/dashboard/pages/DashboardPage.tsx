import { skipToken } from "@reduxjs/toolkit/query";
import { useGetCurrentUserClubPresidentQuery } from "../../clubPresidents/clubPresidentsApiSlice";
import { useGetClubsByDivisionIdQuery, useGetCurrentUserClubQuery } from "../../clubs/clubsApiSlice";
import { useGetMatchesByClubIdQuery } from "../../matches/matchesApiSlice";
import { ClubStatusCard } from "../components/ClubStatusCard";
import { LeagueStandingsCard } from "../components/LeagueStandingsCard";
import { NextMatchCard } from "../components/NextMatchCard";
import { PresidentSummaryCard } from "../components/PresidentSummaryCard";
import { RecentFormCard } from "../components/RecentFormCard";
import { getNextMatch, getRecentMatches } from "../utils/matchHelpers";

export const DashboardPage = () => {
  const { data: club, isLoading: isClubLoading } = useGetCurrentUserClubQuery();
  const { data: president, isLoading: isPresidentLoading } =
    useGetCurrentUserClubPresidentQuery();
  const { data: matches = [], isLoading: isMatchesLoading } = useGetMatchesByClubIdQuery(
    club?.id ?? skipToken,
  );
  const { data: divisionClubs = [], isLoading: isDivisionClubsLoading } =
    useGetClubsByDivisionIdQuery(club?.divisionId ?? skipToken);

  const isLoading =
    isClubLoading || isPresidentLoading || isMatchesLoading || isDivisionClubsLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Dashboard yükleniyor...
      </div>
    );
  }

  const nextMatch = getNextMatch(matches);
  const recentMatches = getRecentMatches(matches);

  return (
    <div className="grid grid-cols-1 gap-card-gap md:grid-cols-8 lg:grid-cols-12">
      {club && (
        <NextMatchCard clubId={club.id} nextMatch={nextMatch} />
      )}
      <PresidentSummaryCard president={president} club={club} />
      <ClubStatusCard club={club} />
      <LeagueStandingsCard
        divisionName={club?.divisionName}
        clubs={divisionClubs}
        currentClubId={club?.id}
      />
      {club && <RecentFormCard clubId={club.id} matches={recentMatches} />}
    </div>
  );
};
