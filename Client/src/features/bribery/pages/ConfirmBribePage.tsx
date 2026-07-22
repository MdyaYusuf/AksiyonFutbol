import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { useCreateBribeAttemptMutation } from "../briberyApiSlice";
import type { MatchInfluenceConfirmState } from "../briberyTypes";
import {
  ConfirmBribeRiskNote,
  ConfirmBribeSummary,
} from "../components/ConfirmBribeSummary";
import { getExposureWarningTitle } from "../utils/matchInfluenceHelpers";

export const ConfirmBribePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as MatchInfluenceConfirmState | null;
  const [createAttempt, { isLoading }] = useCreateBribeAttemptMutation();

  if (!state) {
    return <Navigate to="/app/influence" replace />;
  }

  const handleConfirm = async () => {
    try {
      await createAttempt({
        matchId: state.matchId,
        amount: state.amount,
      }).unwrap();
      navigate("/app/influence", { replace: true });
    } catch {
      /* Toasts via apiClient */
    }
  };

  const secondaryButtonClass =
    "rounded border border-outline-variant bg-surface-container px-6 py-2 font-body-sm text-body-sm text-on-background transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-outline-variant bg-surface-container shadow-lg">
        <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-high px-6 py-4">
          <div>
            <h1 className="font-headline-sm text-headline-sm text-on-background">
              Confirm Influence Attempt
            </h1>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
              Please review the details of this action carefully.
            </p>
          </div>
          <MaterialIcon name="warning" className="text-3xl text-primary" />
        </div>

        <div className="space-y-6 p-6">
          <ConfirmBribeSummary state={state} />
          <ConfirmBribeRiskNote title={getExposureWarningTitle(state.detectionChance)} />
        </div>

        <div className="flex flex-wrap justify-end gap-4 border-t border-outline-variant bg-surface-container-high px-6 py-4">
          <Link to="/app/fixtures" className={secondaryButtonClass}>
            Abort
          </Link>
          <Link to="/app/influence" className={secondaryButtonClass}>
            Go Back
          </Link>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleConfirm}
            className="rounded bg-primary-container px-6 py-2 font-body-sm text-body-sm font-bold text-on-primary transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Confirming..." : "Confirm Attempt"}
          </button>
        </div>
      </div>
    </div>
  );
};
