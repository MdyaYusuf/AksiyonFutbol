import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../../core/store/hooks";
import { MatchLiveCommentary } from "../components/MatchLiveCommentary";
import { MatchLivePitch } from "../components/MatchLivePitch";
import { MatchLiveScoreboard } from "../components/MatchLiveScoreboard";
import { MatchLiveStats } from "../components/MatchLiveStats";
import type { MatchEvent, MatchResponse } from "../matchTypes";
import {
  matchesApiSlice,
  useGetMatchByIdQuery,
  useGetMatchLiveStatusQuery,
} from "../matchesApiSlice";
import {
  getBallPositionFromEvents,
  getEventsThroughFeedPresentation,
  getLiveMatchStats,
  getMatchPresentationPhase,
  getRevealedEvents,
  getMatchReportPath,
  getRunningScoreFromEvents,
  MATCH_LIVE_REPLAY_DURATION_SECONDS,
  matchMinuteToWallSeconds,
  shouldOpenMatchReport,
  wallSecondsToMatchMinute,
  type MatchPresentationPhase,
} from "../utils/matchLiveHelpers";
import { matchSettlementRevealTags } from "../utils/matchSettlementTags";
import { goBackOrFallback, parseMatchEvents } from "../utils/matchReportHelpers";

const WAITING_POLL_MS = 1000;
const WAITING_TIMEOUT_MS = 120_000;
const LOG_HYDRATE_TIMEOUT_MS = 60_000;
const HALF_TIME_PAUSE_SECONDS = 10;
const HALF_TIME_MATCH_MINUTE = 45;
const GOAL_CELEBRATION_MS = 3200;

const getStatusLabel = (
  phase: MatchPresentationPhase,
  playbackComplete: boolean,
  isHalfTimePause: boolean,
): string => {
  if (isHalfTimePause) {
    return "Half Time";
  }

  if (phase === "waitingSim") {
    return "Waiting for kickoff";
  }

  if (playbackComplete || phase === "result") {
    return "Full Time";
  }

  if (phase === "live") {
    return "Live";
  }

  if (phase === "replay") {
    return "Replay";
  }

  return "Scheduled";
};

const hasUsableMatchLog = (match: MatchResponse | undefined): boolean => {
  if (!match?.isPlayed) {
    return false;
  }

  if (!match.matchLogJson || match.matchLogJson.trim().length === 0) {
    return false;
  }

  return true;
};

