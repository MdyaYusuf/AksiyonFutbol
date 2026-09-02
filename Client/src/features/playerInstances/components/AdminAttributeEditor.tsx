import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type {
  PlayerAttributes,
  PlayerPosition,
} from "@/features/basePlayers/basePlayerTypes";
import {
  averageStat,
  computeMainStats,
  computeOverallRating,
  getAttributeGroups,
  getAttributeGroupValues,
  setAttributeStat,
  type AttributeGroupDef,
} from "@/features/playerInstances/utils/playerAttributeHelpers";

interface AdminAttributeEditorProps {
  idPrefix: string;
  position: PlayerPosition;
  attributes: PlayerAttributes;
  onChange: (attributes: PlayerAttributes) => void;
}

const AttributeRow = ({
  id,
  label,
  value,
  fillClassName,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  fillClassName: string;
  onChange: (value: number) => void;
}) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between gap-1">
      <label htmlFor={id} className="truncate text-[11px] leading-4 text-on-surface-variant">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={1}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-12 rounded border border-outline-variant bg-surface-container px-1 py-0.5 text-center font-data-mono text-xs text-on-surface outline-none focus:border-primary"
      />
    </div>
    <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
      <div
        className={`h-full rounded-full ${fillClassName}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  </div>
);

const GroupCard = ({
  idPrefix,
  group,
  attributes,
  position,
  onChange,
}: {
  idPrefix: string;
  group: AttributeGroupDef;
  attributes: PlayerAttributes;
  position: PlayerPosition;
  onChange: (attributes: PlayerAttributes) => void;
}) => {
  const values = getAttributeGroupValues(attributes, group.id);
  const groupAverage = averageStat(
    group.stats.map((stat) => values[stat.key] ?? 0),
  );

  return (
    <div className="space-y-2 rounded border border-outline-variant bg-surface-container-low p-2.5">
      <div className="flex items-center justify-between gap-2">
        <h5 className="flex items-center gap-1.5 text-label-caps text-on-surface-variant">
          <span className={`h-2 w-2 rounded-full ${group.fillClassName}`} />
          {group.title}
        </h5>
        <span className="font-data-mono text-xs text-on-surface">{groupAverage}</span>
      </div>
      <div className="space-y-2">
        {group.stats.map((stat) => (
          <AttributeRow
            key={stat.key}
            id={`${idPrefix}-${group.id}-${stat.key}`}
            label={stat.label}
            value={values[stat.key] ?? 50}
            fillClassName={group.fillClassName}
            onChange={(value) =>
              onChange(setAttributeStat(attributes, position, group.id, stat.key, value))
            }
          />
        ))}
      </div>
    </div>
  );
};

export const AdminAttributeEditor = ({
  idPrefix,
  position,
  attributes,
  onChange,
}: AdminAttributeEditorProps) => {
  const groups = getAttributeGroups(position);
  const sharedGroups = groups.filter((group) => group.kind !== "positional");
  const roleGroups = groups.filter((group) => group.kind === "positional");
  const mains = computeMainStats(position, attributes);
  const overallRating = computeOverallRating(position, attributes);

  const previewItems = [
    { label: "Attack Power", value: mains.attackPower },
    { label: "Defense Strength", value: mains.defenseStrength },
    { label: "Midfield Control", value: mains.midfieldControl },
    { label: "Overall", value: overallRating },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-on-surface">
          <MaterialIcon name="troubleshoot" className="text-[18px] text-primary" />
          Attributes (1-100)
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {previewItems.map((preview) => (
            <div
              key={preview.label}
              className="rounded border border-outline-variant bg-surface-container-low px-2 py-2 text-center"
            >
              <div className="text-[9px] leading-3 font-bold tracking-wide text-on-surface-variant uppercase">
                {preview.label}
              </div>
              <div className="font-data-mono text-sm text-on-surface">{preview.value}</div>
            </div>
          ))}
        </div>
        <p className="mt-1 text-[11px] text-on-surface-variant">
          Mains are a live 55/25/20 blend. Overall averages physical, mental, and the role group.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {sharedGroups.map((group) => (
          <GroupCard
            key={group.id}
            idPrefix={idPrefix}
            group={group}
            attributes={attributes}
            position={position}
            onChange={onChange}
          />
        ))}
      </div>

      <div
        className={
          roleGroups.length === 1
            ? "grid grid-cols-1 gap-2"
            : "grid grid-cols-3 gap-2"
        }
      >
        {roleGroups.map((group) => (
          <GroupCard
            key={group.id}
            idPrefix={idPrefix}
            group={group}
            attributes={attributes}
            position={position}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
};
