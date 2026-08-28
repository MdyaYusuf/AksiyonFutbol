import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { formatCashFull } from "../../clubs/utils/clubOverviewHelpers";
import type { BribeStakeOption, BribeStakeTier } from "../briberyTypes";
import {
  formatChancePercent,
  getAmountToneClass,
} from "../utils/matchInfluenceHelpers";

interface ApproachStakeOptionProps {
  option: BribeStakeOption;
  selected: boolean;
  disabled: boolean;
  unaffordable: boolean;
  onSelect: (tier: BribeStakeTier) => void;
}

export const ApproachStakeOption = ({
  option,
  selected,
  disabled,
  unaffordable,
  onSelect,
}: ApproachStakeOptionProps) => {
  const detectionIsHigh = option.tier === "high";
  const isDisabled = disabled || unaffordable;

  return (
    <label
      className={[
        "group relative flex items-start gap-4 rounded-lg border border-outline-variant bg-surface-container-high p-5 transition-colors",
        isDisabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:bg-surface-variant",
        selected ? "border-primary" : "",
      ].join(" ")}
    >
      <input
        type="radio"
        name="approach"
        value={option.tier}
        checked={selected}
        disabled={isDisabled}
        onChange={() => onSelect(option.tier)}
        className="mt-1 h-5 w-5 border-outline-variant bg-surface text-primary focus:ring-primary focus:ring-offset-background"
      />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="font-stat-value text-stat-value text-on-background">
            {option.title}
          </span>
          <span
            className={`rounded px-2 py-1 font-data-mono text-data-mono text-xs ${getAmountToneClass(option.tier)}`}
          >
            {formatCashFull(option.amount)}
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {option.description}
        </p>
        {unaffordable ? (
          <p className="font-label-caps text-label-caps text-error">
            Insufficient club cash
          </p>
        ) : (
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              <MaterialIcon name="local_fire_department" className="text-[16px] text-secondary" />
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                Heat: +{option.heatGenerated}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MaterialIcon name="check_circle" className="text-[16px] text-primary" />
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                Success: {formatChancePercent(option.successChance)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MaterialIcon
                name="warning"
                className={`text-[16px] ${detectionIsHigh ? "text-error" : "text-secondary"}`}
              />
              <span
                className={`font-label-caps text-label-caps ${
                  detectionIsHigh ? "text-error" : "text-on-surface-variant"
                }`}
              >
                Detection: {formatChancePercent(option.detectionChance)}
              </span>
            </div>
          </div>
        )}
      </div>
      {selected && !isDisabled ? (
        <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-primary" />
      ) : null}
    </label>
  );
};
