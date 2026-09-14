import { useMemo, useState } from "react";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { useGetMyNewsFeedQuery } from "@/features/news/newsApiSlice";
import { NewsArticleTone, type NewsFeedFilter } from "@/features/news/newsTypes";
import {
  filterToKind,
  formatArticleDate,
  getKindBadgeClass,
  getKindCardShellClass,
  getKindIcon,
  getKindLabel,
  getNewsFilterButtonClass,
  getToneBadgeClass,
  getToneLabel,
} from "@/features/news/utils/newsHelpers";

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
    () =>
      [...articles].sort(
        (left, right) =>
          new Date(right.createdDate).getTime() - new Date(left.createdDate).getTime(),
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
        <p className="rounded-lg border border-secondary/30 bg-secondary/10 px-4 py-3 text-body-sm text-secondary">
          Headlines are generated from in-game events. They reflect rumors and reporting, not
          guaranteed facts about other managers&apos; choices.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 rounded-lg border border-[#334155] bg-surface-container p-1">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              setActiveFilter(option.id);
              setExpandedId(null);
            }}
            className={getNewsFilterButtonClass(option.id, activeFilter === option.id)}
          >
            {option.label}
          </button>
        ))}
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
        <div className="rounded-lg border border-[#334155] bg-surface-container-high px-4 py-10 text-center text-body-sm text-on-surface-variant">
          No stories yet. Placement desk coverage, scandals, club moves, and match results will
          appear here as the season unfolds.
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        {sortedArticles.map((article) => {
          const isExpanded = expandedId === article.id;
          const showTone = article.tone !== NewsArticleTone.Neutral;

          return (
            <article key={article.id} className={getKindCardShellClass()}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={[
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-label-caps",
                    getKindBadgeClass(article.kind),
                  ].join(" ")}
                >
                  <MaterialIcon name={getKindIcon(article.kind)} className="text-sm" />
                  {getKindLabel(article.kind)}
                </span>
                {showTone ? (
                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-2.5 py-1 text-label-caps",
                      getToneBadgeClass(article.tone),
                    ].join(" ")}
                  >
                    {getToneLabel(article.tone)}
                  </span>
                ) : null}
                {article.matchWeek != null ? (
                  <span className="rounded border border-secondary/30 bg-secondary/10 px-2 py-0.5 text-label-caps text-secondary">
                    Week {article.matchWeek}
                  </span>
                ) : null}
                <span className="text-body-sm text-on-surface-variant">
                  {formatArticleDate(article.createdDate)}
                </span>
              </div>

              <h2 className="text-title-md font-semibold text-on-surface">{article.headline}</h2>

              {article.subjectClubName ? (
                <p className="mt-1 text-body-sm text-sky-400">
                  Subject: {article.subjectClubName}
                </p>
              ) : null}

              <p className="mt-3 whitespace-pre-wrap text-body-sm leading-relaxed text-on-surface-variant">
                {isExpanded
                  ? article.body
                  : `${article.body.slice(0, 220)}${article.body.length > 220 ? "..." : ""}`}
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
