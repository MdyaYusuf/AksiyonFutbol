import { Link } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";

interface AdminQuickActionsProps {
  onAdvanceMatchWeek: () => void;
  onSimulateNextFixture: () => void;
  onRunCompetitiveSeating: () => void;
  isAdvancing: boolean;
  isSimulating: boolean;
  isRunningSeating: boolean;
  canSimulate: boolean;
  canRunSeating: boolean;
  seatingQueueSummary: string;
  advanceLabel?: string;
}

export const AdminQuickActions = ({
  onAdvanceMatchWeek,
  onSimulateNextFixture,
  onRunCompetitiveSeating,
  isAdvancing,
  isSimulating,
  isRunningSeating,
  canSimulate,
  canRunSeating,
  seatingQueueSummary,
  advanceLabel,
}: AdminQuickActionsProps) => {
  return (
    <div className="flex w-full flex-col rounded-lg border border-outline-variant bg-surface lg:w-2/5">
      <div className="rounded-t-lg border-b border-outline-variant bg-surface-container-low p-4">
        <h3 className="text-headline-sm text-on-surface">Quick Actions</h3>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <button
          type="button"
          onClick={onAdvanceMatchWeek}
          disabled={isAdvancing}
          className="group flex w-full items-center justify-between rounded border border-primary-container bg-primary-container px-4 py-3 text-label-caps text-on-primary-container transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex items-center gap-2">
            <MaterialIcon name="fast_forward" className="text-[18px]" />
            {isAdvancing ? "Processing..." : (advanceLabel ?? "Process Match Week")}
          </span>
          <MaterialIcon
            name="arrow_forward"
            className="text-[18px] opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100"
          />
        </button>

        <div className="my-1 h-px w-full bg-outline-variant" />

        <div className="rounded border border-outline-variant bg-surface-container-low px-3 py-2">
          <p className="text-[10px] text-label-caps text-on-surface-variant">
            Competitive seating queue
          </p>
          <p className="mt-1 text-body-sm text-on-surface">{seatingQueueSummary}</p>
        </div>

        <button
          type="button"
          onClick={onRunCompetitiveSeating}
          disabled={isRunningSeating || !canRunSeating}
          className="group flex w-full items-center justify-between rounded border border-secondary-container bg-secondary-container px-4 py-2.5 text-label-caps text-on-secondary-container transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex items-center gap-2">
            <MaterialIcon name="event_seat" className="text-[16px]" />
            {isRunningSeating ? "Seating..." : "Run Competitive Seating"}
          </span>
          <MaterialIcon
            name="play_arrow"
            className="text-[16px] opacity-0 transition-opacity group-hover:opacity-100"
          />
        </button>

        <div className="my-1 h-px w-full bg-outline-variant" />

        <button
          type="button"
          onClick={onSimulateNextFixture}
          disabled={isSimulating || !canSimulate}
          className="group flex w-full items-center justify-between rounded border border-primary/50 bg-transparent px-4 py-2.5 text-label-caps text-primary transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex items-center gap-2">
            <MaterialIcon name="smart_toy" className="text-[16px]" />
            {isSimulating ? "Simulating..." : "Simulate Next Fixture"}
          </span>
          <MaterialIcon
            name="play_arrow"
            className="text-[16px] opacity-0 transition-opacity group-hover:opacity-100"
          />
        </button>

        <div className="mt-1 grid grid-cols-2 gap-2">
          <Link
            to="/admin/league-divisions"
            className="flex flex-col items-center justify-center gap-1 rounded border border-outline-variant bg-surface-container-low px-3 py-2 transition-colors hover:bg-surface-variant"
          >
            <MaterialIcon name="account_tree" className="text-[18px] text-on-surface-variant" />
            <span className="text-[10px] text-label-caps">New Division</span>
          </Link>
          <Link
            to="/admin/clubs"
            className="flex flex-col items-center justify-center gap-1 rounded border border-outline-variant bg-surface-container-low px-3 py-2 transition-colors hover:bg-surface-variant"
          >
            <MaterialIcon
              name="precision_manufacturing"
              className="text-[18px] text-on-surface-variant"
            />
            <span className="text-[10px] text-label-caps">New Bot Club</span>
          </Link>
          <Link
            to="/admin/matches"
            className="col-span-2 flex items-center justify-center gap-2 rounded border border-outline-variant bg-surface-container-low px-3 py-2 transition-colors hover:bg-surface-variant"
          >
            <MaterialIcon name="edit_calendar" className="text-[16px] text-on-surface-variant" />
            <span className="text-[11px] text-label-caps">Manual Schedule Match</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
