import { apiSlice } from "../../core/api/apiSlice";
import type { PagedResponse, PaginationRequest } from "../../core/types/ApiResponse";
import type {
  CreatedRefereeResponse,
  CreateRefereeRequest,
  RefereePersonalityType,
  RefereePreview,
  RefereeResponse,
  UpdateRefereeRequest,
} from "./refereeTypes";

export const refereesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getReferees: builder.query<
      PagedResponse<RefereeResponse>,
      PaginationRequest & {
        search?: string;
        personalityType?: RefereePersonalityType;
      }
    >({
      query: (params) => ({
        url: "referees",
        params: {
          currentPage: params.currentPage,
          pageSize: params.pageSize,
          search: params.search,
          personalityType: params.personalityType,
        },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: "Referee" as const, id })),
            { type: "Referee", id: "LIST" },
          ]
          : [{ type: "Referee", id: "LIST" }],
    }),

    getRefereeById: builder.query<RefereeResponse, number>({
      query: (id) => ({ url: `referees/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Referee", id }],
    }),

    getRefereesByPersonalityType: builder.query<
      RefereePreview[],
      RefereePersonalityType
    >({
      query: (personalityType) => ({
        url: `referees/personality/${personalityType}`,
      }),
      providesTags: (result, _error, personalityType) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Referee" as const, id })),
            { type: "Referee", id: `PERSONALITY-${personalityType}` },
          ]
          : [{ type: "Referee", id: `PERSONALITY-${personalityType}` }],
    }),

    getEasiestToBribeReferees: builder.query<RefereePreview[], number>({
      query: (count) => ({ url: `referees/easiest-to-bribe/${count}` }),
      providesTags: [{ type: "Referee", id: "EASIEST-TO-BRIBE" }],
    }),

    createReferee: builder.mutation<CreatedRefereeResponse, CreateRefereeRequest>({
      query: (body) => ({
        url: "referees",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Referee", id: "LIST" },
        { type: "Referee", id: `PERSONALITY-${arg.personalityType}` },
        { type: "Referee", id: "EASIEST-TO-BRIBE" },
      ],
    }),

    updateReferee: builder.mutation<null, UpdateRefereeRequest>({
      query: (body) => ({
        url: "referees",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Referee", id: arg.id },
        { type: "Referee", id: "LIST" },
        { type: "Referee", id: `PERSONALITY-${arg.personalityType}` },
        { type: "Referee", id: "EASIEST-TO-BRIBE" },
      ],
    }),

    deleteReferee: builder.mutation<null, number>({
      query: (id) => ({
        url: `referees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Referee", id },
        { type: "Referee", id: "LIST" },
        { type: "Referee", id: "EASIEST-TO-BRIBE" },
      ],
    }),

  }),
});

export const {
  useGetRefereesQuery,
  useGetRefereeByIdQuery,
  useGetRefereesByPersonalityTypeQuery,
  useGetEasiestToBribeRefereesQuery,
  useCreateRefereeMutation,
  useUpdateRefereeMutation,
  useDeleteRefereeMutation,
} = refereesApiSlice;
