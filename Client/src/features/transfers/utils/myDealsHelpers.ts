import { TransferOfferStatus, type TransferOfferResponse } from "@/features/transfers/transferTypes";
import { formatMarketPosition } from "@/features/transfers/utils/transferMarketHelpers";
import { formatSquadMoney } from "@/features/playerInstances/utils/squadHelpers";
import { parseApiDate } from "@/core/utils/dateTime";

export type DealsTab = "outgoing" | "incoming";

export type DealStatusFilter = "pending" | "accepted" | "closed";

export const DEFAULT_DEAL_STATUS_FILTERS: DealStatusFilter[] = ["pending"];

export const DEAL_STATUS_FILTER_OPTIONS: {
  id: DealStatusFilter;
  label: string;
}[] = [
  { id: "pending", label: "Pending" },
  { id: "accepted", label: "Accepted" },
  { id: "closed", label: "Rejected / Withdrawn" },
];

export const getDealStatusFilterChipClassName = (
  filter: DealStatusFilter,
  isActive: boolean,
): string => {
  const base =
    "rounded border px-3 py-1.5 font-label-caps text-label-caps transition-colors";

  if (filter === "pending") {
    if (isActive) {
      return `${base} border-secondary/50 bg-secondary/10 text-secondary`;
    }

    return `${base} border-outline-variant bg-transparent text-on-surface-variant hover:border-secondary hover:text-secondary`;
  }

  if (filter === "accepted") {
    if (isActive) {
      return `${base} border-primary/50 bg-primary/10 text-primary`;
    }

    return `${base} border-outline-variant bg-transparent text-on-surface-variant hover:border-primary hover:text-primary`;
  }

  if (isActive) {
    return `${base} border-error/50 bg-error/10 text-error`;
  }

  return `${base} border-outline-variant bg-transparent text-on-surface-variant hover:border-error hover:text-error`;
};

export const getOfferStatusLabel = (status: TransferOfferStatus): string => {
  if (status === TransferOfferStatus.Pending) {
    return "Pending";
  }

  if (status === TransferOfferStatus.Accepted) {
    return "Accepted";
  }

  if (status === TransferOfferStatus.Rejected) {
    return "Rejected";
  }

  if (status === TransferOfferStatus.Withdrawn) {
    return "Withdrawn";
  }

  return "Cancelled";
};

export const getOfferStatusBadgeClass = (status: TransferOfferStatus): string => {
  if (status === TransferOfferStatus.Pending) {
    return "border-secondary/20 bg-secondary/10 text-secondary";
  }

  if (status === TransferOfferStatus.Accepted) {
    return "border-primary/20 bg-primary/10 text-primary";
  }

  if (status === TransferOfferStatus.Rejected) {
    return "border-error/20 bg-error/10 text-error";
  }

  return "border-outline-variant bg-surface-variant text-on-surface-variant";
};

export const offerMatchesStatusFilters = (
  offer: TransferOfferResponse,
  filters: DealStatusFilter[],
): boolean => {
  if (filters.length === 0) {
    return true;
  }

  const isPending = offer.status === TransferOfferStatus.Pending;
  const isAccepted = offer.status === TransferOfferStatus.Accepted;
  const isClosed =
    offer.status === TransferOfferStatus.Rejected ||
    offer.status === TransferOfferStatus.Withdrawn ||
    offer.status === TransferOfferStatus.Cancelled;

  if (isPending && filters.includes("pending")) {
    return true;
  }

  if (isAccepted && filters.includes("accepted")) {
    return true;
  }

  if (isClosed && filters.includes("closed")) {
    return true;
  }

  return false;
};

export const summarizeDeals = (offers: TransferOfferResponse[]) => {
  const pending = offers.filter((offer) => offer.status === TransferOfferStatus.Pending);
  const totalFee = pending.reduce((sum, offer) => sum + offer.offerFee, 0);
  const totalWage = pending.reduce((sum, offer) => sum + offer.proposedWage, 0);

  return {
    pendingCount: pending.length,
    totalFee,
    totalWage,
  };
};

export const formatRelativeTime = (isoDate: string): string => {
  const date = parseApiDate(isoDate);
  const diffMs = Date.now() - date.getTime();

  if (Number.isNaN(diffMs)) {
    return "—";
  }

  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const getOfferSubtitle = (offer: TransferOfferResponse): string => {
  return `${formatMarketPosition(offer.position)} · OVR ${offer.overallRating}`;
};

export const formatDealFee = (amount: number): string => formatSquadMoney(amount);
