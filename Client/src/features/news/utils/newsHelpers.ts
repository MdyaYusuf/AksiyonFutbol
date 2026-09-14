import {
  NewsArticleKind,
  NewsArticleTone,
  type NewsArticle,
  type NewsFeedFilter,
} from "@/features/news/newsTypes";

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
    case NewsArticleKind.Placement:
      return "Club";
    case NewsArticleKind.MatchReport:
      return "Results";
    default:
      return "News";
  }
};

export const getKindIcon = (kind: NewsArticleKind): string => {
  if (kind === NewsArticleKind.Scandal) {
    return "crisis_alert";
  }

  if (kind === NewsArticleKind.MatchReport) {
    return "sports_soccer";
  }

  return "favorite";
};

/** Kind colors — primary visual cue on the feed (tone is secondary). */
export const getKindBadgeClass = (kind: NewsArticleKind): string => {
  if (kind === NewsArticleKind.Scandal) {
    return "border-error/40 bg-error/15 text-error";
  }

  if (kind === NewsArticleKind.MatchReport) {
    return "border-orange-400/40 bg-orange-400/15 text-orange-400";
  }

  if (kind === NewsArticleKind.Placement) {
    return "border-teal-400/40 bg-teal-400/15 text-teal-400";
  }

  return "border-sky-400/40 bg-sky-400/15 text-sky-400";
};

export const getKindCardShellClass = (): string => {
  return "rounded-lg border border-[#334155] bg-surface-container-high p-5 transition-colors hover:bg-[#334155]";
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

export const getToneLabel = (tone: NewsArticleTone): string => {
  switch (tone) {
    case NewsArticleTone.Sensational:
      return "Sensational";
    case NewsArticleTone.Critical:
      return "Critical";
    case NewsArticleTone.Positive:
      return "Positive";
    default:
      return "Neutral";
  }
};

export const getNewsFilterButtonClass = (
  filterId: NewsFeedFilter,
  isActive: boolean,
): string => {
  const base =
    "rounded-full border px-4 py-2 text-body-sm font-label-caps uppercase tracking-wider transition-colors";

  if (!isActive) {
    return `${base} border-[#334155] bg-surface-container-high text-on-surface-variant hover:bg-surface-variant`;
  }

  if (filterId === "scandals") {
    return `${base} border-error/50 bg-error/20 text-error`;
  }

  if (filterId === "club") {
    return `${base} border-sky-400/50 bg-sky-400/20 text-sky-400`;
  }

  if (filterId === "results") {
    return `${base} border-orange-400/50 bg-orange-400/20 text-orange-400`;
  }

  return `${base} border-primary bg-primary/15 font-semibold text-primary`;
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
