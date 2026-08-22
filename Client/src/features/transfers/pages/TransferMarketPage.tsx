import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { DraftTier } from "../../basePlayers/basePlayerTypes";
import { ClubLifecycleStatus } from "../../clubs/clubTypes";
import { useGetCurrentUserClubQuery } from "../../clubs/clubsApiSlice";
import { CashSpendLockBanner } from "../../matches/components/CashSpendLockBanner";
import type { SquadPositionFilter } from "../../playerInstances/utils/squadHelpers";
import { FreeAgentMarketTable } from "../components/FreeAgentMarketTable";
import { FreeAgentMarketToolbar } from "../components/FreeAgentMarketToolbar";
import { TransferMarketTable } from "../components/TransferMarketTable";
import { TransferMarketToolbar } from "../components/TransferMarketToolbar";
import type { TransferMarketTab } from "../freeAgentTypes";
import {
  useGetFreeAgentsQuery,
  useGetTransferMarketQuery,
  useSignFreeAgentMutation,
} from "../transfersApiSlice";
import type { TransferMarketItem } from "../transferTypes";
import {
  freeAgentSortOptionToApi,
  tierFilterToApi,
  type FreeAgentSortOption,
} from "../utils/freeAgentHelpers";
import {
  positionFilterToApi,
  sortOptionToApi,
  type TransferMarketSortOption,
} from "../utils/transferMarketHelpers";

const canSignFreeAgents = (lifecycleStatus?: number): boolean => {
  return (
    lifecycleStatus === ClubLifecycleStatus.Tutorial
    || lifecycleStatus === ClubLifecycleStatus.Competitive
  );
};

