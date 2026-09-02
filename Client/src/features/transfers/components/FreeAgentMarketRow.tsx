import { Link } from "react-router-dom";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { getNationalityFlagSrc } from "@/core/utils/nationalityFlags";
import {
  formatSquadMoney,
  getPlayerDisplayName,
  getPositionBadgeClassName,
  getPositionLabel,
  getPreferredFootLabel,
  getPreferredFootShortLabel,
} from "@/features/playerInstances/utils/squadHelpers";
import type { FreeAgentMarketItem } from "@/features/transfers/freeAgentTypes";
import {
  DRAFT_TIER_LABELS,
  getDraftTierBadgeClassName,
} from "@/features/transfers/utils/freeAgentHelpers";
import {
  formatTransferWage,
  getRatingBadgeClassName,
  parseMarketPosition,
} from "@/features/transfers/utils/transferMarketHelpers";

interface FreeAgentMarketRowProps {
  item: FreeAgentMarketItem;
  canSign: boolean;
  disabledReason?: string;
  isSigning: boolean;
  onSign: (item: FreeAgentMarketItem) => void;
}

export const FreeAgentMarketRow = ({
  item,
  canSign,
  disabledReason,
  isSigning,
  onSign,
}: FreeAgentMarketRowProps) => {
  const displayName = getPlayerDisplayName(item.firstName, item.lastName);
  const detailPath = `/app/transfers/free-agents/${item.basePlayerId}`;
  const flagSrc = getNationalityFlagSrc(item.nationality);
  const nationalityLabel = item.nationality?.trim() || "Unknown";
  const parsedPosition = parseMarketPosition(item.position);

  return (
    <tr className="group border-b border-surface-bright transition-colors hover:bg-surface-variant">
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
      <td className="min-w-0 px-2 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-highest">
            <MaterialIcon name="person" className="text-sm text-on-surface-variant" />
          </div>
          <div className="flex min-w-0 flex-col">
            <Link
              to={detailPath}
              className="truncate font-body-sm text-body-sm font-semibold text-on-surface transition-colors hover:text-primary"
            >
              {displayName}
            </Link>
            <div className="mt-0.5 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold tracking-wider ${getDraftTierBadgeClassName(item.draftTier)}`}
              >
                {DRAFT_TIER_LABELS[item.draftTier]}
              </span>
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-primary">
                FA
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-2 py-2">
        {parsedPosition != null ? (
          <span
            className={`inline-flex h-6 w-8 items-center justify-center rounded text-label-caps ${getPositionBadgeClassName(parsedPosition)}`}
          >
            {getPositionLabel(parsedPosition)}
          </span>
        ) : (
          <span className="rounded border border-outline-variant bg-surface-bright px-2 py-1 text-on-surface-variant">
            {item.position}
          </span>
        )}
      </td>
      <td className="whitespace-nowrap px-2 py-2">
        <span title={getPreferredFootLabel(item.preferredFoot)}>
          {getPreferredFootShortLabel(item.preferredFoot)}
        </span>
      </td>
      <td className="whitespace-nowrap px-2 py-2">{item.age}</td>
      <td className="whitespace-nowrap px-2 py-2">{item.heightCm}cm</td>
      <td className="whitespace-nowrap px-2 py-2">{item.weightKg}kg</td>
      <td className="px-2 py-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded border font-bold ${getRatingBadgeClassName(item.overallRating)}`}
        >
          {item.overallRating}
        </div>
      </td>
      <td className="whitespace-nowrap px-2 py-2">{formatSquadMoney(item.signingFee)}</td>
      <td className="whitespace-nowrap px-2 py-2">{formatTransferWage(item.wage)}</td>
      <td className="py-2 pr-4 pl-2 text-right">
        {canSign ? (
          <button
            type="button"
            onClick={() => onSign(item)}
            disabled={isSigning}
            className="whitespace-nowrap rounded bg-primary px-3 py-1.5 font-label-caps text-label-caps text-on-primary transition-colors hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigning ? "Signing..." : "Sign Player"}
          </button>
        ) : (
          <button
            type="button"
            disabled
            title={disabledReason}
            className="cursor-not-allowed whitespace-nowrap rounded border border-outline-variant/50 bg-surface-container-low px-3 py-1.5 font-label-caps text-label-caps text-on-surface-variant"
          >
            Unavailable
          </button>
        )}
      </td>
    </tr>
  );
};
