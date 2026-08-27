import type { PresidentAttributes } from "../clubPresidentTypes";
import {
  PRESIDENT_ATTRIBUTE_KEYS,
  PRESIDENT_ATTRIBUTE_LABELS,
  PRESIDENT_ATTRIBUTE_MAX,
} from "../utils/presidentProfileHelpers";

interface PresidentAttributesPanelProps {
  attributes: PresidentAttributes;
  compact?: boolean;
}

export const PresidentAttributesPanel = ({
  attributes,
  compact = false,
}: PresidentAttributesPanelProps) => {
  return (
    <div
      className={[
        "grid gap-2",
        compact ? "grid-cols-5" : "grid-cols-2 sm:grid-cols-5",
      ].join(" ")}
    >
      {PRESIDENT_ATTRIBUTE_KEYS.map((key) => (
        <div
          key={key}
          className={[
            "rounded border border-outline-variant bg-surface-variant text-center",
            compact ? "px-1 py-2" : "p-3",
          ].join(" ")}
        >
          <div
            className={[
              "font-label-caps text-label-caps text-on-surface-variant",
              compact ? "text-[9px]" : "",
            ].join(" ")}
          >
            {compact
              ? PRESIDENT_ATTRIBUTE_LABELS[key].slice(0, 3)
              : PRESIDENT_ATTRIBUTE_LABELS[key]}
          </div>
          <div
            className={[
              "font-stat-value text-on-surface",
              compact ? "text-sm" : "text-stat-value",
            ].join(" ")}
          >
            {attributes[key]}
            {!compact ? (
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                /{PRESIDENT_ATTRIBUTE_MAX}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};
