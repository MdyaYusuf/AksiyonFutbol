import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";

export const FacilitiesCard = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container-high xl:col-span-6">
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low p-6">
        <h3 className="flex items-center gap-2 text-headline-sm text-on-surface">
          <MaterialIcon name="domain" className="text-[20px] text-on-surface-variant" />
          Facilities & Infrastructure
        </h3>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-surface-container-highest">
          <MaterialIcon name="construction" className="text-2xl text-on-surface-variant" />
        </div>
        <p className="text-body-sm text-on-surface-variant">
          Facility upgrades are not available yet.
        </p>
        <p className="text-label-caps text-on-surface-variant">
          Training grounds and academy levels will appear here.
        </p>
      </div>
    </div>
  );
};
