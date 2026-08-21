import { useEffect, useMemo, useRef, useState } from "react";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { useGetLeagueDivisionsQuery } from "../../leagueDivisions/leagueDivisionsApiSlice";
import { paginateItems } from "../../leagueDivisions/utils/adminLeagueDivisionsHelpers";
import {
  AdminClubFormPanel,
  type AdminClubFormValues,
} from "../components/AdminClubFormPanel";
import { AdminClubsTable } from "../components/AdminClubsTable";
import {
  useCreateBotClubMutation,
  useDeleteClubMutation,
  useGetClubCreationDefaultsQuery,
  useGetClubsQuery,
  useUpdateClubFinancesMutation,
  useUpdateClubMutation,
  useUpdateClubStatusMutation,
} from "../clubsApiSlice";
import type { ClubCreationDefaults, ClubResponse } from "../clubTypes";
import { getClubDisplayName } from "../utils/clubDisplayName";
import {
  filterAdminClubs,
  type ClubTypeFilter,
} from "../utils/adminClubsHelpers";

const PAGE_SIZE = 15;

const emptyFormValues = (
  defaults: ClubCreationDefaults,
  defaultDivisionId: number | "" = "",
): AdminClubFormValues => ({
  name: "",
  divisionId: defaultDivisionId,
  cash: defaults.startingCash,
  wageBudget: defaults.startingWageBudget,
  morale: defaults.startingClubStatus,
  chemistry: defaults.startingClubStatus,
  discipline: defaults.startingClubStatus,
});

const toFormValues = (club: ClubResponse): AdminClubFormValues => ({
  name: getClubDisplayName(club),
  divisionId: club.divisionId ?? "",
  cash: club.cash,
  wageBudget: club.wageBudget,
  morale: club.morale,
  chemistry: club.chemistry,
  discipline: club.discipline,
});

