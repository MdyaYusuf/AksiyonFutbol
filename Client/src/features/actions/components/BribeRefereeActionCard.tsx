import { Link } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { formatCashFull } from "../../clubs/utils/clubOverviewHelpers";
import type { BriberyContext } from "../../bribery/briberyTypes";
import { BribeAttemptOutcome } from "../../bribery/briberyTypes";
import { formatChancePercent } from "../../bribery/utils/matchInfluenceHelpers";

interface BribeRefereeActionCardProps {
  briberyContext?: BriberyContext;
  isLoading: boolean;
}

export const BribeRefereeActionCard = ({
  briberyContext,
  isLoading,
}: BribeRefereeActionCardProps) => {
  const alreadyAttempted = briberyContext?.alreadyAttempted ?? false;
  const canAttempt = briberyContext?.canAttempt ?? false;
  const canOpen = canAttempt && !alreadyAttempted;

  const outcomeLabel =
    briberyContext?.existingOutcome === BribeAttemptOutcome.Succeeded
      ? "Succeeded"
      : briberyContext?.existingOutcome === BribeAttemptOutcome.Failed
        ? "Failed"
        : null;

  return (
    <div className="flex flex-col rounded-xl border border-outline-variant bg-surface-container p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-low text-primary">
          <MaterialIcon name="gavel" className="text-2xl" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Bribe Referee
            </h3>
            <span className="rounded border border-secondary/30 bg-secondary/10 px-2 py-0.5 font-label-caps text-label-caps text-secondary">
              Shady
            </span>
          </div>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            Pay the match official for favorable calls. Success boosts your scoring odds.
          </p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Stake" value={isLoading ? "…" : "Variable"} />
        <Stat
          label="Success"
          value={
            canAttempt
              ? formatChancePercent(briberyContext!.estimatedSuccessChance)
              : "—"
          }
        />
        <Stat label="Heat" value="Via detection" />
        <Stat
          label="Cash"
          value={
            briberyContext ? formatCashFull(briberyContext.clubCash) : "—"
          }
        />
      </div>

      {alreadyAttempted ? (
        <div className="mt-auto flex items-center gap-2 rounded border border-outline-variant bg-surface-variant px-3 py-2 font-body-sm text-body-sm text-on-surface-variant">
          <MaterialIcon name="info" className="text-sm text-primary" />
          Already used for this fixture
          {outcomeLabel ? ` (${outcomeLabel})` : ""}.
        </div>
      ) : !canAttempt && !isLoading ? (
        <div className="mt-auto flex items-center gap-2 rounded border border-outline-variant bg-surface-variant px-3 py-2 font-body-sm text-body-sm text-on-surface-variant">
          <MaterialIcon name="lock" className="text-sm" />
          {briberyContext?.unavailableReason ??
            "No upcoming fixture with a referee assigned."}
        </div>
      ) : (
        <div className="mt-auto flex justify-end">
          <Link
            to="/app/actions/bribe"
            className={[
              "flex items-center gap-2 rounded px-5 py-2 font-label-caps text-label-caps transition-colors",
              canOpen
                ? "bg-primary text-on-primary hover:bg-primary-fixed"
                : "pointer-events-none border border-outline-variant bg-surface-variant text-on-surface-variant opacity-60",
            ].join(" ")}
            aria-disabled={!canOpen}
          >
            <MaterialIcon name="arrow_forward" className="text-sm" />
            Open
          </Link>
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => {
  return (
    <div>
      <div className="mb-0.5 font-label-caps text-label-caps text-on-surface-variant">
        {label}
      </div>
      <div className="font-data-mono text-data-mono text-on-surface">{value}</div>
    </div>
  );
};
