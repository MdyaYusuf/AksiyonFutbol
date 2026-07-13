import { apiSlice } from "../../core/api/apiSlice";
import type { PagedResponse, PaginationRequest } from "../../core/types/ApiResponse";
import type {
  CreatedLeagueDivisionResponse,
  CreateLeagueDivisionRequest,
  LeagueDivisionPreview,
  LeagueDivisionResponse,
  ProcessMatchWeekResult,
  UpdateLeagueDivisionMatchWeekRequest,
  UpdateLeagueDivisionRequest,
} from "./leagueDivisionTypes";

export const leagueDivisionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getLeagueDivisions: builder.query<PagedResponse<LeagueDivisionResponse>, PaginationRequest>({
      query: (params) => ({
        url: "leagueDivisions",
        params: {
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
        },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: "LeagueDivision" as const, id })),
            { type: "LeagueDivision", id: "LIST" },
          ]
          : [{ type: "LeagueDivision", id: "LIST" }],
    }),

    getLeagueDivisionById: builder.query<LeagueDivisionResponse, number>({
      query: (id) => ({ url: `leagueDivisions/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "LeagueDivision", id }],
    }),

    getLeagueDivisionsByTier: builder.query<LeagueDivisionPreview[], number>({
      query: (tier) => ({ url: `leagueDivisions/tier/${tier}` }),
      providesTags: (result, _error, tier) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "LeagueDivision" as const, id })),
            { type: "LeagueDivision", id: `TIER-${tier}` },
          ]
          : [{ type: "LeagueDivision", id: `TIER-${tier}` }],
    }),

    getLeagueDivisionByTierAndGroup: builder.query<
      LeagueDivisionResponse,
      { tier: number; groupNumber: number }
    >({
      query: ({ tier, groupNumber }) => ({
        url: `leagueDivisions/tier/${tier}/group/${groupNumber}`,
      }),
      providesTags: (_result, _error, arg) => [
        { type: "LeagueDivision", id: `TIER-${arg.tier}-GROUP-${arg.groupNumber}` },
      ],
    }),

    createLeagueDivision: builder.mutation<
      CreatedLeagueDivisionResponse,
      CreateLeagueDivisionRequest
    >({
      query: (body) => ({
        url: "leagueDivisions",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "LeagueDivision", id: "LIST" }],
    }),

    updateLeagueDivision: builder.mutation<null, UpdateLeagueDivisionRequest>({
      query: (body) => ({
        url: "leagueDivisions",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "LeagueDivision", id: arg.id },
        { type: "LeagueDivision", id: "LIST" },
        { type: "LeagueDivision", id: `TIER-${arg.tier}` },
        { type: "LeagueDivision", id: `TIER-${arg.tier}-GROUP-${arg.groupNumber}` },
      ],
    }),

    updateLeagueDivisionMatchWeek: builder.mutation<
      null,
      UpdateLeagueDivisionMatchWeekRequest
    >({
      query: (body) => ({
        url: "leagueDivisions/match-week",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "LeagueDivision", id: arg.id },
        { type: "LeagueDivision", id: "LIST" },
      ],
    }),

    advanceLeagueDivisionMatchWeek: builder.mutation<null, number>({
      query: (id) => ({
        url: `leagueDivisions/${id}/advance-match-week`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "LeagueDivision", id },
        { type: "LeagueDivision", id: "LIST" },
      ],
    }),

    processLeagueDivisionWeek: builder.mutation<ProcessMatchWeekResult, number>({
      query: (id) => ({
        url: `leagueDivisions/${id}/process-week`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "LeagueDivision", id },
        { type: "LeagueDivision", id: "LIST" },
        { type: "Match", id: "LIST" },
        { type: "Match", id: "SCHEDULED-UNPLAYED" },
      ],
    }),

    deleteLeagueDivision: builder.mutation<null, number>({
      query: (id) => ({
        url: `leagueDivisions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "LeagueDivision", id },
        { type: "LeagueDivision", id: "LIST" },
      ],
    }),

  }),
});

export const {
  useGetLeagueDivisionsQuery,
  useGetLeagueDivisionByIdQuery,
  useGetLeagueDivisionsByTierQuery,
  useGetLeagueDivisionByTierAndGroupQuery,
  useCreateLeagueDivisionMutation,
  useUpdateLeagueDivisionMutation,
  useUpdateLeagueDivisionMatchWeekMutation,
  useAdvanceLeagueDivisionMatchWeekMutation,
  useProcessLeagueDivisionWeekMutation,
  useDeleteLeagueDivisionMutation,
} = leagueDivisionsApiSlice;
