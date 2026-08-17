import { apiSlice } from "../../core/api/apiSlice";
import type {
  CreateTransferListingRequest,
  CreateTransferOfferRequest,
  TransferDealsResponse,
  TransferListingResponse,
  TransferMarketItem,
  TransferMarketQuery,
  TransferOfferResponse,
} from "./transferTypes";
import type {
  FreeAgentMarketItem,
  FreeAgentMarketQuery,
  SignFreeAgentResponse,
} from "./freeAgentTypes";

export const transfersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransferMarket: builder.query<TransferMarketItem[], TransferMarketQuery | void>({
      query: (arg) => ({
        url: "transfers/market",
        params: arg
          ? {
              position: arg.position,
              search: arg.search,
              sortBy: arg.sortBy,
              sortDescending: arg.sortDescending,
            }
          : undefined,
      }),
      providesTags: [{ type: "Transfer", id: "MARKET" }],
    }),

    getMyTransferListings: builder.query<TransferListingResponse[], void>({
      query: () => ({ url: "transfers/listings/me" }),
      providesTags: [{ type: "Transfer", id: "LISTINGS" }],
    }),

    createTransferListing: builder.mutation<
      TransferListingResponse,
      CreateTransferListingRequest
    >({
      query: (body) => ({
        url: "transfers/listings",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Transfer", id: "MARKET" },
        { type: "Transfer", id: "LISTINGS" },
      ],
    }),

    withdrawTransferListing: builder.mutation<TransferListingResponse, string>({
      query: (listingId) => ({
        url: `transfers/listings/${listingId}/withdraw`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Transfer", id: "MARKET" },
        { type: "Transfer", id: "LISTINGS" },
        { type: "Transfer", id: "DEALS" },
      ],
    }),

    getMyTransferDeals: builder.query<TransferDealsResponse, void>({
      query: () => ({ url: "transfers/deals/me" }),
      providesTags: [{ type: "Transfer", id: "DEALS" }],
    }),

    createTransferOffer: builder.mutation<TransferOfferResponse, CreateTransferOfferRequest>({
      query: (body) => ({
        url: "transfers/offers",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Transfer", id: "DEALS" },
        { type: "Transfer", id: "LISTINGS" },
      ],
    }),

    withdrawTransferOffer: builder.mutation<TransferOfferResponse, string>({
      query: (offerId) => ({
        url: `transfers/offers/${offerId}/withdraw`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Transfer", id: "DEALS" }],
    }),

    acceptTransferOffer: builder.mutation<TransferOfferResponse, string>({
      query: (offerId) => ({
        url: `transfers/offers/${offerId}/accept`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Transfer", id: "MARKET" },
        { type: "Transfer", id: "LISTINGS" },
        { type: "Transfer", id: "DEALS" },
        { type: "Club", id: "ME" },
        { type: "PlayerInstance", id: "MY-CLUB" },
        { type: "ClubLineup", id: "ME" },
      ],
    }),

    rejectTransferOffer: builder.mutation<TransferOfferResponse, string>({
      query: (offerId) => ({
        url: `transfers/offers/${offerId}/reject`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Transfer", id: "DEALS" },
        { type: "Transfer", id: "LISTINGS" },
      ],
    }),

    getFreeAgents: builder.query<FreeAgentMarketItem[], FreeAgentMarketQuery | void>({
      query: (arg) => ({
        url: "transfers/free-agents",
        params: arg
          ? {
              position: arg.position,
              tier: arg.tier,
              search: arg.search,
              sortBy: arg.sortBy,
              sortDescending: arg.sortDescending,
            }
          : undefined,
      }),
      providesTags: [{ type: "Transfer", id: "FREE-AGENTS" }],
    }),

    signFreeAgent: builder.mutation<SignFreeAgentResponse, string>({
      query: (basePlayerId) => ({
        url: `transfers/free-agents/${basePlayerId}/sign`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Transfer", id: "FREE-AGENTS" },
        { type: "Club", id: "ME" },
        { type: "PlayerInstance", id: "MY-CLUB" },
        { type: "ClubLineup", id: "ME" },
      ],
    }),
  }),
});

export const {
  useGetTransferMarketQuery,
  useGetMyTransferListingsQuery,
  useCreateTransferListingMutation,
  useWithdrawTransferListingMutation,
  useGetMyTransferDealsQuery,
  useCreateTransferOfferMutation,
  useWithdrawTransferOfferMutation,
  useAcceptTransferOfferMutation,
  useRejectTransferOfferMutation,
  useGetFreeAgentsQuery,
  useSignFreeAgentMutation,
} = transfersApiSlice;
