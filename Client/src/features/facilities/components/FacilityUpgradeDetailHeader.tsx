import { Link } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";

interface FacilityUpgradeDetailHeaderProps {
  facilityName: string;
}

export const FacilityUpgradeDetailHeader = ({
  facilityName,
}: FacilityUpgradeDetailHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b border-outline-variant pb-4">
      <div className="flex items-center gap-3">
        <Link
          to="/app/facilities"
          className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary"
          aria-label="Back to Facilities"
        >
          <MaterialIcon name="arrow_back" />
        </Link>
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            {facilityName}
          </h1>
          <div className="mt-1 flex items-center gap-2 font-label-caps text-label-caps text-on-surface-variant">
            <Link to="/app/facilities" className="hover:text-primary">
              Club Facilities
            </Link>
            <MaterialIcon name="chevron_right" className="text-[14px]" />
            <span className="text-primary">Upgrade Detail</span>
          </div>
        </div>
      </div>
    </div>
  );
};
