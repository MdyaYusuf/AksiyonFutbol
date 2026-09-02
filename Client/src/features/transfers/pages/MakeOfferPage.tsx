import { useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetCurrentUserClubQuery } from "@/features/clubs/clubsApiSlice";
import { CashSpendLockBanner } from "@/features/matches/components/CashSpendLockBanner";
import {
  useGetCurrentUserClubPlayersQuery,
  useGetPlayerInstanceByIdQuery,
} from "@/features/playerInstances/playerInstancesApiSlice";
import { MakeOfferAttributes } from "@/features/transfers/components/MakeOfferAttributes";
import { MakeOfferForm } from "@/features/transfers/components/MakeOfferForm";
import { MakeOfferPlayerHeader } from "@/features/transfers/components/MakeOfferPlayerHeader";
import { MakeOfferScoutReport } from "@/features/transfers/components/MakeOfferScoutReport";
import {
  useCreateTransferOfferMutation,
  useGetTransferMarketItemQuery,
} from "@/features/transfers/transfersApiSlice";
import type { TransferMarketItem } from "@/features/transfers/transferTypes";

interface MakeOfferLocationState {
  listing?: TransferMarketItem;
}

export const MakeOfferPage = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationListing = (location.state as MakeOfferLocationState | null)?.listing;
  const hasLocationListing = Boolean(
    locationListing && locationListing.listingId === listingId,
  );

  const { data: club } = useGetCurrentUserClubQuery();
  const { data: myPlayers = [] } = useGetCurrentUserClubPlayersQuery();
  const {
    data: fetchedListing,
    isLoading: isMarketLoading,
    isError: isMarketError,
  } = useGetTransferMarketItemQuery(listingId ?? "", {
    skip: !listingId || hasLocationListing,
  });

  const listing = useMemo(() => {
    if (hasLocationListing && locationListing) {
      return locationListing;
    }

    return fetchedListing;
  }, [hasLocationListing, locationListing, fetchedListing]);

  const {
    data: player,
    isLoading: isPlayerLoading,
    isError: isPlayerError,
  } = useGetPlayerInstanceByIdQuery(listing?.playerInstanceId ?? "", {
    skip: !listing?.playerInstanceId,
  });

  const [createOffer, { isLoading: isSubmitting }] = useCreateTransferOfferMutation();

  const wageSpace = useMemo(() => {
    if (!club) {
      return 0;
    }

    const wageBill = myPlayers.reduce((sum, squadPlayer) => sum + squadPlayer.wage, 0);
    return club.wageBudget - wageBill;
  }, [club, myPlayers]);

  const handleSubmit = async (offerFee: number, proposedWage: number) => {
    if (!listing) {
      return;
    }

    try {
      await createOffer({
        transferListingId: listing.listingId,
        offerFee,
        proposedWage,
      }).unwrap();
      navigate("/app/transfers");
    } catch {
      /* Toasts via apiClient */
    }
  };

  if (!listingId) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-on-surface-variant">
        <p>Listing not found.</p>
        <Link to="/app/transfers" className="text-primary hover:underline">
          Back to Transfer Market
        </Link>
      </div>
    );
  }

  if (isMarketLoading || (listing && isPlayerLoading)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Loading offer details...
      </div>
    );
  }

  if (!listing || isMarketError || isPlayerError || !player) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-on-surface-variant">
        <p>This listing is no longer available.</p>
        <Link to="/app/transfers" className="text-primary hover:underline">
          Back to Transfer Market
        </Link>
      </div>
    );
  }

  if (club && listing.sellingClubId === club.id) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-on-surface-variant">
        <p>You cannot make an offer on your own listing.</p>
        <Link to="/app/transfers" className="text-primary hover:underline">
          Back to Transfer Market
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center gap-2 font-label-caps text-label-caps text-on-surface-variant">
        <Link to="/app/transfers" className="hover:text-primary">
          Transfers
        </Link>
        <span>/</span>
        <span className="text-on-surface">Transfer Offer</span>
      </div>

      {club?.cashSpendLocked ? <CashSpendLockBanner /> : null}

      <MakeOfferPlayerHeader player={player} listing={listing} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <MakeOfferAttributes player={player} />
          <MakeOfferScoutReport player={player} listing={listing} />
        </div>

        <div className="lg:col-span-7">
          <MakeOfferForm
            listing={listing}
            clubCash={club?.cash ?? 0}
            wageSpace={wageSpace}
            cashSpendLocked={Boolean(club?.cashSpendLocked)}
            isSubmitting={isSubmitting}
            onCancel={() => navigate("/app/transfers")}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};
