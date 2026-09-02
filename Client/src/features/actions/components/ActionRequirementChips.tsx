import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { ClubActionRequirement } from "@/features/actions/actionTypes";
import { getRequirementChipClass } from "@/features/actions/utils/actionPresentationHelpers";

interface ActionRequirementChipsProps {
  requirements: ClubActionRequirement[];
}

export const ActionRequirementChips = ({ requirements }: ActionRequirementChipsProps) => {
  if (requirements.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {requirements.map((requirement) => (
        <span
          key={requirement.key}
          className={[
            "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-label-caps text-label-caps",
            getRequirementChipClass(requirement),
          ].join(" ")}
        >
          {requirement.isMet ? (
            <MaterialIcon name="check_circle" className="text-xs" />
          ) : (
            <MaterialIcon name="lock" className="text-xs" />
          )}
          {requirement.label} {requirement.requiredValue}
          <span className="opacity-70">
            ({requirement.currentValue}/{requirement.requiredValue})
          </span>
        </span>
      ))}
    </div>
  );
};
