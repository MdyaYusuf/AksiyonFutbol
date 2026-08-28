import { useMemo, useState } from "react";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { formatCashFull } from "../../clubs/utils/clubOverviewHelpers";
import { useGetTransferMarketQuery } from "../../transfers/transfersApiSlice";
import type { ClubActionAvailability, MediaSpinMode as MediaSpinModeType } from "../actionTypes";
import { ClubActionType, MediaSpinMode } from "../actionTypes";
import { formatChancePercent } from "../utils/actionsHubHelpers";

interface ExecuteActionModalProps {
  action: ClubActionAvailability;
  matchId?: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (options: {
    mediaSpinMode?: MediaSpinModeType;
    targetPlayerInstanceId?: string;
  }) => void;
}

export const ExecuteActionModal = ({
  action,
  matchId,
  isSubmitting,
  onClose,
  onConfirm,
}: ExecuteActionModalProps) => {
  const needsMediaSpinMode = action.actionType === ClubActionType.MediaSpin;
  const needsTapUpTarget =
    action.actionType === ClubActionType.TapUpTarget ||
    action.actionType === ClubActionType.TapUpTargetII;

  const [mediaSpinMode, setMediaSpinMode] = useState<MediaSpinModeType>(
    MediaSpinMode.OpponentMorale,
  );
  const [targetPlayerId, setTargetPlayerId] = useState("");

  const { data: marketItems = [], isLoading: marketLoading } = useGetTransferMarketQuery(
    undefined,
    { skip: !needsTapUpTarget },
  );

  const canConfirm = useMemo(() => {
    if (needsTapUpTarget) {
      return targetPlayerId.length > 0;
    }

    if (needsMediaSpinMode && mediaSpinMode === MediaSpinMode.OpponentMorale) {
      return !!matchId;
    }

    return true;
  }, [needsTapUpTarget, targetPlayerId, needsMediaSpinMode, mediaSpinMode, matchId]);

  const handleConfirm = () => {
    if (!canConfirm || isSubmitting) {
      return;
    }

    onConfirm({
      mediaSpinMode: needsMediaSpinMode ? mediaSpinMode : undefined,
      targetPlayerInstanceId: needsTapUpTarget ? targetPlayerId : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="execute-action-title"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-outline-variant bg-surface-container shadow-lg"
      >
        <div className="flex items-start justify-between border-b border-outline-variant bg-surface-container-high px-5 py-4">
          <div>
            <h2
              id="execute-action-title"
              className="font-headline-sm text-headline-sm text-on-surface"
            >
              Confirm {action.displayName}
            </h2>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
              {action.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
            aria-label="Close"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3">
            <SummaryStat
              label="Cost"
              value={action.cost > 0 ? formatCashFull(action.cost) : "Free"}
            />
            <SummaryStat
              label="Success"
              value={formatChancePercent(action.successChance)}
            />
            <SummaryStat
              label="Heat"
              value={action.heatGenerated > 0 ? `+${action.heatGenerated}` : "None"}
            />
            <SummaryStat
              label="Cooldown"
              value={action.cooldownDays > 0 ? `${action.cooldownDays}d` : "None"}
            />
            <SummaryStat
              label="Detection"
              value={
                action.isShady
                  ? formatChancePercent(action.detectionChance)
                  : "—"
              }
            />
          </div>

          {needsMediaSpinMode ? (
            <div className="flex flex-col gap-2">
              <div className="font-label-caps text-label-caps text-on-surface-variant">
                Narrative Focus
              </div>
              <label className="flex items-center gap-2 rounded border border-outline-variant bg-surface-container-low px-3 py-2">
                <input
                  type="radio"
                  name="mediaSpinMode"
                  checked={mediaSpinMode === MediaSpinMode.OpponentMorale}
                  onChange={() => {
                    setMediaSpinMode(MediaSpinMode.OpponentMorale);
                  }}
                />
                <span className="font-body-sm text-body-sm text-on-surface">
                  Unsettle next opponent morale
                </span>
              </label>
              <label className="flex items-center gap-2 rounded border border-outline-variant bg-surface-container-low px-3 py-2">
                <input
                  type="radio"
                  name="mediaSpinMode"
                  checked={mediaSpinMode === MediaSpinMode.ReputationRepair}
                  onChange={() => {
                    setMediaSpinMode(MediaSpinMode.ReputationRepair);
                  }}
                />
                <span className="font-body-sm text-body-sm text-on-surface">
                  Repair own standing
                </span>
              </label>
              {mediaSpinMode === MediaSpinMode.OpponentMorale && !matchId ? (
                <p className="font-body-sm text-body-sm text-error">
                  No upcoming fixture to target.
                </p>
              ) : null}
            </div>
          ) : null}

          {needsTapUpTarget ? (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="tap-up-target"
                className="font-label-caps text-label-caps text-on-surface-variant"
              >
                Transfer Target
              </label>
              {marketLoading ? (
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Loading market...
                </p>
              ) : (
                <select
                  id="tap-up-target"
                  value={targetPlayerId}
                  onChange={(event) => {
                    setTargetPlayerId(event.target.value);
                  }}
                  className="rounded border border-outline-variant bg-surface-container-low px-3 py-2 font-body-sm text-body-sm text-on-surface"
                >
                  <option value="">Select a listed player</option>
                  {marketItems.map((item) => (
                    <option key={item.playerInstanceId} value={item.playerInstanceId}>
                      {item.firstName} {item.lastName} · {item.sellingClubName} ·{" "}
                      {formatCashFull(item.askingPrice)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ) : null}

          {action.isShady ? (
            <div className="flex items-start gap-2 rounded border border-secondary/30 bg-surface-variant p-3">
              <MaterialIcon name="warning" className="mt-0.5 text-secondary" />
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Gray-area moves raise Heat and may be exposed. Cost is spent even on failure.
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-outline-variant bg-surface-container-high px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded border border-outline-variant px-5 py-2 font-label-caps text-label-caps text-on-surface-variant transition-colors hover:bg-surface-variant disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm || isSubmitting}
            className="rounded bg-primary px-5 py-2 font-label-caps text-label-caps text-on-primary transition-colors hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? "Executing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SummaryStat = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded border border-outline-variant bg-surface-container-low px-3 py-2">
      <div className="font-label-caps text-label-caps text-on-surface-variant">{label}</div>
      <div className="font-data-mono text-data-mono text-on-surface">{value}</div>
    </div>
  );
};
