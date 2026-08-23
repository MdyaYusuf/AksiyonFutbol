import { useEffect, useState } from "react";
import {
  PlayerPosition,
  type PlayerAttributes,
} from "../../basePlayers/basePlayerTypes";
import {
  getGroupHeaderValue,
  getProfileAttributeGroups,
  getAttributeGroupValues,
  type AttributeGroupKind,
  type AttributePillar,
} from "../utils/playerAttributeHelpers";

interface PillarAccent {
  fill: string;
  text: string;
  panel: string;
  compactMainShell: string;
  compactMainTrack: string;
}

const getGroupAccent = (
  kind: AttributeGroupKind,
  pillar: AttributePillar | undefined,
  position: PlayerPosition,
): PillarAccent => {
  if (kind === "physical") {
    return {
      fill: "bg-primary-container",
      text: "text-primary",
      panel: "rounded-lg border border-primary/30 bg-primary-container/5 p-3",
      compactMainShell:
        "rounded-md border border-primary/35 bg-primary/10 px-2 py-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
      compactMainTrack: "bg-primary/20",
    };
  }

  if (kind === "mental") {
    return {
      fill: "bg-violet-400",
      text: "text-violet-400",
      panel: "rounded-lg border border-violet-400/30 bg-violet-400/5 p-3",
      compactMainShell:
        "rounded-md border border-violet-400/35 bg-violet-400/10 px-2 py-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
      compactMainTrack: "bg-violet-400/20",
    };
  }

  if (pillar === "attack") {
    return {
      fill: "bg-secondary",
      text: "text-secondary",
      panel: "rounded-lg border border-secondary/30 bg-secondary/5 p-3",
      compactMainShell:
        "rounded-md border border-secondary/35 bg-secondary/10 px-2 py-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
      compactMainTrack: "bg-secondary/20",
    };
  }

  if (pillar === "defense") {
    if (position === PlayerPosition.Goalkeeper) {
      return {
        fill: "bg-teal-400",
        text: "text-teal-300",
        panel: "rounded-lg border border-teal-400/30 bg-teal-400/5 p-3",
        compactMainShell:
          "rounded-md border border-teal-400/35 bg-teal-400/10 px-2 py-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
        compactMainTrack: "bg-teal-400/20",
      };
    }

    return {
      fill: "bg-sky-500",
      text: "text-sky-400",
      panel: "rounded-lg border border-sky-500/30 bg-sky-500/5 p-3",
      compactMainShell:
        "rounded-md border border-sky-500/35 bg-sky-500/10 px-2 py-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
      compactMainTrack: "bg-sky-500/20",
    };
  }

  return {
    fill: "bg-tertiary-container",
    text: "text-tertiary",
    panel: "rounded-lg border border-tertiary/30 bg-tertiary/5 p-3",
    compactMainShell:
      "rounded-md border border-tertiary/35 bg-tertiary/10 px-2 py-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
    compactMainTrack: "bg-tertiary/20",
  };
};

interface AttributeBarProps {
  label: string;
  value: number;
  fillClassName: string;
  variant: "main" | "sub";
  accentTextClassName?: string;
  trackClassName?: string;
  compact?: boolean;
  delayMs?: number;
}

const AttributeBar = ({
  label,
  value,
  fillClassName,
  variant,
  accentTextClassName = "text-on-surface",
  trackClassName = "bg-surface-container-highest",
  compact = false,
  delayMs = 0,
}: AttributeBarProps) => {
  const [width, setWidth] = useState(0);
  const clamped = Math.min(100, Math.max(0, value));
  const isMain = variant === "main";

  let valueClassName = "text-on-background";
  if (isMain) {
    valueClassName = `font-semibold ${accentTextClassName}`;
  } else if (compact || !isMain) {
    valueClassName = "font-data-mono text-on-background";
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setWidth(clamped), 80 + delayMs);
    return () => window.clearTimeout(timer);
  }, [clamped, delayMs]);

  let labelClassName = "text-label-caps text-on-surface-variant";
  if (compact) {
    labelClassName = isMain
      ? `text-[11px] font-bold leading-4 tracking-wide uppercase ${accentTextClassName}`
      : "text-[10px] leading-4 tracking-wide text-on-surface-variant uppercase";
  } else if (isMain) {
    labelClassName = `text-body-sm font-bold tracking-wide uppercase ${accentTextClassName}`;
  }

  let barHeight = "h-2";
  if (compact) {
    barHeight = isMain ? "h-3" : "h-1.5";
  } else if (isMain) {
    barHeight = "h-3.5";
  }

  return (
    <div className={`flex flex-col ${compact ? "gap-1" : isMain ? "gap-1.5" : "gap-1"}`}>
      <div className={`flex justify-between ${labelClassName}`}>
        <span>{label}</span>
        <span className={valueClassName}>
          {compact ? value : isMain ? value : `${value} / 100`}
        </span>
      </div>
      <div
        className={`w-full overflow-hidden rounded-full ${trackClassName} ${barHeight}`}
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
  const groups = getProfileAttributeGroups(position);

  return (
    <div
      className={
        compact
          ? "grid grid-cols-3 gap-2"
          : "grid grid-cols-1 gap-6 sm:grid-cols-3"
      }
    >
      {groups.map((group, groupIndex) => {
        const mainValue = getGroupHeaderValue(
          group,
          attributes,
          attackPower,
          defenseStrength,
          midfieldControl,
        );
        const values = getAttributeGroupValues(attributes, group.id);
        const isPrimary = group.kind === "positional";
        const accent = getGroupAccent(group.kind, group.pillar, position);

        let sectionClassName = "flex flex-col gap-3";
        if (compact) {
          sectionClassName = "flex min-w-0 flex-col gap-1.5";
        } else if (isPrimary) {
          sectionClassName = `flex flex-col gap-3 ${accent.panel}`;
        }

        return (
          <section key={group.id} className={sectionClassName}>
            {compact ? (
              <div className={accent.compactMainShell}>
                <AttributeBar
                  label={group.title}
                  value={mainValue}
                  fillClassName={accent.fill}
                  variant="main"
                  accentTextClassName={accent.text}
                  trackClassName={accent.compactMainTrack}
                  compact={compact}
                  delayMs={groupIndex * 60}
                />
              </div>
            ) : (
              <AttributeBar
                label={group.title}
                value={mainValue}
                fillClassName={accent.fill}
                variant="main"
                accentTextClassName={accent.text}
                compact={compact}
                delayMs={groupIndex * 60}
              />
            )}
            <div
              className={`flex flex-col ${
                compact
                  ? "gap-1.5 border-t border-outline-variant/30 pt-1.5"
                  : "gap-2 border-t border-outline-variant/40 pt-2"
              }`}
            >
              {group.stats.map((stat, statIndex) => (
                <AttributeBar
                  key={stat.key}
                  label={stat.label}
                  value={values[stat.key] ?? 0}
                  fillClassName={accent.fill}
                  variant="sub"
                  compact={compact}
                  delayMs={groupIndex * 60 + (statIndex + 1) * 40}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
