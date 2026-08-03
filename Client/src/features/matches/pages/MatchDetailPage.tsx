import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MatchDominancePanel } from "../components/MatchDominancePanel";
import { MatchReportHeader } from "../components/MatchReportHeader";
import { MatchTimeline } from "../components/MatchTimeline";
import { useGetMatchByIdQuery } from "../matchesApiSlice";
import { goBackOrFallback, parseMatchEvents } from "../utils/matchReportHelpers";

export const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: match, isLoading, isError } = useGetMatchByIdQuery(id ?? "", {
    skip: !id,
  });

  const events = useMemo(
    () => parseMatchEvents(match?.matchLogJson),
    [match?.matchLogJson],
  );

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

  if (isError || !match) {
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
  return (
    <div className="mx-auto max-w-7xl space-y-gutter">
      <MatchReportHeader match={match} />

      {!match.isPlayed && (
        <div className="flex justify-end">
          <Link
            to={`/app/matches/${match.id}/lineup`}
            className="rounded bg-primary px-4 py-2 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-fixed"
          >
            Set Lineup
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-card-gap lg:grid-cols-12">
        <MatchTimeline match={match} events={events} />
        <MatchDominancePanel match={match} events={events} />
      </div>
    </div>
  );
};
