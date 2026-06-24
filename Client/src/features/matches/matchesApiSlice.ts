import { apiSlice } from "../../core/api/apiSlice";
import type {
  CreatedMatchResponse,
  CreateMatchRequest,
  MatchPreview,
  MatchResponse,
  UpdateMatchScheduleRequest,
} from "./matchTypes";

export const matchesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getMatches: builder.query<MatchResponse[], void>({
      query: () => ({ url: "matches" }),
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Match" as const, id })),
            { type: "Match", id: "LIST" },
          ]
          : [{ type: "Match", id: "LIST" }],
    }),

    getMatchById: builder.query<MatchResponse, string>({
      query: (id) => ({ url: `matches/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Match", id }],
    }),

    getMatchesByClubId: builder.query<MatchPreview[], string>({
      query: (clubId) => ({ url: `matches/club/${clubId}` }),
      providesTags: (result, _error, clubId) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Match" as const, id })),
            { type: "Match", id: `CLUB-${clubId}` },
          ]
          : [{ type: "Match", id: `CLUB-${clubId}` }],
    }),

    getMatchesByDivisionAndMatchWeek: builder.query<
      MatchPreview[],
      { divisionId: number; matchWeek: number }
    >({
      query: ({ divisionId, matchWeek }) => ({
        url: `matches/division/${divisionId}/week/${matchWeek}`,
      }),
      providesTags: (result, _error, arg) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Match" as const, id })),
            { type: "Match", id: `DIVISION-${arg.divisionId}-WEEK-${arg.matchWeek}` },
          ]
          : [{ type: "Match", id: `DIVISION-${arg.divisionId}-WEEK-${arg.matchWeek}` }],
    }),

    getScheduledUnplayedMatches: builder.query<MatchPreview[], number | void>({
      query: (count = 20) => ({
        url: "matches/scheduled-unplayed",
        params: { count },
      }),
      providesTags: [{ type: "Match", id: "SCHEDULED-UNPLAYED" }],
    }),

    createMatch: builder.mutation<CreatedMatchResponse, CreateMatchRequest>({
      query: (body) => ({
        url: "matches",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Match", id: "LIST" },
        { type: "Match", id: "SCHEDULED-UNPLAYED" },
        { type: "Match", id: `CLUB-${arg.homeClubId}` },
        { type: "Match", id: `CLUB-${arg.awayClubId}` },
        { type: "Match", id: `DIVISION-${arg.divisionId}-WEEK-${arg.matchWeek}` },
        { type: "Club", id: arg.homeClubId },
        { type: "Club", id: arg.awayClubId },
        ...(arg.refereeId ? [{ type: "Referee" as const, id: arg.refereeId }] : []),
      ],
    }),

    updateMatchSchedule: builder.mutation<MatchResponse, UpdateMatchScheduleRequest>({
      query: (body) => ({
        url: "matches",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Match", id: arg.id },
        { type: "Match", id: "LIST" },
        { type: "Match", id: "SCHEDULED-UNPLAYED" },
        { type: "Match", id: `CLUB-${arg.homeClubId}` },
        { type: "Match", id: `CLUB-${arg.awayClubId}` },
        { type: "Match", id: `DIVISION-${arg.divisionId}-WEEK-${arg.matchWeek}` },
        ...(arg.refereeId ? [{ type: "Referee" as const, id: arg.refereeId }] : []),
      ],
    }),

    simulateMatch: builder.mutation<MatchResponse, string>({
      query: (id) => ({
        url: `matches/${id}/simulate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Match", id },
        { type: "Match", id: "LIST" },
        { type: "Match", id: "SCHEDULED-UNPLAYED" },
        { type: "PlayerInstance", id: "LIST" },
        { type: "PlayerInstance", id: "MY-CLUB" },
      ],
    }),

    deleteMatch: builder.mutation<string, string>({
      query: (id) => ({
        url: `matches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Match", id },
        { type: "Match", id: "LIST" },
        { type: "Match", id: "SCHEDULED-UNPLAYED" },
      ],
    }),

  }),
});

export const {
  useGetMatchesQuery,
  useGetMatchByIdQuery,
  useGetMatchesByClubIdQuery,
  useGetMatchesByDivisionAndMatchWeekQuery,
  useGetScheduledUnplayedMatchesQuery,
  useCreateMatchMutation,
  useUpdateMatchScheduleMutation,
  useSimulateMatchMutation,
  useDeleteMatchMutation,
} = matchesApiSlice;
