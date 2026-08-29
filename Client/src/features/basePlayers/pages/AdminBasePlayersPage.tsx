import { useEffect, useState } from "react";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import {
  AdminBasePlayerFormPanel,
  type AdminBasePlayerFormValues,
} from "../components/AdminBasePlayerFormPanel";
import { AdminBasePlayersTable } from "../components/AdminBasePlayersTable";
import {
  useCreateBasePlayerMutation,
  useDeleteBasePlayerMutation,
  useGetBasePlayersQuery,
  useUpdateBasePlayerMutation,
} from "../basePlayersApiSlice";
import {
  DraftTier,
  PlayerPosition,
  PreferredFoot,
  type BasePlayerResponse,
} from "../basePlayerTypes";
import {
  attributesForPosition,
  buildDefaultAttributes,
} from "../../playerInstances/utils/playerAttributeHelpers";
import {
  getDraftTierPricingDefaults,
  type BasePlayerPositionFilter,
} from "../utils/adminBasePlayersHelpers";

const PAGE_SIZE = 10;

const emptyFormValues = (): AdminBasePlayerFormValues => {
  const bronzePricing = getDraftTierPricingDefaults(DraftTier.Bronze);

  return {
    defaultFirstName: "",
    defaultLastName: "",
    nationality: "",
    position: PlayerPosition.Midfielder,
    age: 21,
    heightCm: 180,
    weightKg: 75,
    preferredFoot: PreferredFoot.Right,
    attributes: buildDefaultAttributes(PlayerPosition.Midfielder),
    draftTier: DraftTier.Bronze,
    draftFee: bronzePricing.draftFee,
    wage: bronzePricing.wage,
    marketValue: bronzePricing.marketValue,
    isFreeAgentTemplate: true,
    isDraftOnly: false,
  };
};

const toFormValues = (player: BasePlayerResponse): AdminBasePlayerFormValues => ({
  defaultFirstName: player.defaultFirstName,
  defaultLastName: player.defaultLastName,
  nationality: player.nationality ?? "",
  position: player.position,
  age: player.age,
  heightCm: player.heightCm,
  weightKg: player.weightKg,
  preferredFoot: player.preferredFoot,
  attributes: attributesForPosition(player.position, player.attributes),
  draftTier: player.draftTier,
  draftFee: player.draftFee,
  wage: player.wage,
  marketValue: player.marketValue,
  isFreeAgentTemplate: player.isFreeAgentTemplate,
  isDraftOnly: player.isDraftOnly,
});

const toRequestBody = (values: AdminBasePlayerFormValues) => ({
  defaultFirstName: values.defaultFirstName.trim(),
  defaultLastName: values.defaultLastName.trim(),
  nationality: values.nationality.trim() || null,
  position: values.position,
  age: values.age,
  heightCm: values.heightCm,
  weightKg: values.weightKg,
  preferredFoot: values.preferredFoot,
  attributes: attributesForPosition(values.position, values.attributes),
  draftTier: values.draftTier,
  draftFee: values.draftFee,
  wage: values.wage,
  marketValue: values.marketValue,
  isFreeAgentTemplate: values.isFreeAgentTemplate,
  isDraftOnly: values.isDraftOnly,
});

export const AdminBasePlayersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] =
    useState<BasePlayerPositionFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [panelMode, setPanelMode] = useState<"create" | "edit">("create");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [formValues, setFormValues] =
    useState<AdminBasePlayerFormValues>(emptyFormValues);

  const trimmedSearch = searchQuery.trim();

  const { data: playersData, isLoading } = useGetBasePlayersQuery({
    currentPage,
    pageSize: PAGE_SIZE,
    search: trimmedSearch.length > 0 ? trimmedSearch : undefined,
    position: positionFilter === "ALL" ? undefined : positionFilter,
  });

  const [createBasePlayer, { isLoading: isCreating }] =
    useCreateBasePlayerMutation();
  const [updateBasePlayer, { isLoading: isUpdating }] =
    useUpdateBasePlayerMutation();
  const [deleteBasePlayer] = useDeleteBasePlayerMutation();

  const players = playersData?.items ?? [];
  const totalCount = playersData?.totalCount ?? 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, positionFilter]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalCount]);

  const isSubmitting = isCreating || isUpdating;

  const openCreatePanel = () => {
    setPanelMode("create");
    setEditingPlayerId(null);
    setFormValues(emptyFormValues());
    setIsPanelOpen(true);
  };

  const openEditPanel = (playerId: string) => {
    const player = players.find((item) => item.id === playerId);

    if (!player) {
      return;
    }

    setPanelMode("edit");
    setEditingPlayerId(playerId);
    setFormValues(toFormValues(player));
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setEditingPlayerId(null);
  };

  const handleSubmit = async () => {
    const body = toRequestBody(formValues);

    if (panelMode === "create") {
      await createBasePlayer(body).unwrap();
      setFormValues(emptyFormValues());
      closePanel();
      return;
    }

    if (!editingPlayerId) {
      return;
    }

    await updateBasePlayer({
      id: editingPlayerId,
      ...body,
    }).unwrap();
    closePanel();
  };

  const handleDelete = async (playerId: string) => {
    const player = players.find((item) => item.id === playerId);

    if (!player) {
      return;
    }

    const confirmed = window.confirm(
      `Delete base player "${player.defaultFirstName} ${player.defaultLastName}"?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteBasePlayer(playerId).unwrap();

    if (editingPlayerId === playerId) {
      closePanel();
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Base players loading...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-1 text-headline-md font-bold text-on-surface">Base Players</h2>
        <p className="text-body-sm text-on-surface-variant">
          Master player templates for the game world.
        </p>
      </div>

      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <MaterialIcon
              name="search"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-on-surface-variant"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Find player..."
              className="w-full rounded border border-outline-variant bg-surface-container py-2 pr-4 pl-10 text-sm text-on-surface outline-none focus:border-primary"
            />
          </div>
          <select
            value={positionFilter === "ALL" ? "ALL" : String(positionFilter)}
            onChange={(event) =>
              setPositionFilter(
                event.target.value === "ALL"
                  ? "ALL"
                  : (Number(event.target.value) as PlayerPosition),
              )
            }
            className="appearance-none rounded border border-outline-variant bg-surface-container px-4 py-2 text-sm text-on-surface outline-none focus:border-primary"
          >
            <option value="ALL">All Pos</option>
            <option value={PlayerPosition.Goalkeeper}>GK</option>
            <option value={PlayerPosition.Defender}>DEF</option>
            <option value={PlayerPosition.Midfielder}>MID</option>
            <option value={PlayerPosition.Forward}>FWD</option>
          </select>
        </div>

        <button
          type="button"
          onClick={openCreatePanel}
          className="flex items-center gap-2 rounded bg-primary-container px-6 py-2 text-sm font-bold text-on-primary-container transition-colors hover:bg-primary-fixed"
        >
          <MaterialIcon name="add" className="text-[18px]" />
          Create Base Player
        </button>
      </div>

      <AdminBasePlayersTable
        players={players}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        totalCount={totalCount}
        onPageChange={setCurrentPage}
        onEdit={openEditPanel}
        onDelete={handleDelete}
      />

      <AdminBasePlayerFormPanel
        mode={panelMode}
        isOpen={isPanelOpen}
        values={formValues}
        isSubmitting={isSubmitting}
        onChange={setFormValues}
        onClose={closePanel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
