import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { RefereePersonalityType } from "@/features/referees/refereeTypes";
import { PERSONALITY_OPTIONS } from "@/features/referees/utils/adminRefereesHelpers";

export interface AdminRefereeFormValues {
  name: string;
  personalityType: RefereePersonalityType;
  briberyDifficulty: number;
  biography: string;
}

interface AdminRefereeFormPanelProps {
  mode: "create" | "edit";
  isOpen: boolean;
  values: AdminRefereeFormValues;
  isSubmitting: boolean;
  onChange: (values: AdminRefereeFormValues) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const AdminRefereeFormPanel = ({
  mode,
  isOpen,
  values,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: AdminRefereeFormPanelProps) => {
  if (!isOpen) {
    return null;
  }

  const title = mode === "create" ? "Create Referee" : "Edit Referee";
  const submitLabel = mode === "create" ? "Save Referee" : "Update Referee";
  const canSubmit =
    values.name.trim().length >= 2 &&
    values.briberyDifficulty >= 1 &&
    values.briberyDifficulty <= 100 &&
    !isSubmitting;

  return (
    <aside className="flex h-[calc(100vh-8rem)] w-full shrink-0 flex-col rounded border border-outline-variant bg-surface-container shadow-sm lg:sticky lg:top-0 lg:w-80">
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-high p-4">
        <h3 className="text-headline-sm font-semibold text-on-surface">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-on-surface-variant transition-colors hover:text-on-surface"
          aria-label="Close panel"
        >
          <MaterialIcon name="close" className="text-[18px]" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
        <div className="space-y-1.5">
          <label
            htmlFor="referee-name"
            className="block text-label-caps text-on-surface-variant"
          >
            Name <span className="text-error">*</span>
          </label>
          <input
            id="referee-name"
            type="text"
            value={values.name}
            onChange={(event) =>
              onChange({ ...values, name: event.target.value })
            }
            placeholder="e.g., Anthony Taylor"
            maxLength={100}
            className="w-full rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="referee-personality"
            className="block text-label-caps text-on-surface-variant"
          >
            Personality
          </label>
          <select
            id="referee-personality"
            value={values.personalityType}
            onChange={(event) =>
              onChange({
                ...values,
                personalityType: Number(
                  event.target.value,
                ) as RefereePersonalityType,
              })
            }
            className="w-full appearance-none rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            {PERSONALITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="referee-bribery"
              className="block text-label-caps text-on-surface-variant"
            >
              Bribery Difficulty
            </label>
            <span className="font-data-mono text-data-mono text-primary">
              {values.briberyDifficulty}
            </span>
          </div>
          <input
            id="referee-bribery"
            type="range"
            min={1}
            max={100}
            value={values.briberyDifficulty}
            onChange={(event) =>
              onChange({
                ...values,
                briberyDifficulty: Number(event.target.value),
              })
            }
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-lowest accent-primary"
          />
          <div className="mt-1 flex justify-between text-[10px] tracking-wider text-on-surface-variant uppercase">
            <span>Corruptible</span>
            <span>Untouchable</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="referee-biography"
            className="block text-label-caps text-on-surface-variant"
          >
            Biography &amp; Notes
          </label>
          <textarea
            id="referee-biography"
            value={values.biography}
            onChange={(event) =>
              onChange({ ...values, biography: event.target.value })
            }
            placeholder="Enter background details, known biases, or specific tactical notes..."
            rows={4}
            maxLength={1000}
            className="w-full resize-none rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex gap-3 border-t border-outline-variant bg-surface-container-high p-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 rounded border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="flex-1 rounded bg-primary-container px-4 py-2 text-sm font-medium text-on-primary-container transition-colors hover:bg-primary-fixed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </aside>
  );
};
