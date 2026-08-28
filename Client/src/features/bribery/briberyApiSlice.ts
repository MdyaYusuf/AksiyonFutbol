import { apiSlice } from "../../core/api/apiSlice";
import type {
  BribeAttemptResponse,
  BriberyContext,
  CreateBribeAttemptRequest,
} from "./briberyTypes";

export const briberyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBriberyContext: builder.query<BriberyContext, void>({
      query: () => ({ url: "bribery/context" }),
      providesTags: [{ type: "Bribery", id: "CONTEXT" }],
    }),

    getMyBribeAttempts: builder.query<BribeAttemptResponse[], void>({
      query: () => ({ url: "bribery/attempts/me" }),
      providesTags: [{ type: "Bribery", id: "ATTEMPTS" }],
    }),

    createBribeAttempt: builder.mutation<BribeAttemptResponse, CreateBribeAttemptRequest>({
      query: (body) => ({
        url: "bribery/attempts",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Bribery", id: "CONTEXT" },
        { type: "Bribery", id: "ATTEMPTS" },
        { type: "Club", id: "ME" },
        { type: "ClubPresident", id: "ME" },
        { type: "Actions", id: "CONTEXT" },
      ],
    }),
  }),
});

export const {
  useGetBriberyContextQuery,
  useGetMyBribeAttemptsQuery,
  useCreateBribeAttemptMutation,
} = briberyApiSlice;
