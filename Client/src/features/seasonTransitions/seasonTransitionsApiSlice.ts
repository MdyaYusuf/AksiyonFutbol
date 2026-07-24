import { apiSlice } from "../../core/api/apiSlice";
import type {
  SeasonEndPreview,
  SeasonEndProcessResult,
} from "./seasonTransitionTypes";

export const seasonTransitionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSeasonEndPreview: builder.query<SeasonEndPreview, number>({
      query: (divisionId) => ({
        url: `leagueDivisions/${divisionId}/season-end-preview`,
      }),
      providesTags: (_result, _error, divisionId) => [
        { type: "LeagueDivision", id: `SEASON-END-${divisionId}` },
      ],
    }),

    processSeasonEnd: builder.mutation<SeasonEndProcessResult, number>({
      query: (divisionId) => ({
        url: `leagueDivisions/${divisionId}/process-season-end`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, divisionId) => [
        { type: "LeagueDivision", id: divisionId },
        { type: "LeagueDivision", id: "LIST" },
        { type: "LeagueDivision", id: `SEASON-END-${divisionId}` },
        { type: "Club", id: "ME" },
        { type: "Club", id: "LIST" },
        { type: "Match", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetSeasonEndPreviewQuery, useProcessSeasonEndMutation } =
  seasonTransitionsApiSlice;
