import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";

interface MatchDayFooterProps {
  hasInjuredStarters: boolean;
  canConfirm: boolean;
  isSaving: boolean;
  onClearSelection: () => void;
  onConfirm: () => void;
}

export const MatchDayFooter = ({
  hasInjuredStarters,
  canConfirm,
  isSaving,
  onClearSelection,
  onConfirm,
}: MatchDayFooterProps) => {
  return (
    <div className="sticky bottom-0 mt-gutter flex flex-col items-stretch justify-between gap-3 rounded-lg border border-outline-variant bg-surface-container p-4 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={onClearSelection}
        className="rounded border border-outline-variant px-4 py-2 font-body-sm text-body-sm text-on-surface transition-colors hover:bg-surface-variant"
      >
        Clear Selection
      </button>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
        {hasInjuredStarters && (
          <span className="flex items-center gap-1 font-body-sm text-body-sm text-error">
            <MaterialIcon name="error" className="text-sm" />
            Resolve injuries before match
          </span>
        )}
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
          {isSaving ? "Saving..." : "Confirm for Match"}
        </button>
      </div>
    </div>
  );
};
