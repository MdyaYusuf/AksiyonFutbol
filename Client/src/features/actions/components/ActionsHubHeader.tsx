import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { ProgressBar } from "../../../core/components/ui/ProgressBar";
import { formatCashFull } from "../../clubs/utils/clubOverviewHelpers";
import { getHeatBarColor, getHeatLabel } from "../utils/actionsHubHelpers";

interface ActionsHubHeaderProps {
  clubCash: number;
  suspicion: number;
  maxSuspicion: number;
}

export const ActionsHubHeader = ({
  clubCash,
  suspicion,
  maxSuspicion,
}: ActionsHubHeaderProps) => {
  const heatColor = getHeatBarColor(suspicion, maxSuspicion);
  const heatLabel = getHeatLabel(suspicion, maxSuspicion);

  return (
    <div className="flex flex-col gap-6 border-b border-outline-variant pb-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 font-display-lg text-display-lg font-extrabold text-on-surface">
            Actions
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Spend resources, tilt the odds, manage the heat
          </p>
          <p className="mt-2 max-w-2xl font-body-sm text-body-sm text-on-surface-variant/80">
            Fictional satire set in a made-up league. Gray-area moves are game mechanics only
            and do not reflect or encourage real-world misconduct.
          </p>
        </div>

        <div className="min-w-[140px] rounded-lg border border-outline-variant bg-surface-container-high p-4">
          <div className="mb-1 flex items-center gap-1 font-label-caps text-label-caps text-on-surface-variant">
            <MaterialIcon name="account_balance_wallet" className="text-sm" />
            Club Cash
          </div>
          <div className="font-stat-value text-stat-value text-primary">
            {formatCashFull(clubCash)}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-error/40 bg-error/10 p-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MaterialIcon name="local_fire_department" className="text-error" />
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Heat</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Scrutiny from gray-area moves. Higher heat raises the chance of exposure.
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-stat-value text-stat-value text-error">
              {suspicion}
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {" "}
                / {maxSuspicion}
              </span>
            </div>
            <div className="font-label-caps text-label-caps text-error/80">
              {heatLabel}
            </div>
          </div>
        </div>
        <ProgressBar
          value={suspicion}
          max={maxSuspicion}
          colorClassName={heatColor}
          trackClassName="bg-error/20"
        />
      </div>
    </div>
  );
};
