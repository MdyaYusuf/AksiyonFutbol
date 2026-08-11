import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PlayerPosition } from "../../basePlayers/basePlayerTypes";
import { useGetCurrentUserClubQuery } from "../../clubs/clubsApiSlice";
import { formatMatchDateTime } from "../../dashboard/utils/dashboardFormatters";
import { useGetMatchByIdQuery } from "../../matches/matchesApiSlice";
import {
  getMatchLivePath,
  getMatchPresentationPhase,
  getMatchReportPath,
  shouldOpenLiveView,
  shouldOpenMatchReport,
} from "../../matches/utils/matchLiveHelpers";
import { useGetCurrentUserClubPlayersQuery } from "../../playerInstances/playerInstancesApiSlice";
import type { PlayerInstanceResponse } from "../../playerInstances/playerInstanceTypes";
import { MatchDayContextBar } from "../components/MatchDayContextBar";
import { MatchDayFooter } from "../components/MatchDayFooter";
import { MatchDayInjuryBanner } from "../components/MatchDayInjuryBanner";
import { MatchDayPitch } from "../components/MatchDayPitch";
import { MatchDayStartingXi } from "../components/MatchDayStartingXi";
import {
  useGetMyClubLineupQuery,
  useUpsertMyClubLineupMutation,
} from "../clubLineupsApiSlice";
import type { TeamFormation, TeamMentality } from "../clubLineupTypes";
import {
  createEmptyBenchSlots,
  createEmptyStarterSlots,
  getFormationLabel,
  LINEUP_STARTER_COUNT,
  lineupToSlots,
} from "../utils/tacticsHelpers";

