import { MaterialIcon } from "@/core/components/ui/MaterialIcon";

interface AdminDivisionFormValues {
  name: string;
  tier: number;
  groupNumber: number;
  currentMatchWeek: number;
}

interface AdminDivisionFormPanelProps {
  mode: "create" | "edit";
  isOpen: boolean;
  values: AdminDivisionFormValues;
  isSubmitting: boolean;
  onChange: (values: AdminDivisionFormValues) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const tierOptions = [1, 2, 3, 4];

export const AdminDivisionFormPanel = ({
  mode,
  isOpen,
  values,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: AdminDivisionFormPanelProps) => {
  if (!isOpen) {
    return null;
  }

  const title = mode === "create" ? "Create Division" : "Edit Division";
  const submitLabel = mode === "create" ? "Save Division" : "Update Division";

  return (
    <aside className="flex h-[calc(100vh-8rem)] w-full shrink-0 flex-col rounded-lg border border-outline-variant bg-surface-container-high shadow-sm lg:sticky lg:top-0 lg:w-80">
      <div className="flex items-center justify-between rounded-t-lg border-b border-outline-variant bg-surface-container-highest p-4">
        <h3 className="flex items-center gap-2 text-headline-sm font-semibold text-on-surface">
          <MaterialIcon name="library_add" className="text-[20px] text-primary" />
          {title}
        </h3>
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
        <div className="space-y-1">
          <label htmlFor="division-name" className="block text-label-caps text-on-surface-variant">
            Division Name <span className="text-error">*</span>
          </label>
          <input
            id="division-name"
            type="text"
            value={values.name}
            onChange={(event) => onChange({ ...values, name: event.target.value })}
            placeholder="e.g. National League North"
            className="w-full rounded border border-outline-variant bg-background px-3 py-2 text-body-sm text-on-surface transition-all outline-none placeholder:text-surface-variant focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <label htmlFor="division-tier" className="block text-label-caps text-on-surface-variant">
              Tier Level
            </label>
            <select
              id="division-tier"
              value={values.tier}
              onChange={(event) =>
                onChange({ ...values, tier: Number(event.target.value) })
              }
              className="w-full appearance-none rounded border border-outline-variant bg-background px-3 py-2 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {tierOptions.map((tier) => (
                <option key={tier} value={tier}>
                  Tier {tier}
                  {tier === 1 ? " (Top)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 space-y-1">
            <label htmlFor="division-group" className="block text-label-caps text-on-surface-variant">
              Group Number
            </label>
            <input
              id="division-group"
              type="number"
              min={1}
              value={values.groupNumber}
              onChange={(event) =>
                onChange({ ...values, groupNumber: Number(event.target.value) })
              }
              className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-data-mono text-data-mono text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {mode === "edit" && (
          <div className="space-y-1">
            <label
              htmlFor="division-match-week"
              className="block text-label-caps text-on-surface-variant"
            >
              Current Match Week
            </label>
            <input
              id="division-match-week"
              type="number"
              min={1}
              value={values.currentMatchWeek}
              onChange={(event) =>
                onChange({ ...values, currentMatchWeek: Number(event.target.value) })
              }
              className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-data-mono text-data-mono text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 rounded-b-lg border-t border-outline-variant bg-surface-container-highest p-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-outline-variant px-4 py-2 text-label-caps text-on-surface transition-colors hover:bg-surface-variant"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded bg-primary-container px-4 py-2 text-label-caps text-on-primary-container shadow-sm transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </aside>
  );
};

export type { AdminDivisionFormValues };