export const AdminClubsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [divisionFilter, setDivisionFilter] = useState<number | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ClubTypeFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [panelMode, setPanelMode] = useState<"create" | "edit">("create");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [editingClubId, setEditingClubId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<AdminClubFormValues>({
    name: "",
    divisionId: "",
    cash: 0,
    wageBudget: 0,
    morale: 0,
    chemistry: 0,
    discipline: 0,
  });

  const { data: clubsData, isLoading: isClubsLoading } = useGetClubsQuery({
    currentPage: 1,
    pageSize: 500,
  });
  const { data: divisionsData, isLoading: isDivisionsLoading } = useGetLeagueDivisionsQuery({
    currentPage: 1,
    pageSize: 100,
  });
  const { data: creationDefaults, isLoading: isDefaultsLoading } =
    useGetClubCreationDefaultsQuery();

  const [createBotClub, { isLoading: isCreating }] = useCreateBotClubMutation();
  const [updateClub, { isLoading: isUpdatingName }] = useUpdateClubMutation();
  const [updateFinances, { isLoading: isUpdatingFinances }] = useUpdateClubFinancesMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateClubStatusMutation();
  const [deleteClub] = useDeleteClubMutation();

  const clubs = clubsData?.items ?? [];
  const divisions = divisionsData?.items ?? [];
  const hasSeededDefaults = useRef(false);

  const filteredClubs = useMemo(
    () => filterAdminClubs(clubs, searchQuery, divisionFilter, typeFilter),
    [clubs, searchQuery, divisionFilter, typeFilter],
  );

  const paginatedClubs = useMemo(
    () => paginateItems(filteredClubs, currentPage, PAGE_SIZE),
    [filteredClubs, currentPage],
  );

  const editingClub = useMemo(
    () => clubs.find((club) => club.id === editingClubId),
    [clubs, editingClubId],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, divisionFilter, typeFilter]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredClubs.length / PAGE_SIZE));

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, filteredClubs.length]);

  useEffect(() => {
    if (!creationDefaults || hasSeededDefaults.current) {
      return;
    }

    hasSeededDefaults.current = true;
    setFormValues(emptyFormValues(creationDefaults, divisions[0]?.id ?? ""));
  }, [creationDefaults, divisions]);

  const isSubmitting =
    isCreating || isUpdatingName || isUpdatingFinances || isUpdatingStatus;
  const isLoading = isClubsLoading || isDivisionsLoading || isDefaultsLoading;

  const openCreatePanel = () => {
    if (!creationDefaults) {
      return;
    }

    const defaultDivisionId = divisions[0]?.id ?? "";
    setPanelMode("create");
    setEditingClubId(null);
    setFormValues(emptyFormValues(creationDefaults, defaultDivisionId));
    setIsPanelOpen(true);
  };

  const openEditPanel = (clubId: string) => {
    const club = clubs.find((item) => item.id === clubId);

    if (!club) {
      return;
    }

    setPanelMode("edit");
    setEditingClubId(clubId);
    setFormValues(toFormValues(club));
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setEditingClubId(null);
  };

  const handleSubmit = async () => {
    if (panelMode === "create") {
      if (formValues.divisionId === "") {
        return;
      }

      await createBotClub({
        name: formValues.name.trim(),
        divisionId: formValues.divisionId,
        cash: formValues.cash,
        wageBudget: formValues.wageBudget,
        morale: formValues.morale,
        chemistry: formValues.chemistry,
        discipline: formValues.discipline,
      }).unwrap();

      if (creationDefaults) {
        setFormValues(emptyFormValues(creationDefaults, formValues.divisionId));
      }
      return;
    }

    if (!editingClub) {
      return;
    }

    if (formValues.name.trim() !== editingClub.name) {
      await updateClub({
        id: editingClub.id,
        name: formValues.name.trim(),
      }).unwrap();
    }

    if (
      formValues.cash !== editingClub.cash ||
      formValues.wageBudget !== editingClub.wageBudget
    ) {
      await updateFinances({
        id: editingClub.id,
        cash: formValues.cash,
        wageBudget: formValues.wageBudget,
      }).unwrap();
    }

    if (
      formValues.morale !== editingClub.morale ||
      formValues.chemistry !== editingClub.chemistry ||
      formValues.discipline !== editingClub.discipline
    ) {
      await updateStatus({
        id: editingClub.id,
        morale: formValues.morale,
        chemistry: formValues.chemistry,
        discipline: formValues.discipline,
      }).unwrap();
    }
  };

  const handleDelete = async (clubId: string) => {
    const club = clubs.find((item) => item.id === clubId);

    if (!club) {
      return;
    }

    const confirmed = window.confirm(`Delete club "${getClubDisplayName(club)}"?`);

    if (!confirmed) {
      return;
    }

    await deleteClub(clubId).unwrap();

    if (editingClubId === clubId) {
      closePanel();
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Clubs loading...
      </div>
    );
  }

  const typeFilters: { value: ClubTypeFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "human", label: "Human" },
    { value: "bot", label: "Bot" },
  ];

  return (
    <div className="-m-container-padding flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden border-r border-outline-variant bg-surface-container-low/50 p-container-padding">
        <div className="flex shrink-0 flex-col gap-4">
          <div>
            <h2 className="text-headline-md text-on-surface">Clubs</h2>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Club registry, finances, and division membership
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-outline-variant bg-surface-container-high p-3">
            <div className="flex flex-1 flex-wrap items-center gap-4">
              <div className="relative w-64">
                <MaterialIcon
                  name="search"
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-on-surface-variant"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Find a club..."
                  className="w-full rounded border border-outline-variant bg-surface-container-low py-1.5 pr-3 pl-10 text-body-sm outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <select
                value={divisionFilter === "all" ? "all" : String(divisionFilter)}
                onChange={(event) =>
                  setDivisionFilter(
                    event.target.value === "all" ? "all" : Number(event.target.value),
                  )
                }
                className="appearance-none rounded border border-outline-variant bg-surface-container-low px-3 py-1.5 pr-8 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Divisions</option>
                {divisions.map((division) => (
                  <option key={division.id} value={division.id}>
                    {division.name}
                  </option>
                ))}
              </select>

              <div className="flex rounded border border-outline-variant bg-surface-container-low p-0.5">
                {typeFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setTypeFilter(filter.value)}
                    className={[
                      "rounded-sm px-3 py-1 text-[13px] font-medium transition-colors",
                      typeFilter === filter.value
                        ? "bg-surface-variant text-on-surface shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface",
                    ].join(" ")}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={openCreatePanel}
              className="flex items-center gap-2 rounded bg-primary-container px-4 py-2 text-label-caps font-bold text-on-primary-container shadow-sm transition-all hover:brightness-110"
            >
              <MaterialIcon name="add" className="text-[18px]" />
              Create Bot Club
            </button>
          </div>
        </div>

        <AdminClubsTable
          clubs={paginatedClubs}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          totalCount={filteredClubs.length}
          onPageChange={setCurrentPage}
          onEdit={openEditPanel}
          onDelete={handleDelete}
        />
      </div>

      {isPanelOpen && (
        <AdminClubFormPanel
          mode={panelMode}
          isOpen={isPanelOpen}
          values={formValues}
          divisions={divisions}
          isSubmitting={isSubmitting}
          isBotClub={editingClub?.isBot ?? true}
          onChange={setFormValues}
          onClose={closePanel}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
