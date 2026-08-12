import { useEffect, useState } from "react";
import type { PlayerAttributes, PlayerPosition } from "../../basePlayers/basePlayerTypes";
import {
  getAttributeGroups,
  getAttributeGroupValues,
  getPillarValue,
} from "../utils/playerAttributeHelpers";

interface AttributeBarProps {
  label: string;
  value: number;
  fillClassName: string;
  emphasize?: boolean;
  compact?: boolean;
  delayMs?: number;
}

const AttributeBar = ({
  label,
  value,
  fillClassName,
  emphasize = false,
  compact = false,
  delayMs = 0,
}: AttributeBarProps) => {
  const [width, setWidth] = useState(0);
  const clamped = Math.min(100, Math.max(0, value));

  let valueClassName = "text-on-background";
  if (emphasize) {
    valueClassName = "font-semibold text-primary";
  } else if (compact) {
    valueClassName = "font-data-mono text-on-background";
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setWidth(clamped), 80 + delayMs);
    return () => window.clearTimeout(timer);
  }, [clamped, delayMs]);

  return (
    <div className={`flex flex-col ${compact ? "gap-0.5" : "gap-1"}`}>
      <div
        className={`flex justify-between text-on-surface-variant ${
          compact ? "text-[10px] leading-4 tracking-wide uppercase" : "text-label-caps"
        }`}
      >
        <span>{label}</span>
        <span className={valueClassName}>
          {compact ? value : `${value} / 100`}
        </span>
      </div>
      <div
        className={`w-full overflow-hidden rounded-full bg-surface-container-highest ${
          compact ? "h-1.5" : "h-2"
        }`}
      >
        <div
          className={`h-full transition-all duration-700 ease-out ${fillClassName}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

interface PlayerAttributeProfileProps {
  position: PlayerPosition;
  attributes?: PlayerAttributes | null;
  attackPower: number;
  defenseStrength: number;
  midfieldControl: number;
  compact?: boolean;
}

export const PlayerAttributeProfile = ({
  position,
  attributes,
  attackPower,
  defenseStrength,
  midfieldControl,
  compact = false,
}: PlayerAttributeProfileProps) => {
  const groups = getAttributeGroups(position);

  return (
    <div
      className={
        compact
          ? "flex flex-col gap-3"
          : "grid grid-cols-1 gap-6 sm:grid-cols-3"
      }
    >
      {groups.map((group, groupIndex) => {
        const mainValue = getPillarValue(
          group.pillar,
          attackPower,
          defenseStrength,
          midfieldControl,
        );
        const values = getAttributeGroupValues(attributes, group.id);
        const emphasize = group.pillar === "midfield";

        return (
          <section
            key={group.id}
            className={`flex flex-col ${compact ? "gap-1.5" : "gap-3"}`}
          >
            <AttributeBar
              label={group.title}
              value={mainValue}
              fillClassName={group.fillClassName}
              emphasize={emphasize}
              compact={compact}
              delayMs={groupIndex * 60}
            />
            {group.stats.map((stat, statIndex) => (
              <AttributeBar
                key={stat.key}
                label={stat.label}
                value={values[stat.key] ?? 0}
                fillClassName={group.fillClassName}
                compact={compact}
                delayMs={groupIndex * 60 + (statIndex + 1) * 40}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
};
