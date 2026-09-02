import { apiSlice } from "@/core/api/apiSlice";
import type { PagedResponse } from "@/core/types/ApiResponse";
import type {
  ClubCreationDefaults,
  ClubOption,
  ClubPreview,
  ClubResponse,
  CreatedClubResponse,
  CreateBotClubRequest,
  CreateClubRequest,
  GetClubsParams,
  UpdateClubFinancesRequest,
  UpdateClubRequest,
  UpdateClubStatusRequest,
} from "@/features/clubs/clubTypes";

export const clubsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getClubs: builder.query<PagedResponse<ClubResponse>, GetClubsParams>({
      query: (params) => ({
        url: "clubs",
        params: {
          currentPage: params.currentPage,
          pageSize: params.pageSize,
          search: params.search,
          divisionId: params.divisionId,
          isBot: params.isBot,
        },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: "Club" as const, id })),
            { type: "Club", id: "LIST" },
          ]
          : [{ type: "Club", id: "LIST" }],
    }),

    getClubOptions: builder.query<ClubOption[], void>({
      query: () => ({ url: "clubs/options" }),
      providesTags: [{ type: "Club", id: "OPTIONS" }],
    }),

    getClubById: builder.query<ClubResponse, string>({
      query: (id) => ({ url: `clubs/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Club", id }],
    }),

    getCurrentUserClub: builder.query<ClubResponse, void>({
      query: () => ({ url: "clubs/me" }),
      providesTags: [{ type: "Club", id: "ME" }],
    }),

    checkCurrentUserHasClub: builder.query<boolean, void>({
      query: () => ({ url: "clubs/me/exists" }),
      providesTags: [{ type: "Club", id: "ME" }],
    }),

    getClubByPresidentId: builder.query<ClubResponse, string>({
      query: (presidentId) => ({ url: `clubs/by-president/${presidentId}` }),
      providesTags: (_result, _error, presidentId) => [
        { type: "Club", id: `PRESIDENT-${presidentId}` },
      ],
    }),

    getClubsByDivisionId: builder.query<ClubPreview[], number>({
      query: (divisionId) => ({ url: `clubs/by-division/${divisionId}` }),
      providesTags: (result, _error, divisionId) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Club" as const, id })),
            { type: "Club", id: `DIVISION-${divisionId}` },
          ]
          : [{ type: "Club", id: `DIVISION-${divisionId}` }],
    }),

    getClubCreationDefaults: builder.query<ClubCreationDefaults, void>({
      query: () => ({ url: "clubs/creation-defaults" }),
    }),

    createClub: builder.mutation<CreatedClubResponse, CreateClubRequest>({
      query: (body) => ({
        url: "clubs",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            clubsApiSlice.util.updateQueryData(
              "checkCurrentUserHasClub",
              undefined,
              () => true,
            ),
          );
        } catch {
          /* Toasts via apiClient */
        }
      },
      invalidatesTags: () => [
        { type: "Club", id: "LIST" },
        { type: "Club", id: "OPTIONS" },
        { type: "Club", id: "ME" },
        { type: "ClubPresident", id: "ME" },
        { type: "ClubDraft", id: "ME" },
        { type: "ClubDraft", id: "CATALOG" },
      ],
    }),

    createBotClub: builder.mutation<CreatedClubResponse, CreateBotClubRequest>({
      query: (body) => ({
        url: "clubs/bot",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Club", id: "LIST" },
        { type: "Club", id: "OPTIONS" },
        { type: "Club", id: `DIVISION-${arg.divisionId}` },
        { type: "LeagueDivision", id: arg.divisionId },
        { type: "LeagueDivision", id: "LIST" },
      ],
    }),

    updateClub: builder.mutation<null, UpdateClubRequest>({
      query: (body) => ({
        url: "clubs",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Club", id: arg.id },
        { type: "Club", id: "LIST" },
        { type: "Club", id: "OPTIONS" },
        { type: "Club", id: "ME" },
      ],
    }),

    updateClubFinances: builder.mutation<null, UpdateClubFinancesRequest>({
      query: (body) => ({
        url: "clubs/finances",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Club", id: arg.id },
        { type: "Club", id: "LIST" },
        { type: "Club", id: "ME" },
      ],
    }),

    updateClubStatus: builder.mutation<null, UpdateClubStatusRequest>({
      query: (body) => ({
        url: "clubs/status",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Club", id: arg.id },
        { type: "Club", id: "LIST" },
        { type: "Club", id: "ME" },
      ],
    }),

    deleteClub: builder.mutation<null, string>({
      query: (id) => ({
        url: `clubs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Club", id },
        { type: "Club", id: "LIST" },
        { type: "Club", id: "OPTIONS" },
        { type: "Club", id: "ME" },
        { type: "LeagueDivision", id: "LIST" },
      ],
    }),

  }),
});

export const {
  useGetClubsQuery,
  useGetClubOptionsQuery,
  useGetClubByIdQuery,
  useGetCurrentUserClubQuery,
  useCheckCurrentUserHasClubQuery,
  useGetClubByPresidentIdQuery,
  useGetClubsByDivisionIdQuery,
  useGetClubCreationDefaultsQuery,
  useCreateClubMutation,
  useCreateBotClubMutation,
  useUpdateClubMutation,
  useUpdateClubFinancesMutation,
  useUpdateClubStatusMutation,
  useDeleteClubMutation,
} = clubsApiSlice;
