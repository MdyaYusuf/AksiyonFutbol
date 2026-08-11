import { useEffect, useMemo, useState } from "react";
import { PlayerPosition } from "../../basePlayers/basePlayerTypes";
import { useGetCurrentUserClubPlayersQuery } from "../../playerInstances/playerInstancesApiSlice";
import type { PlayerInstanceResponse } from "../../playerInstances/playerInstanceTypes";
import { getPositionLabel } from "../../playerInstances/utils/squadHelpers";
import { TacticsBench } from "../components/TacticsBench";
import { TacticsControls } from "../components/TacticsControls";
import { TacticsPitch } from "../components/TacticsPitch";
import { TacticsSlotPicker } from "../components/TacticsSlotPicker";
import {
  useGetMyClubLineupQuery,
  useUpsertMyClubLineupMutation,
} from "../clubLineupsApiSlice";
import { TeamFormation, TeamMentality } from "../clubLineupTypes";
import {
  createEmptyBenchSlots,
  createEmptyStarterSlots,
  getBenchCandidates,
  getSlotCandidates,
  getStarterSlotPosition,
  LINEUP_STARTER_COUNT,
  lineupToSlots,
  redistributeByFormation,
} from "../utils/tacticsHelpers";

interface SlotPickerState {
  kind: "starter" | "bench";
  slotIndex: number;
  anchor: DOMRect;
}

