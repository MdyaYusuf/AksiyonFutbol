import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { apiClient } from "./apiClient";

type QueryParams = Record<string, string | number | boolean | null | undefined>;

const customBaseQuery: BaseQueryFn<
  { url: string; method?: string; body?: unknown; params?: QueryParams },
  unknown,
  unknown
> = async ({ url, method = "GET", body, params }) => {
  try {
    const requestBody = body instanceof FormData
      ? body
      : body
        ? JSON.stringify(body)
        : undefined;

    const result = await apiClient<unknown>(buildUrlWithParams(url, params), {
      method,
      body: requestBody,
    });

    return { data: result.data };
  } catch (error) {
    return { error };
  }
};

const buildUrlWithParams = (url: string, params?: QueryParams) => {
  if (!params) {
    return url;
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {

    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  if (!queryString) {
    return url;
  }

  return `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: [
    "Role",
    "User",
    "ClubPresident",
    "LeagueDivision",
    "Club",
    "ClubLineup",
    "BasePlayer",
    "PlayerInstance",
    "Referee",
    "Match",
    "Transfer",
    "Bribery",
    "Facility",
  ],
  endpoints: () => ({}),
});