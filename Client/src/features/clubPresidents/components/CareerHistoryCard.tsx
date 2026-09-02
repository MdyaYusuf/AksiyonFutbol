import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { ClubResponse } from "@/features/clubs/clubTypes";
import { getClubDisplayName } from "@/features/clubs/utils/clubDisplayName";
import type { ClubPresidentResponse } from "@/features/clubPresidents/clubPresidentTypes";
import { formatCareerPeriod } from "@/features/clubPresidents/utils/presidentProfileHelpers";

interface CareerHistoryCardProps {
  president: ClubPresidentResponse;
  club?: ClubResponse;
  matchCount: number;
  winRate: number | null;
}

export const CareerHistoryCard = ({
  president,
  club,
  matchCount,
  winRate,
}: CareerHistoryCardProps) => {
  return (
    <section className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-high p-6 md:col-span-2">
      <div className="mb-6 flex items-center justify-between border-b border-outline-variant pb-4">
        <h3 className="flex items-center gap-2 text-headline-sm text-on-surface">
          <MaterialIcon name="history" className="text-on-surface-variant" />
          Career History
        </h3>
      </div>

      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-12 gap-4 border-b border-outline-variant pb-2 text-label-caps text-on-surface-variant">
          <div className="col-span-5">Club</div>
          <div className="col-span-3 text-center">Period</div>
          <div className="col-span-2 text-center">Matches</div>
          <div className="col-span-2 text-right">Win %</div>
        </div>

        {club ? (
          <div className="-mx-2 grid grid-cols-12 items-center gap-4 rounded border-b border-outline-variant/50 px-2 py-2 transition-colors hover:bg-surface-variant">
            <div className="col-span-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-outline-variant bg-surface-variant">
                <MaterialIcon name="shield" className="text-sm text-primary" />
              </div>
              <span className="text-body-sm font-semibold text-on-surface">
                {getClubDisplayName(club)}
              </span>
              <span className="hidden rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] text-primary uppercase sm:inline-block">
                Current
              </span>
            </div>
            <div className="col-span-3 text-center font-data-mono text-data-mono text-on-surface-variant">
              {formatCareerPeriod(president.createdDate)}
            </div>
            <div className="col-span-2 text-center font-data-mono text-data-mono text-on-surface">
              {matchCount}
            </div>
            <div className="col-span-2 text-right font-data-mono text-data-mono text-primary">
              {winRate == null ? "—" : winRate.toFixed(1)}
            </div>
          </div>
        ) : (
          <p className="py-8 text-center text-body-sm text-on-surface-variant">
            No club assignment yet.
          </p>
        )}
      </div>
    </section>
  );
};
