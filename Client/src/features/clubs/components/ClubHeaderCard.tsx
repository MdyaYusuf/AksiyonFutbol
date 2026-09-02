import type { ClubResponse } from "@/features/clubs/clubTypes";
import { formatEstablishedYear } from "@/features/clubs/utils/clubOverviewHelpers";
import { getClubDisplayName } from "@/features/clubs/utils/clubDisplayName";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";

interface ClubHeaderCardProps {
  club: ClubResponse;
}

export const ClubHeaderCard = ({ club }: ClubHeaderCardProps) => {
  return (
    <div className="mb-8 flex flex-col gap-6 border-b border-outline-variant pb-6 md:flex-row md:items-end">
      <div className="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-outline-variant bg-surface-container-high p-4 shadow-sm">
        <div className="absolute inset-0 bg-primary opacity-0 transition-opacity group-hover:opacity-5" />
        <MaterialIcon name="shield" className="text-5xl text-primary" filled />
      </div>

      <div className="flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-3">
          <span className="rounded border border-outline-variant bg-surface-container-highest px-2 py-0.5 text-label-caps text-on-surface-variant">
            {formatEstablishedYear(club.createdDate)}
          </span>
          <span className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-label-caps text-primary">
            Pro Status
          </span>
        </div>
        <h2 className="m-0 text-[32px] leading-10 font-extrabold tracking-tight text-on-surface lg:text-display-lg lg:leading-[56px]">
          {getClubDisplayName(club)}
        </h2>
        <p className="mt-2 flex items-center gap-2 text-body-lg text-on-surface-variant">
          <MaterialIcon name="trophy" className="text-[18px]" />
          {club.divisionName}
          {club.presidentName ? ` • ${club.presidentName}` : ""}
        </p>
      </div>
    </div>
  );
};
