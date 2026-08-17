import type { FreeAgentMarketItem } from "../freeAgentTypes";
import { FreeAgentMarketRow } from "./FreeAgentMarketRow";

interface FreeAgentMarketTableProps {
  items: FreeAgentMarketItem[];
  canSign: boolean;
  disabledReason?: string;
  signingBasePlayerId?: string | null;
  onSign: (item: FreeAgentMarketItem) => void;
}

export const FreeAgentMarketTable = ({
  items,
  canSign,
  disabledReason,
  signingBasePlayerId,
  onSign,
}: FreeAgentMarketTableProps) => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-high font-label-caps text-label-caps text-on-surface-variant">
              <th className="px-4 py-3 font-normal">Player</th>
              <th className="px-4 py-3 font-normal">Pos</th>
              <th className="px-4 py-3 font-normal">Age</th>
              <th className="px-4 py-3 font-normal">Rating</th>
              <th className="px-4 py-3 font-normal">Signing Fee</th>
              <th className="px-4 py-3 font-normal">Wage</th>
              <th className="px-4 py-3 text-right font-normal">Action</th>
            </tr>
          </thead>
          <tbody className="font-data-mono text-data-mono text-on-surface">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
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
    </div>
  );
};
