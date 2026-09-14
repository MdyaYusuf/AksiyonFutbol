import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { PresidentTitle } from "@/features/objectives/objectiveTypes";

interface ObjectivesTitlesPanelProps {
  titles: PresidentTitle[];
  equippedTitle: string;
  isEquipping: boolean;
  onEquip: (titleKey: string) => void;
}

export const ObjectivesTitlesPanel = ({
  titles,
  equippedTitle,
  isEquipping,
  onEquip,
}: ObjectivesTitlesPanelProps) => {
  return (
    <section className="rounded border border-[#334155] bg-surface-container-high p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-headline-sm text-headline-sm text-on-surface">
          <MaterialIcon name="emoji_events" className="text-secondary" />
          Title Cabinet
        </h3>
        <span className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
          Equipped: {equippedTitle}
        </span>
      </div>

      {titles.length === 0 ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Complete objectives and seasons to unlock titles.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {titles.map((title) => (
            <button
              key={title.titleKey}
              type="button"
              disabled={isEquipping || title.isEquipped}
              onClick={() => {
                onEquip(title.titleKey);
              }}
              className={[
                "rounded border px-3 py-3 text-left transition-colors",
                title.isEquipped
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-[#334155] bg-surface text-on-surface hover:border-secondary/40 hover:bg-secondary/10",
                isEquipping ? "opacity-60" : "",
              ].join(" ")}
            >
              <div className="font-body-sm text-body-sm font-semibold">
                {title.displayName}
              </div>
              <div
                className={[
                  "mt-1 text-[10px] uppercase tracking-wider",
                  title.isEquipped ? "text-primary" : "text-on-surface-variant",
                ].join(" ")}
              >
                {title.isEquipped ? "Equipped" : "Click to equip"}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
