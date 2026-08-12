import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type {
  PlayerAttributes,
  PlayerPosition,
} from "../../basePlayers/basePlayerTypes";
import {
  computeMainStats,
  getAttributeGroups,
  getAttributeGroupValues,
  getPillarValue,
  setAttributeStat,
} from "../utils/playerAttributeHelpers";

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
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="text-sm text-on-surface-variant">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={1}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-16 rounded border border-outline-variant bg-surface-container p-1.5 text-center font-data-mono text-sm text-on-surface outline-none focus:border-primary"
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

export const AdminAttributeEditor = ({
  idPrefix,
  position,
  attributes,
  onChange,
}: AdminAttributeEditorProps) => {
  const groups = getAttributeGroups(position);
  const mains = computeMainStats(position, attributes);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-on-surface">
          <MaterialIcon name="troubleshoot" className="text-[18px] text-primary" />
          Technical Attributes (1-100)
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {groups.map((group) => {
            const mainValue = getPillarValue(
              group.pillar,
              mains.attackPower,
              mains.defenseStrength,
              mains.midfieldControl,
            );

            return (
              <div
                key={`${group.id}-preview`}
                className="rounded border border-outline-variant bg-surface-container-low px-2 py-2 text-center"
              >
                <div className="text-[10px] font-bold tracking-wide text-on-surface-variant uppercase">
                  {group.title}
                </div>
                <div className="font-data-mono text-sm text-on-surface">{mainValue}</div>
              </div>
            );
          })}
        </div>
        <p className="mt-1 text-[11px] text-on-surface-variant">
          Main ratings update from the group average.
        </p>
      </div>

      {groups.map((group) => {
        const values = getAttributeGroupValues(attributes, group.id);

        return (
          <div key={group.id} className="space-y-3">
            <h5 className="text-label-caps text-on-surface-variant">{group.title}</h5>
            {group.stats.map((stat) => (
              <AttributeRow
                key={stat.key}
                id={`${idPrefix}-${group.id}-${stat.key}`}
                label={stat.label}
                value={values[stat.key] ?? 50}
                fillClassName={group.fillClassName}
                onChange={(value) =>
                  onChange(
                    setAttributeStat(attributes, position, group.id, stat.key, value),
                  )
                }
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};
