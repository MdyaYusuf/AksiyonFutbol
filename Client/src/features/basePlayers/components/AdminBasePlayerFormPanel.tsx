import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import {
  PlayerPosition,
  PreferredFoot,
} from "../basePlayerTypes";

export interface AdminBasePlayerFormValues {
  defaultFirstName: string;
  defaultLastName: string;
  nationality: string;
  position: PlayerPosition;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  attackPower: number;
  defenseStrength: number;
  midfieldControl: number;
}

interface AdminBasePlayerFormPanelProps {
  mode: "create" | "edit";
  isOpen: boolean;
  values: AdminBasePlayerFormValues;
  isSubmitting: boolean;
  onChange: (values: AdminBasePlayerFormValues) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const positionOptions = [
  { value: PlayerPosition.Goalkeeper, label: "Goalkeeper (GK)" },
  { value: PlayerPosition.Defender, label: "Defender (DEF)" },
  { value: PlayerPosition.Midfielder, label: "Midfielder (MID)" },
  { value: PlayerPosition.Forward, label: "Forward (FWD)" },
];

const footOptions = [
  { value: PreferredFoot.Left, label: "Left" },
  { value: PreferredFoot.Right, label: "Right" },
  { value: PreferredFoot.Both, label: "Both" },
];

const AttributeRow = ({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
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
        className="h-full rounded-full bg-primary"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  </div>
);

export const AdminBasePlayerFormPanel = ({
  mode,
  isOpen,
  values,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: AdminBasePlayerFormPanelProps) => {
  const title = mode === "create" ? "Create Base Player" : "Edit Base Player";
  const submitLabel = mode === "create" ? "Save Player" : "Update Player";

  return (
    <>
      <button
        type="button"
        aria-label="Close panel overlay"
        onClick={onClose}
        className={[
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      <aside
        className={[
          "fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-outline-variant bg-surface shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low p-6">
          <h3 className="text-headline-sm font-bold text-on-surface">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant transition-colors hover:text-on-surface"
            aria-label="Close panel"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="base-first-name"
                className="mb-1 block text-xs text-label-caps text-on-surface-variant"
              >
                First Name
              </label>
              <input
                id="base-first-name"
                type="text"
                value={values.defaultFirstName}
                onChange={(event) =>
                  onChange({ ...values, defaultFirstName: event.target.value })
                }
                className="w-full rounded border border-outline-variant bg-surface-container p-2 text-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="base-last-name"
                className="mb-1 block text-xs text-label-caps text-on-surface-variant"
              >
                Last Name
              </label>
              <input
                id="base-last-name"
                type="text"
                value={values.defaultLastName}
                onChange={(event) =>
                  onChange({ ...values, defaultLastName: event.target.value })
                }
                className="w-full rounded border border-outline-variant bg-surface-container p-2 text-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="base-nationality"
                className="mb-1 block text-xs text-label-caps text-on-surface-variant"
              >
                Nationality
              </label>
              <input
                id="base-nationality"
                type="text"
                value={values.nationality}
                onChange={(event) =>
                  onChange({ ...values, nationality: event.target.value })
                }
                placeholder="e.g. Turkey"
                className="w-full rounded border border-outline-variant bg-surface-container p-2 text-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="base-position"
                className="mb-1 block text-xs text-label-caps text-on-surface-variant"
              >
                Position
              </label>
              <select
                id="base-position"
                value={values.position}
                onChange={(event) =>
                  onChange({
                    ...values,
                    position: Number(event.target.value) as PlayerPosition,
                  })
                }
                className="w-full appearance-none rounded border border-outline-variant bg-surface-container p-2 text-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {positionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="base-age"
                className="mb-1 block text-xs text-label-caps text-on-surface-variant"
              >
                Age
              </label>
              <input
                id="base-age"
                type="number"
                min={16}
                max={40}
                value={values.age}
                onChange={(event) =>
                  onChange({ ...values, age: Number(event.target.value) })
                }
                className="w-full rounded border border-outline-variant bg-surface-container p-2 text-center font-data-mono text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="base-height"
                className="mb-1 block text-xs text-label-caps text-on-surface-variant"
              >
                Height (cm)
              </label>
              <input
                id="base-height"
                type="number"
                min={150}
                max={220}
                value={values.heightCm}
                onChange={(event) =>
                  onChange({ ...values, heightCm: Number(event.target.value) })
                }
                className="w-full rounded border border-outline-variant bg-surface-container p-2 text-center font-data-mono text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="base-weight"
                className="mb-1 block text-xs text-label-caps text-on-surface-variant"
              >
                Weight (kg)
              </label>
              <input
                id="base-weight"
                type="number"
                min={50}
                max={120}
                value={values.weightKg}
                onChange={(event) =>
                  onChange({ ...values, weightKg: Number(event.target.value) })
                }
                className="w-full rounded border border-outline-variant bg-surface-container p-2 text-center font-data-mono text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <span className="mb-2 block text-xs text-label-caps text-on-surface-variant">
              Preferred Foot
            </span>
            <div className="flex gap-2 rounded border border-outline-variant bg-surface-container p-1">
              {footOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onChange({ ...values, preferredFoot: option.value })
                  }
                  className={[
                    "flex-1 rounded py-1.5 text-xs font-medium transition-colors",
                    values.preferredFoot === option.value
                      ? "bg-surface-variant text-on-surface"
                      : "text-on-surface-variant",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t border-outline-variant pt-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-on-surface">
              <MaterialIcon name="troubleshoot" className="text-[18px] text-primary" />
              Technical Attributes (1-100)
            </h4>
            <AttributeRow
              id="base-attack"
              label="Attack Power"
              value={values.attackPower}
              onChange={(attackPower) => onChange({ ...values, attackPower })}
            />
            <AttributeRow
              id="base-defense"
              label="Defense Strength"
              value={values.defenseStrength}
              onChange={(defenseStrength) =>
                onChange({ ...values, defenseStrength })
              }
            />
            <AttributeRow
              id="base-midfield"
              label="Midfield Control"
              value={values.midfieldControl}
              onChange={(midfieldControl) =>
                onChange({ ...values, midfieldControl })
              }
            />
          </div>
        </div>

        <div className="flex gap-3 border-t border-outline-variant bg-surface-container-low p-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded border border-outline-variant px-4 py-2 font-medium text-on-surface transition-colors hover:bg-surface-variant"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded bg-primary-container px-4 py-2 font-bold text-on-primary-container transition-colors hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </aside>
    </>
  );
};