export const MatchDayLineupPage = () => {
  const { id: matchId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: club, isLoading: isClubLoading } = useGetCurrentUserClubQuery();
  const {
    data: match,
    isLoading: isMatchLoading,
    isError: isMatchError,
  } = useGetMatchByIdQuery(matchId ?? "", { skip: !matchId });
  const { data: squad = [], isLoading: isSquadLoading } =
    useGetCurrentUserClubPlayersQuery();
  const { data: lineup, isLoading: isLineupLoading } = useGetMyClubLineupQuery();
  const [upsertLineup, { isLoading: isSaving }] = useUpsertMyClubLineupMutation();

  const [formation, setFormation] = useState<TeamFormation | null>(null);
  const [mentality, setMentality] = useState<TeamMentality | null>(null);
  const [starterIds, setStarterIds] = useState<(string | null)[]>(createEmptyStarterSlots);
  const [benchIds, setBenchIds] = useState<(string | null)[]>(createEmptyBenchSlots);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const playersById = useMemo(() => {
    const map = new Map<string, PlayerInstanceResponse>();
    squad.forEach((player) => map.set(player.id, player));
    return map;
  }, [squad]);

  useEffect(() => {
    if (!lineup || squad.length === 0) {
      return;
    }

    const slots = lineupToSlots(lineup, playersById);
    setFormation(lineup.formation);
    setMentality(lineup.mentality);
    setStarterIds(slots.starters);
    setBenchIds(slots.bench);
    setSelectedIndex(null);
  }, [lineup, squad, playersById]);

  const usedIds = useMemo(() => {
    const ids = new Set<string>();
    starterIds.forEach((id) => {
      if (id) {
        ids.add(id);
      }
    });
    benchIds.forEach((id) => {
      if (id) {
        ids.add(id);
      }
    });
    return ids;
  }, [starterIds, benchIds]);

  const availablePlayers = useMemo(
    () => squad.filter((player) => !usedIds.has(player.id)),
    [squad, usedIds],
  );

  const injuredStarterCount = starterIds.reduce((count, id) => {
    if (!id) {
      return count;
    }

    if (playersById.get(id)?.isInjured) {
      return count + 1;
    }

    return count;
  }, 0);

  const filledStarterCount = starterIds.filter(Boolean).length;
  const hasGoalkeeper = starterIds.some((id) => {
    if (!id) {
      return false;
    }

    return playersById.get(id)?.position === PlayerPosition.Goalkeeper;
  });

  const canConfirm =
    Boolean(formation && mentality) &&
    filledStarterCount === LINEUP_STARTER_COUNT &&
    hasGoalkeeper &&
    injuredStarterCount === 0 &&
    !isSaving;

  const handleSelectStarter = (index: number) => {
    setSelectedIndex((current) => (current === index ? null : index));
  };

  const handleSwapIn = (playerId: string) => {
    if (selectedIndex == null) {
      return;
    }

    const player = playersById.get(playerId);
    if (!player || player.isInjured) {
      return;
    }

    const displaced = starterIds[selectedIndex];
    const nextStarters = [...starterIds];
    nextStarters[selectedIndex] = playerId;

    let nextBench = benchIds.map((id) => (id === playerId ? null : id));
    if (displaced) {
      const emptyBench = nextBench.findIndex((id) => id == null);
      if (emptyBench >= 0) {
        nextBench[emptyBench] = displaced;
      }
    }

    setStarterIds(nextStarters);
    setBenchIds(nextBench);
    setSelectedIndex(null);
    setIsConfirmed(false);
  };

  const handleClearSelection = () => {
    setSelectedIndex(null);
  };

  const handleConfirm = async () => {
    if (!canConfirm || formation == null || mentality == null || !match) {
      return;
    }

    const payloadStarters = starterIds.filter((id): id is string => Boolean(id));
    const payloadBench = benchIds.filter((id): id is string => Boolean(id));

    try {
      await upsertLineup({
        formation,
        mentality,
        starterPlayerIds: payloadStarters,
        benchPlayerIds: payloadBench,
      }).unwrap();

      const phase = getMatchPresentationPhase(match, new Date());
      if (shouldOpenLiveView(phase)) {
        navigate(getMatchLivePath(match.id), { replace: true });
        return;
      }

      setIsConfirmed(true);
    } catch {
      /* Toasts via apiClient */
    }
  };

  if (!matchId) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-on-surface-variant">
        <p>Match not found.</p>
        <Link to="/app/fixtures" className="text-primary hover:underline">
          Back to Fixtures
        </Link>
      </div>
    );
  }

  const isLoading =
    isClubLoading || isMatchLoading || isSquadLoading || isLineupLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Loading match day lineup...
      </div>
    );
  }

  if (isMatchError || !match || !club) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-on-surface-variant">
        <p>Match not found.</p>
        <Link to="/app/fixtures" className="text-primary hover:underline">
          Back to Fixtures
        </Link>
      </div>
    );
  }

  const userIsHome = match.homeClubId === club.id;
  const opponentName = userIsHome ? match.awayClubName : match.homeClubName;
  const venueLabel = userIsHome ? "Home" : "Away";
  const phase = getMatchPresentationPhase(match, new Date());
  const detailsPath = shouldOpenLiveView(phase)
    ? getMatchLivePath(match.id)
    : getMatchReportPath(match.id);

  if (match.isPlayed) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="text-body-sm text-on-surface-variant">
          This match has already been played. Lineup changes are no longer available.
        </p>
        {shouldOpenLiveView(phase) ? (
          <Link
            to={getMatchLivePath(match.id)}
            className="inline-flex text-primary hover:underline"
          >
            Watch live
          </Link>
        ) : null}
        {shouldOpenMatchReport(phase) ? (
          <Link
            to={getMatchReportPath(match.id)}
            className="inline-flex text-primary hover:underline"
          >
            View match report
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-gutter pb-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-headline-sm text-headline-sm font-black text-primary">
          Match Day Lineup
        </h1>
        <Link
          to={detailsPath}
          className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary"
        >
          Match details
        </Link>
      </div>

      <MatchDayContextBar
        matchWeek={match.matchWeek}
        venueLabel={venueLabel}
        opponentName={opponentName}
        kickoffLabel={formatMatchDateTime(match.matchDate)}
      />

      <MatchDayInjuryBanner injuredCount={injuredStarterCount} />

      <div className="grid min-h-[600px] grid-cols-1 gap-gutter xl:grid-cols-12">
        <div className="flex min-h-[480px] xl:col-span-8">
          {formation != null && (
            <MatchDayPitch
              formation={formation}
              starterIds={starterIds}
              playersById={playersById}
              selectedIndex={selectedIndex}
              onSlotClick={handleSelectStarter}
            />
          )}
        </div>
        <div className="flex min-h-[320px] xl:col-span-4">
          <MatchDayStartingXi
            starterIds={starterIds}
            playersById={playersById}
            availablePlayers={availablePlayers}
            selectedIndex={selectedIndex}
            formationLabel={formation != null ? getFormationLabel(formation) : "—"}
            onSelectStarter={handleSelectStarter}
            onSwapIn={handleSwapIn}
          />
        </div>
      </div>

      <MatchDayFooter
        hasInjuredStarters={injuredStarterCount > 0}
        canConfirm={canConfirm}
        isSaving={isSaving}
        isConfirmed={isConfirmed}
        kickoffLabel={formatMatchDateTime(match.matchDate)}
        onClearSelection={handleClearSelection}
        onConfirm={handleConfirm}
      />
    </div>
  );
};
