import type { TransferOfferResponse } from "../transferTypes";
import type { DealsTab } from "../utils/myDealsHelpers";
import { MyDealsRow } from "./MyDealsRow";

interface MyDealsTableProps {
  offers: TransferOfferResponse[];
  tab: DealsTab;
  isBusy: boolean;
  cashSpendLocked?: boolean;
  canCompleteSale?: boolean;
  onAccept: (offerId: string) => void;
  onReject: (offerId: string) => void;
  onWithdraw: (offerId: string) => void;
}

export const MyDealsTable = ({
  offers,
  tab,
  isBusy,
  cashSpendLocked = false,
  canCompleteSale = true,
  onAccept,
  onReject,
  onWithdraw,
}: MyDealsTableProps) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container">
              <th className="p-4 font-label-caps text-label-caps font-medium text-on-surface-variant">
                Player
              </th>
              <th className="p-4 font-label-caps text-label-caps font-medium text-on-surface-variant">
                Direction
              </th>
              <th className="p-4 text-right font-label-caps text-label-caps font-medium text-on-surface-variant">
                Proposed Fee
              </th>
              <th className="p-4 text-right font-label-caps text-label-caps font-medium text-on-surface-variant">
                Proposed Wage
              </th>
              <th className="p-4 font-label-caps text-label-caps font-medium text-on-surface-variant">
                Status
              </th>
              <th className="p-4 font-label-caps text-label-caps font-medium text-on-surface-variant">
                Last Updated
              </th>
              <th className="p-4 text-right font-label-caps text-label-caps font-medium text-on-surface-variant">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30 font-data-mono text-data-mono">
            {offers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-12 text-center font-body-sm text-body-sm text-on-surface-variant"
                >
                  No deals match your filters.
                </td>
              </tr>
            ) : (
              offers.map((offer) => (
                <MyDealsRow
                  key={offer.id}
                  offer={offer}
                  tab={tab}
                  isBusy={isBusy}
                  cashSpendLocked={cashSpendLocked}
                  canCompleteSale={canCompleteSale}
                  onAccept={onAccept}
                  onReject={onReject}
                  onWithdraw={onWithdraw}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-outline-variant/30 p-4 text-sm text-on-surface-variant">
        <span>
          Showing {offers.length === 0 ? 0 : 1} to {offers.length} of {offers.length}{" "}
          deals
        </span>
      </div>
    </div>
  );
};
