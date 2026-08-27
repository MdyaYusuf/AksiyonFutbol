import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { formatCashFull } from "../../clubs/utils/clubOverviewHelpers";
import type { ClubActionResult } from "../actionTypes";
import { ClubActionOutcome } from "../actionTypes";

interface ActionResultBannerProps {
  result: ClubActionResult;
  onDismiss: () => void;
}

export const ActionResultBanner = ({ result, onDismiss }: ActionResultBannerProps) => {
  const detected = result.action.wasDetected;
  const succeeded = result.action.outcome === ClubActionOutcome.Succeeded;
  const investigation = result.investigation;

  return (
    <div
      className={[
        "rounded-xl border p-4",
        detected
          ? "border-error/40 bg-error/10"
          : "border-outline-variant bg-surface-container",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <MaterialIcon
            name={detected ? "gavel" : succeeded ? "check_circle" : "cancel"}
            className={detected ? "text-error" : "text-primary"}
          />
          <div>
            <h3
              className={[
                "font-headline-sm text-headline-sm",
                detected ? "text-error" : "text-on-surface",
              ].join(" ")}
            >
              {result.action.displayName}
              {detected ? " — Detected" : succeeded ? " — Succeeded" : " — Failed"}
            </h3>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
              Cash {formatCashFull(result.newCash)} · Heat {result.newSuspicion} · Morale{" "}
              {result.newMorale}
              {result.newReputationPoints != null
                ? ` · Legitimacy ${result.newReputationPoints}`
                : ""}
            </p>

            {investigation ? (
              <ul className="mt-3 space-y-1 font-body-sm text-body-sm text-on-surface">
                {investigation.fineAmount > 0 ? (
                  <li>Fine: {formatCashFull(investigation.fineAmount)}</li>
                ) : null}
                {investigation.moralePenalty > 0 ? (
                  <li>Morale −{investigation.moralePenalty}</li>
                ) : null}
                {investigation.reputationPenalty > 0 ? (
                  <li>Legitimacy −{investigation.reputationPenalty}</li>
                ) : null}
                {investigation.matchPenaltyApplied ? (
                  <li>Match penalty applied for the linked fixture</li>
                ) : null}
              </ul>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded p-1 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
          aria-label="Dismiss"
        >
          <MaterialIcon name="close" />
        </button>
      </div>
    </div>
  );
};