export const TacticsBoardPage = () => {
  const { data: squad = [], isLoading: isSquadLoading } =
    useGetCurrentUserClubPlayersQuery();
  const { data: lineup, isLoading: isLineupLoading } = useGetMyClubLineupQuery();
  const [upsertLineup, { isLoading: isSaving }] = useUpsertMyClubLineupMutation();

  const [formation, setFormation] = useState<TeamFormation>(TeamFormation.FourThreeThree);
  const [mentality, setMentality] = useState<TeamMentality>(TeamMentality.Balanced);
  const [starterIds, setStarterIds] = useState<(string | null)[]>(createEmptyStarterSlots);
  const [benchIds, setBenchIds] = useState<(string | null)[]>(createEmptyBenchSlots);
  const [picker, setPicker] = useState<SlotPickerState | null>(null);
  const [baselineKey, setBaselineKey] = useState("");

  const playersById = useMemo(() => {
    const map = new Map<string, PlayerInstanceResponse>();
    squad.forEach((player) => map.set(player.id, player));
    return map;
  }, [squad]);

  useEffect(() => {
    if (!lineup || squad.length === 0) {
      return;
    }

    const slots = lineupToSlots(lineup, playersById);
    setFormation(lineup.formation);
    setMentality(lineup.mentality);
    setStarterIds(slots.starters);
    setBenchIds(slots.bench);
    setPicker(null);
    setBaselineKey(
      JSON.stringify({
        formation: lineup.formation,
        mentality: lineup.mentality,
        starters: slots.starters,
        bench: slots.bench,
      }),
    );
  }, [lineup, squad, playersById]);

  const filledStarterCount = starterIds.filter(Boolean).length;
  const hasGoalkeeper = starterIds.some((id) => {
    if (!id) {
      return false;
    }

    return playersById.get(id)?.position === PlayerPosition.Goalkeeper;
  });
  const hasInjuredStarter = starterIds.some((id) => {
    if (!id) {
      return false;
    }

    return playersById.get(id)?.isInjured === true;
  });

  const canSave =
    filledStarterCount === LINEUP_STARTER_COUNT &&
    hasGoalkeeper &&
    !hasInjuredStarter &&
    !isSaving;

  const currentKey = JSON.stringify({
    formation,
    mentality,
    starters: starterIds,
    bench: benchIds,
  });
  const isDirty = currentKey !== baselineKey;

  const pickerCandidates = useMemo(() => {
    if (!picker) {
      return [];
    }

    if (picker.kind === "bench") {
      return getBenchCandidates(picker.slotIndex, starterIds, benchIds, squad);
    }

    return getSlotCandidates(
      formation,
      picker.slotIndex,
      starterIds,
      benchIds,
      squad,
    );
  }, [picker, formation, starterIds, benchIds, squad]);

  const movePlayerToStarter = (playerId: string, targetIndex: number) => {
    const player = playersById.get(playerId);
    if (!player || player.isInjured) {
      return;
    }

    const occupantId = starterIds[targetIndex] ?? null;
    if (occupantId === playerId) {
      return;
    }

    const fromStarter = starterIds.findIndex((id) => id === playerId);
    const fromBench = benchIds.findIndex((id) => id === playerId);
    const nextStarters = [...starterIds];
    const nextBench = [...benchIds];

    nextStarters[targetIndex] = playerId;

    if (fromStarter >= 0) {
      nextStarters[fromStarter] = occupantId;
    } else if (fromBench >= 0) {
      nextBench[fromBench] = occupantId;
    } else if (occupantId) {
      const emptyBench = nextBench.findIndex((id) => id == null);
      if (emptyBench >= 0) {
        nextBench[emptyBench] = occupantId;
      }
    }

    setStarterIds(nextStarters);
    setBenchIds(nextBench);
    setPicker(null);
  };

  const movePlayerToBench = (playerId: string, targetIndex: number) => {
    const occupantId = benchIds[targetIndex] ?? null;
    if (occupantId === playerId) {
      return;
    }

    const occupant = occupantId ? playersById.get(occupantId) : undefined;
    const fromStarter = starterIds.findIndex((id) => id === playerId);
    const fromBench = benchIds.findIndex((id) => id === playerId);

    if (fromStarter >= 0 && occupant?.isInjured) {
      return;
    }

    const nextStarters = [...starterIds];
    const nextBench = [...benchIds];

    nextBench[targetIndex] = playerId;

    if (fromStarter >= 0) {
      nextStarters[fromStarter] = occupantId;
    } else if (fromBench >= 0) {
      nextBench[fromBench] = occupantId;
    }

    setStarterIds(nextStarters);
    setBenchIds(nextBench);
    setPicker(null);
  };

  const handleStarterSlotClick = (index: number, anchor: DOMRect) => {
    if (picker?.kind === "starter" && picker.slotIndex === index) {
      setPicker(null);
      return;
    }

    setPicker({ kind: "starter", slotIndex: index, anchor });
  };

  const handleBenchSlotClick = (index: number, anchor: DOMRect) => {
    if (picker?.kind === "bench" && picker.slotIndex === index) {
      setPicker(null);
      return;
    }

    setPicker({ kind: "bench", slotIndex: index, anchor });
  };

  const handleFormationChange = (nextFormation: TeamFormation) => {
    const currentPlayers = starterIds.filter((id): id is string => Boolean(id));
    setFormation(nextFormation);
    setStarterIds(redistributeByFormation(currentPlayers, nextFormation, playersById));
    setPicker(null);
  };

  const handleReset = () => {
    if (!lineup) {
      return;
    }

    const slots = lineupToSlots(lineup, playersById);
    setFormation(lineup.formation);
    setMentality(lineup.mentality);
    setStarterIds(slots.starters);
    setBenchIds(slots.bench);
    setPicker(null);
  };

  const handleSave = async () => {
    if (!canSave) {
      return;
    }

    const payloadStarters = starterIds.filter((id): id is string => Boolean(id));
    const payloadBench = benchIds.filter((id): id is string => Boolean(id));

    try {
      const saved = await upsertLineup({
        formation,
        mentality,
        starterPlayerIds: payloadStarters,
        benchPlayerIds: payloadBench,
      }).unwrap();

      const slots = lineupToSlots(saved, playersById);
      setFormation(saved.formation);
      setMentality(saved.mentality);
      setStarterIds(slots.starters);
      setBenchIds(slots.bench);
      setBaselineKey(
        JSON.stringify({
          formation: saved.formation,
          mentality: saved.mentality,
          starters: slots.starters,
          bench: slots.bench,
        }),
      );
      setPicker(null);
    } catch {
      /* Toasts via apiClient */
    }
  };

  if (isSquadLoading || isLineupLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Loading tactics board...
      </div>
    );
  }

  let pickerOccupantId: string | null = null;
  if (picker) {
    if (picker.kind === "starter") {
      pickerOccupantId = starterIds[picker.slotIndex] ?? null;
    } else {
      pickerOccupantId = benchIds[picker.slotIndex] ?? null;
    }
  }

  const pickerOccupant = pickerOccupantId
    ? playersById.get(pickerOccupantId)
    : undefined;

  let pickerSlotLabel = "";
  if (picker) {
    if (picker.kind === "bench") {
      pickerSlotLabel = "Bench";
    } else {
      pickerSlotLabel = getPositionLabel(
        getStarterSlotPosition(formation, picker.slotIndex),
      );
    }
  }

  let pickerEmptyMessage = "";
  if (picker?.kind === "bench") {
    pickerEmptyMessage = "There aren't any more players in the squad.";
  } else if (pickerSlotLabel) {
    pickerEmptyMessage = `No ${pickerSlotLabel.toLowerCase()} available to swap in.`;
  }

  return (
    <div className="-m-gutter flex h-[calc(100vh-64px)] flex-col overflow-hidden md:-m-container-padding">
      <div className="flex items-end justify-between border-b border-outline-variant px-container-padding py-4">
        <div>
          <h1 className="font-headline-sm text-headline-sm font-black text-primary">Tactics</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Set your preferred lineup
            {isDirty ? " · Unsaved changes" : ""}
          </p>
        </div>
        {(hasInjuredStarter || filledStarterCount < LINEUP_STARTER_COUNT || !hasGoalkeeper) && (
          <p className="max-w-sm text-right text-xs text-secondary">
            {hasInjuredStarter
              ? "Injured players cannot start."
              : !hasGoalkeeper
                ? "Include at least one goalkeeper in the XI."
                : `Select ${LINEUP_STARTER_COUNT - filledStarterCount} more starter(s).`}
          </p>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-container-padding md:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
          <TacticsControls
            formation={formation}
            mentality={mentality}
            onFormationChange={handleFormationChange}
            onMentalityChange={setMentality}
            onReset={handleReset}
          />
          <TacticsPitch
            formation={formation}
            starterIds={starterIds}
            playersById={playersById}
            selectedIndex={
              picker?.kind === "starter" ? picker.slotIndex : null
            }
            onSlotClick={handleStarterSlotClick}
            onDropOnSlot={(index, playerId) => {
              movePlayerToStarter(playerId, index);
            }}
          />
        </div>

        <TacticsBench
          slotIds={benchIds}
          playersById={playersById}
          selectedIndex={picker?.kind === "bench" ? picker.slotIndex : null}
          onSlotClick={handleBenchSlotClick}
          onDropOnSlot={(index, playerId) => {
            movePlayerToBench(playerId, index);
          }}
          onSave={handleSave}
          isSaving={isSaving}
          canSave={canSave}
        />
      </div>

      {picker ? (
        <TacticsSlotPicker
          anchor={picker.anchor}
          slotLabel={pickerSlotLabel}
          occupant={pickerOccupant}
          candidates={pickerCandidates}
          emptyMessage={pickerEmptyMessage}
          allowInjured={picker.kind === "bench"}
          onPick={(playerId) => {
            if (picker.kind === "bench") {
              movePlayerToBench(playerId, picker.slotIndex);
              return;
            }

            movePlayerToStarter(playerId, picker.slotIndex);
          }}
          onClose={() => {
            setPicker(null);
          }}
        />
      ) : null}
    </div>
  );
};
