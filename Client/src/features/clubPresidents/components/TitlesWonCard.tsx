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
    <section className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-high p-5">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-outline-variant pb-3">
        <h3 className="flex items-center gap-2 text-title-md text-on-surface">
          <MaterialIcon name="emoji_events" className="text-secondary" />
          Titles Won
        </h3>
        {data?.equippedTitle ? (
          <span className="truncate font-body-sm text-body-sm text-primary">
            Equipped: {data.equippedTitle}
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <p className="py-6 text-center text-body-sm text-on-surface-variant">
          Loading titles...
        </p>
      ) : titles.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center">
          <MaterialIcon name="trophy" className="text-xl text-on-surface-variant" />
          <p className="text-body-sm text-on-surface-variant">No titles unlocked yet.</p>
          <p className="text-label-caps text-on-surface-variant">
            Complete objectives and seasons to fill this cabinet.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {titles.map((title) => (
            <button
              key={title.titleKey}
              type="button"
              disabled={isEquipping || title.isEquipped}
              onClick={() => {
                void handleEquip(title.titleKey);
              }}
              title={title.isEquipped ? "Equipped" : "Click to equip"}
              className={[
                "inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-left transition-colors",
                title.isEquipped
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-outline-variant bg-surface text-on-surface hover:border-primary/40 hover:bg-surface-variant",
              ].join(" ")}
            >
              <MaterialIcon
                name={title.isEquipped ? "check_circle" : "workspace_premium"}
                className="text-sm"
              />
              <span className="text-body-sm font-semibold">{title.displayName}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
