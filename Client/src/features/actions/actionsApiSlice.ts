import { apiSlice } from "../../core/api/apiSlice";
import type {
  ClubActionHistoryItem,
  ClubActionResult,
  ClubActionsContext,
  ExecuteClubActionRequest,
} from "./actionTypes";

export const actionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActionsContext: builder.query<ClubActionsContext, void>({
      query: () => ({ url: "actions/context" }),
      providesTags: [{ type: "Actions", id: "CONTEXT" }],
    }),

    getMyActionHistory: builder.query<ClubActionHistoryItem[], void>({
      query: () => ({ url: "actions/history/me" }),
      providesTags: [{ type: "Actions", id: "HISTORY" }],
    }),

    executeClubAction: builder.mutation<ClubActionResult, ExecuteClubActionRequest>({
      query: (body) => ({
        url: "actions/execute",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Actions", id: "CONTEXT" },
        { type: "Actions", id: "HISTORY" },
        { type: "Club", id: "ME" },
        { type: "Facility", id: "ME" },
        { type: "ClubPresident", id: "ME" },
        { type: "Bribery", id: "CONTEXT" },
        { type: "News", id: "FEED" },
      ],
    }),
  }),
});

export const {
  useGetActionsContextQuery,
  useGetMyActionHistoryQuery,
  useExecuteClubActionMutation,
} = actionsApiSlice;
