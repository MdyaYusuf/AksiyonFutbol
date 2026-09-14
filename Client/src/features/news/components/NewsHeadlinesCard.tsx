import { Link } from "react-router-dom";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { useGetMyNewsFeedQuery } from "@/features/news/newsApiSlice";
import {
  formatArticleDate,
  getKindBadgeClass,
  getKindIcon,
  getKindLabel,
} from "@/features/news/utils/newsHelpers";

export const NewsHeadlinesCard = () => {
  const { data: articles = [], isLoading } = useGetMyNewsFeedQuery({ limit: 2 });

  return (
    <div className="col-span-1 flex flex-col rounded-lg border border-[#334155] bg-surface-container-high p-4 md:col-span-8 lg:col-span-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-label-caps text-on-surface-variant">Division Headlines</h2>
        <Link to="/app/news" className="text-body-sm text-primary hover:underline">
          Open News
        </Link>
      </div>

      {isLoading ? (
        <p className="py-6 text-center text-body-sm text-on-surface-variant">Loading headlines...</p>
      ) : null}

      {!isLoading && articles.length === 0 ? (
        <p className="py-6 text-center text-body-sm text-on-surface-variant">
          No headlines yet. Finish your draft or play matches to fill the press room.
        </p>
      ) : null}

      <div className="flex flex-1 flex-col gap-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            to="/app/news"
            className="rounded-lg border border-[#334155] bg-surface-container p-3 transition-colors hover:border-primary/40"
          >
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span
                className={[
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-label-caps",
                  getKindBadgeClass(article.kind),
                ].join(" ")}
              >
                <MaterialIcon name={getKindIcon(article.kind)} className="text-sm" />
                {getKindLabel(article.kind)}
              </span>
              <span className="text-label-caps text-on-surface-variant">
                {formatArticleDate(article.createdDate)}
              </span>
            </div>
            <p className="text-body-sm font-semibold text-on-surface">{article.headline}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
