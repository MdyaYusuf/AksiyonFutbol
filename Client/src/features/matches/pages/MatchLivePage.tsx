import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MatchLiveCommentary } from "../components/MatchLiveCommentary";
import { MatchLivePitch } from "../components/MatchLivePitch";
import { MatchLiveScoreboard } from "../components/MatchLiveScoreboard";
import { MatchLiveStats } from "../components/MatchLiveStats";
import { useGetMatchByIdQuery } from "../matchesApiSlice";
import {
  getBallPositionFromEvents,
  getLatestLiveEvents,
  getLiveMatchStats,
  getLiveMomentIntensity,
  getMatchPresentationPhase,
  getPlaybackSeekSeconds,
  getRevealedEvents,
  getRunningScoreFromEvents,
  MATCH_LIVE_REPLAY_DURATION_SECONDS,
  wallSecondsToMatchMinute,
  type MatchPresentationPhase,
} from "../utils/matchLiveHelpers";
import { goBackOrFallback, parseMatchEvents } from "../utils/matchReportHelpers";

const WAITING_POLL_MS = 2500;
const WAITING_TIMEOUT_MS = 120_000;

const getStatusLabel = (
  phase: MatchPresentationPhase,
  playbackComplete: boolean,
): string => {
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

export const MatchLivePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const startReplayRequested = searchParams.get("replay") === "1";
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInitializedSeek, setHasInitializedSeek] = useState(false);
  const [waitingTimedOut, setWaitingTimedOut] = useState(false);
  const [pollWaiting, setPollWaiting] = useState(false);
  const waitingStartedAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);

  const { data: match, isLoading, isError } = useGetMatchByIdQuery(id ?? "", {
    skip: !id,
    pollingInterval: pollWaiting ? WAITING_POLL_MS : 0,
  });

  const phase = useMemo(() => {
    if (!match) {
      return "upcoming" as const;
    }

    return getMatchPresentationPhase(match, new Date(nowMs));
  }, [match, nowMs]);

  useEffect(() => {
    setPollWaiting(phase === "waitingSim");
  }, [phase]);

  const events = useMemo(
    () => parseMatchEvents(match?.matchLogJson),
    [match?.matchLogJson],
  );

  useEffect(() => {
    setHasInitializedSeek(false);
    setPlaybackSeconds(0);
    setIsPlaying(false);
    setWaitingTimedOut(false);
    waitingStartedAtRef.current = null;
    setPollWaiting(false);
  }, [id]);

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

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
    if (!match?.isPlayed || hasInitializedSeek) {
      return;
    }

    const currentPhase = getMatchPresentationPhase(match, new Date());

    if (currentPhase === "live") {
      const seek = getPlaybackSeekSeconds(match.matchDate, new Date());
      setPlaybackSeconds(seek);
      setIsPlaying(seek < MATCH_LIVE_REPLAY_DURATION_SECONDS);
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
  }, [match, hasInitializedSeek, startReplayRequested]);

  useEffect(() => {
    if (!isPlaying || !match?.isPlayed) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastFrameRef.current = null;
      return;
    }

    const tick = (timestamp: number) => {
      if (lastFrameRef.current === null) {
        lastFrameRef.current = timestamp;
      }

      const deltaSeconds = (timestamp - lastFrameRef.current) / 1000;
      lastFrameRef.current = timestamp;

      setPlaybackSeconds((previous) => {
        const next = previous + deltaSeconds;

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
  }, [isPlaying, match?.isPlayed]);

  const handleGoBack = () => goBackOrFallback(navigate, "/app/dashboard");

  const handleRestart = () => {
    setPlaybackSeconds(0);
    setIsPlaying(true);
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

  if (isLoading && !match) {
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
      </div>
    );
  }

  const matchMinute = wallSecondsToMatchMinute(playbackSeconds);
  const revealed = getRevealedEvents(events, matchMinute);
  const score = getRunningScoreFromEvents(revealed, match.homeClubId, match.awayClubId);
  const ball = getBallPositionFromEvents(revealed, match.homeClubId);
  const stats = getLiveMatchStats(revealed, match.homeClubId, match.awayClubId);
  const latestEvents = getLatestLiveEvents(revealed, 1);
  const headline = latestEvents.length > 0 ? latestEvents[0] : null;
  const momentIntensity = getLiveMomentIntensity(headline);
  const flashToken =
    headline && momentIntensity === "critical"
      ? `${headline.type}-${headline.minute}-${headline.description}`
      : null;
  const playbackComplete = playbackSeconds >= MATCH_LIVE_REPLAY_DURATION_SECONDS;
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
          <Link
            to={`/app/matches/${match.id}`}
            className="rounded border border-outline-variant px-3 py-1 text-body-sm text-on-surface transition-colors hover:bg-surface-variant"
          >
            Full report
          </Link>
        </div>
      </div>

      <MatchLiveScoreboard
        homeClubName={match.homeClubName}
        awayClubName={match.awayClubName}
        homeScore={score.home}
        awayScore={score.away}
        matchMinute={playbackComplete ? 90 : matchMinute}
        statusLabel={getStatusLabel(displayPhase, playbackComplete)}
      />

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
            momentIntensity={momentIntensity}
            flashToken={flashToken}
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
          <MatchLiveCommentary events={revealed} />
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
                <Link
                  to={`/app/matches/${match.id}`}
                  className="rounded border border-outline-variant px-4 py-1.5 text-body-sm text-on-surface"
                >
                  Open match report
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
