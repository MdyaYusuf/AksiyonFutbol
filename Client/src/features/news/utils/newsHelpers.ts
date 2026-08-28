import { NewsArticleKind, NewsArticleTone, type NewsArticle, type NewsFeedFilter } from "../newsTypes";

export const filterToKind = (filter: NewsFeedFilter): NewsArticleKind | undefined => {
  switch (filter) {
    case "scandals":
      return NewsArticleKind.Scandal;
    case "club":
      return NewsArticleKind.ClubLife;
    case "results":
      return NewsArticleKind.MatchReport;
    default:
      return undefined;
  }
};

export const getKindLabel = (kind: NewsArticleKind): string => {
  switch (kind) {
    case NewsArticleKind.Scandal:
      return "Scandal";
    case NewsArticleKind.ClubLife:
      return "Club Life";
    case NewsArticleKind.MatchReport:
      return "Results";
    default:
      return "News";
  }
};

export const getToneBadgeClass = (tone: NewsArticleTone): string => {
  switch (tone) {
    case NewsArticleTone.Sensational:
      return "border-error/40 bg-error/15 text-error";
    case NewsArticleTone.Critical:
      return "border-tertiary/40 bg-tertiary/15 text-tertiary";
    case NewsArticleTone.Positive:
      return "border-primary/40 bg-primary/15 text-primary";
    default:
      return "border-outline-variant bg-surface-container-highest text-on-surface-variant";
  }
};

export const formatArticleDate = (createdDate: string): string => {
  const date = new Date(createdDate);

  if (Number.isNaN(date.getTime())) {
    return createdDate;
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getArticlePreview = (article: NewsArticle): string => {
  if (article.body.length <= 160) {
    return article.body;
  }

  return `${article.body.slice(0, 157)}...`;
};
