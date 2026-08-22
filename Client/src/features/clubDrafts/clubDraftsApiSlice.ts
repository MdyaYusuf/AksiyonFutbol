import { apiSlice } from "../../core/api/apiSlice";
import { clubsApiSlice } from "../clubs/clubsApiSlice";
import type {
  AddClubDraftPickRequest,
  ClubDraftState,
  DraftCatalogPlayer,
  FinalizeClubDraftResponse,
} from "./clubDraftTypes";

export const clubDraftsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClubDraftCatalog: builder.query<DraftCatalogPlayer[], void>({
      query: () => ({ url: "clubDrafts/me/catalog" }),
      providesTags: [{ type: "ClubDraft", id: "CATALOG" }],
      keepUnusedDataFor: 0,
    }),

    getClubDraftState: builder.query<ClubDraftState, void>({
      query: () => ({ url: "clubDrafts/me" }),
      providesTags: [{ type: "ClubDraft", id: "ME" }],
      keepUnusedDataFor: 0,
    }),

    addClubDraftPick: builder.mutation<ClubDraftState, AddClubDraftPickRequest>({
      query: (body) => ({
        url: "clubDrafts/me/picks",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "ClubDraft", id: "ME" },
        { type: "ClubDraft", id: "CATALOG" },
      ],
    }),

    removeClubDraftPick: builder.mutation<ClubDraftState, string>({
      query: (basePlayerId) => ({
        url: `clubDrafts/me/picks/${basePlayerId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "ClubDraft", id: "ME" },
        { type: "ClubDraft", id: "CATALOG" },
      ],
    }),

    finalizeClubDraft: builder.mutation<FinalizeClubDraftResponse, void>({
      query: () => ({
        url: "clubDrafts/me/finalize",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            clubsApiSlice.util.updateQueryData("getCurrentUserClub", undefined, (club) => {
              club.lifecycleStatus = data.lifecycleStatus;
              club.divisionId = data.tutorialDivisionId;
              club.divisionName = data.tutorialDivisionName;
              club.tutorialDivisionId = data.tutorialDivisionId;
            }),
          );
        } catch {
          /* Toasts via apiClient */
        }
      },
      invalidatesTags: [
        { type: "Club", id: "ME" },
        { type: "Club", id: "LIST" },
        { type: "LeagueDivision", id: "LIST" },
        { type: "PlayerInstance", id: "LIST" },
        { type: "ClubLineup", id: "LIST" },
        { type: "Match", id: "LIST" },
        { type: "Match", id: "SCHEDULED-UNPLAYED" },
      ],
    }),
  }),
});

export const {
  useGetClubDraftCatalogQuery,
  useGetClubDraftStateQuery,
  useAddClubDraftPickMutation,
  useRemoveClubDraftPickMutation,
  useFinalizeClubDraftMutation,
} = clubDraftsApiSlice;
