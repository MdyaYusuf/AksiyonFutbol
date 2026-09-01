import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { ClubLifecycleStatus, type ClubResponse } from "../../clubs/clubTypes";
import {
  getPlacementQueueSummary,
  getPlacementQueueTitle,
  getTutorialWeekBanner,
} from "../../clubs/utils/clubLifecycleHelpers";
import type { LeagueDivisionResponse } from "../../leagueDivisions/leagueDivisionTypes";

interface DashboardLifecycleBannerProps {
  club: ClubResponse;
  division?: LeagueDivisionResponse;
}

export const DashboardLifecycleBanner = ({
  club,
  division,
}: DashboardLifecycleBannerProps) => {
  if (club.lifecycleStatus === ClubLifecycleStatus.AwaitingPlacement) {
    return (
      <div className="col-span-1 flex items-center gap-2.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 md:col-span-8 lg:col-span-12">
        <MaterialIcon name="schedule" className="shrink-0 text-[18px] text-primary" filled />
        <div className="min-w-0">
          <p className="text-body-sm font-semibold text-on-surface">
            {getPlacementQueueTitle(club.placementTargetTier)}
          </p>
          <p className="text-[13px] leading-snug text-on-surface-variant">
            {getPlacementQueueSummary(club.placementTargetTier)}
          </p>
        </div>
      </div>
    );
  }

  if (club.lifecycleStatus === ClubLifecycleStatus.Tutorial && division) {
    return (
      <div className="col-span-1 flex items-center gap-2.5 rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-2.5 md:col-span-8 lg:col-span-12">
        <MaterialIcon name="school" className="shrink-0 text-[18px] text-secondary" filled />
        <div className="min-w-0">
          <p className="text-body-sm font-semibold text-on-surface">
            {getTutorialWeekBanner(division.currentMatchWeek)}
          </p>
          <p className="text-[13px] leading-snug text-on-surface-variant">
            Private placement league vs Kardelenspor, Anadoluspor, and Poyrazspor. Kickoff is 19:00 Istanbul.
          </p>
        </div>
      </div>
    );
  }

  return null;
};
