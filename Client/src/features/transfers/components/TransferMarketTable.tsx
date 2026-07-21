import type { TransferMarketItem } from "../transferTypes";
import { TransferMarketRow } from "./TransferMarketRow";

interface TransferMarketTableProps {
  items: TransferMarketItem[];
  currentClubId?: string;
  onMakeOffer: (item: TransferMarketItem) => void;
}

export const TransferMarketTable = ({
  items,
  currentClubId,
  onMakeOffer,
}: TransferMarketTableProps) => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-high font-label-caps text-label-caps text-on-surface-variant">
              <th className="px-4 py-3 font-normal">Player</th>
              <th className="px-4 py-3 font-normal">Pos</th>
              <th className="px-4 py-3 font-normal">Age</th>
              <th className="px-4 py-3 font-normal">Club</th>
              <th className="px-4 py-3 font-normal">Rating</th>
              <th className="px-4 py-3 font-normal">Market Value</th>
              <th className="px-4 py-3 font-normal">Wage</th>
              <th className="px-4 py-3 text-right font-normal">Action</th>
            </tr>
          </thead>
          <tbody className="font-data-mono text-data-mono text-on-surface">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center font-body-sm text-body-sm text-on-surface-variant"
                >
                  No listed players match your filters.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <TransferMarketRow
                  key={item.listingId}
                  item={item}
                  isOwnListing={currentClubId === item.sellingClubId}
                  onMakeOffer={onMakeOffer}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
