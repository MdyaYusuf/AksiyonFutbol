import type { ClubDraftState, DraftCatalogPlayer } from "../clubDraftTypes";
import type {
  DraftCatalogSort,
  DraftCatalogSortColumn,
} from "../utils/draftBoardHelpers";
import { DraftCatalogRow } from "./DraftCatalogRow";

interface DraftCatalogTableProps {
  players: DraftCatalogPlayer[];
  draft: ClubDraftState;
  sort: DraftCatalogSort;
  busyPlayerId: string | null;
  onSortChange: (column: DraftCatalogSortColumn) => void;
  onPick: (basePlayerId: string) => void;
  onRemove: (basePlayerId: string) => void;
}

interface SortableHeaderProps {
  label: string;
  column: DraftCatalogSortColumn;
  sort: DraftCatalogSort;
  title?: string;
  onSortChange: (column: DraftCatalogSortColumn) => void;
}

const SortableHeader = ({
  label,
  column,
  sort,
  title,
  onSortChange,
}: SortableHeaderProps) => {
  const isActive = sort.column === column;
  let ariaSort: "ascending" | "descending" | "none" = "none";
  let arrowPath = "M5 8.2 L1.4 2.2 H8.6 Z";

  if (isActive) {
    if (sort.direction === "asc") {
      ariaSort = "ascending";
      arrowPath = "M5 1.8 L8.6 7.8 H1.4 Z";
    } else {
      ariaSort = "descending";
    }
  }

  return (
    <th className="px-2 py-3 font-normal" aria-sort={ariaSort}>
      <button
        type="button"
        title={title}
        onClick={() => onSortChange(column)}
        className="inline-flex max-w-full items-center gap-0.5 text-label-caps text-on-surface-variant transition-colors hover:text-on-surface"
      >
        {label}
        <svg
          viewBox="0 0 10 10"
          className={`h-2.5 w-2.5 shrink-0 ${isActive ? "text-primary" : "invisible"}`}
          aria-hidden="true"
        >
          <path fill="currentColor" d={arrowPath} />
        </svg>
      </button>
    </th>
  );
};

export const DraftCatalogTable = ({
  players,
  draft,
  sort,
  busyPlayerId,
  onSortChange,
  onPick,
  onRemove,
}: DraftCatalogTableProps) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[19%]" />
            <col className="w-[6%]" />
            <col className="w-[7%]" />
            <col className="w-[6%]" />
            <col className="w-[6%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[7%]" />
            <col className="w-[9%]" />
            <col className="w-[10%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-high font-label-caps text-label-caps text-on-surface-variant">
              <SortableHeader
                label="Player"
                column="player"
                sort={sort}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Nat"
                column="nationality"
                sort={sort}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Pos"
                column="position"
                sort={sort}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Foot"
                column="foot"
                title="Preferred foot"
                sort={sort}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Age"
                column="age"
                sort={sort}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Height"
                column="height"
                sort={sort}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Weight"
                column="weight"
                sort={sort}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="OVR"
                column="overall"
                sort={sort}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Fee"
                column="fee"
                sort={sort}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="Wage"
                column="wage"
                sort={sort}
                onSortChange={onSortChange}
              />
              <th className="py-3 pr-4 pl-2 text-center font-normal">Action</th>
            </tr>
          </thead>
          <tbody className="font-data-mono text-data-mono text-on-surface">
            {players.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-12 text-center font-body-sm text-body-sm text-on-surface-variant"
                >
                  No players match your filters.
                </td>
              </tr>
            ) : (
              players.map((player) => (
                <DraftCatalogRow
                  key={player.id}
                  player={player}
                  draft={draft}
                  isBusy={busyPlayerId === player.id}
                  onPick={onPick}
                  onRemove={onRemove}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
