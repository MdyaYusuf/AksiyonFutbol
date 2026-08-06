import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { MatchLiveStats } from "../components/MatchLiveStats";
import { MatchReportHeader } from "../components/MatchReportHeader";
import { MatchTimeline } from "../components/MatchTimeline";
import { useGetMatchByIdQuery } from "../matchesApiSlice";
import {
  getLiveMatchStats,
  getMatchLivePath,
  getMatchLiveReplayPath,
  getMatchPresentationPhase,
} from "../utils/matchLiveHelpers";
import { goBackOrFallback, parseMatchEvents } from "../utils/matchReportHelpers";

export const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nowMs, setNowMs] = useState(() => Date.now());
  const { data: match, isLoading, isError } = useGetMatchByIdQuery(id ?? "", {
    skip: !id,
  });

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const events = useMemo(
    () => parseMatchEvents(match?.matchLogJson),
    [match?.matchLogJson],
  );

  const phase = useMemo(
    () => (match ? getMatchPresentationPhase(match, new Date(nowMs)) : "upcoming"),
    [match, nowMs],
  );

  const stats = useMemo(() => {
    if (!match) {
      return null;
    }

    return getLiveMatchStats(events, match.homeClubId, match.awayClubId);
  }, [events, match]);

  const handleGoBack = () => goBackOrFallback(navigate, "/app/fixtures");

  if (!id) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-on-surface-variant">
        <p>Match not found.</p>
        <button
          type="button"
          onClick={handleGoBack}
          className="text-primary hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Maç raporu yükleniyor...
      </div>
    );
  }

  if (isError || !match || !stats) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-on-surface-variant">
        <p>Maç raporu bulunamadı.</p>
        <button
          type="button"
          onClick={handleGoBack}
          className="text-primary hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const livePath = getMatchLivePath(match.id);
  const replayPath = getMatchLiveReplayPath(match.id);

  return (
    <div className="mx-auto flex h-[calc(100vh-64px-32px)] max-w-7xl flex-col gap-3 overflow-hidden md:h-[calc(100vh-64px-48px)]">
      <div className="shrink-0">
        <MatchReportHeader match={match} />
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-center gap-2">
        {!match.isPlayed ? (
          <Link
            to={`/app/matches/${match.id}/lineup`}
            className="rounded bg-primary px-4 py-2 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-fixed"
          >
            Set Lineup
          </Link>
        ) : null}

        {phase === "waitingSim" || phase === "live" ? (
          <Link
            to={livePath}
            className="rounded bg-primary px-4 py-2 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-fixed"
          >
            Watch live
          </Link>
        ) : null}

        {phase === "replay" && match.isPlayed ? (
          <Link
            to={replayPath}
            className="inline-flex items-center gap-2 rounded bg-primary px-5 py-2 text-body-sm font-semibold text-on-primary shadow-[0_0_16px_rgba(74,222,128,0.25)] transition-colors hover:bg-primary-fixed"
          >
            <MaterialIcon name="replay" className="text-sm" />
            Watch replay
          </Link>
        ) : null}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-12">
        <MatchTimeline match={match} events={events} />
        <div className="min-h-0 lg:col-span-5">
          <MatchLiveStats
            homeClubName={match.homeClubName}
            awayClubName={match.awayClubName}
            stats={stats}
          />
        </div>
      </div>
    </div>
  );
};
