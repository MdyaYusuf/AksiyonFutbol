import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import {
  getPlayerDisplayName,
  getPlayerInitials,
} from "../../playerInstances/utils/squadHelpers";
import { TransferOfferStatus, type TransferOfferResponse } from "../transferTypes";
import {
  formatDealFee,
  formatRelativeTime,
  getOfferStatusBadgeClass,
  getOfferStatusLabel,
  getOfferSubtitle,
  type DealsTab,
} from "../utils/myDealsHelpers";
import {
  formatTransferWage,
  TRANSFER_MINIMUM_SQUAD_SIZE,
} from "../utils/transferMarketHelpers";

interface MyDealsRowProps {
  offer: TransferOfferResponse;
  tab: DealsTab;
  isBusy: boolean;
  cashSpendLocked?: boolean;
  canCompleteSale?: boolean;
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
  onWithdraw: (offerId: string) => void;
}

export const MyDealsRow = ({
  offer,
  tab,
  isBusy,
  cashSpendLocked = false,
  canCompleteSale = true,
  onAccept,
  onReject,
  onWithdraw,
}: MyDealsRowProps) => {
  const isOutgoing = tab === "outgoing";
  const isPending = offer.status === TransferOfferStatus.Pending;
  const isAccepted = offer.status === TransferOfferStatus.Accepted;
  const displayName = getPlayerDisplayName(offer.firstName, offer.lastName);
  const initials = getPlayerInitials(offer.firstName, offer.lastName);
  const lastUpdated = formatRelativeTime(offer.updatedDate ?? offer.createdDate);
  const directionLabel = isOutgoing
    ? `To ${offer.buyingClubName}`
    : `From ${offer.sellingClubName}`;
  const directionIcon = isOutgoing ? "flight_takeoff" : "flight_land";
  const acceptBlockedBySquadFloor = isOutgoing && !canCompleteSale;
  const acceptTitle = acceptBlockedBySquadFloor
    ? `You must keep at least ${TRANSFER_MINIMUM_SQUAD_SIZE} players to complete a sale`
    : "Accept";

  return (
    <tr
      className={`group transition-colors hover:bg-surface-variant/40 ${
        isAccepted ? "opacity-60" : ""
      }`}
    >
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-outline-variant/50 bg-surface-bright text-xs font-bold text-on-surface">
            {initials}
          </div>
          <div>
            <div className="font-semibold text-on-surface">{displayName}</div>
            <div className="font-body-sm text-xs text-on-surface-variant">
              {getOfferSubtitle(offer)}
            </div>
          </div>
        </div>
      </td>
      <td className="p-4 text-on-surface-variant">
        <div className="flex items-center gap-1.5">
          <MaterialIcon name={directionIcon} className="text-sm text-secondary" />
          <span>{directionLabel}</span>
        </div>
      </td>
      <td className="p-4 text-right text-on-surface">{formatDealFee(offer.offerFee)}</td>
      <td className="p-4 text-right text-on-surface-variant">
        {formatTransferWage(offer.proposedWage)}
      </td>
      <td className="p-4">
        <span
          className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold ${getOfferStatusBadgeClass(offer.status)}`}
        >
          {getOfferStatusLabel(offer.status)}
        </span>
      </td>
      <td className="p-4 text-xs text-on-surface-variant">{lastUpdated}</td>
      <td className="p-4 text-right">
        {isPending && isOutgoing && (
          <div className="flex justify-end gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
            <button
              type="button"
              title={acceptTitle}
              disabled={isBusy || cashSpendLocked || acceptBlockedBySquadFloor}
              onClick={() => onAccept(offer.id)}
              className="rounded border border-primary/30 bg-surface p-1.5 text-primary transition-colors hover:bg-surface-bright disabled:opacity-50"
            >
              <MaterialIcon name="check" filled className="text-sm" />
            </button>
            <button
              type="button"
              title="Reject"
              disabled={isBusy}
              onClick={() => onReject(offer.id)}
              className="rounded border border-error/30 bg-surface p-1.5 text-error transition-colors hover:bg-surface-bright disabled:opacity-50"
            >
              <MaterialIcon name="close" filled className="text-sm" />
            </button>
          </div>
        )}

        {isPending && !isOutgoing && (
          <div className="flex justify-end opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => onWithdraw(offer.id)}
              className="rounded border border-outline-variant bg-surface-bright px-2 py-1 text-xs text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-50"
            >
              Withdraw
            </button>
          </div>
        )}

        {isAccepted && (
          <span className="text-xs text-on-surface-variant">Completed</span>
        )}
      </td>
    </tr>
  );
};
