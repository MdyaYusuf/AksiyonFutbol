import type { PresidentAttributes } from "@/features/clubPresidents/clubPresidentTypes";
import {
  PRESIDENT_ATTRIBUTE_KEYS,
  PRESIDENT_ATTRIBUTE_LABELS,
  PRESIDENT_ATTRIBUTE_MAX,
} from "@/features/clubPresidents/utils/presidentProfileHelpers";

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
            compact ? "px-0.5 py-1.5" : "p-3",
          ].join(" ")}
        >
          <div
            className={[
              "font-label-caps text-label-caps text-on-surface-variant",
              compact ? "text-[10px] leading-tight" : "",
            ].join(" ")}
          >
            {PRESIDENT_ATTRIBUTE_LABELS[key]}
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
