import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetCurrentUserClubQuery } from "../../clubs/clubsApiSlice";
import {
  useGetCurrentUserClubPlayersQuery,
  useGetPlayerInstanceByIdQuery,
} from "../../playerInstances/playerInstancesApiSlice";
import { MakeOfferAttributes } from "../components/MakeOfferAttributes";
import { MakeOfferForm } from "../components/MakeOfferForm";
import { MakeOfferPlayerHeader } from "../components/MakeOfferPlayerHeader";
import { MakeOfferScoutReport } from "../components/MakeOfferScoutReport";
import {
  useCreateTransferOfferMutation,
  useGetTransferMarketQuery,
} from "../transfersApiSlice";

export const MakeOfferPage = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();

  const { data: club } = useGetCurrentUserClubQuery();
  const { data: myPlayers = [] } = useGetCurrentUserClubPlayersQuery();
  const { data: marketItems = [], isLoading: isMarketLoading } = useGetTransferMarketQuery();

  const listing = useMemo(
    () => marketItems.find((item) => item.listingId === listingId),
    [marketItems, listingId],
  );

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

  if (!listing || isPlayerError || !player) {
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
            isSubmitting={isSubmitting}
            onCancel={() => navigate("/app/transfers")}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};
