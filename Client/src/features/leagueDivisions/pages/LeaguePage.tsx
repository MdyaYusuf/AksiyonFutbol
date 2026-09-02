import { skipToken } from "@reduxjs/toolkit/query";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGetClubsByDivisionIdQuery, useGetCurrentUserClubQuery } from "@/features/clubs/clubsApiSlice";
import { ClubLifecycleStatus } from "@/features/clubs/clubTypes";
import {
  getPlacementQueueSummary,
  getPlacementQueueTitle,
} from "@/features/clubs/utils/clubLifecycleHelpers";
import { useGetMatchesQuery } from "@/features/matches/matchesApiSlice";
import { LeagueStandingsHeader } from "@/features/leagueDivisions/components/LeagueStandingsHeader";
import { StandingsTable } from "@/features/leagueDivisions/components/StandingsTable";
import { useGetLeagueDivisionByIdQuery } from "@/features/leagueDivisions/leagueDivisionsApiSlice";
import {
  buildStandings,
  exportStandingsCsv,
  getStandingsLegendItems,
  resolveLeagueDisplayMaxMatchWeek,
  resolveScheduledMaxMatchWeek,
} from "@/features/leagueDivisions/utils/standingsHelpers";

export const LeaguePage = () => {
  const { data: club, isLoading: isClubLoading } = useGetCurrentUserClubQuery();
  const { data: division, isLoading: isDivisionLoading } =
    useGetLeagueDivisionByIdQuery(club?.divisionId ?? skipToken);
  const { data: divisionClubs = [], isLoading: isClubsLoading } =
    useGetClubsByDivisionIdQuery(club?.divisionId ?? skipToken);
  const { data: allMatches = [], isLoading: isMatchesLoading } = useGetMatchesQuery();

  const [weekSelection, setWeekSelection] = useState<{
    divisionId: number;
    week: number;
  } | null>(null);

  const divisionMatches = useMemo(() => {
    if (!club) {
      return [];
    }

    return allMatches.filter(
      (match) =>
        match.divisionId === club.divisionId &&
        match.season === division?.currentSeason,
    );
  }, [allMatches, club, division]);

  const maxMatchWeek = useMemo(() => {
    if (!division) {
      return 1;
    }

    const scheduledMax = resolveScheduledMaxMatchWeek(
      divisionMatches,
      division.id,
      division.currentSeason,
    );

    return resolveLeagueDisplayMaxMatchWeek(
      division.currentMatchWeek,
      scheduledMax,
      division.isTutorial,
    );
  }, [division, divisionMatches]);

  const selectedMatchWeek = useMemo(() => {
    if (!division) {
      return 1;
    }

    if (weekSelection?.divisionId === division.id) {
      return Math.min(weekSelection.week, maxMatchWeek);
    }

    return maxMatchWeek;
  }, [division, maxMatchWeek, weekSelection]);

  const handleMatchWeekChange = (week: number) => {
    if (division == null) {
      return;
    }

    setWeekSelection({
      divisionId: division.id,
      week,
    });
  };

  const standings = useMemo(() => {
    if (!club || !division) {
      return [];
    }

    return buildStandings(
      divisionClubs,
      allMatches,
      division.id,
      selectedMatchWeek,
      {
        season: division.currentSeason,
        isTutorial: division.isTutorial,
        tier: division.tier,
      },
    );
  }, [allMatches, club, division, divisionClubs, selectedMatchWeek]);

  const legendItems = useMemo(() => {
    if (!division) {
      return [];
    }

    return getStandingsLegendItems({
      isTutorial: division.isTutorial,
      tier: division.tier,
    });
  }, [division]);

  const isLoading =
    isClubLoading || isDivisionLoading || isClubsLoading || isMatchesLoading;

  const seasonLooksComplete =
    !!division &&
    divisionMatches.length > 0 &&
    divisionMatches.every((match) => match.isPlayed);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Lig tablosu yükleniyor...
      </div>
    );
  }

  const isAwaitingPlacement =
    club?.lifecycleStatus === ClubLifecycleStatus.AwaitingPlacement;
  const showSeasonEndCta =
    seasonLooksComplete
    && !division?.isTutorial
    && !isAwaitingPlacement;

  if (!club) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Lig bilgisi bulunamadı.
      </div>
    );
  }

  if (!division) {
    if (isAwaitingPlacement) {
      return (
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
            <p className="text-body-sm font-semibold text-on-surface">
              {getPlacementQueueTitle(club.placementTargetTier)}
            </p>
            <p className="text-body-sm text-on-surface-variant">
              {getPlacementQueueSummary(club.placementTargetTier)}
            </p>
          </div>
        </div>
      );
    }

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
        maxMatchWeek={maxMatchWeek}
        selectedMatchWeek={selectedMatchWeek}
        onMatchWeekChange={handleMatchWeekChange}
        onExport={() =>
          exportStandingsCsv(standings, division.name, selectedMatchWeek)
        }
      />

      {isAwaitingPlacement ? (
        <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
          <p className="text-body-sm font-semibold text-on-surface">
            {getPlacementQueueTitle(club.placementTargetTier)}
          </p>
          <p className="text-body-sm text-on-surface-variant">
            {getPlacementQueueSummary(club.placementTargetTier)}
          </p>
        </div>
      ) : null}

      {showSeasonEndCta ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
          <p className="text-body-sm text-on-surface">
            All fixtures are complete. Review promotion and relegation.
          </p>
          <Link
            to="/app/season-end"
            className="rounded bg-primary px-4 py-2 font-label-caps text-label-caps text-on-primary transition-colors hover:bg-primary-fixed"
          >
            Season Complete
          </Link>
        </div>
      ) : null}

      <StandingsTable
        standings={standings}
        currentClubId={club.id}
        legendItems={legendItems}
      />
    </div>
  );
};
