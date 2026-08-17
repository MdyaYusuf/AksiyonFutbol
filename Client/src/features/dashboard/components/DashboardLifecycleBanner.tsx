import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { ClubLifecycleStatus, type ClubResponse } from "../../clubs/clubTypes";
import {
  getPlacementQueueMessage,
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
      <div className="col-span-1 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 md:col-span-8 lg:col-span-12">
        <MaterialIcon name="schedule" className="mt-0.5 text-primary" filled />
        <div>
          <p className="text-body-sm font-semibold text-on-surface">
            {getPlacementQueueMessage(club.placementTargetTier)}
          </p>
          <p className="text-body-sm text-on-surface-variant">
            Keep your squad and cash. Competitive seating packs 8-club divisions on Monday.
          </p>
        </div>
      </div>
    );
  }

  if (club.lifecycleStatus === ClubLifecycleStatus.Tutorial && division) {
    return (
      <div className="col-span-1 flex items-start gap-3 rounded-lg border border-secondary/30 bg-secondary/10 px-4 py-3 md:col-span-8 lg:col-span-12">
        <MaterialIcon name="school" className="mt-0.5 text-secondary" filled />
        <div>
          <p className="text-body-sm font-semibold text-on-surface">
            {getTutorialWeekBanner(division.currentMatchWeek)}
          </p>
          <p className="text-body-sm text-on-surface-variant">
            Private tutorial vs Kardelenspor, Anadoluspor, and Poyrazspor. Kickoff is 19:00 Istanbul.
          </p>
        </div>
      </div>
    );
  }

  return null;
};
