import { useEffect, useMemo, useState, type FormEvent } from "react";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { formatCash } from "@/features/dashboard/utils/dashboardFormatters";
import type { TransferMarketItem } from "@/features/transfers/transferTypes";
import { formatTransferWage } from "@/features/transfers/utils/transferMarketHelpers";
import {
  formatCompactMoney,
  getBudgetBarClass,
  getOfferFeeBounds,
  getRemainingCashToneClass,
} from "@/features/transfers/utils/makeOfferHelpers";

interface MakeOfferFormProps {
  listing: TransferMarketItem;
  clubCash: number;
  wageSpace: number;
  cashSpendLocked?: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (offerFee: number, proposedWage: number) => void;
}

export const MakeOfferForm = ({
  listing,
  clubCash,
  wageSpace,
  cashSpendLocked = false,
  isSubmitting,
  onCancel,
  onSubmit,
}: MakeOfferFormProps) => {
  const bounds = useMemo(() => getOfferFeeBounds(listing.askingPrice), [listing.askingPrice]);
  const [offerFee, setOfferFee] = useState(bounds.defaultFee);
  const [proposedWage, setProposedWage] = useState(Math.round(listing.wage));
  const [contractYears, setContractYears] = useState(4);
  const [sellOnPercent, setSellOnPercent] = useState(10);

  useEffect(() => {
    const nextBounds = getOfferFeeBounds(listing.askingPrice);
    setOfferFee(nextBounds.defaultFee);
    setProposedWage(Math.round(listing.wage));
  }, [listing]);

  const remainingCash = clubCash - offerFee;
  const remainingPercent =
    clubCash > 0 ? Math.max(0, Math.min(100, (remainingCash / clubCash) * 100)) : 0;

  const canSubmit =
    offerFee > 0 &&
    proposedWage >= 0 &&
    remainingCash >= 0 &&
    !cashSpendLocked &&
    !isSubmitting;

  const handleFeeChange = (value: number) => {
    const clamped = Math.min(bounds.maxFee, Math.max(bounds.minFee, value));
    setOfferFee(clamped);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit(offerFee, proposedWage);
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-outline-variant bg-surface-container-high p-6">
      <div className="mb-6 flex items-center justify-between border-b border-outline-variant pb-4">
        <h2 className="font-headline-md text-headline-md text-on-surface">Construct Offer</h2>
        <span className="flex items-center gap-1 rounded-full border border-outline-variant bg-surface px-3 py-1 font-label-caps text-label-caps text-on-surface-variant">
          <MaterialIcon name="info" className="text-[14px]" />
          Standard Transfer
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 font-label-caps text-label-caps text-on-surface-variant">
        <span>
          Budget{" "}
          <span className="text-primary">{formatCash(clubCash)}</span>
        </span>
        <span>
          Wage space{" "}
          <span className="text-on-surface">{formatTransferWage(Math.max(0, wageSpace))}</span>
        </span>
      </div>

      <form className="flex flex-1 flex-col gap-6" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block font-label-caps text-label-caps text-on-surface-variant">
            Transfer Fee (Upfront)
          </label>
          <div className="flex items-center gap-4 rounded border border-outline-variant bg-surface p-1 transition-colors focus-within:border-primary">
            <div className="pl-3 font-data-mono text-on-surface-variant">$</div>
            <input
              type="number"
              min={bounds.minFee}
              max={bounds.maxFee}
              step={bounds.step}
              value={offerFee}
              onChange={(event) => handleFeeChange(Number(event.target.value) || 0)}
              className="h-12 w-full border-none bg-transparent font-data-mono text-lg text-on-surface outline-none"
            />
          </div>
        </div>

        <div className="px-2">
          <input
            type="range"
            min={bounds.minFee}
            max={bounds.maxFee}
            step={bounds.step}
            value={offerFee}
            onChange={(event) => handleFeeChange(Number(event.target.value))}
            className="h-1 w-full appearance-none rounded-full bg-surface-variant outline-none accent-primary"
          />
          <div className="mt-2 flex justify-between font-data-mono text-[10px] text-on-surface-variant opacity-60">
            <span>{formatCompactMoney(bounds.minFee)} (Min)</span>
            <span>{formatCompactMoney(bounds.maxFee)} (Max)</span>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block font-label-caps text-label-caps text-on-surface-variant">
              Proposed Wage
            </label>
            <div className="flex items-center gap-2 rounded border border-outline-variant bg-surface p-1 transition-colors focus-within:border-primary">
              <div className="pl-3 font-data-mono text-on-surface-variant">$</div>
              <input
                type="number"
                min={0}
                step={1000}
                value={proposedWage}
                onChange={(event) => setProposedWage(Number(event.target.value) || 0)}
                className="h-10 w-full border-none bg-transparent font-data-mono text-on-surface outline-none"
              />
              <div className="pr-3 font-data-mono text-xs text-on-surface-variant opacity-70">
                /w
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block font-label-caps text-label-caps text-on-surface-variant">
              Contract Length
            </label>
            <select
              value={contractYears}
              onChange={(event) => setContractYears(Number(event.target.value))}
              className="h-12 w-full rounded border border-outline-variant bg-surface px-3 font-body-sm text-on-surface outline-none focus:border-primary"
            >
              {[1, 2, 3, 4, 5].map((years) => (
                <option key={years} value={years}>
                  {years} {years === 1 ? "Year" : "Years"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block font-label-caps text-label-caps text-on-surface-variant">
            Sell-on Percentage
          </label>
          <select
            value={sellOnPercent}
            onChange={(event) => setSellOnPercent(Number(event.target.value))}
            className="h-12 w-full rounded border border-outline-variant bg-surface px-3 font-body-sm text-on-surface outline-none focus:border-primary"
          >
            {[0, 5, 10, 15, 20].map((percent) => (
              <option key={percent} value={percent}>
                {percent === 0 ? "0% (None)" : `${percent}%`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1" />

        <div className="mt-6 rounded border border-outline-variant bg-surface p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              Live Affordability Helper
            </span>
            <MaterialIcon name="account_balance_wallet" className="text-[18px] text-primary" />
          </div>
          <div className="flex items-end justify-between">
            <span className="font-body-sm text-body-sm text-on-surface">
              Remaining cash after fee:
            </span>
            <span
              className={`font-data-mono text-data-mono font-bold transition-colors duration-300 ${getRemainingCashToneClass(remainingCash, clubCash)}`}
            >
              {formatCash(remainingCash)}
            </span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-variant">
            <div
              className={`h-full transition-all duration-300 ${getBudgetBarClass(remainingCash, clubCash)}`}
              style={{ width: `${remainingPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-2 flex gap-4 border-t border-outline-variant pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-outline-variant px-6 py-3 font-body-sm font-semibold text-on-surface transition-colors hover:bg-surface-variant"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className={`flex flex-1 items-center justify-center gap-2 rounded py-3 font-body-sm font-semibold transition-colors ${
              canSubmit
                ? "bg-primary text-on-primary hover:bg-primary-fixed"
                : "cursor-not-allowed bg-primary text-on-primary opacity-50"
            }`}
          >
            <MaterialIcon name="send" className="text-[18px]" />
            {isSubmitting ? "Sending..." : "Submit Offer"}
          </button>
        </div>
      </form>
    </div>
  );
};
