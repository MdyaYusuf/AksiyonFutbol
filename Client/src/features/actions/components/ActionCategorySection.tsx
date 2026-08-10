import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { ClubActionAvailability, ClubActionCategory } from "../actionTypes";
import { ClubActionCategory as Category } from "../actionTypes";
import { getCategoryIcon, getCategoryLabel } from "../utils/actionsHubHelpers";
import { ActionCard } from "./ActionCard";
import { BribeRefereeActionCard } from "./BribeRefereeActionCard";
import type { BriberyContext } from "../../bribery/briberyTypes";

interface ActionCategorySectionProps {
  category: ClubActionCategory;
  actions: ClubActionAvailability[];
  briberyContext?: BriberyContext;
  briberyLoading?: boolean;
  onExecute: (action: ClubActionAvailability) => void;
}

export const ActionCategorySection = ({
  category,
  actions,
  briberyContext,
  briberyLoading = false,
  onExecute,
}: ActionCategorySectionProps) => {
  const showBriberyFirst = category === Category.Match;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
        <MaterialIcon name={getCategoryIcon(category)} className="text-primary" />
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          {getCategoryLabel(category)}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {showBriberyFirst ? (
          <BribeRefereeActionCard
            briberyContext={briberyContext}
            isLoading={briberyLoading}
          />
        ) : null}

        {actions.map((action) => (
          <ActionCard
            key={action.actionType}
            action={action}
            onExecute={onExecute}
          />
        ))}
      </div>
    </section>
  );
};
