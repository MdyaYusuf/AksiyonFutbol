import type { FreeAgentMarketItem } from "@/features/transfers/freeAgentTypes";
import { FreeAgentMarketRow } from "@/features/transfers/components/FreeAgentMarketRow";
import { TransferMarketPagination } from "@/features/transfers/components/TransferMarketPagination";

interface FreeAgentMarketTableProps {
  items: FreeAgentMarketItem[];
  canSign: boolean;
  disabledReason?: string;
  signingBasePlayerId?: string | null;
  onSign: (item: FreeAgentMarketItem) => void;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const FreeAgentMarketTable = ({
  items,
  canSign,
  disabledReason,
  signingBasePlayerId,
  onSign,
  totalCount,
  currentPage,
  pageSize,
  onPrevPage,
  onNextPage,
}: FreeAgentMarketTableProps) => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-high font-label-caps text-label-caps text-on-surface-variant">
              <th className="px-2 py-3 font-normal">Nat</th>
              <th className="px-2 py-3 font-normal">Player</th>
              <th className="px-2 py-3 font-normal">Pos</th>
              <th className="px-2 py-3 font-normal" title="Preferred foot">
                Foot
              </th>
              <th className="px-2 py-3 font-normal">Age</th>
              <th className="px-2 py-3 font-normal">Height</th>
              <th className="px-2 py-3 font-normal">Weight</th>
              <th className="px-2 py-3 font-normal">OVR</th>
              <th className="px-2 py-3 font-normal">Signing Fee</th>
              <th className="px-2 py-3 font-normal">Wage</th>
              <th className="py-3 pr-4 pl-2 text-right font-normal">Action</th>
            </tr>
          </thead>
          <tbody className="font-data-mono text-data-mono text-on-surface">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-12 text-center font-body-sm text-body-sm text-on-surface-variant"
                >
                  No free agents match your filters.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <FreeAgentMarketRow
                  key={item.basePlayerId}
                  item={item}
                  canSign={canSign}
                  disabledReason={disabledReason}
                  isSigning={signingBasePlayerId === item.basePlayerId}
                  onSign={onSign}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <TransferMarketPagination
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        itemLabel="free agents"
      />
    </div>
  );
};
