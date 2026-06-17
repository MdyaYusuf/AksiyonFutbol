import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { apiClient } from "./apiClient";

const customBaseQuery: BaseQueryFn<
  { url: string; method?: string; body?: unknown },
  unknown,
  unknown
> = async ({ url, method = "GET", body }) => {
  try {
    const result = await apiClient<unknown>(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });

    return { data: result.data };
  } catch (error) {
    return { error };
  }
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["Role"],
  endpoints: () => ({}),
});