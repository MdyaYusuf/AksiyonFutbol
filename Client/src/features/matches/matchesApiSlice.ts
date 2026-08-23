import { apiSlice } from "../../core/api/apiSlice";
import type {
  CreatedMatchResponse,
  CreateMatchRequest,
  MatchLiveStatus,
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

    getMatchLiveStatus: builder.query<
      MatchLiveStatus,
      { matchId: string; clubId: string }
    >({
      query: ({ matchId }) => ({ url: `matches/${matchId}/live-status` }),
      async onQueryStarted({ matchId, clubId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Mark the fixture as kicked off so live UI can start. Do not write the
          // final score or invalidate club cash — that would spoil the replay.
          dispatch(
            matchesApiSlice.util.updateQueryData(
              "getMatchesByClubId",
              clubId,
              (draft) => {
                const match = draft.find((entry) => entry.id === matchId);

                if (!match) {
                  return;
                }

                match.isPlayed = data.isPlayed;
              },
            ),
          );
        } catch {
          // Status poll failures are non-fatal; next tick retries.
        }
      },
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

    getMatchesByDivisionId: builder.query<MatchPreview[], number>({
      query: (divisionId) => ({ url: `matches/division/${divisionId}` }),
      providesTags: (result, _error, divisionId) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Match" as const, id })),
            { type: "Match", id: `DIVISION-${divisionId}` },
          ]
          : [{ type: "Match", id: `DIVISION-${divisionId}` }],
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
      query: (count) => ({
        url: "matches/scheduled-unplayed",
        params: { count: count ?? 20 },
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
        { type: "Match", id: `DIVISION-${arg.divisionId}` },
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
        { type: "Match", id: `DIVISION-${arg.divisionId}` },
        { type: "Match", id: `DIVISION-${arg.divisionId}-WEEK-${arg.matchWeek}` },
        ...(arg.refereeId ? [{ type: "Referee" as const, id: arg.refereeId }] : []),
      ],
    }),

    simulateMatch: builder.mutation<MatchResponse, string>({
      query: (id) => ({
        url: `matches/${id}/simulate`,
        method: "POST",
      }),
      invalidatesTags: (result, _error, id) => [
        { type: "Match", id },
        { type: "Match", id: "LIST" },
        { type: "Match", id: "SCHEDULED-UNPLAYED" },
        { type: "PlayerInstance", id: "LIST" },
        { type: "PlayerInstance", id: "MY-CLUB" },
        { type: "Club", id: "LIST" },
        { type: "Club", id: "ME" },
        { type: "Facility", id: "ME" },
        { type: "Actions", id: "CONTEXT" },
        { type: "Bribery", id: "CONTEXT" },
        ...(result
          ? [
              { type: "Club" as const, id: result.homeClubId },
              { type: "Club" as const, id: result.awayClubId },
              { type: "Match" as const, id: `CLUB-${result.homeClubId}` },
              { type: "Match" as const, id: `CLUB-${result.awayClubId}` },
              { type: "Match" as const, id: `DIVISION-${result.divisionId}` },
              {
                type: "Match" as const,
                id: `DIVISION-${result.divisionId}-WEEK-${result.matchWeek}`,
              },
            ]
          : []),
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
        { type: "PlayerInstance", id: "LIST" },
        { type: "Club", id: "LIST" },
      ],
    }),

  }),
});

export const {
  useGetMatchesQuery,
  useGetMatchByIdQuery,
  useGetMatchLiveStatusQuery,
  useGetMatchesByClubIdQuery,
  useGetMatchesByDivisionIdQuery,
  useGetMatchesByDivisionAndMatchWeekQuery,
  useGetScheduledUnplayedMatchesQuery,
  useCreateMatchMutation,
  useUpdateMatchScheduleMutation,
  useSimulateMatchMutation,
  useDeleteMatchMutation,
} = matchesApiSlice;
