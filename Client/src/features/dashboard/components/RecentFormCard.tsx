import { Link } from "react-router-dom";
import type { MatchPreview } from "@/features/matches/matchTypes";
import {
  getMatchResultLetter,
  getOpponentLabel,
  getScoreLabel,
} from "@/features/dashboard/utils/matchHelpers";

interface RecentFormCardProps {
  clubId: string;
  matches: MatchPreview[];
}

const resultStyles = {
  W: {
    badge: "border-primary/30 bg-primary/20 text-primary",
    score: "text-primary",
  },
  D: {
    badge: "border-secondary/30 bg-secondary/20 text-secondary",
    score: "text-secondary",
  },
  L: {
    badge: "border-error/30 bg-error/20 text-error",
    score: "text-error",
  },
} as const;

export const RecentFormCard = ({ clubId, matches }: RecentFormCardProps) => {
  return (
    <div className="col-span-1 flex flex-col rounded-lg border border-outline-variant bg-surface-container-high p-4 md:col-span-8 lg:col-span-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-label-caps text-on-surface-variant">Recent Form</h2>
        <Link to="/app/fixtures" className="text-body-sm text-primary hover:underline">
          View All
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {matches.length === 0 ? (
          <p className="py-6 text-center text-body-sm text-on-surface-variant">
            No played matches yet.
          </p>
        ) : (
          matches.map((match) => {
            const result = getMatchResultLetter(match, clubId);
            const styles = result ? resultStyles[result] : resultStyles.D;

            return (
              <div
                key={match.id}
                className="flex items-center justify-between rounded border border-outline-variant bg-background p-3 transition-colors hover:bg-surface-container"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded border font-data-mono text-xs font-bold ${styles.badge}`}
                  >
                    {result ?? "—"}
                  </div>
                  <span className="text-body-sm text-on-surface">
                    {getOpponentLabel(match, clubId)}
                  </span>
                </div>
                <span className={`font-data-mono font-bold ${styles.score}`}>
                  {getScoreLabel(match)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
