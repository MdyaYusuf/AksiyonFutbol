import type { ClubActionAvailability, ClubActionCategory } from "@/features/actions/actionTypes";
import { ClubActionCategory as Category } from "@/features/actions/actionTypes";
import {
  getCategoryGridClass,
  getCategorySectionTitle,
} from "@/features/actions/utils/actionsHubHelpers";
import { ActionCard } from "@/features/actions/components/ActionCard";
import { BribeRefereeActionCard } from "@/features/actions/components/BribeRefereeActionCard";
import type { BriberyContext } from "@/features/bribery/briberyTypes";

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
    <section>
      <h3 className="mb-6 border-b border-[#334155] pb-2 font-headline-md text-headline-md text-on-surface">
        {getCategorySectionTitle(category)}
      </h3>

      <div className={getCategoryGridClass(category)}>
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
