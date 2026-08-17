import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import {
  formatSquadMoney,
  getPlayerDisplayName,
  getPositionLabel,
} from "../../playerInstances/utils/squadHelpers";
import {
  DRAFT_TIER_LABELS,
  getDraftTierBadgeClassName,
} from "../../transfers/utils/freeAgentHelpers";
import type { ClubDraftState } from "../clubDraftTypes";
import {
  getRequiredPickCount,
  getSelectedPickCount,
} from "../utils/draftBoardHelpers";

interface DraftPicksPanelProps {
  draft: ClubDraftState;
  isFinalizing: boolean;
  onRemove: (basePlayerId: string) => void;
  onFinalize: () => void;
}

export const DraftPicksPanel = ({
  draft,
  isFinalizing,
  onRemove,
  onFinalize,
}: DraftPicksPanelProps) => {
  const selected = getSelectedPickCount(draft);
  const required = getRequiredPickCount(draft);
  const orderedPicks = [...draft.picks].sort(
    (left, right) => left.pickOrder - right.pickOrder,
  );

  return (
    <aside className="flex flex-col gap-4 rounded-xl border border-outline-variant bg-surface-container/60 p-4 lg:sticky lg:top-20">
      <div>
        <h2 className="text-headline-sm text-on-surface">Your Picks</h2>
        <p className="text-body-sm text-on-surface-variant">
          {selected}/{required} selected
        </p>
      </div>

      <ul className="flex max-h-[420px] flex-col gap-2 overflow-y-auto">
        {orderedPicks.length === 0 ? (
          <li className="rounded-lg border border-dashed border-outline-variant px-3 py-6 text-center text-body-sm text-on-surface-variant">
            Pick players from the catalog to fill 2 GK, 5 DEF, 5 MID, and 4 FWD.
          </li>
        ) : (
          orderedPicks.map((pick) => (
            <li
              key={pick.basePlayerId}
              className="flex items-center justify-between gap-2 rounded-lg border border-outline-variant bg-surface-container-high px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-body-sm font-semibold text-on-surface">
                  {getPlayerDisplayName(pick.defaultFirstName, pick.defaultLastName)}
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  {getPositionLabel(pick.position)} · {pick.overallRating} ·{" "}
                  {formatSquadMoney(pick.draftFee)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold tracking-wider ${getDraftTierBadgeClassName(pick.draftTier)}`}
                >
                  {DRAFT_TIER_LABELS[pick.draftTier]}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(pick.basePlayerId)}
                  disabled={isFinalizing}
                  className="rounded p-1 text-on-surface-variant transition-colors hover:text-error disabled:opacity-50"
                  aria-label="Remove pick"
                >
                  <MaterialIcon name="close" className="text-sm" />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <button
        type="button"
        onClick={onFinalize}
        disabled={!draft.canFinalize || isFinalizing}
        className="flex items-center justify-center gap-2 rounded bg-primary px-4 py-3 text-headline-sm text-on-primary shadow-lg transition-all hover:bg-primary-fixed-dim disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isFinalizing ? "Finalizing..." : "Finalize Draft"}
        <MaterialIcon name="arrow_forward" filled />
      </button>

      {!draft.canFinalize ? (
        <p className="text-center text-body-sm text-on-surface-variant">
          Fill every position quota without going over cash or wages to enter the tutorial.
        </p>
      ) : null}
    </aside>
  );
};
