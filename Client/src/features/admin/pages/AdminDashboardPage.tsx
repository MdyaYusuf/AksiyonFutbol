import { useMemo } from "react";
import { useGetClubsQuery } from "../../clubs/clubsApiSlice";
import { useAdvanceLeagueDivisionMatchWeekMutation } from "../../leagueDivisions/leagueDivisionsApiSlice";
import {
  useGetMatchesQuery,
  useGetScheduledUnplayedMatchesQuery,
  useSimulateMatchMutation,
} from "../../matches/matchesApiSlice";
import { useGetLeagueDivisionsQuery } from "../../leagueDivisions/leagueDivisionsApiSlice";
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
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";

export const AdminDashboardPage = () => {
  const { data: divisionsData, isLoading: isDivisionsLoading } = useGetLeagueDivisionsQuery({
    pageNumber: 1,
    pageSize: 100,
  });
  const { data: clubsData, isLoading: isClubsLoading } = useGetClubsQuery({
    pageNumber: 1,
    pageSize: 500,
  });
  const { data: matches = [], isLoading: isMatchesLoading } = useGetMatchesQuery();
  const { data: scheduledMatches = [] } = useGetScheduledUnplayedMatchesQuery(1);

  const [advanceMatchWeek, { isLoading: isAdvancing }] =
    useAdvanceLeagueDivisionMatchWeekMutation();
  const [simulateMatch, { isLoading: isSimulating }] = useSimulateMatchMutation();

  const divisions = divisionsData?.items ?? [];
  const clubs = clubsData?.items ?? [];

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

  const handleAdvanceMatchWeek = async () => {
    if (!advanceTarget) {
      return;
    }

    await advanceMatchWeek(advanceTarget.id);
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
          onAdvanceMatchWeek={handleAdvanceMatchWeek}
          onSimulateNextFixture={handleSimulateNextFixture}
          isAdvancing={isAdvancing}
          isSimulating={isSimulating}
          canSimulate={scheduledMatches.length > 0}
          advanceLabel={
            advanceTarget
              ? `Advance Week (${advanceTarget.name})`
              : "Advance Match Week"
          }
        />
      </div>

      <AdminDivisionsGlanceTable rows={divisionRows} />
    </div>
  );
};
