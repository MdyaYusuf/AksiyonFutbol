import { useMemo } from "react";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { useGetClubOptionsQuery } from "@/features/clubs/clubsApiSlice";
import {
  useGetLeagueDivisionsQuery,
  useProcessLeagueDivisionWeekMutation,
} from "@/features/leagueDivisions/leagueDivisionsApiSlice";
import {
  useGetMatchesQuery,
  useGetScheduledUnplayedMatchesQuery,
  useSimulateMatchMutation,
} from "@/features/matches/matchesApiSlice";
import { AdminDivisionsGlanceTable } from "@/features/admin/components/AdminDivisionsGlanceTable";
import { AdminQuickActions } from "@/features/admin/components/AdminQuickActions";
import { AdminRecentActivity } from "@/features/admin/components/AdminRecentActivity";
import { AdminStatCards } from "@/features/admin/components/AdminStatCards";
import {
  buildAdminDashboardStats,
  buildDivisionGlanceRows,
  buildRecentActivity,
  findAdvanceMatchWeekTarget,
  formatSeatingQueueSummary,
} from "@/features/admin/utils/adminDashboardHelpers";
import {
  useGetCompetitiveSeatingQueueQuery,
  useRunCompetitiveSeatingMutation,
} from "@/features/competitiveSeating/competitiveSeatingApiSlice";

export const AdminDashboardPage = () => {
  const { data: divisionsData, isLoading: isDivisionsLoading } = useGetLeagueDivisionsQuery({
    currentPage: 1,
    pageSize: 50,
  });
  const { data: clubs = [], isLoading: isClubsLoading } = useGetClubOptionsQuery();
  const { data: matches = [], isLoading: isMatchesLoading } = useGetMatchesQuery();
  const { data: scheduledMatches = [] } = useGetScheduledUnplayedMatchesQuery(1);
  const { data: seatingQueue } = useGetCompetitiveSeatingQueueQuery();

  const [processWeek, { isLoading: isProcessingWeek }] =
    useProcessLeagueDivisionWeekMutation();
  const [simulateMatch, { isLoading: isSimulating }] = useSimulateMatchMutation();
  const [runCompetitiveSeating, { isLoading: isRunningSeating }] =
    useRunCompetitiveSeatingMutation();

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

  const handleRunCompetitiveSeating = async () => {
    await runCompetitiveSeating();
  };

  const seatingQueueSummary = formatSeatingQueueSummary(seatingQueue);
  const canRunSeating = (seatingQueue?.totalQueuedClubs ?? 0) > 0;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Admin dashboard loading...
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
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
          onRunCompetitiveSeating={handleRunCompetitiveSeating}
          isAdvancing={isProcessingWeek}
          isSimulating={isSimulating}
          isRunningSeating={isRunningSeating}
          canSimulate={scheduledMatches.length > 0}
          canRunSeating={canRunSeating}
          seatingQueueSummary={seatingQueueSummary}
          advanceLabel={
            advanceTarget
              ? `Process Week (${advanceTarget.name})`
              : "Process Match Week"
          }
        />
      </div>

      <AdminDivisionsGlanceTable rows={divisionRows} />
      </div>
    </div>
  );
};
