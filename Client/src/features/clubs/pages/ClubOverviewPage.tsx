import { useGetCurrentUserClubQuery } from "@/features/clubs/clubsApiSlice";
import { ClubHeaderCard } from "@/features/clubs/components/ClubHeaderCard";
import { ClubQuickLinksCard } from "@/features/clubs/components/ClubQuickLinksCard";
import { FacilitiesCard } from "@/features/clubs/components/FacilitiesCard";
import { FinancialOverviewCard } from "@/features/clubs/components/FinancialOverviewCard";
import { SquadAtmosphereCard } from "@/features/clubs/components/SquadAtmosphereCard";

export const ClubOverviewPage = () => {
  const { data: club, isLoading } = useGetCurrentUserClubQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Kulüp bilgileri yükleniyor...
      </div>
    );
  }

  if (!club) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Kulüp bulunamadı.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <ClubHeaderCard club={club} />

      <div className="grid grid-cols-1 gap-gutter xl:grid-cols-12">
        <FinancialOverviewCard club={club} />
        <SquadAtmosphereCard club={club} />
        <FacilitiesCard />
        <ClubQuickLinksCard />
      </div>
    </div>
  );
};
