import { useGetCurrentUserClubQuery } from "../clubsApiSlice";
import { ClubHeaderCard } from "../components/ClubHeaderCard";
import { ClubQuickLinksCard } from "../components/ClubQuickLinksCard";
import { FacilitiesCard } from "../components/FacilitiesCard";
import { FinancialOverviewCard } from "../components/FinancialOverviewCard";
import { SquadAtmosphereCard } from "../components/SquadAtmosphereCard";

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
