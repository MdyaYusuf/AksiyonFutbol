import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { getNationalityFlagSrc } from "../../../core/utils/nationalityFlags";
import {
  formatSquadMoney,
  getPlayerDisplayName,
  getPositionBadgeClassName,
  getPositionLabel,
  getPreferredFootLabel,
  getPreferredFootShortLabel,
} from "../../playerInstances/utils/squadHelpers";
import {
  DRAFT_TIER_LABELS,
  getDraftTierBadgeClassName,
} from "../../transfers/utils/freeAgentHelpers";
import {
  formatTransferWage,
  getRatingBadgeClassName,
} from "../../transfers/utils/transferMarketHelpers";
import type { ClubDraftState, DraftCatalogPlayer } from "../clubDraftTypes";
import { getPickBlockReason } from "../utils/draftBoardHelpers";

interface DraftCatalogRowProps {
  player: DraftCatalogPlayer;
  draft: ClubDraftState;
  isBusy: boolean;
  onPick: (basePlayerId: string) => void;
  onRemove: (basePlayerId: string) => void;
}

export const DraftCatalogRow = ({
  player,
  draft,
  isBusy,
  onPick,
  onRemove,
}: DraftCatalogRowProps) => {
  const displayName = getPlayerDisplayName(
    player.defaultFirstName,
    player.defaultLastName,
  );
  const blockReason = getPickBlockReason(player, draft);
  const flagSrc = getNationalityFlagSrc(player.nationality);
  const nationalityLabel = player.nationality?.trim() || "Unknown";

  return (
    <tr className="group border-b border-surface-bright transition-colors hover:bg-surface-variant">
      <td className="min-w-0 px-2 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-highest">
            <MaterialIcon name="person" className="text-sm text-on-surface-variant" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-body-sm text-body-sm font-semibold text-on-surface transition-colors group-hover:text-primary">
              {displayName}
            </span>
            <span
              className={`mt-0.5 inline-flex w-fit items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold tracking-wider ${getDraftTierBadgeClassName(player.draftTier)}`}
            >
              {DRAFT_TIER_LABELS[player.draftTier]}
            </span>
          </div>
        </div>
      </td>
      <td className="px-2 py-2">
        {flagSrc ? (
          <img
            src={flagSrc}
            alt={nationalityLabel}
            title={nationalityLabel}
            width={33}
            height={20}
            className="h-5 w-[33px] object-contain"
          />
        ) : (
          <span
            title={nationalityLabel}
            className="inline-block h-5 w-[33px] rounded-sm bg-surface-container-highest"
          />
        )}
      </td>
      <td className="whitespace-nowrap px-2 py-2">
        <span
          className={`rounded px-2 py-1 ${getPositionBadgeClassName(player.position)}`}
        >
          {getPositionLabel(player.position)}
        </span>
      </td>
      <td className="whitespace-nowrap px-2 py-2">
        <span title={getPreferredFootLabel(player.preferredFoot)}>
          {getPreferredFootShortLabel(player.preferredFoot)}
        </span>
      </td>
      <td className="whitespace-nowrap px-2 py-2">{player.age}</td>
      <td className="whitespace-nowrap px-2 py-2">{player.heightCm}cm</td>
      <td className="whitespace-nowrap px-2 py-2">{player.weightKg}kg</td>
      <td className="px-2 py-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded border font-bold ${getRatingBadgeClassName(player.overallRating)}`}
        >
          {player.overallRating}
        </div>
      </td>
      <td className="whitespace-nowrap px-2 py-2">{formatSquadMoney(player.draftFee)}</td>
      <td className="whitespace-nowrap px-2 py-2">{formatTransferWage(player.wage)}</td>
      <td className="py-2 pr-4 pl-2 text-center">
        {player.isPickedByMe ? (
          <button
            type="button"
            onClick={() => onRemove(player.id)}
            disabled={isBusy}
            className="whitespace-nowrap rounded border border-outline-variant px-3 py-1.5 font-label-caps text-label-caps text-on-surface transition-colors hover:border-error hover:text-error disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? "Removing..." : "Remove"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onPick(player.id)}
            disabled={isBusy || Boolean(blockReason)}
            title={blockReason}
            className="whitespace-nowrap rounded bg-primary px-3 py-1.5 font-label-caps text-label-caps text-on-primary transition-colors hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? "Picking..." : "Pick"}
          </button>
        )}
      </td>
    </tr>
  );
};
