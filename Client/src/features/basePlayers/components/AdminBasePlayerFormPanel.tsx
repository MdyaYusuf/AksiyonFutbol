import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { AdminAttributeEditor } from "../../playerInstances/components/AdminAttributeEditor";
import { applyPositionChange } from "../../playerInstances/utils/playerAttributeHelpers";
import {
  DraftTier,
  PlayerPosition,
  PreferredFoot,
  type PlayerAttributes,
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
  attributes: PlayerAttributes;
  draftTier: DraftTier;
  draftFee: number;
  isFreeAgentTemplate: boolean;
  isDraftOnly: boolean;
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

const draftTierOptions = [
  { value: DraftTier.Gold, label: "Gold" },
  { value: DraftTier.Silver, label: "Silver" },
  { value: DraftTier.Bronze, label: "Bronze" },
  { value: DraftTier.Iron, label: "Iron" },
];

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
                onChange={(event) => {
                  const position = Number(event.target.value) as PlayerPosition;
                  onChange({
                    ...values,
                    position,
                    attributes: applyPositionChange(
                      values.position,
                      position,
                      values.attributes,
                    ),
                  });
                }}
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

          <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-4">
            <div>
              <label
                htmlFor="base-draft-tier"
                className="mb-1 block text-xs text-label-caps text-on-surface-variant"
              >
                Draft Tier
              </label>
              <select
                id="base-draft-tier"
                value={values.draftTier}
                onChange={(event) =>
                  onChange({
                    ...values,
                    draftTier: Number(event.target.value) as DraftTier,
                  })
                }
                className="w-full appearance-none rounded border border-outline-variant bg-surface-container p-2 text-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {draftTierOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="base-draft-fee"
                className="mb-1 block text-xs text-label-caps text-on-surface-variant"
              >
                Draft Fee
              </label>
              <input
                id="base-draft-fee"
                type="number"
                min={0}
                step={100}
                value={values.draftFee}
                onChange={(event) =>
                  onChange({ ...values, draftFee: Number(event.target.value) })
                }
                className="w-full rounded border border-outline-variant bg-surface-container p-2 text-center font-data-mono text-sm text-on-surface outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 rounded border border-outline-variant bg-surface-container p-3 text-sm text-on-surface">
              <input
                type="checkbox"
                checked={values.isFreeAgentTemplate}
                disabled={values.isDraftOnly}
                onChange={(event) =>
                  onChange({
                    ...values,
                    isFreeAgentTemplate: event.target.checked,
                    isDraftOnly: event.target.checked ? false : values.isDraftOnly,
                  })
                }
              />
              Free agent template
            </label>
            <label className="flex items-center gap-2 rounded border border-outline-variant bg-surface-container p-3 text-sm text-on-surface">
              <input
                type="checkbox"
                checked={values.isDraftOnly}
                disabled={values.isFreeAgentTemplate}
                onChange={(event) =>
                  onChange({
                    ...values,
                    isDraftOnly: event.target.checked,
                    isFreeAgentTemplate: event.target.checked
                      ? false
                      : values.isFreeAgentTemplate,
                  })
                }
              />
              Draft only
            </label>
          </div>

          <div className="space-y-4 border-t border-outline-variant pt-4">
            <AdminAttributeEditor
              idPrefix="base"
              position={values.position}
              attributes={values.attributes}
              onChange={(attributes) => onChange({ ...values, attributes })}
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
