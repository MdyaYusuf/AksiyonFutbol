import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useMemo, useState } from "react";
import { useGetCurrentUserClubPresidentQuery } from "../../clubPresidents/clubPresidentsApiSlice";
import { useGetClubsByDivisionIdQuery, useGetCurrentUserClubQuery } from "../../clubs/clubsApiSlice";
import { useGetLeagueDivisionByIdQuery } from "../../leagueDivisions/leagueDivisionsApiSlice";
import { buildStandings } from "../../leagueDivisions/utils/standingsHelpers";
import {
  useGetMatchLiveStatusQuery,
  useGetMatchesByClubIdQuery,
  useGetMatchesQuery,
} from "../../matches/matchesApiSlice";
import {
  getMatchKickoff,
  getMatchPresentationPhase,
} from "../../matches/utils/matchLiveHelpers";
import { ClubStatusCard } from "../components/ClubStatusCard";
import { LeagueStandingsCard } from "../components/LeagueStandingsCard";
import { NextMatchCard } from "../components/NextMatchCard";
import { PresidentSummaryCard } from "../components/PresidentSummaryCard";
import { RecentFormCard } from "../components/RecentFormCard";
import { getNextMatch, getRecentMatches } from "../utils/matchHelpers";

/** Poll live-status only while waiting for simulation to finish. */
const WAITING_SIM_POLL_MS = 5_000;

export const DashboardPage = () => {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const { data: club, isLoading: isClubLoading } = useGetCurrentUserClubQuery();
  const { data: president, isLoading: isPresidentLoading } =
    useGetCurrentUserClubPresidentQuery();
  const { data: matches = [], isLoading: isMatchesLoading } = useGetMatchesByClubIdQuery(
    club?.id ?? skipToken,
  );
  const { data: divisionClubs = [], isLoading: isDivisionClubsLoading } =
    useGetClubsByDivisionIdQuery(club?.divisionId ?? skipToken);
  const { data: division, isLoading: isDivisionLoading } =
    useGetLeagueDivisionByIdQuery(club?.divisionId ?? skipToken);
  const { data: allMatches = [], isLoading: isAllMatchesLoading } = useGetMatchesQuery();

  const now = new Date(nowMs);
  const nextMatch = getNextMatch(matches, now);
  const nextPhase = nextMatch
    ? getMatchPresentationPhase(nextMatch, now)
    : null;

  useGetMatchLiveStatusQuery(
    nextMatch && club
      ? { matchId: nextMatch.id, clubId: club.id }
      : skipToken,
    {
      skip: nextPhase !== "waitingSim",
      pollingInterval: nextPhase === "waitingSim" ? WAITING_SIM_POLL_MS : 0,
    },
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // One-shot wake at kickoff so waitingSim polling can start without a refresh.
  useEffect(() => {
    if (!nextMatch || nextMatch.isPlayed) {
      return;
    }

    const kickoffMs = getMatchKickoff(nextMatch.matchDate).getTime();

    if (Number.isNaN(kickoffMs)) {
      return;
    }

    const delayMs = kickoffMs - Date.now();

    if (delayMs <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setNowMs(Date.now());
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [nextMatch?.id, nextMatch?.matchDate, nextMatch?.isPlayed]);

  const standings = useMemo(() => {
    if (!club || !division) {
      return [];
    }

    return buildStandings(
      divisionClubs,
      allMatches,
      division.id,
      Math.max(1, division.currentMatchWeek),
    );
  }, [allMatches, club, division, divisionClubs]);

  const isLoading =
    isClubLoading
    || isPresidentLoading
    || isMatchesLoading
    || isDivisionClubsLoading
    || isDivisionLoading
    || isAllMatchesLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Dashboard yükleniyor...
      </div>
    );
  }

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
        standings={standings}
        currentClubId={club?.id}
      />
      {club && <RecentFormCard clubId={club.id} matches={recentMatches} />}
    </div>
  );
};
