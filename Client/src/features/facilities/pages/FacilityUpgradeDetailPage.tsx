import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { FacilityCurrentPerformance } from "../components/FacilityCurrentPerformance";
import { FacilityProjectedImpact } from "../components/FacilityProjectedImpact";
import { FacilityUpgradeActions } from "../components/FacilityUpgradeActions";
import { FacilityUpgradeDetailHeader } from "../components/FacilityUpgradeDetailHeader";
import { FacilityUpgradeHero } from "../components/FacilityUpgradeHero";
import { FacilityUpgradePath } from "../components/FacilityUpgradePath";
import {
  useGetMyFacilitiesQuery,
  useUpgradeFacilityMutation,
} from "../facilitiesApiSlice";
import { CashSpendLockBanner } from "../../matches/components/CashSpendLockBanner";
import {
  getFacilityPerformanceStats,
  getProjectedImpactRows,
  parseFacilityTypeParam,
} from "../utils/facilityUpgradeDetailHelpers";

export const FacilityUpgradeDetailPage = () => {
  const navigate = useNavigate();
  const { facilityType: facilityTypeParam } = useParams<{ facilityType: string }>();
  const facilityType = parseFacilityTypeParam(facilityTypeParam);

  const { data: overview, isLoading, isError } = useGetMyFacilitiesQuery();
  const [upgradeFacility, { isLoading: isSubmitting }] = useUpgradeFacilityMutation();

  if (!facilityType) {
    return <Navigate to="/app/facilities" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Loading facility details...
      </div>
    );
  }

  if (isError || !overview) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 py-16 text-center">
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Facility details could not be loaded.
        </p>
        <Link to="/app/facilities" className="text-primary hover:underline">
          Back to Facilities
        </Link>
      </div>
    );
  }

  const facility = overview.facilities.find((item) => item.facilityType === facilityType);

  if (!facility) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 py-16 text-center">
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          This facility was not found for your club.
        </p>
        <Link to="/app/facilities" className="text-primary hover:underline">
          Back to Facilities
        </Link>
      </div>
    );
  }

  const performanceStats = getFacilityPerformanceStats(facility, overview);
  const impactRows = getProjectedImpactRows(facility, overview);
  const canAfford =
    !facility.isMaxLevel &&
    !overview.cashSpendLocked &&
    overview.clubCash >= facility.nextUpgradeCost;
  const targetLevel = facility.isMaxLevel ? facility.level : facility.level + 1;

  const handleConfirm = async () => {
    if (!canAfford || facility.isMaxLevel || overview.cashSpendLocked) {
      return;
    }

    try {
      await upgradeFacility({ facilityType: facility.facilityType }).unwrap();
      navigate("/app/facilities", { replace: true });
    } catch {
      /* Toasts via apiClient */
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <FacilityUpgradeDetailHeader facilityName={facility.facilityTypeName} />

      {overview.cashSpendLocked ? <CashSpendLockBanner /> : null}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="col-span-1 flex flex-col gap-4 lg:col-span-5">
          <FacilityUpgradeHero facility={facility} />
          <FacilityCurrentPerformance stats={performanceStats} />
        </div>

        <div className="col-span-1 flex flex-col gap-6 lg:col-span-7">
          <div className="relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container p-6">
            <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6">
              <FacilityUpgradePath facility={facility} />
              <FacilityProjectedImpact targetLevel={targetLevel} rows={impactRows} />
              <FacilityUpgradeActions
                upgradeCost={facility.nextUpgradeCost}
                canAfford={canAfford}
                cashSpendLocked={Boolean(overview.cashSpendLocked)}
                isMaxLevel={facility.isMaxLevel}
                isSubmitting={isSubmitting}
                onConfirm={handleConfirm}
              />

              <div className="flex items-start gap-3 rounded border border-outline-variant/50 bg-surface-variant/50 p-3">
                <MaterialIcon name="info" className="mt-0.5 text-[20px] text-secondary" />
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  The Board supports this investment. Confirmation spends club cash immediately
                  and applies the facility level upgrade with its status bonuses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
