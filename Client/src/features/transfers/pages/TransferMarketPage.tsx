import { useMemo, useState } from "react";
import { useGetCurrentUserClubQuery } from "../../clubs/clubsApiSlice";
import type { SquadPositionFilter } from "../../playerInstances/utils/squadHelpers";
import { TransferMarketTable } from "../components/TransferMarketTable";
import { TransferMarketToolbar } from "../components/TransferMarketToolbar";
import { TransferOfferModal } from "../components/TransferOfferModal";
import {
  useCreateTransferOfferMutation,
  useGetTransferMarketQuery,
} from "../transfersApiSlice";
import type { TransferMarketItem } from "../transferTypes";
import {
  positionFilterToApi,
  sortOptionToApi,
  type TransferMarketSortOption,
} from "../utils/transferMarketHelpers";

export const TransferMarketPage = () => {
  const { data: club } = useGetCurrentUserClubQuery();
  const [positionFilter, setPositionFilter] = useState<SquadPositionFilter>("ALL");
  const [sortOption, setSortOption] = useState<TransferMarketSortOption>("rating-desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [offerTarget, setOfferTarget] = useState<TransferMarketItem | null>(null);

  const marketQuery = useMemo(() => {
    const sort = sortOptionToApi(sortOption);
    const trimmedSearch = searchQuery.trim();

    return {
      position: positionFilterToApi(positionFilter),
      search: trimmedSearch.length > 0 ? trimmedSearch : undefined,
      sortBy: sort.sortBy,
      sortDescending: sort.sortDescending,
    };
  }, [positionFilter, sortOption, searchQuery]);

  const { data: marketItems = [], isLoading, isFetching } = useGetTransferMarketQuery(marketQuery);
  const [createOffer, { isLoading: isSubmitting }] = useCreateTransferOfferMutation();

  const handleSubmitOffer = async (offerFee: number, proposedWage: number) => {
    if (!offerTarget) {
      return;
    }

    try {
      await createOffer({
        transferListingId: offerTarget.listingId,
        offerFee,
        proposedWage,
      }).unwrap();
      setOfferTarget(null);
    } catch {
      /* Toasts via apiClient */
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Loading transfer market...
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline-md text-headline-md text-on-surface">Transfer Market</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Scout available talent and spend wisely
          {isFetching ? " · Updating..." : ""}
        </p>
      </div>

      <TransferMarketToolbar
        positionFilter={positionFilter}
        onPositionFilterChange={setPositionFilter}
        sortOption={sortOption}
        onSortOptionChange={setSortOption}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <TransferMarketTable
        items={marketItems}
        currentClubId={club?.id}
        onMakeOffer={setOfferTarget}
      />

      {offerTarget && (
        <TransferOfferModal
          item={offerTarget}
          clubCash={club?.cash ?? 0}
          isSubmitting={isSubmitting}
          onClose={() => setOfferTarget(null)}
          onSubmit={handleSubmitOffer}
        />
      )}
    </div>
  );
};
