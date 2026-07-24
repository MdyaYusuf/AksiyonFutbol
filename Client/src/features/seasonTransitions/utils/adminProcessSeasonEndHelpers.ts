import type {
  SeasonClubMovement,
  SeasonDivisionPreview,
  SeasonEndPreview,
} from "../seasonTransitionTypes";
import { SeasonMovementOutcome } from "../seasonTransitionTypes";

export type AdminMovementKind = "champion" | "promoted" | "relegated" | "stayed";

export interface AdminProjectedMovementRow {
  kind: AdminMovementKind;
  clubId: string;
  clubName: string;
  points: number;
  position: number;
  newDivisionLabel: string;
}

export const getSelectedDivisionPreview = (
  preview: SeasonEndPreview,
  divisionId: number,
): SeasonDivisionPreview | undefined => {
  return preview.divisions.find((division) => division.divisionId === divisionId);
};

export const buildAdminProjectedRows = (
  preview: SeasonEndPreview,
  divisionId: number,
  showAll: boolean,
): AdminProjectedMovementRow[] => {
  const division = getSelectedDivisionPreview(preview, divisionId);

  if (!division) {
    return [];
  }

  const incomingPromoted = preview.movements.filter(
    (movement) =>
      movement.outcome === SeasonMovementOutcome.Promoted &&
      movement.toDivisionId === divisionId,
  );

  const outgoingRelegated = preview.movements.filter(
    (movement) =>
      movement.outcome === SeasonMovementOutcome.Relegated &&
      movement.fromDivisionId === divisionId,
  );

  const championStanding = division.standings[0];
  const championIsRelegated =
    !!championStanding &&
    outgoingRelegated.some((movement) => movement.clubId === championStanding.clubId);

  const rows: AdminProjectedMovementRow[] = [];

  if (championStanding && !championIsRelegated) {
    rows.push({
      kind: "champion",
      clubId: championStanding.clubId,
      clubName: championStanding.clubName,
      points: championStanding.points,
      position: championStanding.position,
      newDivisionLabel: "—",
    });
  }

  for (const movement of incomingPromoted) {
    rows.push(toProjectedRow(movement, "promoted"));
  }

  for (const movement of outgoingRelegated) {
    rows.push(toProjectedRow(movement, "relegated"));
  }

  if (!showAll) {
    return rows;
  }

  const highlightedIds = new Set(rows.map((row) => row.clubId));
  const stayed = preview.movements.filter(
    (movement) =>
      movement.outcome === SeasonMovementOutcome.Stayed &&
      movement.fromDivisionId === divisionId &&
      !highlightedIds.has(movement.clubId),
  );

  for (const movement of stayed) {
    rows.push(toProjectedRow(movement, "stayed"));
  }

  return rows.sort((left, right) => left.position - right.position);
};

export const getPreflightChecks = (
  preview: SeasonEndPreview | undefined,
  selectedDivision: SeasonDivisionPreview | undefined,
): {
  fixtures: { ok: boolean; label: string };
  dataSync: { ok: boolean; label: string };
  backup: { ok: boolean; label: string };
} => {
  if (!preview || !selectedDivision) {
    return {
      fixtures: { ok: false, label: "Unavailable" },
      dataSync: { ok: false, label: "Unavailable" },
      backup: { ok: false, label: "Not configured" },
    };
  }

  const allComplete = preview.divisions.every((division) => division.isSeasonComplete);

  return {
    fixtures: {
      ok: allComplete,
      label: allComplete ? "100% Completed" : "Incomplete",
    },
    dataSync: {
      ok: true,
      label: "Verified",
    },
    backup: {
      ok: false,
      label: "Not configured",
    },
  };
};

const toProjectedRow = (
  movement: SeasonClubMovement,
  kind: AdminMovementKind,
): AdminProjectedMovementRow => {
  let newDivisionLabel = "—";

  if (kind === "promoted" || kind === "relegated") {
    newDivisionLabel = movement.toDivisionName ?? "—";
  }

  return {
    kind,
    clubId: movement.clubId,
    clubName: movement.clubName,
    points: movement.points,
    position: movement.position,
    newDivisionLabel,
  };
};
