import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import {
  formatSquadMoney,
  getPlayerDisplayName,
} from "../../playerInstances/utils/squadHelpers";
import type { TransferMarketItem } from "../transferTypes";
import {
  formatMarketPosition,
  formatTransferWage,
  getRatingBadgeClassName,
} from "../utils/transferMarketHelpers";

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

  return (
    <tr className="group border-b border-surface-bright transition-colors hover:bg-surface-variant">
      <td className="px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-highest">
            <MaterialIcon name="person" className="text-sm text-on-surface-variant" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-body-sm text-body-sm font-semibold text-on-surface transition-colors group-hover:text-primary">
              {displayName}
            </span>
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
      <td className="px-4 py-2">
        <span className="rounded border border-outline-variant bg-surface-bright px-2 py-1 text-on-surface-variant">
          {formatMarketPosition(item.position)}
        </span>
      </td>
      <td className="px-4 py-2">{item.age}</td>
      <td className="px-4 py-2 font-body-sm text-body-sm">{item.sellingClubName}</td>
      <td className="px-4 py-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded border font-bold ${getRatingBadgeClassName(item.overallRating)}`}
        >
          {item.overallRating}
        </div>
      </td>
      <td className="px-4 py-2">{formatSquadMoney(item.marketValue)}</td>
      <td className="px-4 py-2">{formatTransferWage(item.wage)}</td>
      <td className="px-4 py-2 text-right">
        {isOwnListing ? (
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded border border-outline-variant/50 bg-surface-container-low px-3 py-1.5 font-label-caps text-label-caps text-on-surface-variant"
          >
            Unavailable
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onMakeOffer(item)}
            className="rounded bg-primary px-3 py-1.5 font-label-caps text-label-caps text-on-primary transition-colors hover:bg-primary-fixed"
          >
            Make Offer
          </button>
        )}
      </td>
    </tr>
  );
};
