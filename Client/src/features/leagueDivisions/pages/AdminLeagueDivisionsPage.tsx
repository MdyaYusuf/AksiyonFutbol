import { useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import {
  AdminDivisionFormPanel,
  type AdminDivisionFormValues,
} from "../components/AdminDivisionFormPanel";
import { AdminDivisionsTable } from "../components/AdminDivisionsTable";
import {
  useCreateLeagueDivisionMutation,
  useDeleteLeagueDivisionMutation,
  useGetLeagueDivisionsQuery,
  useProcessLeagueDivisionWeekMutation,
  useUpdateLeagueDivisionMatchWeekMutation,
  useUpdateLeagueDivisionMutation,
} from "../leagueDivisionsApiSlice";
import type { LeagueDivisionResponse } from "../leagueDivisionTypes";

const PAGE_SIZE = 10;

const emptyFormValues = (): AdminDivisionFormValues => ({
  name: "",
  tier: 3,
  groupNumber: 1,
  currentMatchWeek: 1,
});

const toFormValues = (division: LeagueDivisionResponse): AdminDivisionFormValues => ({
  name: division.name,
  tier: division.tier,
  groupNumber: division.groupNumber,
  currentMatchWeek: division.currentMatchWeek,
});

export const AdminLeagueDivisionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [panelMode, setPanelMode] = useState<"create" | "edit">("create");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [editingDivisionId, setEditingDivisionId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<AdminDivisionFormValues>(emptyFormValues);
  const [advancingDivisionId, setAdvancingDivisionId] = useState<number | null>(null);

  const trimmedSearch = searchQuery.trim();

  const { data: divisionsData, isLoading: isDivisionsLoading } = useGetLeagueDivisionsQuery({
    currentPage,
    pageSize: PAGE_SIZE,
    search: trimmedSearch.length > 0 ? trimmedSearch : undefined,
  });

  const [createDivision, { isLoading: isCreating }] = useCreateLeagueDivisionMutation();
  const [updateDivision, { isLoading: isUpdating }] = useUpdateLeagueDivisionMutation();
  const [updateMatchWeek, { isLoading: isUpdatingMatchWeek }] =
    useUpdateLeagueDivisionMatchWeekMutation();
  const [processWeek] = useProcessLeagueDivisionWeekMutation();
  const [deleteDivision] = useDeleteLeagueDivisionMutation();

  const divisions = divisionsData?.items ?? [];
  const totalCount = divisionsData?.totalCount ?? 0;

  const editingDivision = useMemo(
    () => divisions.find((division) => division.id === editingDivisionId),
    [divisions, editingDivisionId],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalCount]);

  const isSubmitting = isCreating || isUpdating || isUpdatingMatchWeek;
  const isLoading = isDivisionsLoading;

  const openCreatePanel = () => {
    setPanelMode("create");
    setEditingDivisionId(null);
    setFormValues(emptyFormValues());
    setIsPanelOpen(true);
  };

  const openEditPanel = (divisionId: number) => {
    const division = divisions.find((item) => item.id === divisionId);

    if (!division) {
      return;
    }

    setPanelMode("edit");
    setEditingDivisionId(divisionId);
    setFormValues(toFormValues(division));
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setEditingDivisionId(null);
  };

  const handleSubmit = async () => {
    if (panelMode === "create") {
      await createDivision({
        name: formValues.name.trim(),
        tier: formValues.tier,
        groupNumber: formValues.groupNumber,
      }).unwrap();
      setFormValues(emptyFormValues());
      return;
    }

    if (!editingDivision) {
      return;
    }

    const hasDivisionChanges =
      formValues.name.trim() !== editingDivision.name ||
      formValues.tier !== editingDivision.tier ||
      formValues.groupNumber !== editingDivision.groupNumber;

    if (hasDivisionChanges) {
      await updateDivision({
        id: editingDivision.id,
        name: formValues.name.trim(),
        tier: formValues.tier,
        groupNumber: formValues.groupNumber,
      }).unwrap();
    }

    if (formValues.currentMatchWeek !== editingDivision.currentMatchWeek) {
      await updateMatchWeek({
        id: editingDivision.id,
        currentMatchWeek: formValues.currentMatchWeek,
      }).unwrap();
    }
  };

  const handleDelete = async (divisionId: number) => {
    const division = divisions.find((item) => item.id === divisionId);

    if (!division) {
      return;
    }

    const confirmed = window.confirm(`Delete division "${division.name}"?`);

    if (!confirmed) {
      return;
    }

    await deleteDivision(divisionId).unwrap();

    if (editingDivisionId === divisionId) {
      closePanel();
    }
  };

  const handleAdvanceWeek = async (divisionId: number) => {
    setAdvancingDivisionId(divisionId);

    try {
      await processWeek(divisionId).unwrap();
    } finally {
      setAdvancingDivisionId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        League divisions loading...
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="flex flex-col gap-container-padding lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="mb-1 text-headline-md font-bold tracking-tight text-on-surface">
              League Divisions
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Manage hierarchical tiers, groups, and global league structure.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <MaterialIcon
                name="filter_list"
                className="absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-on-surface-variant"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Filter divisions..."
                className="w-64 rounded border border-outline-variant bg-surface-container-high py-2 pr-4 pl-9 text-body-sm text-on-surface shadow-sm placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={openCreatePanel}
              className="flex items-center gap-2 rounded bg-primary-container px-4 py-2 text-label-caps font-bold text-on-primary-container shadow-sm transition-all hover:bg-primary"
            >
              <MaterialIcon name="add" className="text-[18px]" />
              Create New
            </button>
          </div>
        </div>

        <AdminDivisionsTable
          divisions={divisions}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          onEdit={openEditPanel}
          onDelete={handleDelete}
          onAdvanceWeek={handleAdvanceWeek}
          advancingDivisionId={advancingDivisionId}
        />
      </div>

      <AdminDivisionFormPanel
        mode={panelMode}
        isOpen={isPanelOpen}
        values={formValues}
        isSubmitting={isSubmitting}
        onChange={setFormValues}
        onClose={closePanel}
        onSubmit={handleSubmit}
      />
      </div>
    </div>
  );
};
