interface TransferMarketPaginationProps {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  itemLabel: string;
}

export const TransferMarketPagination = ({
  totalCount,
  currentPage,
  pageSize,
  onPrevPage,
  onNextPage,
  itemLabel,
}: TransferMarketPaginationProps) => {
  const showingFrom = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, totalCount);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-high px-4 py-3 text-body-sm text-on-surface-variant">
      <div>
        Showing {showingFrom}-{showingTo} of {totalCount} {itemLabel}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrevPage}
          disabled={!canGoPrev}
          className="rounded border border-outline-variant px-3 py-1 transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={onNextPage}
          disabled={!canGoNext}
          className="rounded border border-outline-variant px-3 py-1 transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
