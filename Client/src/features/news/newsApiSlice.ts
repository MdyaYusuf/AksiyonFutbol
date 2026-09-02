import { apiSlice } from "@/core/api/apiSlice";
import type { NewsArticle, NewsArticleKind } from "@/features/news/newsTypes";

export const newsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyNewsFeed: builder.query<NewsArticle[], { kind?: NewsArticleKind; limit?: number } | void>({
      query: (args) => ({
        url: "news/me",
        params: args
          ? {
              kind: args.kind,
              limit: args.limit,
            }
          : undefined,
      }),
      providesTags: [{ type: "News", id: "FEED" }],
    }),
  }),
});

export const { useGetMyNewsFeedQuery } = newsApiSlice;
