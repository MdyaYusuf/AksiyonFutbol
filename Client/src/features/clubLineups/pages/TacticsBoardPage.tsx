import { useEffect, useMemo, useState } from "react";
import { PlayerPosition } from "../../basePlayers/basePlayerTypes";
import { useGetCurrentUserClubPlayersQuery } from "../../playerInstances/playerInstancesApiSlice";
import type { PlayerInstanceResponse } from "../../playerInstances/playerInstanceTypes";
import { TacticsAvailableSquad } from "../components/TacticsAvailableSquad";
import { TacticsBench } from "../components/TacticsBench";
import { TacticsControls } from "../components/TacticsControls";
import { TacticsPitch } from "../components/TacticsPitch";
import {
  useGetMyClubLineupQuery,
  useUpsertMyClubLineupMutation,
} from "../clubLineupsApiSlice";
import { TeamFormation, TeamMentality } from "../clubLineupTypes";
import {
  createEmptyBenchSlots,
  createEmptyStarterSlots,
  LINEUP_STARTER_COUNT,
  lineupToSlots,
  redistributeByFormation,
} from "../utils/tacticsHelpers";

type SlotSelection =
  | { kind: "starter"; index: number }
  | { kind: "bench"; index: number }
  | null;

export const TacticsBoardPage = () => {
  const { data: squad = [], isLoading: isSquadLoading } =
    useGetCurrentUserClubPlayersQuery();
  const { data: lineup, isLoading: isLineupLoading } = useGetMyClubLineupQuery();
  const [upsertLineup, { isLoading: isSaving }] = useUpsertMyClubLineupMutation();

  const [formation, setFormation] = useState<TeamFormation>(TeamFormation.FourThreeThree);
  const [mentality, setMentality] = useState<TeamMentality>(TeamMentality.Balanced);
  const [starterIds, setStarterIds] = useState<(string | null)[]>(createEmptyStarterSlots);
  const [benchIds, setBenchIds] = useState<(string | null)[]>(createEmptyBenchSlots);
  const [selection, setSelection] = useState<SlotSelection>(null);
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
    setSelection(null);
    setBaselineKey(
      JSON.stringify({
        formation: lineup.formation,
        mentality: lineup.mentality,
        starters: slots.starters,
        bench: slots.bench,
      }),
    );
  }, [lineup, squad, playersById]);

  const usedIds = useMemo(() => {
    const ids = new Set<string>();
    starterIds.forEach((id) => {
      if (id) {
        ids.add(id);
      }
    });
    benchIds.forEach((id) => {
      if (id) {
        ids.add(id);
      }
    });
    return ids;
  }, [starterIds, benchIds]);

  const availablePlayers = useMemo(
    () => squad.filter((player) => !usedIds.has(player.id)),
    [squad, usedIds],
  );

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

  const clearPlayerFromSlots = (playerId: string) => {
    setStarterIds((current) => current.map((id) => (id === playerId ? null : id)));
    setBenchIds((current) => current.map((id) => (id === playerId ? null : id)));
  };

  const assignToStarter = (index: number, playerId: string) => {
    const player = playersById.get(playerId);
    if (!player || player.isInjured) {
      return;
    }

    clearPlayerFromSlots(playerId);
    setStarterIds((current) => {
      const next = [...current];
      next[index] = playerId;
      return next;
    });
    setSelection(null);
  };

  const assignToBench = (index: number, playerId: string) => {
    clearPlayerFromSlots(playerId);
    setBenchIds((current) => {
      const next = [...current];
      next[index] = playerId;
      return next;
    });
    setSelection(null);
  };

  const handleStarterSlotClick = (index: number) => {
    const currentId = starterIds[index];

    if (selection?.kind === "starter" && selection.index === index) {
      if (currentId) {
        setStarterIds((prev) => {
          const next = [...prev];
          next[index] = null;
          return next;
        });
      }
      setSelection(null);
      return;
    }

    if (selection?.kind === "bench") {
      const benchPlayerId = benchIds[selection.index];
      if (benchPlayerId) {
        const starterPlayerId = currentId;
        setBenchIds((prev) => {
          const next = [...prev];
          next[selection.index] = starterPlayerId;
          return next;
        });
        setStarterIds((prev) => {
          const next = [...prev];
          next[index] = benchPlayerId;
          return next;
        });
        setSelection(null);
        return;
      }
    }

    setSelection({ kind: "starter", index });
  };

  const handleBenchSlotClick = (index: number) => {
    const currentId = benchIds[index];

    if (selection?.kind === "bench" && selection.index === index) {
      if (currentId) {
        setBenchIds((prev) => {
          const next = [...prev];
          next[index] = null;
          return next;
        });
      }
      setSelection(null);
      return;
    }

    if (selection?.kind === "starter") {
      const starterPlayerId = starterIds[selection.index];
      if (starterPlayerId) {
        const benchPlayerId = currentId;
        setStarterIds((prev) => {
          const next = [...prev];
          next[selection.index] = benchPlayerId;
          return next;
        });
        setBenchIds((prev) => {
          const next = [...prev];
          next[index] = starterPlayerId;
          return next;
        });
        setSelection(null);
        return;
      }
    }

    setSelection({ kind: "bench", index });
  };

  const handleAvailablePlayerClick = (playerId: string) => {
    const player = playersById.get(playerId);
    if (!player) {
      return;
    }

    if (selection?.kind === "starter") {
      if (player.isInjured) {
        return;
      }

      assignToStarter(selection.index, playerId);
      return;
    }

    if (selection?.kind === "bench") {
      assignToBench(selection.index, playerId);
      return;
    }

    if (!player.isInjured) {
      const emptyStarter = starterIds.findIndex((id) => id == null);
      if (emptyStarter >= 0) {
        assignToStarter(emptyStarter, playerId);
        return;
      }
    }

    const emptyBench = benchIds.findIndex((id) => id == null);
    if (emptyBench >= 0) {
      assignToBench(emptyBench, playerId);
    }
  };

  const handleFormationChange = (nextFormation: TeamFormation) => {
    const currentPlayers = starterIds.filter((id): id is string => Boolean(id));
    setFormation(nextFormation);
    setStarterIds(redistributeByFormation(currentPlayers, nextFormation, playersById));
    setSelection(null);
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
    setSelection(null);
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
      setSelection(null);
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
            selectedIndex={selection?.kind === "starter" ? selection.index : null}
            onSlotClick={handleStarterSlotClick}
          />
          <TacticsBench
            slotIds={benchIds}
            playersById={playersById}
            selectedIndex={selection?.kind === "bench" ? selection.index : null}
            onSlotClick={handleBenchSlotClick}
          />
        </div>

        <TacticsAvailableSquad
          players={availablePlayers}
          onPlayerClick={handleAvailablePlayerClick}
          onSave={handleSave}
          isSaving={isSaving}
          canSave={canSave}
        />
      </div>
    </div>
  );
};
