import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { PresidentAttributeKey, PresidentAttributes } from "../clubPresidentTypes";
import {
  PRESIDENT_ATTRIBUTE_KEYS,
  PRESIDENT_ATTRIBUTE_LABELS,
  PRESIDENT_ATTRIBUTE_MAX,
  PRESIDENT_ATTRIBUTE_MIN,
  getRemainingAttributePoints,
} from "../utils/presidentProfileHelpers";

interface PresidentAttributeAllocatorProps {
  attributes: PresidentAttributes;
  onChange: (attributes: PresidentAttributes) => void;
}

export const PresidentAttributeAllocator = ({
  attributes,
  onChange,
}: PresidentAttributeAllocatorProps) => {
  const remaining = getRemainingAttributePoints(attributes);

  const adjust = (key: PresidentAttributeKey, delta: number) => {
    const nextValue = attributes[key] + delta;

    if (nextValue < PRESIDENT_ATTRIBUTE_MIN || nextValue > PRESIDENT_ATTRIBUTE_MAX) {
      return;
    }

    if (delta > 0 && remaining <= 0) {
      return;
    }

    onChange({
      ...attributes,
      [key]: nextValue,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant">
            Attribute Build
          </p>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            Each attribute starts at {PRESIDENT_ATTRIBUTE_MIN} (max {PRESIDENT_ATTRIBUTE_MAX}).
            Spend the full point budget.
          </p>
        </div>
        <div className="rounded border border-outline-variant bg-surface-container-low px-3 py-2 text-right">
          <div className="font-label-caps text-label-caps text-on-surface-variant">
            Remaining
          </div>
          <div
            className={[
              "font-stat-value text-stat-value",
              remaining === 0 ? "text-primary" : "text-secondary",
            ].join(" ")}
          >
            {remaining}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {PRESIDENT_ATTRIBUTE_KEYS.map((key) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 rounded border border-outline-variant bg-surface-container-low px-3 py-2"
          >
            <span className="font-body-sm text-body-sm text-on-surface">
              {PRESIDENT_ATTRIBUTE_LABELS[key]}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Decrease ${PRESIDENT_ATTRIBUTE_LABELS[key]}`}
                disabled={attributes[key] <= PRESIDENT_ATTRIBUTE_MIN}
                onClick={() => {
                  adjust(key, -1);
                }}
                className="flex h-8 w-8 items-center justify-center rounded border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-40"
              >
                <MaterialIcon name="remove" className="text-sm" />
              </button>
              <span className="w-6 text-center font-data-mono text-data-mono text-on-surface">
                {attributes[key]}
              </span>
              <button
                type="button"
                aria-label={`Increase ${PRESIDENT_ATTRIBUTE_LABELS[key]}`}
                disabled={
                  attributes[key] >= PRESIDENT_ATTRIBUTE_MAX || remaining <= 0
                }
                onClick={() => {
                  adjust(key, 1);
                }}
                className="flex h-8 w-8 items-center justify-center rounded border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-40"
              >
                <MaterialIcon name="add" className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