export const TransferMarketPage = () => {
  const navigate = useNavigate();
  const { data: club } = useGetCurrentUserClubQuery();
  const [activeTab, setActiveTab] = useState<TransferMarketTab>("free-agents");

  const [positionFilter, setPositionFilter] = useState<SquadPositionFilter>("ALL");
  const [sortOption, setSortOption] = useState<TransferMarketSortOption>("rating-desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [listingTierFilter, setListingTierFilter] = useState<DraftTier | "ALL">("ALL");

  const [freeAgentTierFilter, setFreeAgentTierFilter] = useState<DraftTier | "ALL">("ALL");
  const [freeAgentSortOption, setFreeAgentSortOption] =
    useState<FreeAgentSortOption>("rating-desc");
  const [freeAgentSearchQuery, setFreeAgentSearchQuery] = useState("");
  const [signingBasePlayerId, setSigningBasePlayerId] = useState<string | null>(null);

  const marketQuery = useMemo(() => {
    const sort = sortOptionToApi(sortOption);
    const trimmedSearch = searchQuery.trim();

    return {
      position: positionFilterToApi(positionFilter),
      tier: tierFilterToApi(listingTierFilter),
      search: trimmedSearch.length > 0 ? trimmedSearch : undefined,
      sortBy: sort.sortBy,
      sortDescending: sort.sortDescending,
    };
  }, [positionFilter, listingTierFilter, sortOption, searchQuery]);

  const freeAgentQuery = useMemo(() => {
    const sort = freeAgentSortOptionToApi(freeAgentSortOption);
    const trimmedSearch = freeAgentSearchQuery.trim();

    return {
      position: positionFilterToApi(positionFilter),
      tier: tierFilterToApi(freeAgentTierFilter),
      search: trimmedSearch.length > 0 ? trimmedSearch : undefined,
      sortBy: sort.sortBy,
      sortDescending: sort.sortDescending,
    };
  }, [positionFilter, freeAgentTierFilter, freeAgentSortOption, freeAgentSearchQuery]);

  const {
    data: marketItems = [],
    isLoading: isListingsLoading,
    isFetching: isListingsFetching,
  } = useGetTransferMarketQuery(marketQuery, { skip: activeTab !== "listings" });

  const {
    data: freeAgents = [],
    isLoading: isFreeAgentsLoading,
    isFetching: isFreeAgentsFetching,
  } = useGetFreeAgentsQuery(freeAgentQuery, { skip: activeTab !== "free-agents" });

  const [signFreeAgent] = useSignFreeAgentMutation();

  const handleMakeOffer = (item: TransferMarketItem) => {
    navigate(`/app/transfers/${item.listingId}/offer`);
  };

  const freeAgentSignAllowed = canSignFreeAgents(club?.lifecycleStatus);
  const freeAgentDisabledReason = freeAgentSignAllowed
    ? club?.cashSpendLocked
      ? "Cash spending is locked during a live match."
      : undefined
    : "Free agents can only be signed during tutorial or competitive seasons.";

  const handleSignFreeAgent = async (basePlayerId: string) => {
    if (!freeAgentSignAllowed || club?.cashSpendLocked) {
      return;
    }

    setSigningBasePlayerId(basePlayerId);

    try {
      await signFreeAgent(basePlayerId).unwrap();
    } catch {
      /* Toasts via apiClient */
    } finally {
      setSigningBasePlayerId(null);
    }
  };

  const isLoading =
    activeTab === "listings" ? isListingsLoading : isFreeAgentsLoading;
  const isFetching =
    activeTab === "listings" ? isListingsFetching : isFreeAgentsFetching;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Loading transfer market...
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2">
          <h1 className="font-headline-md text-headline-md text-on-surface">Transfer Market</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Scout listed players or sign global free agents
            {isFetching ? " · Updating..." : ""}
          </p>
        </div>
        <Link
          to="/app/transfers/deals"
          className="rounded border border-outline-variant px-4 py-2 font-label-caps text-label-caps text-on-surface transition-colors hover:border-primary hover:text-primary"
        >
          My Deals
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 rounded-lg border border-outline-variant bg-surface-container p-1">
        <button
          type="button"
          onClick={() => setActiveTab("free-agents")}
          className={`rounded-md px-4 py-2 font-label-caps text-label-caps transition-colors ${
            activeTab === "free-agents"
              ? "bg-primary text-on-primary"
              : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
          }`}
        >
          Free Agents
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("listings")}
          className={`rounded-md px-4 py-2 font-label-caps text-label-caps transition-colors ${
            activeTab === "listings"
              ? "bg-primary text-on-primary"
              : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
          }`}
        >
          Listed Players
        </button>
      </div>

      {activeTab === "free-agents" ? (
        <>
          {club?.cashSpendLocked ? <CashSpendLockBanner /> : null}

          <FreeAgentMarketToolbar
            positionFilter={positionFilter}
            onPositionFilterChange={setPositionFilter}
            tierFilter={freeAgentTierFilter}
            onTierFilterChange={setFreeAgentTierFilter}
            sortOption={freeAgentSortOption}
            onSortOptionChange={setFreeAgentSortOption}
            searchQuery={freeAgentSearchQuery}
            onSearchQueryChange={setFreeAgentSearchQuery}
          />

          <FreeAgentMarketTable
            items={freeAgents}
            canSign={freeAgentSignAllowed && !club?.cashSpendLocked}
            disabledReason={freeAgentDisabledReason}
            signingBasePlayerId={signingBasePlayerId}
            onSign={(item) => handleSignFreeAgent(item.basePlayerId)}
          />
        </>
      ) : (
        <>
          <TransferMarketToolbar
            positionFilter={positionFilter}
            onPositionFilterChange={setPositionFilter}
            sortOption={sortOption}
            onSortOptionChange={(sort) =>
              setSortOption(sort as TransferMarketSortOption)
            }
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            tierFilter={listingTierFilter}
            onTierFilterChange={setListingTierFilter}
          />

          <TransferMarketTable
            items={marketItems}
            currentClubId={club?.id}
            onMakeOffer={handleMakeOffer}
          />
        </>
      )}
    </div>
  );
};
