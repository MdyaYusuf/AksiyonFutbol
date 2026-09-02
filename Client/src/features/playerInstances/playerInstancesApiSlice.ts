import { apiSlice } from "@/core/api/apiSlice";
import type { PagedResponse, PaginationRequest } from "@/core/types/ApiResponse";
import type {
  CreatedPlayerInstanceResponse,
  CreateCustomPlayerInstanceRequest,
  CreatePlayerInstanceFromBasePlayerRequest,
  PlayerInstancePreview,
  PlayerInstanceResponse,
  UpdatePlayerInstanceHealthRequest,
  UpdatePlayerInstanceNameRequest,
  UpdatePlayerInstanceSeasonStatsRequest,
  UpdatePlayerInstanceStatsRequest,
} from "@/features/playerInstances/playerInstanceTypes";

export const playerInstancesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getPlayerInstances: builder.query<
      PagedResponse<PlayerInstanceResponse>,
      PaginationRequest & {
        search?: string;
        clubId?: string;
        position?: number;
        isInjured?: boolean;
      }
    >({
      query: (params) => ({
        url: "playerInstances",
        params: {
          currentPage: params.currentPage,
          pageSize: params.pageSize,
          search: params.search,
          clubId: params.clubId,
          position: params.position,
          isInjured: params.isInjured,
        },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: "PlayerInstance" as const, id })),
            { type: "PlayerInstance", id: "LIST" },
          ]
          : [{ type: "PlayerInstance", id: "LIST" }],
    }),

    getPlayerInstanceById: builder.query<PlayerInstanceResponse, string>({
      query: (id) => ({ url: `playerInstances/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "PlayerInstance", id }],
    }),

    getPlayerInstancesByClubId: builder.query<PlayerInstancePreview[], string>({
      query: (clubId) => ({ url: `playerInstances/by-club/${clubId}` }),
      providesTags: (result, _error, clubId) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "PlayerInstance" as const, id })),
            { type: "PlayerInstance", id: `CLUB-${clubId}` },
          ]
          : [{ type: "PlayerInstance", id: `CLUB-${clubId}` }],
    }),

    getCurrentUserClubPlayers: builder.query<PlayerInstanceResponse[], void>({
      query: () => ({ url: "playerInstances/my-club" }),
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "PlayerInstance" as const, id })),
            { type: "PlayerInstance", id: "MY-CLUB" },
          ]
          : [{ type: "PlayerInstance", id: "MY-CLUB" }],
    }),

    getAvailablePlayerInstancesByClubId: builder.query<PlayerInstancePreview[], string>({
      query: (clubId) => ({ url: `playerInstances/by-club/${clubId}/available` }),
      providesTags: (result, _error, clubId) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "PlayerInstance" as const, id })),
            { type: "PlayerInstance", id: `CLUB-${clubId}-AVAILABLE` },
          ]
          : [{ type: "PlayerInstance", id: `CLUB-${clubId}-AVAILABLE` }],
    }),

    getInjuredPlayerInstancesByClubId: builder.query<PlayerInstancePreview[], string>({
      query: (clubId) => ({ url: `playerInstances/by-club/${clubId}/injured` }),
      providesTags: (result, _error, clubId) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "PlayerInstance" as const, id })),
            { type: "PlayerInstance", id: `CLUB-${clubId}-INJURED` },
          ]
          : [{ type: "PlayerInstance", id: `CLUB-${clubId}-INJURED` }],
    }),

    createPlayerInstanceFromBasePlayer: builder.mutation<
      CreatedPlayerInstanceResponse,
      CreatePlayerInstanceFromBasePlayerRequest
    >({
      query: (body) => ({
        url: "playerInstances/from-base-player",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "PlayerInstance", id: "LIST" },
        { type: "PlayerInstance", id: `CLUB-${arg.clubId}` },
        { type: "PlayerInstance", id: `CLUB-${arg.clubId}-AVAILABLE` },
        { type: "PlayerInstance", id: "MY-CLUB" },
        { type: "Club", id: arg.clubId },
        { type: "BasePlayer", id: arg.basePlayerId },
      ],
    }),

    createCustomPlayerInstance: builder.mutation<
      CreatedPlayerInstanceResponse,
      CreateCustomPlayerInstanceRequest
    >({
      query: (body) => ({
        url: "playerInstances/custom",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "PlayerInstance", id: "LIST" },
        { type: "PlayerInstance", id: `CLUB-${arg.clubId}` },
        { type: "PlayerInstance", id: `CLUB-${arg.clubId}-AVAILABLE` },
        { type: "PlayerInstance", id: "MY-CLUB" },
        { type: "Club", id: arg.clubId },
      ],
    }),

    updatePlayerInstanceName: builder.mutation<null, UpdatePlayerInstanceNameRequest>({
      query: (body) => ({
        url: "playerInstances/name",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "PlayerInstance", id: arg.id },
        { type: "PlayerInstance", id: "LIST" },
        { type: "PlayerInstance", id: "MY-CLUB" },
      ],
    }),

    updatePlayerInstanceStats: builder.mutation<null, UpdatePlayerInstanceStatsRequest>({
      query: (body) => ({
        url: "playerInstances/stats",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "PlayerInstance", id: arg.id },
        { type: "PlayerInstance", id: "LIST" },
        { type: "PlayerInstance", id: "MY-CLUB" },
      ],
    }),

    updatePlayerInstanceHealth: builder.mutation<null, UpdatePlayerInstanceHealthRequest>({
      query: (body) => ({
        url: "playerInstances/health",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "PlayerInstance", id: arg.id },
        { type: "PlayerInstance", id: "LIST" },
        { type: "PlayerInstance", id: "MY-CLUB" },
      ],
    }),

    updatePlayerInstanceSeasonStats: builder.mutation<
      null,
      UpdatePlayerInstanceSeasonStatsRequest
    >({
      query: (body) => ({
        url: "playerInstances/season-stats",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "PlayerInstance", id: arg.id },
        { type: "PlayerInstance", id: "LIST" },
        { type: "PlayerInstance", id: "MY-CLUB" },
      ],
    }),

    deletePlayerInstance: builder.mutation<null, string>({
      query: (id) => ({
        url: `playerInstances/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PlayerInstance", id },
        { type: "PlayerInstance", id: "LIST" },
        { type: "PlayerInstance", id: "MY-CLUB" },
      ],
    }),

  }),
});

export const {
  useGetPlayerInstancesQuery,
  useGetPlayerInstanceByIdQuery,
  useGetPlayerInstancesByClubIdQuery,
  useGetCurrentUserClubPlayersQuery,
  useGetAvailablePlayerInstancesByClubIdQuery,
  useGetInjuredPlayerInstancesByClubIdQuery,
  useCreatePlayerInstanceFromBasePlayerMutation,
  useCreateCustomPlayerInstanceMutation,
  useUpdatePlayerInstanceNameMutation,
  useUpdatePlayerInstanceStatsMutation,
  useUpdatePlayerInstanceHealthMutation,
  useUpdatePlayerInstanceSeasonStatsMutation,
  useDeletePlayerInstanceMutation,
} = playerInstancesApiSlice;
