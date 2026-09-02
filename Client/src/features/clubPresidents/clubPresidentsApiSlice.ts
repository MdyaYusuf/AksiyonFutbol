import { apiSlice } from "@/core/api/apiSlice";
import type { PagedResponse, PaginationRequest } from "@/core/types/ApiResponse";
import type {
  ClubPresidentResponse,
  CreatedClubPresidentResponse,
  CreateClubPresidentRequest,
  UpdateClubPresidentReputationRequest,
  UpdateClubPresidentRequest,
} from "@/features/clubPresidents/clubPresidentTypes";

export const clubPresidentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getClubPresidents: builder.query<PagedResponse<ClubPresidentResponse>, PaginationRequest>({
      query: (params) => ({
        url: "clubPresidents",
        params: {
          currentPage: params.currentPage,
          pageSize: params.pageSize,
        },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: "ClubPresident" as const, id })),
            { type: "ClubPresident", id: "LIST" },
          ]
          : [{ type: "ClubPresident", id: "LIST" }],
    }),

    getClubPresidentById: builder.query<ClubPresidentResponse, string>({
      query: (id) => ({ url: `clubPresidents/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "ClubPresident", id }],
    }),

    getClubPresidentByUserId: builder.query<ClubPresidentResponse, string>({
      query: (userId) => ({ url: `clubPresidents/by-user/${userId}` }),
      providesTags: (_result, _error, userId) => [
        { type: "ClubPresident", id: `USER-${userId}` },
      ],
    }),

    getCurrentUserClubPresident: builder.query<ClubPresidentResponse, void>({
      query: () => ({ url: "clubPresidents/me" }),
      providesTags: [{ type: "ClubPresident", id: "ME" }],
    }),

    checkCurrentUserHasPresident: builder.query<boolean, void>({
      query: () => ({ url: "clubPresidents/me/exists" }),
      providesTags: [{ type: "ClubPresident", id: "ME" }],
    }),

    createClubPresident: builder.mutation<
      CreatedClubPresidentResponse,
      CreateClubPresidentRequest
    >({
      query: (body) => ({
        url: "clubPresidents",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "ClubPresident", id: "LIST" },
        { type: "ClubPresident", id: "ME" },
      ],
    }),

    updateClubPresident: builder.mutation<null, UpdateClubPresidentRequest>({
      query: (body) => ({
        url: "clubPresidents",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "ClubPresident", id: arg.id },
        { type: "ClubPresident", id: "LIST" },
        { type: "ClubPresident", id: "ME" },
      ],
    }),

    updateClubPresidentReputation: builder.mutation<
      null,
      UpdateClubPresidentReputationRequest
    >({
      query: (body) => ({
        url: "clubPresidents/reputation",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "ClubPresident", id: arg.id },
        { type: "ClubPresident", id: "LIST" },
      ],
    }),

    deleteClubPresident: builder.mutation<null, string>({
      query: (id) => ({
        url: `clubPresidents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ClubPresident", id },
        { type: "ClubPresident", id: "LIST" },
        { type: "ClubPresident", id: "ME" },
      ],
    }),

  }),
});

export const {
  useGetClubPresidentsQuery,
  useGetClubPresidentByIdQuery,
  useGetClubPresidentByUserIdQuery,
  useGetCurrentUserClubPresidentQuery,
  useCheckCurrentUserHasPresidentQuery,
  useCreateClubPresidentMutation,
  useUpdateClubPresidentMutation,
  useUpdateClubPresidentReputationMutation,
  useDeleteClubPresidentMutation,
} = clubPresidentsApiSlice;
