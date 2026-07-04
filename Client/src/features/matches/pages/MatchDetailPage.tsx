import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { MatchDominancePanel } from "../components/MatchDominancePanel";
import { MatchReportHeader } from "../components/MatchReportHeader";
import { MatchTimeline } from "../components/MatchTimeline";
import { useGetMatchByIdQuery } from "../matchesApiSlice";
import { parseMatchEvents } from "../utils/matchReportHelpers";

export const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: match, isLoading, isError } = useGetMatchByIdQuery(id ?? "", {
    skip: !id,
  });

  const events = useMemo(
    () => parseMatchEvents(match?.matchLogJson),
    [match?.matchLogJson],
  );

  if (!id) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-on-surface-variant">
        <p>Match not found.</p>
        <Link to="/app/fixtures" className="text-primary hover:underline">
          Back to Fixtures
        </Link>
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
        <Link to="/app/fixtures" className="text-primary hover:underline">
          Back to Fixtures
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-gutter">
      <MatchReportHeader match={match} />

      <div className="grid grid-cols-1 gap-card-gap lg:grid-cols-12">
        <MatchTimeline match={match} events={events} />
        <MatchDominancePanel match={match} events={events} />
      </div>
    </div>
  );
};