export const MatchLivePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const startReplayRequested = searchParams.get("replay") === "1";
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInitializedSeek, setHasInitializedSeek] = useState(false);
  const [waitingTimedOut, setWaitingTimedOut] = useState(false);
  const [isHydratingLog, setIsHydratingLog] = useState(false);
  const [logHydrateTimedOut, setLogHydrateTimedOut] = useState(false);
  const [halfTimePauseRemaining, setHalfTimePauseRemaining] = useState<number | null>(null);
  const waitingStartedAtRef = useRef<number | null>(null);
  const logHydrateStartedAtRef = useRef<number | null>(null);
  const halfTimePauseRemainingRef = useRef(0);
  const halfTimePauseCompletedRef = useRef(false);
  const commentaryHoldRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const [goalCelebration, setGoalCelebration] = useState<{
    token: string;
    scorerLabel: string;
  } | null>(null);
  const [feedPresentation, setFeedPresentation] = useState<{
    sequence: MatchEvent[];
    lineIndex: number;
  }>({ sequence: [], lineIndex: 0 });

  const {
    data: match,
    isLoading,
    isError,
    isFetching,
    refetch: refetchMatch,
  } = useGetMatchByIdQuery(id ?? "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const hasReachedFullTime = playbackSeconds >= MATCH_LIVE_REPLAY_DURATION_SECONDS;

  useEffect(() => {
    if (!hasReachedFullTime || !id || !match?.homeClubId || !match.awayClubId) {
      return;
    }

    dispatch(
      matchesApiSlice.util.invalidateTags(
        matchSettlementRevealTags(id, [match.homeClubId, match.awayClubId]),
      ),
    );
  }, [
    hasReachedFullTime,
    id,
    match?.homeClubId,
    match?.awayClubId,
    dispatch,
  ]);

  const phase = useMemo(() => {
    if (!match) {
      return "upcoming" as const;
    }

    return getMatchPresentationPhase(match, new Date(nowMs));
  }, [match, nowMs]);

  const events = useMemo(
    () => parseMatchEvents(match?.matchLogJson),
    [match?.matchLogJson],
  );

  const eventsReady = hasUsableMatchLog(match) && events.length > 0;
  const needsLogHydration = Boolean(match?.isPlayed) && !eventsReady;
  const isWaitingForSim = phase === "waitingSim";
  const matchMinute = wallSecondsToMatchMinute(playbackSeconds);
  const revealedForPlayback = useMemo(
    () => getRevealedEvents(events, matchMinute),
    [events, matchMinute],
  );

  const { data: liveStatus } = useGetMatchLiveStatusQuery(
    id && match
      ? { matchId: id, clubId: match.homeClubId }
      : skipToken,
    {
      skip: !isWaitingForSim,
      pollingInterval: isWaitingForSim ? WAITING_POLL_MS : 0,
    },
  );

  useEffect(() => {
    setHasInitializedSeek(false);
    setPlaybackSeconds(0);
    setIsPlaying(false);
    setWaitingTimedOut(false);
    setIsHydratingLog(false);
    setLogHydrateTimedOut(false);
    setHalfTimePauseRemaining(null);
    setGoalCelebration(null);
    setFeedPresentation({ sequence: [], lineIndex: 0 });
    waitingStartedAtRef.current = null;
    logHydrateStartedAtRef.current = null;
    halfTimePauseRemainingRef.current = 0;
    halfTimePauseCompletedRef.current = false;
    commentaryHoldRef.current = false;
  }, [id]);

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // When status says played, fetch the full match (including matchLogJson) before live UI.
  useEffect(() => {
    if (!liveStatus?.isPlayed) {
      return;
    }

    if (eventsReady) {
      return;
    }

    let cancelled = false;

    setIsHydratingLog(true);

    void refetchMatch()
      .catch(() => {
        // Next poll / manual retry will try again.
      })
      .finally(() => {
        if (!cancelled) {
          setIsHydratingLog(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [liveStatus?.isPlayed, eventsReady, refetchMatch]);

  // Keep refetching while played but log/events are still missing.
  useEffect(() => {
    if (!needsLogHydration) {
      return;
    }

    const timer = window.setInterval(() => {
      void refetchMatch();
    }, WAITING_POLL_MS);

    return () => window.clearInterval(timer);
  }, [needsLogHydration, refetchMatch]);

  useEffect(() => {
    if (phase !== "waitingSim") {
      waitingStartedAtRef.current = null;
      setWaitingTimedOut(false);
      return;
    }

    if (waitingStartedAtRef.current === null) {
      waitingStartedAtRef.current = Date.now();
    }

    const startedAt = waitingStartedAtRef.current;
    const timer = window.setInterval(() => {
      if (Date.now() - startedAt >= WAITING_TIMEOUT_MS) {
        setWaitingTimedOut(true);
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (!needsLogHydration) {
      logHydrateStartedAtRef.current = null;
      setLogHydrateTimedOut(false);
      return;
    }

    if (logHydrateStartedAtRef.current === null) {
      logHydrateStartedAtRef.current = Date.now();
    }

    const startedAt = logHydrateStartedAtRef.current;
    const timer = window.setInterval(() => {
      if (Date.now() - startedAt >= LOG_HYDRATE_TIMEOUT_MS) {
        setLogHydrateTimedOut(true);
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [needsLogHydration]);

  // Only start the clock once events are actually available.
  useEffect(() => {
    if (!eventsReady || !match || hasInitializedSeek) {
      return;
    }

    const currentPhase = getMatchPresentationPhase(match, new Date());

    if (currentPhase === "live") {
      setPlaybackSeconds(0);
      setIsPlaying(true);
      setHasInitializedSeek(true);
      return;
    }

    if (startReplayRequested) {
      setPlaybackSeconds(0);
      setIsPlaying(true);
      setHasInitializedSeek(true);
      return;
    }

    // Finished match without an explicit replay request: stay on full time.
    setPlaybackSeconds(MATCH_LIVE_REPLAY_DURATION_SECONDS);
    setIsPlaying(false);
    setHasInitializedSeek(true);
  }, [eventsReady, match, hasInitializedSeek, startReplayRequested]);

  useEffect(() => {
    if (!isPlaying || !eventsReady) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastFrameRef.current = null;
      return;
    }

    const halfTimeWallSeconds = matchMinuteToWallSeconds(HALF_TIME_MATCH_MINUTE);

    const tick = (timestamp: number) => {
      if (lastFrameRef.current === null) {
        lastFrameRef.current = timestamp;
      }

      const deltaSeconds = (timestamp - lastFrameRef.current) / 1000;
      lastFrameRef.current = timestamp;

      if (halfTimePauseRemainingRef.current > 0) {
        halfTimePauseRemainingRef.current = Math.max(
          0,
          halfTimePauseRemainingRef.current - deltaSeconds,
        );
        setHalfTimePauseRemaining(
          halfTimePauseRemainingRef.current > 0
            ? halfTimePauseRemainingRef.current
            : null,
        );

        if (halfTimePauseRemainingRef.current <= 0) {
          halfTimePauseCompletedRef.current = true;
          setHalfTimePauseRemaining(null);
        }

        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Hold the clock while a key attack plays out in the live feed.
      if (commentaryHoldRef.current) {
        lastFrameRef.current = timestamp;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      setPlaybackSeconds((previous) => {
        let next = previous + deltaSeconds;

        if (
          !halfTimePauseCompletedRef.current
          && previous < halfTimeWallSeconds
          && next >= halfTimeWallSeconds
        ) {
          next = halfTimeWallSeconds;
          halfTimePauseRemainingRef.current = HALF_TIME_PAUSE_SECONDS;
          setHalfTimePauseRemaining(HALF_TIME_PAUSE_SECONDS);
        }

        if (next >= MATCH_LIVE_REPLAY_DURATION_SECONDS) {
          setIsPlaying(false);
          return MATCH_LIVE_REPLAY_DURATION_SECONDS;
        }

        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastFrameRef.current = null;
    };
  }, [isPlaying, eventsReady]);

  const handleGoBack = () => goBackOrFallback(navigate, "/app/dashboard");

  const handleRestart = () => {
    if (!eventsReady) {
      return;
    }

    halfTimePauseRemainingRef.current = 0;
    halfTimePauseCompletedRef.current = false;
    commentaryHoldRef.current = false;
    setHalfTimePauseRemaining(null);
    setGoalCelebration(null);
    setFeedPresentation({ sequence: [], lineIndex: 0 });
    setPlaybackSeconds(0);
    setIsPlaying(true);
  };

  const handleCommentaryHoldChange = (holding: boolean) => {
    commentaryHoldRef.current = holding;
  };

  const handleFeedPresentationChange = (
    sequence: MatchEvent[],
    lineIndex: number,
  ) => {
    setFeedPresentation({ sequence, lineIndex });
  };

  const handleGoalMomentChange = (scorerLabel: string | null) => {
    if (!scorerLabel) {
      return;
    }

    setGoalCelebration({
      token: `${Date.now()}-${scorerLabel}`,
      scorerLabel,
    });
  };

  useEffect(() => {
    if (!goalCelebration) {
      return;
    }

    const timer = window.setTimeout(() => {
      setGoalCelebration(null);
    }, GOAL_CELEBRATION_MS);

    return () => window.clearTimeout(timer);
  }, [goalCelebration?.token]);

  const handleRetryLoad = () => {
    setLogHydrateTimedOut(false);
    logHydrateStartedAtRef.current = Date.now();
    setIsHydratingLog(true);
    void refetchMatch().finally(() => setIsHydratingLog(false));
  };

  if (!id) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-on-surface-variant">
        <p>Match not found.</p>
        <button type="button" onClick={handleGoBack} className="text-primary hover:underline">
          Go back
        </button>
      </div>
    );
  }

  if ((isLoading || isHydratingLog) && !match) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Loading live match…
      </div>
    );
  }

  if (isError || !match) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-on-surface-variant">
        <p>Live match could not be loaded.</p>
        <button type="button" onClick={handleGoBack} className="text-primary hover:underline">
          Go back
        </button>
      </div>
    );
  }

  if (phase === "upcoming") {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-lg flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-headline-md text-on-surface">Match not started yet</h1>
        <p className="text-body-sm text-on-surface-variant">
          Kickoff has not been reached. You can set your lineup or check the scout report.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to={`/app/matches/${match.id}/lineup`}
            className="rounded bg-primary px-4 py-2 text-body-sm font-semibold text-on-primary"
          >
            Set Lineup
          </Link>
          <Link
            to={`/app/matches/${match.id}`}
            className="rounded border border-outline-variant px-4 py-2 text-body-sm text-on-surface"
          >
            Scout Report
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "waitingSim") {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-lg flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-headline-md text-on-surface">Waiting for kickoff…</h1>
        <p className="text-body-sm text-on-surface-variant">
          {waitingTimedOut
            ? "The match is due but has not been simulated yet. Check back shortly or ask an admin to process fixtures."
            : "The match window has opened. Results will appear here as soon as the simulation finishes."}
        </p>
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-surface-variant">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
        {waitingTimedOut ? (
          <button
            type="button"
            onClick={handleRetryLoad}
            className="rounded border border-outline-variant px-4 py-2 text-body-sm text-on-surface transition-colors hover:bg-surface-variant"
          >
            Check again
          </button>
        ) : null}
      </div>
    );
  }

  // Played (live/replay) but match log not hydrated yet — never start an empty clock.
  if (needsLogHydration) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-lg flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-headline-md text-on-surface">
          {logHydrateTimedOut ? "Match events unavailable" : "Loading match events…"}
        </h1>
        <p className="text-body-sm text-on-surface-variant">
          {logHydrateTimedOut
            ? "The result is ready but the live log could not be loaded. Try again or open the full report."
            : "Simulation finished. Pulling the full match log before kickoff playback."}
        </p>
        {(isHydratingLog || isFetching) && !logHydrateTimedOut ? (
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-surface-variant">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
          </div>
        ) : null}
        {logHydrateTimedOut ? (
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleRetryLoad}
              className="rounded bg-primary px-4 py-2 text-body-sm font-semibold text-on-primary"
            >
              Try again
            </button>
            {shouldOpenMatchReport(phase) ? (
              <Link
                to={getMatchReportPath(match.id)}
                className="rounded border border-outline-variant px-4 py-2 text-body-sm text-on-surface"
              >
                Open match report
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  const isHalfTimePause = halfTimePauseRemaining !== null;
  const revealed = revealedForPlayback;
  const playbackComplete = playbackSeconds >= MATCH_LIVE_REPLAY_DURATION_SECONDS;
  const scoreEvents = playbackComplete
    ? revealed
    : getEventsThroughFeedPresentation(
        revealed,
        feedPresentation.sequence,
        feedPresentation.lineIndex,
      );
  const score = getRunningScoreFromEvents(
    scoreEvents,
    match.homeClubId,
    match.awayClubId,
  );
  const ball = getBallPositionFromEvents(revealed, match.homeClubId);
  const stats = getLiveMatchStats(revealed, match.homeClubId, match.awayClubId);
  const displayPhase: MatchPresentationPhase = playbackComplete ? "result" : phase;
  const progressPercent = Math.min(
    100,
    (playbackSeconds / MATCH_LIVE_REPLAY_DURATION_SECONDS) * 100,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleGoBack}
          className="text-body-sm text-on-surface-variant transition-colors hover:text-primary"
        >
          ← Go back
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRestart}
            className="rounded border border-outline-variant px-3 py-1 text-body-sm text-on-surface transition-colors hover:bg-surface-variant"
          >
            Restart
          </button>
          {shouldOpenMatchReport(phase) ? (
            <Link
              to={getMatchReportPath(match.id)}
              className="rounded border border-outline-variant px-3 py-1 text-body-sm text-on-surface transition-colors hover:bg-surface-variant"
            >
              Full report
            </Link>
          ) : null}
        </div>
      </div>

      <MatchLiveScoreboard
        homeClubName={match.homeClubName}
        awayClubName={match.awayClubName}
        homeScore={score.home}
        awayScore={score.away}
        matchMinute={playbackComplete ? 90 : matchMinute}
        statusLabel={getStatusLabel(displayPhase, playbackComplete, isHalfTimePause)}
      />

      {isHalfTimePause ? (
        <p className="text-center text-body-sm text-on-surface-variant">
          Half time — second half in {Math.ceil(halfTimePauseRemaining ?? 0)}s
        </p>
      ) : null}

      <div className="h-0.5 overflow-hidden rounded-full bg-surface-variant">
        <div
          className="h-full bg-primary transition-[width] duration-100 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <MatchLivePitch
            homeClubName={match.homeClubName}
            awayClubName={match.awayClubName}
            ball={ball}
            goalCelebration={
              goalCelebration
                ? { scorerLabel: goalCelebration.scorerLabel }
                : null
            }
          />
        </div>
        <div className="lg:col-span-5">
          <MatchLiveStats
            homeClubName={match.homeClubName}
            awayClubName={match.awayClubName}
            stats={stats}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <MatchLiveCommentary
            events={revealed}
            onHoldPlaybackChange={handleCommentaryHoldChange}
            onGoalMomentChange={handleGoalMomentChange}
            onFeedPresentationChange={handleFeedPresentationChange}
          />
        </div>
        <div className="lg:col-span-5">
          {playbackComplete ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container-high px-3 py-2 text-center">
              <p className="text-body-sm text-on-surface-variant">
                Final score: {match.homeClubName} {match.homeScore ?? score.home} -{" "}
                {match.awayScore ?? score.away} {match.awayClubName}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="rounded bg-primary px-4 py-1.5 text-body-sm font-semibold text-on-primary"
                >
                  Watch replay
                </button>
                {shouldOpenMatchReport(phase) ? (
                  <Link
                    to={getMatchReportPath(match.id)}
                    className="rounded border border-outline-variant px-4 py-1.5 text-body-sm text-on-surface"
                  >
                    Open match report
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
