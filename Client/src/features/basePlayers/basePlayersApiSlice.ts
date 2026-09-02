import { apiSlice } from "@/core/api/apiSlice";
import type { PagedResponse, PaginationRequest } from "@/core/types/ApiResponse";
import type {
  BasePlayerOption,
  BasePlayerPreview,
  BasePlayerResponse,
  CreatedBasePlayerResponse,
  CreateBasePlayerRequest,
  PlayerPosition,
  UpdateBasePlayerRequest,
} from "@/features/basePlayers/basePlayerTypes";

export const basePlayersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getBasePlayers: builder.query<
      PagedResponse<BasePlayerResponse>,
      PaginationRequest & {
        search?: string;
        position?: PlayerPosition;
      }
    >({
      query: (params) => ({
        url: "basePlayers",
        params: {
          currentPage: params.currentPage,
          pageSize: params.pageSize,
          search: params.search,
          position: params.position,
        },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: "BasePlayer" as const, id })),
            { type: "BasePlayer", id: "LIST" },
          ]
          : [{ type: "BasePlayer", id: "LIST" }],
    }),

    getBasePlayerOptions: builder.query<BasePlayerOption[], void>({
      query: () => ({ url: "basePlayers/options" }),
      providesTags: [{ type: "BasePlayer", id: "OPTIONS" }],
    }),

    getBasePlayerById: builder.query<BasePlayerResponse, string>({
      query: (id) => ({ url: `basePlayers/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "BasePlayer", id }],
    }),

    getBasePlayersByPosition: builder.query<BasePlayerPreview[], PlayerPosition>({
      query: (position) => ({ url: `basePlayers/position/${position}` }),
      providesTags: (result, _error, position) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "BasePlayer" as const, id })),
            { type: "BasePlayer", id: `POSITION-${position}` },
          ]
          : [{ type: "BasePlayer", id: `POSITION-${position}` }],
    }),

    createBasePlayer: builder.mutation<CreatedBasePlayerResponse, CreateBasePlayerRequest>({
      query: (body) => ({
        url: "basePlayers",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "BasePlayer", id: "LIST" },
        { type: "BasePlayer", id: "OPTIONS" },
        { type: "BasePlayer", id: `POSITION-${arg.position}` },
      ],
    }),

    updateBasePlayer: builder.mutation<null, UpdateBasePlayerRequest>({
      query: (body) => ({
        url: "basePlayers",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "BasePlayer", id: arg.id },
        { type: "BasePlayer", id: "LIST" },
        { type: "BasePlayer", id: "OPTIONS" },
        { type: "BasePlayer", id: `POSITION-${arg.position}` },
      ],
    }),

    deleteBasePlayer: builder.mutation<null, string>({
      query: (id) => ({
        url: `basePlayers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "BasePlayer", id },
        { type: "BasePlayer", id: "LIST" },
        { type: "BasePlayer", id: "OPTIONS" },
      ],
    }),

  }),
});

export const {
  useGetBasePlayersQuery,
  useGetBasePlayerOptionsQuery,
  useGetBasePlayerByIdQuery,
  useGetBasePlayersByPositionQuery,
  useCreateBasePlayerMutation,
  useUpdateBasePlayerMutation,
  useDeleteBasePlayerMutation,
} = basePlayersApiSlice;
