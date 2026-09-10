import { apiSlice } from "@/core/api/apiSlice";
import type {
  ClaimObjectiveRequest,
  ClaimObjectiveResult,
  EquipTitleRequest,
  ObjectivesContext,
} from "@/features/objectives/objectiveTypes";

export const objectivesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getObjectivesContext: builder.query<ObjectivesContext, void>({
      query: () => ({ url: "objectives" }),
      providesTags: [{ type: "Objectives", id: "CONTEXT" }],
    }),

    claimObjective: builder.mutation<ClaimObjectiveResult, ClaimObjectiveRequest>({
      query: (body) => ({
        url: "objectives/claim",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Objectives", id: "CONTEXT" },
        { type: "Club", id: "ME" },
        { type: "ClubPresident", id: "ME" },
        { type: "Actions", id: "CONTEXT" },
      ],
    }),

    equipTitle: builder.mutation<ObjectivesContext, EquipTitleRequest>({
      query: (body) => ({
        url: "objectives/titles/equip",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Objectives", id: "CONTEXT" },
        { type: "ClubPresident", id: "ME" },
      ],
    }),
  }),
});

export const {
  useGetObjectivesContextQuery,
  useClaimObjectiveMutation,
  useEquipTitleMutation,
} = objectivesApiSlice;
