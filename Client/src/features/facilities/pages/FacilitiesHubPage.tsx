import { CashSpendLockBanner } from "@/features/matches/components/CashSpendLockBanner";
import { FacilitiesHubHeader } from "@/features/facilities/components/FacilitiesHubHeader";
import { FacilityHubCard } from "@/features/facilities/components/FacilityHubCard";
import { useGetMyFacilitiesQuery } from "@/features/facilities/facilitiesApiSlice";

export const FacilitiesHubPage = () => {
  const { data: overview, isLoading, isError } = useGetMyFacilitiesQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Loading facilities...
      </div>
    );
  }

  if (isError || !overview) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Facilities could not be loaded.
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <FacilitiesHubHeader clubCash={overview.clubCash} morale={overview.morale} />

      {overview.cashSpendLocked ? <CashSpendLockBanner /> : null}

      <div className="grid grid-cols-1 gap-card-gap md:grid-cols-2">
        {overview.facilities.map((facility) => (
          <FacilityHubCard
            key={facility.id}
            facility={facility}
            clubCash={overview.clubCash}
          />
        ))}
      </div>
    </div>
  );
};
