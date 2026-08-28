import { useMemo, useState } from "react";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { useGetMyNewsFeedQuery } from "../newsApiSlice";
import { NewsArticleKind } from "../newsTypes";
import {
  filterToKind,
  formatArticleDate,
  getKindLabel,
  getToneBadgeClass,
} from "../utils/newsHelpers";
import type { NewsFeedFilter } from "../newsTypes";

const filterOptions: { id: NewsFeedFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "scandals", label: "Scandals" },
  { id: "club", label: "Club" },
  { id: "results", label: "Results" },
];

export const NewsPage = () => {
  const [activeFilter, setActiveFilter] = useState<NewsFeedFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const kind = filterToKind(activeFilter);
  const { data: articles = [], isLoading, isError } = useGetMyNewsFeedQuery(
    kind != null ? { kind } : undefined,
  );

  const sortedArticles = useMemo(
    () => [...articles].sort(
      (left, right) => new Date(right.createdDate).getTime() - new Date(left.createdDate).getTime(),
    ),
    [articles],
  );

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <MaterialIcon name="newspaper" className="text-3xl text-primary" />
          <div>
            <h1 className="text-headline-md font-bold text-on-surface">Division News</h1>
            <p className="text-body-sm text-on-surface-variant">
              Scandals, club life, and match desk coverage from your division press room.
            </p>
          </div>
        </div>
        <p className="rounded-lg border border-outline-variant bg-surface-container-high px-4 py-3 text-body-sm text-on-surface-variant">
          Headlines are generated from in-game events. They reflect rumors and reporting, not
          guaranteed facts about other managers&apos; choices.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const isActive = activeFilter === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setActiveFilter(option.id);
                setExpandedId(null);
              }}
              className={[
                "rounded-full border px-4 py-2 text-body-sm transition-colors",
                isActive
                  ? "border-primary bg-primary/15 font-semibold text-primary"
                  : "border-outline-variant bg-surface-container-high text-on-surface-variant hover:border-primary/40",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center text-on-surface-variant">
          Loading division news...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-error/40 bg-error/10 px-4 py-6 text-body-sm text-error">
          Could not load the news feed. Try again shortly.
        </div>
      ) : null}

      {!isLoading && !isError && sortedArticles.length === 0 ? (
        <div className="rounded-lg border border-outline-variant bg-surface-container-high px-4 py-10 text-center text-body-sm text-on-surface-variant">
          No stories yet. Scandals, honorable club moves, and match results will appear here as the
          season unfolds.
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        {sortedArticles.map((article) => {
          const isExpanded = expandedId === article.id;
          const kindIcon =
            article.kind === NewsArticleKind.Scandal
              ? "crisis_alert"
              : article.kind === NewsArticleKind.ClubLife
                ? "favorite"
                : "sports_soccer";

          return (
            <article
              key={article.id}
              className="rounded-lg border border-outline-variant bg-surface-container-high p-5"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={[
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-label-caps",
                    getToneBadgeClass(article.tone),
                  ].join(" ")}
                >
                  <MaterialIcon name={kindIcon} className="text-sm" />
                  {getKindLabel(article.kind)}
                </span>
                {article.matchWeek != null ? (
                  <span className="text-label-caps text-on-surface-variant">
                    Week {article.matchWeek}
                  </span>
                ) : null}
                <span className="text-body-sm text-on-surface-variant">
                  {formatArticleDate(article.createdDate)}
                </span>
              </div>

              <h2 className="text-title-md font-semibold text-on-surface">{article.headline}</h2>

              {article.subjectClubName ? (
                <p className="mt-1 text-body-sm text-on-surface-variant">
                  Subject: {article.subjectClubName}
                </p>
              ) : null}

              <p className="mt-3 whitespace-pre-wrap text-body-sm leading-relaxed text-on-surface">
                {isExpanded ? article.body : `${article.body.slice(0, 220)}${article.body.length > 220 ? "..." : ""}`}
              </p>

              {article.body.length > 220 ? (
                <button
                  type="button"
                  className="mt-3 text-body-sm font-semibold text-primary hover:underline"
                  onClick={() => {
                    setExpandedId(isExpanded ? null : article.id);
                  }}
                >
                  {isExpanded ? "Show less" : "Read full story"}
                </button>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
};
