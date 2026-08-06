import { useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "../../../core/components/ui/ConfirmDialog";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { useGetClubsQuery } from "../../clubs/clubsApiSlice";
import { useGetLeagueDivisionsQuery } from "../../leagueDivisions/leagueDivisionsApiSlice";
import { useGetRefereesQuery } from "../../referees/refereesApiSlice";
import {
  AdminMatchFormPanel,
  type AdminMatchFormValues,
} from "../components/AdminMatchFormPanel";
import { AdminMatchesTable } from "../components/AdminMatchesTable";
import {
  useCreateMatchMutation,
  useDeleteMatchMutation,
  useGetMatchesQuery,
  useSimulateMatchMutation,
  useUpdateMatchScheduleMutation,
} from "../matchesApiSlice";
import type { MatchResponse } from "../matchTypes";
import {
  filterAdminMatches,
  findUnplayedWeekAlert,
  formatDivisionOption,
  fromDateTimeLocalValue,
  getAvailableMatchWeeks,
  getDefaultMatchDateLocal,
  getUnplayedMatchesForWeek,
  toDateTimeLocalValue,
  type MatchStatusFilter,
} from "../utils/adminMatchesHelpers";

const emptyFormValues = (
  defaultDivisionId: number | "" = "",
  defaultMatchWeek = 1,
): AdminMatchFormValues => ({
  divisionId: defaultDivisionId,
  matchWeek: defaultMatchWeek,
  homeClubId: "",
  awayClubId: "",
  refereeId: "",
  matchDate: getDefaultMatchDateLocal(),
});

const toFormValues = (match: MatchResponse): AdminMatchFormValues => ({
  divisionId: match.divisionId,
  matchWeek: match.matchWeek,
  homeClubId: match.homeClubId,
  awayClubId: match.awayClubId,
  refereeId: match.refereeId ?? "",
  matchDate: toDateTimeLocalValue(match.matchDate),
});

export const AdminMatchesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [divisionFilter, setDivisionFilter] = useState<number | "all">("all");
  const [matchWeekFilter, setMatchWeekFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<MatchStatusFilter>("all");
  const [panelMode, setPanelMode] = useState<"create" | "edit">("create");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<AdminMatchFormValues>(emptyFormValues());
  const [simulatingMatchId, setSimulatingMatchId] = useState<string | null>(null);
  const [isSimulatingWeek, setIsSimulatingWeek] = useState(false);
  const [matchPendingDelete, setMatchPendingDelete] = useState<MatchResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: matches = [], isLoading: isMatchesLoading } = useGetMatchesQuery();
  const { data: divisionsData, isLoading: isDivisionsLoading } = useGetLeagueDivisionsQuery({
    currentPage: 1,
    pageSize: 100,
  });
  const { data: clubsData, isLoading: isClubsLoading } = useGetClubsQuery({
    currentPage: 1,
    pageSize: 500,
  });
  const { data: refereesData, isLoading: isRefereesLoading } = useGetRefereesQuery({
    currentPage: 1,
    pageSize: 200,
  });

  const [createMatch, { isLoading: isCreating }] = useCreateMatchMutation();
  const [updateMatch, { isLoading: isUpdating }] = useUpdateMatchScheduleMutation();
  const [simulateMatch] = useSimulateMatchMutation();
  const [deleteMatch] = useDeleteMatchMutation();

  const divisions = divisionsData?.items ?? [];
  const clubs = clubsData?.items ?? [];
  const referees = refereesData?.items ?? [];

  const filteredMatches = useMemo(
    () =>
      filterAdminMatches(
        matches,
        searchQuery,
        divisionFilter,
        matchWeekFilter,
        statusFilter,
      ),
    [matches, searchQuery, divisionFilter, matchWeekFilter, statusFilter],
  );

  const availableWeeks = useMemo(() => getAvailableMatchWeeks(matches), [matches]);

  const weekAlert = useMemo(
    () => findUnplayedWeekAlert(matches, divisions),
    [matches, divisions],
  );

  useEffect(() => {
    if (matchWeekFilter !== "all" && !availableWeeks.includes(matchWeekFilter)) {
      setMatchWeekFilter("all");
    }
  }, [availableWeeks, matchWeekFilter]);

  const isLoading =
    isMatchesLoading || isDivisionsLoading || isClubsLoading || isRefereesLoading;
  const isSubmitting = isCreating || isUpdating;

  const openCreatePanel = () => {
    const defaultDivision = divisions[0];
    setPanelMode("create");
    setEditingMatchId(null);
    setFormValues(
      emptyFormValues(
        defaultDivision?.id ?? "",
        defaultDivision?.currentMatchWeek ?? 1,
      ),
    );
    setIsPanelOpen(true);
  };

  const openEditPanel = (matchId: string) => {
    const match = matches.find((item) => item.id === matchId);

    if (!match || match.isPlayed) {
      return;
    }

    setPanelMode("edit");
    setEditingMatchId(matchId);
    setFormValues(toFormValues(match));
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setEditingMatchId(null);
  };

  const handleSubmit = async () => {
    if (
      formValues.divisionId === "" ||
      !formValues.homeClubId ||
      !formValues.awayClubId ||
      !formValues.matchDate
    ) {
      return;
    }

    const payload = {
      divisionId: formValues.divisionId,
      matchWeek: formValues.matchWeek,
      homeClubId: formValues.homeClubId,
      awayClubId: formValues.awayClubId,
      refereeId: formValues.refereeId === "" ? null : formValues.refereeId,
      matchDate: fromDateTimeLocalValue(formValues.matchDate),
    };

    if (panelMode === "create") {
      await createMatch(payload).unwrap();
      setFormValues(
        emptyFormValues(formValues.divisionId, formValues.matchWeek),
      );
      return;
    }

    if (!editingMatchId) {
      return;
    }

    await updateMatch({
      id: editingMatchId,
      ...payload,
    }).unwrap();
  };

  const handleSimulate = async (matchId: string) => {
    setSimulatingMatchId(matchId);

    try {
      await simulateMatch(matchId).unwrap();
    } finally {
      setSimulatingMatchId(null);
    }
  };

  const handleSimulateWeek = async () => {
    if (!weekAlert) {
      return;
    }

    const targets = getUnplayedMatchesForWeek(
      matches,
      weekAlert.divisionId,
      weekAlert.matchWeek,
    ).filter((match) => match.refereeId != null);

    if (targets.length === 0) {
      return;
    }

    setIsSimulatingWeek(true);

    try {
      for (const match of targets) {
        setSimulatingMatchId(match.id);
        await simulateMatch(match.id).unwrap();
      }
    } finally {
      setSimulatingMatchId(null);
      setIsSimulatingWeek(false);
    }
  };

  const handleDeleteRequest = (matchId: string) => {
    const match = matches.find((item) => item.id === matchId);

    if (!match) {
      return;
    }

    setMatchPendingDelete(match);
  };

  const handleConfirmDelete = async () => {
    if (!matchPendingDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteMatch(matchPendingDelete.id).unwrap();

      if (editingMatchId === matchPendingDelete.id) {
        closePanel();
      }

      setMatchPendingDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (isDeleting) {
      return;
    }

    setMatchPendingDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Matches loading...
      </div>
    );
  }

  const statusFilters: { value: MatchStatusFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "scheduled", label: "Scheduled" },
    { value: "played", label: "Played" },
  ];

  const simulatableWeekCount = weekAlert
    ? getUnplayedMatchesForWeek(matches, weekAlert.divisionId, weekAlert.matchWeek).filter(
        (match) => match.refereeId != null,
      ).length
    : 0;

  return (
    <div className="-m-container-padding flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden border-r border-outline-variant">
        <div className="shrink-0 border-b border-outline-variant bg-surface p-container-padding pb-4">
          <div className="mb-4">
            <h2 className="text-headline-md font-bold text-on-surface">Matches</h2>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Fixture control and match simulation
            </p>
          </div>

          {weekAlert && (
            <div className="flex items-center justify-between rounded border border-secondary/30 bg-secondary-container/20 p-3">
              <div className="flex items-center gap-3">
                <MaterialIcon name="warning" className="text-secondary" />
                <span className="text-body-sm text-secondary-fixed">
                  {weekAlert.unplayedCount} unplayed fixtures in {weekAlert.divisionName},
                  Week {weekAlert.matchWeek}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSimulateWeek}
                disabled={isSimulatingWeek || simulatableWeekCount === 0}
                className="rounded bg-secondary px-4 py-1.5 text-label-caps text-on-secondary transition-colors hover:bg-secondary-fixed disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSimulatingWeek
                  ? "Simulating..."
                  : `Simulate All This Week (${simulatableWeekCount})`}
              </button>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 overflow-x-auto border-b border-outline-variant bg-surface-container-lowest px-container-padding py-3">
          <div className="flex min-w-max items-center gap-3">
            <select
              value={divisionFilter === "all" ? "all" : String(divisionFilter)}
              onChange={(event) =>
                setDivisionFilter(
                  event.target.value === "all" ? "all" : Number(event.target.value),
                )
              }
              className="h-8 rounded border border-outline-variant bg-surface-container px-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Divisions</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {formatDivisionOption(division)}
                </option>
              ))}
            </select>

            <select
              value={matchWeekFilter === "all" ? "all" : String(matchWeekFilter)}
              onChange={(event) =>
                setMatchWeekFilter(
                  event.target.value === "all" ? "all" : Number(event.target.value),
                )
              }
              className="h-8 rounded border border-outline-variant bg-surface-container px-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="all">Match Week (All)</option>
              {availableWeeks.map((week) => (
                <option key={week} value={week}>
                  Week {week}
                </option>
              ))}
            </select>

            <div className="flex overflow-hidden rounded border border-outline-variant bg-surface-container">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={[
                    "px-3 py-1 text-sm transition-colors",
                    statusFilter === filter.value
                      ? "bg-surface-variant font-medium text-on-surface"
                      : "text-on-surface-variant hover:bg-surface-variant/50",
                  ].join(" ")}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="relative ml-2">
              <MaterialIcon
                name="search"
                className="absolute top-1.5 left-2 text-sm text-on-surface-variant"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Club name..."
                className="h-8 w-48 rounded border border-outline-variant bg-surface-container py-0 pr-3 pl-8 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={openCreatePanel}
            className="flex shrink-0 items-center gap-2 rounded bg-primary px-4 py-2 text-label-caps text-on-primary transition-colors hover:bg-primary-fixed"
          >
            <MaterialIcon name="add" className="text-sm" />
            Schedule Match
          </button>
        </div>

        <AdminMatchesTable
          matches={filteredMatches}
          simulatingMatchId={simulatingMatchId}
          onSimulate={handleSimulate}
          onEdit={openEditPanel}
          onDelete={handleDeleteRequest}
        />
      </div>

      {isPanelOpen && (
        <AdminMatchFormPanel
          mode={panelMode}
          isOpen={isPanelOpen}
          values={formValues}
          divisions={divisions}
          clubs={clubs}
          referees={referees}
          isSubmitting={isSubmitting}
          onChange={setFormValues}
          onClose={closePanel}
          onSubmit={handleSubmit}
        />
      )}

      <ConfirmDialog
        open={matchPendingDelete != null}
        title="Delete match"
        message={
          matchPendingDelete
            ? `Delete "${matchPendingDelete.homeClubName} vs ${matchPendingDelete.awayClubName}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        confirmTone="danger"
        isConfirming={isDeleting}
        onConfirm={() => {
          void handleConfirmDelete();
        }}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};
