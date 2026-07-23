import { apiSlice } from "../../core/api/apiSlice";
import type {
  ClubFacilitiesOverview,
  UpgradeFacilityRequest,
} from "./facilityTypes";

export const facilitiesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyFacilities: builder.query<ClubFacilitiesOverview, void>({
      query: () => ({ url: "facilities/me" }),
      providesTags: [{ type: "Facility", id: "ME" }],
    }),

    upgradeFacility: builder.mutation<ClubFacilitiesOverview, UpgradeFacilityRequest>({
      query: (body) => ({
        url: "facilities/upgrade",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Facility", id: "ME" },
        { type: "Club", id: "ME" },
      ],
    }),
  }),
});

export const { useGetMyFacilitiesQuery, useUpgradeFacilityMutation } =
  facilitiesApiSlice;
