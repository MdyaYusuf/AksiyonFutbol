import { useMemo } from "react";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { useGetClubOptionsQuery } from "../../clubs/clubsApiSlice";
import {
  useGetLeagueDivisionsQuery,
  useProcessLeagueDivisionWeekMutation,
} from "../../leagueDivisions/leagueDivisionsApiSlice";
import {
  useGetMatchesQuery,
  useGetScheduledUnplayedMatchesQuery,
  useSimulateMatchMutation,
} from "../../matches/matchesApiSlice";
import { AdminDivisionsGlanceTable } from "../components/AdminDivisionsGlanceTable";
import { AdminQuickActions } from "../components/AdminQuickActions";
import { AdminRecentActivity } from "../components/AdminRecentActivity";
import { AdminStatCards } from "../components/AdminStatCards";
import {
  buildAdminDashboardStats,
  buildDivisionGlanceRows,
  buildRecentActivity,
  findAdvanceMatchWeekTarget,
} from "../utils/adminDashboardHelpers";

export const AdminDashboardPage = () => {
  const { data: divisionsData, isLoading: isDivisionsLoading } = useGetLeagueDivisionsQuery({
    currentPage: 1,
    pageSize: 50,
  });
  const { data: clubs = [], isLoading: isClubsLoading } = useGetClubOptionsQuery();
  const { data: matches = [], isLoading: isMatchesLoading } = useGetMatchesQuery();
  const { data: scheduledMatches = [] } = useGetScheduledUnplayedMatchesQuery(1);

  const [processWeek, { isLoading: isProcessingWeek }] =
    useProcessLeagueDivisionWeekMutation();
  const [simulateMatch, { isLoading: isSimulating }] = useSimulateMatchMutation();

  const divisions = divisionsData?.items ?? [];

  const stats = useMemo(
    () => buildAdminDashboardStats(divisions, clubs, matches),
    [divisions, clubs, matches],
  );

  const divisionRows = useMemo(
    () => buildDivisionGlanceRows(divisions, clubs, matches),
    [divisions, clubs, matches],
  );

  const recentActivity = useMemo(
    () => buildRecentActivity(clubs, matches),
    [clubs, matches],
  );

  const advanceTarget = useMemo(
    () => findAdvanceMatchWeekTarget(divisionRows),
    [divisionRows],
  );

  const isLoading = isDivisionsLoading || isClubsLoading || isMatchesLoading;

  const handleProcessWeek = async () => {
    if (!advanceTarget) {
      return;
    }

    await processWeek(advanceTarget.id);
  };

  const handleSimulateNextFixture = async () => {
    const nextMatch = scheduledMatches[0];

    if (!nextMatch) {
      return;
    }

    await simulateMatch(nextMatch.id);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Admin dashboard loading...
      </div>
    );
  }

  return (
    <div className="space-y-gutter">
      <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-headline-md leading-tight text-on-surface">Admin Dashboard</h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Game world operations overview
          </p>
        </div>
        <div className="flex items-center gap-2 rounded border border-outline-variant bg-surface-container-low px-3 py-1.5 font-data-mono text-data-mono text-on-surface-variant">
          <MaterialIcon name="circle" className="text-[16px] text-primary" />
          System: Online
        </div>
      </div>

      <AdminStatCards stats={stats} />

      <div className="flex flex-col gap-gutter lg:flex-row">
        <AdminRecentActivity items={recentActivity} />
        <AdminQuickActions
          onAdvanceMatchWeek={handleProcessWeek}
          onSimulateNextFixture={handleSimulateNextFixture}
          isAdvancing={isProcessingWeek}
          isSimulating={isSimulating}
          canSimulate={scheduledMatches.length > 0}
          advanceLabel={
            advanceTarget
              ? `Process Week (${advanceTarget.name})`
              : "Process Match Week"
          }
        />
      </div>

      <AdminDivisionsGlanceTable rows={divisionRows} />
    </div>
  );
};
