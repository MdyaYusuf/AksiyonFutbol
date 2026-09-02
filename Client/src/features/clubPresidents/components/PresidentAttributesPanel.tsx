import type { PresidentAttributes } from "@/features/clubPresidents/clubPresidentTypes";
import {
  PRESIDENT_ATTRIBUTE_KEYS,
  PRESIDENT_ATTRIBUTE_LABELS,
  PRESIDENT_ATTRIBUTE_MAX,
} from "@/features/clubPresidents/utils/presidentProfileHelpers";
import {
  getPresidentAttributeBarClass,
  getPresidentAttributeTextClass,
} from "@/features/clubPresidents/utils/presidentAttributePresentation";

interface PresidentAttributesPanelProps {
  attributes: PresidentAttributes;
  compact?: boolean;
  className?: string;
}

export const PresidentAttributesPanel = ({
  attributes,
  compact = false,
  className = "",
}: PresidentAttributesPanelProps) => {
  return (
    <div className={["grid grid-cols-5 gap-2", className].join(" ")}>
      {PRESIDENT_ATTRIBUTE_KEYS.map((key) => {
        const value = attributes[key];
        const fillClass = getPresidentAttributeBarClass(key);
        const textClass = getPresidentAttributeTextClass(key);

        return (
          <div key={key} className="flex flex-col items-center">
            <span
              className={[
                "mb-1 text-center font-semibold leading-tight text-on-surface-variant",
                compact ? "text-[10px]" : "text-xs",
              ].join(" ")}
            >
              {PRESIDENT_ATTRIBUTE_LABELS[key]}
            </span>
            <div
              className={["mb-1 flex w-full gap-0.5", compact ? "h-1.5" : "h-2"].join(" ")}
              role="img"
              aria-label={`${PRESIDENT_ATTRIBUTE_LABELS[key]} ${value} out of ${PRESIDENT_ATTRIBUTE_MAX}`}
            >
              {Array.from({ length: PRESIDENT_ATTRIBUTE_MAX }, (_, index) => (
                <div
                  key={index}
                  className={[
                    "flex-1 rounded-sm",
                    index < value ? fillClass : "bg-surface-variant",
                  ].join(" ")}
                />
              ))}
            </div>
            <span
              className={[
                "font-data-mono font-bold leading-none",
                textClass,
                compact ? "text-sm" : "text-lg",
              ].join(" ")}
            >
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
