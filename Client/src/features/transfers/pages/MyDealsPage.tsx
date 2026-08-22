import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGetCurrentUserClubQuery } from "../../clubs/clubsApiSlice";
import { CashSpendLockBanner } from "../../matches/components/CashSpendLockBanner";
import { MyDealsSummary } from "../components/MyDealsSummary";
import { MyDealsTable } from "../components/MyDealsTable";
import { MyDealsToolbar } from "../components/MyDealsToolbar";
import {
  useAcceptTransferOfferMutation,
  useGetMyTransferDealsQuery,
  useRejectTransferOfferMutation,
  useWithdrawTransferOfferMutation,
} from "../transfersApiSlice";
import {
  DEFAULT_DEAL_STATUS_FILTERS,
  offerMatchesStatusFilters,
  summarizeDeals,
  type DealStatusFilter,
  type DealsTab,
} from "../utils/myDealsHelpers";

export const MyDealsPage = () => {
  const { data, isLoading } = useGetMyTransferDealsQuery();
  const { data: club } = useGetCurrentUserClubQuery();
  const cashSpendLocked = Boolean(club?.cashSpendLocked);
  const [tab, setTab] = useState<DealsTab>("outgoing");
  const [statusFilters, setStatusFilters] = useState<DealStatusFilter[]>(
    DEFAULT_DEAL_STATUS_FILTERS,
  );

  const [acceptOffer, { isLoading: isAccepting }] = useAcceptTransferOfferMutation();
  const [rejectOffer, { isLoading: isRejecting }] = useRejectTransferOfferMutation();
  const [withdrawOffer, { isLoading: isWithdrawing }] =
    useWithdrawTransferOfferMutation();

  const isBusy = isAccepting || isRejecting || isWithdrawing;

  const sourceOffers = useMemo(() => {
    if (!data) {
      return [];
    }

    // Design "Outgoing" = players leaving (seller view) = API incomingOffers
    // Design "Incoming" = our bids (buyer view) = API outgoingOffers
    return tab === "outgoing" ? data.incomingOffers : data.outgoingOffers;
  }, [data, tab]);

  const filteredOffers = useMemo(
    () => sourceOffers.filter((offer) => offerMatchesStatusFilters(offer, statusFilters)),
    [sourceOffers, statusFilters],
  );

  const summary = useMemo(() => summarizeDeals(sourceOffers), [sourceOffers]);

  const handleToggleStatusFilter = (filter: DealStatusFilter) => {
    setStatusFilters((current) => {
      if (current.includes(filter)) {
        return current.filter((item) => item !== filter);
      }

      return [...current, filter];
    });
  };

  const handleAccept = async (offerId: string) => {
    try {
      await acceptOffer(offerId).unwrap();
    } catch {
      /* Toasts via apiClient */
    }
  };

  const handleReject = async (offerId: string) => {
    try {
      await rejectOffer(offerId).unwrap();
    } catch {
      /* Toasts via apiClient */
    }
  };

  const handleWithdraw = async (offerId: string) => {
    try {
      await withdrawOffer(offerId).unwrap();
    } catch {
      /* Toasts via apiClient */
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Loading deals...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-outline-variant pb-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 font-label-caps text-label-caps text-on-surface-variant">
            <Link to="/app/transfers" className="hover:text-primary">
              Transfers
            </Link>
            <span>/</span>
            <span className="text-on-surface">My Deals</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface md:text-display-lg md:leading-tight">
            My Deals
          </h1>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            Manage all active transfer negotiations.
          </p>
        </div>

        <div className="flex space-x-1 rounded border border-outline-variant/30 bg-surface-container-low p-1">
          <button
            type="button"
            onClick={() => setTab("outgoing")}
            className={`rounded px-6 py-2 font-label-caps text-label-caps transition-all ${
              tab === "outgoing"
                ? "border border-outline-variant/50 bg-surface-container-highest text-on-surface shadow-sm"
                : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"
            }`}
          >
            Outgoing
          </button>
          <button
            type="button"
            onClick={() => setTab("incoming")}
            className={`rounded px-6 py-2 font-label-caps text-label-caps transition-all ${
              tab === "incoming"
                ? "border border-outline-variant/50 bg-surface-container-highest text-on-surface shadow-sm"
                : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"
            }`}
          >
            Incoming
          </button>
        </div>
      </div>

      {cashSpendLocked ? <CashSpendLockBanner /> : null}

      <MyDealsToolbar
        statusFilters={statusFilters}
        onToggleStatusFilter={handleToggleStatusFilter}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <MyDealsSummary
            tab={tab}
            totalFee={summary.totalFee}
            totalWage={summary.totalWage}
            pendingCount={summary.pendingCount}
          />
        </div>
        <div className="xl:col-span-9">
          <MyDealsTable
            offers={filteredOffers}
            tab={tab}
            isBusy={isBusy}
            cashSpendLocked={cashSpendLocked}
            onAccept={handleAccept}
            onReject={handleReject}
            onWithdraw={handleWithdraw}
          />
        </div>
      </div>
    </div>
  );
};
