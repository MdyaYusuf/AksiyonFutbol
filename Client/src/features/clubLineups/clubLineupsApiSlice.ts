import { apiSlice } from "../../core/api/apiSlice";
import type { ClubLineupResponse, UpsertClubLineupRequest } from "./clubLineupTypes";

export const clubLineupsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyClubLineup: builder.query<ClubLineupResponse, void>({
      query: () => ({ url: "clubLineups/me" }),
      providesTags: [{ type: "ClubLineup", id: "ME" }],
    }),

    upsertMyClubLineup: builder.mutation<ClubLineupResponse, UpsertClubLineupRequest>({
      query: (body) => ({
        url: "clubLineups/me",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "ClubLineup", id: "ME" }],
    }),
  }),
});

export const {
  useGetMyClubLineupQuery,
  useUpsertMyClubLineupMutation,
} = clubLineupsApiSlice;
