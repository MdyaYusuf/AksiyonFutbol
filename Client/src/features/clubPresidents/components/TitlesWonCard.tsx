import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import {
  useEquipTitleMutation,
  useGetObjectivesContextQuery,
} from "@/features/objectives/objectivesApiSlice";

export const TitlesWonCard = () => {
  const { data, isLoading } = useGetObjectivesContextQuery();
  const [equipTitle, { isLoading: isEquipping }] = useEquipTitleMutation();

  const titles = data?.titles ?? [];

  const handleEquip = async (titleKey: string) => {
    try {
      await equipTitle({ titleKey }).unwrap();
    } catch {
      /* Toasts via apiClient */
    }
  };

  return (
    <section className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-high p-6 md:col-span-2">
      <div className="mb-6 flex items-center justify-between border-b border-outline-variant pb-4">
        <h3 className="flex items-center gap-2 text-headline-sm text-on-surface">
          <MaterialIcon name="emoji_events" className="text-secondary" />
          Titles Won
        </h3>
        {data?.equippedTitle ? (
          <span className="font-body-sm text-body-sm text-primary">
            Equipped: {data.equippedTitle}
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-body-sm text-on-surface-variant">
          Loading titles...
        </p>
      ) : titles.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant bg-background">
            <MaterialIcon name="trophy" className="text-2xl text-on-surface-variant" />
          </div>
          <p className="text-body-sm text-on-surface-variant">No titles unlocked yet.</p>
          <p className="text-label-caps text-on-surface-variant">
            Complete objectives and seasons to fill this cabinet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {titles.map((title) => (
            <button
              key={title.titleKey}
              type="button"
              disabled={isEquipping || title.isEquipped}
              onClick={() => {
                void handleEquip(title.titleKey);
              }}
              className={[
                "rounded border px-3 py-3 text-left transition-colors",
                title.isEquipped
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-outline-variant bg-surface text-on-surface hover:border-primary/40 hover:bg-surface-variant",
              ].join(" ")}
            >
              <div className="font-body-sm text-body-sm font-semibold">
                {title.displayName}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-on-surface-variant">
                {title.isEquipped ? "Equipped" : "Click to equip"}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
