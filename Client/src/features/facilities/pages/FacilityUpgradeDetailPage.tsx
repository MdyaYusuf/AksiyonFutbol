import { Link, useParams } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";

/** Placeholder until Facility Upgrade Detail is built from its design. */
export const FacilityUpgradeDetailPage = () => {
  const { facilityType } = useParams<{ facilityType: string }>();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-8">
      <div className="flex items-center gap-3">
        <Link
          to="/app/facilities"
          className="-ml-2 flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-primary"
          aria-label="Back to Facilities"
        >
          <MaterialIcon name="arrow_back" />
        </Link>
        <h1 className="font-headline-md text-headline-md text-on-background">
          Facility Upgrade
        </h1>
      </div>
      <p className="font-body-lg text-body-lg text-on-surface-variant">
        Detail UI for facility type {facilityType ?? "—"} comes next.
      </p>
      <Link
        to="/app/facilities"
        className="self-start rounded border border-outline-variant px-6 py-2 font-label-caps text-label-caps text-on-surface-variant transition-colors hover:bg-surface-variant"
      >
        Back to Facilities Hub
      </Link>
    </div>
  );
};
