import { Link } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";

interface MatchDayFooterProps {
  hasInjuredStarters: boolean;
  canConfirm: boolean;
  isSaving: boolean;
  isConfirmed: boolean;
  kickoffLabel: string;
  dashboardPath?: string;
  onClearSelection: () => void;
  onConfirm: () => void;
}

export const MatchDayFooter = ({
  hasInjuredStarters,
  canConfirm,
  isSaving,
  isConfirmed,
  kickoffLabel,
  dashboardPath = "/app/dashboard",
  onClearSelection,
  onConfirm,
}: MatchDayFooterProps) => {
  return (
    <div className="mt-gutter flex flex-col gap-3 rounded-lg border border-outline-variant bg-surface-container p-4">
      {isConfirmed ? (
        <div className="flex flex-col gap-2 rounded border border-primary/30 bg-primary/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 text-on-surface">
            <MaterialIcon name="check_circle" className="mt-0.5 text-primary" />
            <div>
              <p className="text-body-sm font-semibold">Lineup confirmed for this match</p>
              <p className="text-body-sm text-on-surface-variant">
                Kickoff {kickoffLabel}. You can keep editing and save again if needed.
              </p>
            </div>
          </div>
          <Link
            to={dashboardPath}
            className="shrink-0 rounded border border-outline-variant px-4 py-2 text-center text-body-sm text-on-surface transition-colors hover:bg-surface-variant"
          >
            Back to Dashboard
          </Link>
        </div>
      ) : null}

      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onClearSelection}
          className="rounded border border-outline-variant px-4 py-2 font-body-sm text-body-sm text-on-surface transition-colors hover:bg-surface-variant"
        >
          Clear Selection
        </button>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
          {hasInjuredStarters ? (
            <span className="flex items-center gap-1 font-body-sm text-body-sm text-error">
              <MaterialIcon name="error" className="text-sm" />
              Resolve injuries before match
            </span>
          ) : null}
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm}
            className={`rounded px-6 py-2 text-body-sm font-bold shadow-sm transition-colors ${
              canConfirm
                ? "bg-primary text-on-primary hover:bg-primary-container"
                : "cursor-not-allowed bg-primary text-on-primary opacity-50"
            }`}
          >
            {isSaving
              ? "Saving..."
              : isConfirmed
                ? "Update Lineup"
                : "Confirm for Match"}
          </button>
        </div>
      </div>
    </div>
  );
};
