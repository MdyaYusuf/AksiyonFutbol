import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useMemo, useState } from "react";
import { useGetClubsByDivisionIdQuery, useGetCurrentUserClubQuery } from "../../clubs/clubsApiSlice";
import { useGetMatchesQuery } from "../../matches/matchesApiSlice";
import { LeagueStandingsHeader } from "../components/LeagueStandingsHeader";
import { StandingsTable } from "../components/StandingsTable";
import { useGetLeagueDivisionByIdQuery } from "../leagueDivisionsApiSlice";
import {
  buildStandings,
  exportStandingsCsv,
} from "../utils/standingsHelpers";

export const LeaguePage = () => {
  const { data: club, isLoading: isClubLoading } = useGetCurrentUserClubQuery();
  const { data: division, isLoading: isDivisionLoading } =
    useGetLeagueDivisionByIdQuery(club?.divisionId ?? skipToken);
  const { data: divisionClubs = [], isLoading: isClubsLoading } =
    useGetClubsByDivisionIdQuery(club?.divisionId ?? skipToken);
  const { data: allMatches = [], isLoading: isMatchesLoading } = useGetMatchesQuery();

  const [selectedMatchWeek, setSelectedMatchWeek] = useState(1);

  useEffect(() => {
    if (division) {
      setSelectedMatchWeek(Math.max(1, division.currentMatchWeek));
    }
  }, [division]);

  const standings = useMemo(() => {
    if (!club || !division) {
      return [];
    }

    return buildStandings(
      divisionClubs,
      allMatches,
      division.id,
      selectedMatchWeek,
    );
  }, [allMatches, club, division, divisionClubs, selectedMatchWeek]);

  const isLoading =
    isClubLoading || isDivisionLoading || isClubsLoading || isMatchesLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Lig tablosu yükleniyor...
      </div>
    );
  }

  if (!club || !division) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Lig bilgisi bulunamadı.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <LeagueStandingsHeader
        division={division}
        selectedMatchWeek={selectedMatchWeek}
        onMatchWeekChange={setSelectedMatchWeek}
        onExport={() =>
          exportStandingsCsv(standings, division.name, selectedMatchWeek)
        }
      />

      <StandingsTable standings={standings} currentClubId={club.id} />
    </div>
  );
};
