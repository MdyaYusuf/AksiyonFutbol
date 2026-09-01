import { apiSlice } from "../../core/api/apiSlice";
import type {
  CompetitiveSeatingQueuePreview,
  CompetitiveSeatingRunResult,
} from "./competitiveSeatingTypes";

export const competitiveSeatingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompetitiveSeatingQueue: builder.query<CompetitiveSeatingQueuePreview, void>({
      query: () => ({ url: "competitive-seating/queue" }),
      providesTags: [{ type: "Club", id: "SEATING-QUEUE" }],
    }),
    runCompetitiveSeating: builder.mutation<CompetitiveSeatingRunResult, void>({
      query: () => ({
        url: "competitive-seating/run",
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Club", id: "SEATING-QUEUE" },
        { type: "Club", id: "LIST" },
        { type: "Club", id: "ME" },
        { type: "LeagueDivision", id: "LIST" },
        { type: "Match", id: "LIST" },
        { type: "Match", id: "SCHEDULED-UNPLAYED" },
      ],
    }),
  }),
});

export const {
  useGetCompetitiveSeatingQueueQuery,
  useRunCompetitiveSeatingMutation,
} = competitiveSeatingApiSlice;
