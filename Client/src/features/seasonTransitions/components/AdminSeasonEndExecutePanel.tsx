import { MaterialIcon } from "@/core/components/ui/MaterialIcon";

interface AdminSeasonEndWarningProps {
  blockReason?: string | null;
}

export const AdminSeasonEndWarning = ({ blockReason }: AdminSeasonEndWarningProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg border border-secondary/50 bg-secondary/5 p-6">
      <div className="absolute top-0 left-0 h-full w-1 bg-secondary" />
      <div className="mb-4 flex items-start gap-3">
        <MaterialIcon name="warning" className="text-2xl text-secondary" />
        <div>
          <h3 className="font-headline-sm text-headline-sm text-secondary">Emergency override</h3>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            Competitive groups auto-process when every fixture is complete. Use this
            only if automation did not run.
          </p>
        </div>
      </div>
      <ul className="mb-2 list-inside list-disc space-y-2 text-sm text-on-surface-variant opacity-80">
        <li>Promotion and relegation swaps will update club divisions.</li>
        <li>Every division in the group starts the next season at match week 1.</li>
        <li>Played matches stay on record. A new double round-robin is generated for the next season.</li>
        <li>Player season stats reset for clubs in the group.</li>
        <li>This operation cannot be undone.</li>
      </ul>
      {blockReason ? (
        <p className="mt-4 font-body-sm text-body-sm text-error">{blockReason}</p>
      ) : null}
    </div>
  );
};

interface AdminSeasonEndExecuteProps {
  confirmed: boolean;
  canProcess: boolean;
  isSubmitting: boolean;
  onConfirmedChange: (value: boolean) => void;
  onProcess: () => void;
}

export const AdminSeasonEndExecute = ({
  confirmed,
  canProcess,
  isSubmitting,
  onConfirmedChange,
  onProcess,
}: AdminSeasonEndExecuteProps) => {
  const canSubmit = confirmed && canProcess && !isSubmitting;

  return (
    <div className="flex flex-1 flex-col justify-end rounded-lg border border-outline-variant bg-surface-container p-6">
      <div className="mb-6">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => onConfirmedChange(event.target.checked)}
            className="h-5 w-5 rounded border-outline-variant bg-surface text-primary focus:ring-primary focus:ring-offset-background"
          />
          <span className="text-sm text-on-surface">
            I confirm that all fixtures are complete and I have reviewed the projected
            movements.
          </span>
        </label>
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={onProcess}
        className="group flex w-full items-center justify-center gap-2 rounded bg-primary-container py-4 font-headline-sm text-headline-sm text-on-primary-container shadow-lg transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <MaterialIcon
          name="sync"
          className="transition-transform duration-500 group-hover:rotate-180"
        />
        {isSubmitting ? "Processing..." : "Force Process Season End"}
      </button>
      <p className="mt-3 text-center font-data-mono text-xs text-on-surface-variant">
        This operation cannot be undone.
      </p>
    </div>
  );
};
