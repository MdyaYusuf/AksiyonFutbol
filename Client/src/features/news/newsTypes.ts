export const NewsArticleKind = {
  Scandal: 1,
  ClubLife: 2,
  MatchReport: 3,
  Placement: 4,
} as const;

export type NewsArticleKind = (typeof NewsArticleKind)[keyof typeof NewsArticleKind];

export const NewsArticleTone = {
  Critical: 1,
  Neutral: 2,
  Positive: 3,
  Sensational: 4,
} as const;

export type NewsArticleTone = (typeof NewsArticleTone)[keyof typeof NewsArticleTone];

export interface NewsArticle {
  id: string;
  divisionId: number;
  season: number;
  matchWeek?: number | null;
  subjectClubId?: string | null;
  subjectClubName?: string | null;
  kind: NewsArticleKind;
  tone: NewsArticleTone;
  headline: string;
  body: string;
  createdDate: string;
}

export type NewsFeedFilter = "all" | "scandals" | "club" | "results";
