import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { LeagueDivisionResponse } from "../../leagueDivisions/leagueDivisionTypes";

export interface AdminClubFormValues {
  name: string;
  divisionId: number | "";
  cash: number;
  wageBudget: number;
  morale: number;
  chemistry: number;
  discipline: number;
}

interface AdminClubFormPanelProps {
  mode: "create" | "edit";
  isOpen: boolean;
  values: AdminClubFormValues;
  divisions: LeagueDivisionResponse[];
  isSubmitting: boolean;
  isBotClub?: boolean;
  onChange: (values: AdminClubFormValues) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const formatDivisionOption = (division: LeagueDivisionResponse): string => {
  return `${division.name} (Tier ${division.tier})`;
};

const StatRangeInput = ({
  id,
  label,
  value,
  accentClassName,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  accentClassName: string;
  onChange: (value: number) => void;
}) => (
  <div>
    <div className="mb-1 flex justify-between text-[11px]">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-data-mono text-on-surface">{value}</span>
    </div>
    <input
      id={id}
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className={`h-1 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-high ${accentClassName}`}
    />
  </div>
);

export const AdminClubFormPanel = ({
  mode,
  isOpen,
  values,
  divisions,
  isSubmitting,
  isBotClub = true,
  onChange,
  onClose,
  onSubmit,
}: AdminClubFormPanelProps) => {
  if (!isOpen) {
    return null;
  }

  const isCreate = mode === "create";
  const title = isCreate ? "Create Bot Club" : "Edit Club";
  const submitLabel = isCreate ? "Save Club" : "Update Club";

  return (
    <aside className="z-20 flex min-h-0 w-full shrink-0 flex-col overflow-hidden border-l border-outline-variant bg-surface shadow-[-4px_0_15px_rgba(0,0,0,0.5)] md:flex lg:w-96">
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low p-5">
        <h3 className="flex items-center gap-2 text-headline-sm text-on-surface">
          <MaterialIcon
            name={isCreate || isBotClub ? "smart_toy" : "shield"}
            className="text-primary"
          />
          {title}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-on-surface-variant transition-colors hover:text-on-surface"
          aria-label="Close panel"
        >
          <MaterialIcon name="close" />
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        <div className="space-y-4">
          <div>
            <label htmlFor="club-name" className="mb-1.5 block text-label-caps text-on-surface-variant">
              Club Name
            </label>
            <input
              id="club-name"
              type="text"
              value={values.name}
              onChange={(event) => onChange({ ...values, name: event.target.value })}
              className="w-full rounded border border-outline-variant bg-background px-3 py-2 text-body-sm text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {isCreate && (
            <div>
              <label
                htmlFor="club-division"
                className="mb-1.5 block text-label-caps text-on-surface-variant"
              >
                Target Division
              </label>
              <select
                id="club-division"
                value={values.divisionId}
                onChange={(event) =>
                  onChange({
                    ...values,
                    divisionId: event.target.value === "" ? "" : Number(event.target.value),
                  })
                }
                className="w-full appearance-none rounded border border-outline-variant bg-background px-3 py-2 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">Select division</option>
                {divisions.map((division) => (
                  <option key={division.id} value={division.id}>
                    {formatDivisionOption(division)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!isCreate && (
            <p className="rounded border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface-variant">
              {isBotClub ? "Bot club" : "Human club"} • Division cannot be changed here.
            </p>
          )}
        </div>

        <hr className="border-outline-variant" />

        <div className="space-y-4">
          <h4 className="text-label-caps tracking-wider text-on-surface-variant uppercase">
            Financial Injection
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="club-cash"
                className="mb-1 block text-[11px] text-on-surface-variant uppercase"
              >
                Starting Cash ($)
              </label>
              <input
                id="club-cash"
                type="number"
                min={0}
                value={values.cash}
                onChange={(event) =>
                  onChange({ ...values, cash: Number(event.target.value) })
                }
                className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-data-mono text-[13px] text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="club-wage"
                className="mb-1 block text-[11px] text-on-surface-variant uppercase"
              >
                Wage Budget ($)
              </label>
              <input
                id="club-wage"
                type="number"
                min={0}
                value={values.wageBudget}
                onChange={(event) =>
                  onChange({ ...values, wageBudget: Number(event.target.value) })
                }
                className="w-full rounded border border-outline-variant bg-background px-3 py-2 font-data-mono text-[13px] text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <hr className="border-outline-variant" />

        <div className="space-y-4">
          <h4 className="text-label-caps tracking-wider text-on-surface-variant uppercase">
            Base Club Stats (0-100)
          </h4>
          <div className="space-y-3">
            <StatRangeInput
              id="club-morale"
              label="Morale"
              value={values.morale}
              accentClassName="accent-secondary"
              onChange={(morale) => onChange({ ...values, morale })}
            />
            <StatRangeInput
              id="club-chemistry"
              label="Chemistry"
              value={values.chemistry}
              accentClassName="accent-secondary"
              onChange={(chemistry) => onChange({ ...values, chemistry })}
            />
            <StatRangeInput
              id="club-discipline"
              label="Discipline"
              value={values.discipline}
              accentClassName="accent-primary"
              onChange={(discipline) => onChange({ ...values, discipline })}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 border-t border-outline-variant bg-surface-container-low p-5">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded border border-outline-variant px-4 py-2 text-label-caps text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 rounded bg-primary-container px-4 py-2 text-label-caps font-bold text-on-primary-container shadow-sm transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </aside>
  );
};
