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
import type { TransferMarketItem } from "@/features/transfers/transferTypes";
import {
  formatTransferWage,
  getRatingBadgeClassName,
  parseMarketPosition,
} from "@/features/transfers/utils/transferMarketHelpers";

interface TransferMarketRowProps {
  item: TransferMarketItem;
  isOwnListing: boolean;
  onMakeOffer: (item: TransferMarketItem) => void;
}

export const TransferMarketRow = ({
  item,
  isOwnListing,
  onMakeOffer,
}: TransferMarketRowProps) => {
  const displayName = getPlayerDisplayName(item.firstName, item.lastName);
  const detailPath = `/app/squad/${item.playerInstanceId}`;
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
              <span className="inline-flex items-center rounded-full border border-secondary/20 bg-secondary/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-secondary">
                LISTED
              </span>
              {item.isInjured && (
                <span className="inline-flex items-center rounded-full border border-error/20 bg-error/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-error">
                  INJ
                </span>
              )}
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
      <td className="whitespace-nowrap px-2 py-2 font-body-sm text-body-sm">
        {item.sellingClubName}
      </td>
      <td className="px-2 py-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded border font-bold ${getRatingBadgeClassName(item.overallRating)}`}
        >
          {item.overallRating}
        </div>
      </td>
      <td className="whitespace-nowrap px-2 py-2">{formatSquadMoney(item.marketValue)}</td>
      <td className="whitespace-nowrap px-2 py-2">{formatTransferWage(item.wage)}</td>
      <td className="py-2 pr-4 pl-2 text-right">
        {isOwnListing ? (
          <button
            type="button"
            disabled
            className="cursor-not-allowed whitespace-nowrap rounded border border-outline-variant/50 bg-surface-container-low px-3 py-1.5 font-label-caps text-label-caps text-on-surface-variant"
          >
            Unavailable
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onMakeOffer(item)}
            className="whitespace-nowrap rounded bg-primary px-3 py-1.5 font-label-caps text-label-caps text-on-primary transition-colors hover:bg-primary-fixed"
          >
            Make Offer
          </button>
        )}
      </td>
    </tr>
  );
};
