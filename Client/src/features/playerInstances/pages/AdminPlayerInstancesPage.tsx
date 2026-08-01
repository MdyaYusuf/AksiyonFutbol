import { useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { useGetBasePlayersQuery } from "../../basePlayers/basePlayersApiSlice";
import {
  PlayerPosition,
  PreferredFoot,
} from "../../basePlayers/basePlayerTypes";
import { useGetClubsQuery } from "../../clubs/clubsApiSlice";
import { paginateItems } from "../../leagueDivisions/utils/adminLeagueDivisionsHelpers";
import {
  AdminPlayerInstanceFormPanel,
  type AssignFromBaseFormValues,
  type CustomPlayerFormValues,
  type EditPlayerFormValues,
  type PlayerInstancePanelTab,
} from "../components/AdminPlayerInstanceFormPanel";
import { AdminPlayerInstancesTable } from "../components/AdminPlayerInstancesTable";
import {
  useCreateCustomPlayerInstanceMutation,
  useCreatePlayerInstanceFromBasePlayerMutation,
  useDeletePlayerInstanceMutation,
  useGetPlayerInstancesQuery,
  useUpdatePlayerInstanceHealthMutation,
  useUpdatePlayerInstanceNameMutation,
  useUpdatePlayerInstanceSeasonStatsMutation,
  useUpdatePlayerInstanceStatsMutation,
} from "../playerInstancesApiSlice";
import type { PlayerInstanceResponse } from "../playerInstanceTypes";
import {
  filterAdminPlayerInstances,
  type PlayerPositionFilter,
  type PlayerStatusFilter,
} from "../utils/adminPlayerInstancesHelpers";

const PAGE_SIZE = 15;

const emptyAssignValues = (clubId = ""): AssignFromBaseFormValues => ({
  clubId,
  basePlayerId: "",
  marketValue: 1_000_000,
  wage: 10_000,
});

const emptyCustomValues = (clubId = ""): CustomPlayerFormValues => ({
  clubId,
  firstName: "",
  lastName: "",
  nationality: "",
  position: PlayerPosition.Midfielder,
  age: 21,
  heightCm: 180,
  weightKg: 75,
  preferredFoot: PreferredFoot.Right,
  attackPower: 50,
  defenseStrength: 50,
  midfieldControl: 50,
  marketValue: 1_000_000,
  wage: 10_000,
});

const emptyEditValues = (): EditPlayerFormValues => ({
  firstName: "",
  lastName: "",
  clubName: "",
  position: PlayerPosition.Midfielder,
  age: 21,
  heightCm: 180,
  weightKg: 75,
  preferredFoot: PreferredFoot.Right,
  attackPower: 50,
  defenseStrength: 50,
  midfieldControl: 50,
  isInjured: false,
  injuryDays: 0,
  seasonGoals: 0,
  seasonAssists: 0,
  seasonYellowCards: 0,
  seasonRedCards: 0,
  marketValue: 0,
  wage: 0,
});

const toEditValues = (player: PlayerInstanceResponse): EditPlayerFormValues => ({
  firstName: player.firstName,
  lastName: player.lastName,
  clubName: player.clubName,
  position: player.position,
  age: player.age,
  heightCm: player.heightCm,
  weightKg: player.weightKg,
  preferredFoot: player.preferredFoot,
  attackPower: player.attackPower,
  defenseStrength: player.defenseStrength,
  midfieldControl: player.midfieldControl,
  isInjured: player.isInjured,
  injuryDays: player.injuryDays,
  seasonGoals: player.seasonGoals,
  seasonAssists: player.seasonAssists,
  seasonYellowCards: player.seasonYellowCards,
  seasonRedCards: player.seasonRedCards,
  marketValue: player.marketValue,
  wage: player.wage,
});

export const AdminPlayerInstancesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clubFilter, setClubFilter] = useState<string | "all">("all");
  const [positionFilter, setPositionFilter] = useState<PlayerPositionFilter>("all");
  const [statusFilter, setStatusFilter] = useState<PlayerStatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PlayerInstancePanelTab>("assign");
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [assignValues, setAssignValues] = useState<AssignFromBaseFormValues>(
    emptyAssignValues(),
  );
  const [customValues, setCustomValues] = useState<CustomPlayerFormValues>(
    emptyCustomValues(),
  );
  const [editValues, setEditValues] = useState<EditPlayerFormValues>(emptyEditValues());

  const { data: playersData, isLoading: isPlayersLoading } = useGetPlayerInstancesQuery({
    currentPage: 1,
    pageSize: 500,
  });
  const { data: clubsData, isLoading: isClubsLoading } = useGetClubsQuery({
    currentPage: 1,
    pageSize: 500,
  });
  const { data: basePlayersData, isLoading: isBasePlayersLoading } = useGetBasePlayersQuery({
    currentPage: 1,
    pageSize: 500,
  });

  const [assignFromBase, { isLoading: isAssigning }] =
    useCreatePlayerInstanceFromBasePlayerMutation();
  const [createCustom, { isLoading: isCreatingCustom }] =
    useCreateCustomPlayerInstanceMutation();
  const [updateName, { isLoading: isUpdatingName }] =
    useUpdatePlayerInstanceNameMutation();
  const [updateStats, { isLoading: isUpdatingStats }] =
    useUpdatePlayerInstanceStatsMutation();
  const [updateHealth, { isLoading: isUpdatingHealth }] =
    useUpdatePlayerInstanceHealthMutation();
  const [updateSeasonStats, { isLoading: isUpdatingSeason }] =
    useUpdatePlayerInstanceSeasonStatsMutation();
  const [deletePlayer] = useDeletePlayerInstanceMutation();

  const players = playersData?.items ?? [];
  const clubs = clubsData?.items ?? [];
  const basePlayers = basePlayersData?.items ?? [];

  const filteredPlayers = useMemo(
    () =>
      filterAdminPlayerInstances(
        players,
        searchQuery,
        clubFilter,
        positionFilter,
        statusFilter,
      ),
    [players, searchQuery, clubFilter, positionFilter, statusFilter],
  );

  const paginatedPlayers = useMemo(
    () => paginateItems(filteredPlayers, currentPage, PAGE_SIZE),
    [filteredPlayers, currentPage],
  );

  const editingPlayer = useMemo(
    () => players.find((player) => player.id === editingPlayerId),
    [players, editingPlayerId],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, clubFilter, positionFilter, statusFilter]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredPlayers.length / PAGE_SIZE));

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, filteredPlayers.length]);

  const isLoading = isPlayersLoading || isClubsLoading || isBasePlayersLoading;
  const isSubmitting =
    isAssigning ||
    isCreatingCustom ||
    isUpdatingName ||
    isUpdatingStats ||
    isUpdatingHealth ||
    isUpdatingSeason;

  const openAssignPanel = () => {
    setActiveTab("assign");
    setEditingPlayerId(null);
    setAssignValues(emptyAssignValues(clubs[0]?.id ?? ""));
    setIsPanelOpen(true);
  };

  const openCustomPanel = () => {
    setActiveTab("custom");
    setEditingPlayerId(null);
    setCustomValues(emptyCustomValues(clubs[0]?.id ?? ""));
    setIsPanelOpen(true);
  };

  const openEditPanel = (playerId: string) => {
    const player = players.find((item) => item.id === playerId);

    if (!player) {
      return;
    }

    setActiveTab("edit");
    setEditingPlayerId(playerId);
    setEditValues(toEditValues(player));
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setEditingPlayerId(null);
  };

  const handleSubmit = async () => {
    if (activeTab === "assign") {
      if (!assignValues.clubId || !assignValues.basePlayerId) {
        return;
      }

      await assignFromBase({
        clubId: assignValues.clubId,
        basePlayerId: assignValues.basePlayerId,
        marketValue: assignValues.marketValue,
        wage: assignValues.wage,
      }).unwrap();

      setAssignValues(emptyAssignValues(assignValues.clubId));
      return;
    }

    if (activeTab === "custom") {
      if (!customValues.clubId || !customValues.firstName.trim() || !customValues.lastName.trim()) {
        return;
      }

      await createCustom({
        clubId: customValues.clubId,
        firstName: customValues.firstName.trim(),
        lastName: customValues.lastName.trim(),
        nationality: customValues.nationality.trim() || null,
        position: customValues.position,
        age: customValues.age,
        heightCm: customValues.heightCm,
        weightKg: customValues.weightKg,
        preferredFoot: customValues.preferredFoot,
        attackPower: customValues.attackPower,
        defenseStrength: customValues.defenseStrength,
        midfieldControl: customValues.midfieldControl,
        marketValue: customValues.marketValue,
        wage: customValues.wage,
      }).unwrap();

      setCustomValues(emptyCustomValues(customValues.clubId));
      return;
    }

    if (!editingPlayer) {
      return;
    }

    if (
      editValues.firstName.trim() !== editingPlayer.firstName ||
      editValues.lastName.trim() !== editingPlayer.lastName
    ) {
      await updateName({
        id: editingPlayer.id,
        firstName: editValues.firstName.trim(),
        lastName: editValues.lastName.trim(),
      }).unwrap();
    }

    if (
      editValues.isInjured !== editingPlayer.isInjured ||
      editValues.injuryDays !== editingPlayer.injuryDays
    ) {
      await updateHealth({
        id: editingPlayer.id,
        isInjured: editValues.isInjured,
        injuryDays: editValues.isInjured ? editValues.injuryDays : 0,
      }).unwrap();
    }

    if (
      editValues.seasonGoals !== editingPlayer.seasonGoals ||
      editValues.seasonAssists !== editingPlayer.seasonAssists ||
      editValues.seasonYellowCards !== editingPlayer.seasonYellowCards ||
      editValues.seasonRedCards !== editingPlayer.seasonRedCards
    ) {
      await updateSeasonStats({
        id: editingPlayer.id,
        seasonGoals: editValues.seasonGoals,
        seasonAssists: editValues.seasonAssists,
        seasonYellowCards: editValues.seasonYellowCards,
        seasonRedCards: editValues.seasonRedCards,
      }).unwrap();
    }

    if (
      editValues.position !== editingPlayer.position ||
      editValues.age !== editingPlayer.age ||
      editValues.heightCm !== editingPlayer.heightCm ||
      editValues.weightKg !== editingPlayer.weightKg ||
      editValues.preferredFoot !== editingPlayer.preferredFoot ||
      editValues.attackPower !== editingPlayer.attackPower ||
      editValues.defenseStrength !== editingPlayer.defenseStrength ||
      editValues.midfieldControl !== editingPlayer.midfieldControl ||
      editValues.marketValue !== editingPlayer.marketValue ||
      editValues.wage !== editingPlayer.wage
    ) {
      await updateStats({
        id: editingPlayer.id,
        position: editValues.position,
        age: editValues.age,
        heightCm: editValues.heightCm,
        weightKg: editValues.weightKg,
        preferredFoot: editValues.preferredFoot,
        attackPower: editValues.attackPower,
        defenseStrength: editValues.defenseStrength,
        midfieldControl: editValues.midfieldControl,
        marketValue: editValues.marketValue,
        wage: editValues.wage,
      }).unwrap();
    }
  };

  const handleDelete = async (playerId: string) => {
    const player = players.find((item) => item.id === playerId);

    if (!player) {
      return;
    }

    const confirmed = window.confirm(
      `Delete player "${player.firstName} ${player.lastName}"?`,
    );

    if (!confirmed) {
      return;
    }

    await deletePlayer(playerId).unwrap();

    if (editingPlayerId === playerId) {
      closePanel();
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Player instances loading...
      </div>
    );
  }

  return (
    <div className="-m-container-padding flex h-[calc(100vh-4rem)] overflow-hidden">
      <div className="min-w-0 flex-1 overflow-y-auto p-container-padding">
        <div className="mx-auto flex max-w-7xl flex-col gap-gutter">
          <div className="mb-2 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-headline-md font-bold text-on-surface">Player Instances</h2>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Live squad players assigned to clubs within the ecosystem.
              </p>
            </div>
            <div className="flex w-full items-center gap-3 md:w-auto">
              <button
                type="button"
                onClick={openCustomPanel}
                className="flex items-center gap-2 rounded border border-outline-variant bg-transparent px-4 py-2 text-label-caps text-on-surface transition-colors hover:bg-surface-variant"
              >
                <MaterialIcon name="person_add" className="text-sm" />
                Create Custom Player
              </button>
              <button
                type="button"
                onClick={openAssignPanel}
                className="flex items-center gap-2 rounded bg-primary-container px-4 py-2 text-label-caps font-bold text-on-primary-container shadow-sm transition-colors hover:bg-primary"
              >
                <MaterialIcon name="library_add" className="text-sm" />
                Assign From Base
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded border border-outline-variant bg-surface-container-low p-3">
            <div className="relative min-w-[200px] flex-1">
              <MaterialIcon
                name="search"
                className="absolute top-1/2 left-3 -translate-y-1/2 text-on-surface-variant"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search players..."
                className="h-10 w-full rounded border border-outline-variant bg-background py-2 pr-3 pl-10 text-body-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={clubFilter}
                onChange={(event) =>
                  setClubFilter(event.target.value === "all" ? "all" : event.target.value)
                }
                className="h-10 min-w-[150px] rounded border border-outline-variant bg-background px-3 text-body-sm text-on-surface"
              >
                <option value="all">All Clubs</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))}
              </select>
              <select
                value={positionFilter === "all" ? "all" : String(positionFilter)}
                onChange={(event) =>
                  setPositionFilter(
                    event.target.value === "all"
                      ? "all"
                      : (Number(event.target.value) as PlayerPosition),
                  )
                }
                className="h-10 min-w-[120px] rounded border border-outline-variant bg-background px-3 text-body-sm text-on-surface"
              >
                <option value="all">Position</option>
                <option value={PlayerPosition.Goalkeeper}>Goalkeeper (GK)</option>
                <option value={PlayerPosition.Defender}>Defender (DEF)</option>
                <option value={PlayerPosition.Midfielder}>Midfielder (MID)</option>
                <option value={PlayerPosition.Forward}>Forward (FWD)</option>
              </select>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as PlayerStatusFilter)
                }
                className="h-10 min-w-[120px] rounded border border-outline-variant bg-background px-3 text-body-sm text-on-surface"
              >
                <option value="all">Status</option>
                <option value="available">Available</option>
                <option value="injured">Injured</option>
              </select>
            </div>
          </div>

          <AdminPlayerInstancesTable
            players={paginatedPlayers}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            totalCount={filteredPlayers.length}
            onPageChange={setCurrentPage}
            onFilterByClub={(clubId) => setClubFilter(clubId)}
            onEdit={openEditPanel}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {isPanelOpen && (
        <AdminPlayerInstanceFormPanel
          activeTab={activeTab}
          isOpen={isPanelOpen}
          isSubmitting={isSubmitting}
          hasEditingPlayer={editingPlayerId !== null}
          clubs={clubs}
          basePlayers={basePlayers}
          assignValues={assignValues}
          customValues={customValues}
          editValues={editValues}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab !== "edit") {
              setEditingPlayerId(null);
            }
          }}
          onAssignChange={setAssignValues}
          onCustomChange={setCustomValues}
          onEditChange={setEditValues}
          onClose={closePanel}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
