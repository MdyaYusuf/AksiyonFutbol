import { useEffect, useState } from "react";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import {
  AdminRefereeFormPanel,
  type AdminRefereeFormValues,
} from "@/features/referees/components/AdminRefereeFormPanel";
import { AdminRefereesTable } from "@/features/referees/components/AdminRefereesTable";
import {
  useCreateRefereeMutation,
  useDeleteRefereeMutation,
  useGetRefereesQuery,
  useUpdateRefereeMutation,
} from "@/features/referees/refereesApiSlice";
import {
  RefereePersonalityType,
  type RefereeResponse,
} from "@/features/referees/refereeTypes";
import { type RefereePersonalityFilter } from "@/features/referees/utils/adminRefereesHelpers";

const PAGE_SIZE = 10;

const emptyFormValues = (): AdminRefereeFormValues => ({
  name: "",
  personalityType: RefereePersonalityType.Balanced,
  briberyDifficulty: 50,
  biography: "",
});

const toFormValues = (referee: RefereeResponse): AdminRefereeFormValues => ({
  name: referee.name,
  personalityType: referee.personalityType,
  briberyDifficulty: referee.briberyDifficulty,
  biography: referee.biography ?? "",
});

const toRequestBody = (values: AdminRefereeFormValues) => ({
  name: values.name.trim(),
  personalityType: values.personalityType,
  briberyDifficulty: values.briberyDifficulty,
  biography: values.biography.trim() || null,
});

export const AdminRefereesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [personalityFilter, setPersonalityFilter] =
    useState<RefereePersonalityFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [panelMode, setPanelMode] = useState<"create" | "edit">("create");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [editingRefereeId, setEditingRefereeId] = useState<number | null>(null);
  const [formValues, setFormValues] =
    useState<AdminRefereeFormValues>(emptyFormValues);

  const trimmedSearch = searchQuery.trim();

  const { data: refereesData, isLoading } = useGetRefereesQuery({
    currentPage,
    pageSize: PAGE_SIZE,
    search: trimmedSearch.length > 0 ? trimmedSearch : undefined,
    personalityType:
      personalityFilter === "ALL" ? undefined : personalityFilter,
  });

  const [createReferee, { isLoading: isCreating }] = useCreateRefereeMutation();
  const [updateReferee, { isLoading: isUpdating }] = useUpdateRefereeMutation();
  const [deleteReferee] = useDeleteRefereeMutation();

  const referees = refereesData?.items ?? [];
  const totalCount = refereesData?.totalCount ?? 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, personalityFilter]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalCount]);

  const isSubmitting = isCreating || isUpdating;

  const openCreatePanel = () => {
    setPanelMode("create");
    setEditingRefereeId(null);
    setFormValues(emptyFormValues());
    setIsPanelOpen(true);
  };

  const openEditPanel = (refereeId: number) => {
    const referee = referees.find((item) => item.id === refereeId);

    if (!referee) {
      return;
    }

    setPanelMode("edit");
    setEditingRefereeId(refereeId);
    setFormValues(toFormValues(referee));
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setEditingRefereeId(null);
  };

  const handleSubmit = async () => {
    const body = toRequestBody(formValues);

    if (panelMode === "create") {
      await createReferee(body).unwrap();
      setFormValues(emptyFormValues());
      closePanel();
      return;
    }

    if (!editingRefereeId) {
      return;
    }

    await updateReferee({
      id: editingRefereeId,
      ...body,
    }).unwrap();
    closePanel();
  };

  const handleDelete = async (refereeId: number) => {
    const referee = referees.find((item) => item.id === refereeId);

    if (!referee) {
      return;
    }

    const confirmed = window.confirm(
      `Delete referee "${referee.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteReferee(refereeId).unwrap();

    if (editingRefereeId === refereeId) {
      closePanel();
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Referees loading...
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="flex flex-col gap-container-padding lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="mb-1 text-headline-md font-bold tracking-tight text-on-surface">
              Referees
            </h2>
            <p className="text-label-caps text-on-surface-variant">
              Officials, personalities, and bribery difficulty
            </p>
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <MaterialIcon
                name="search"
                className="absolute top-1/2 left-2.5 -translate-y-1/2 text-[18px] text-on-surface-variant"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search Referees..."
                className="w-full rounded border border-outline-variant bg-surface-container-lowest py-1.5 pr-3 pl-8 text-sm text-on-surface outline-none focus:border-primary sm:w-48"
              />
            </div>
            <select
              value={personalityFilter === "ALL" ? "ALL" : String(personalityFilter)}
              onChange={(event) =>
                setPersonalityFilter(
                  event.target.value === "ALL"
                    ? "ALL"
                    : (Number(event.target.value) as RefereePersonalityType),
                )
              }
              className="appearance-none rounded border border-outline-variant bg-surface-container-lowest px-3 py-1.5 pr-8 text-sm text-on-surface outline-none focus:border-primary"
            >
              <option value="ALL">All Personalities</option>
              <option value={RefereePersonalityType.Balanced}>Neutral</option>
              <option value={RefereePersonalityType.Lenient}>Lenient</option>
              <option value={RefereePersonalityType.Strict}>Strict</option>
              <option value={RefereePersonalityType.Showman}>Showman</option>
              <option value={RefereePersonalityType.Corruptible}>
                Corruptible
              </option>
            </select>
            <button
              type="button"
              onClick={openCreatePanel}
              className="flex items-center gap-2 whitespace-nowrap rounded bg-primary-container px-4 py-1.5 text-label-caps text-on-primary-container transition-colors hover:bg-primary-fixed"
            >
              <MaterialIcon name="add" className="text-[16px]" />
              Create Referee
            </button>
          </div>
        </div>

        <AdminRefereesTable
          referees={referees}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          onEdit={openEditPanel}
          onDelete={handleDelete}
        />
      </div>

      <AdminRefereeFormPanel
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
