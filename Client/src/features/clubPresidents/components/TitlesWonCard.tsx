import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";

export const TitlesWonCard = () => {
  return (
    <section className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-high p-6">
      <div className="mb-6 flex items-center justify-between border-b border-outline-variant pb-4">
        <h3 className="flex items-center gap-2 text-headline-sm text-on-surface">
          <MaterialIcon name="emoji_events" className="text-secondary" />
          Titles Won
        </h3>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-background">
          <MaterialIcon name="trophy" className="text-2xl text-on-surface-variant" />
        </div>
        <p className="text-body-sm text-on-surface-variant">No titles won yet.</p>
        <p className="text-label-caps text-on-surface-variant">
          Win leagues and cups to fill this cabinet.
        </p>
      </div>
    </section>
  );
};
