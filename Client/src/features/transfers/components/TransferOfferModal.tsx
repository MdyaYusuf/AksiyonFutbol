import { useEffect, useState, type FormEvent } from "react";
import { formatCash } from "../../dashboard/utils/dashboardFormatters";
import {
  formatSquadMoney,
  getPlayerDisplayName,
} from "../../playerInstances/utils/squadHelpers";
import type { TransferMarketItem } from "../transferTypes";
import { formatTransferWage } from "../utils/transferMarketHelpers";

interface TransferOfferModalProps {
  item: TransferMarketItem;
  clubCash: number;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (offerFee: number, proposedWage: number) => void;
}

export const TransferOfferModal = ({
  item,
  clubCash,
  isSubmitting,
  onClose,
  onSubmit,
}: TransferOfferModalProps) => {
  const [offerFee, setOfferFee] = useState(String(Math.round(item.askingPrice)));
  const [proposedWage, setProposedWage] = useState(String(Math.round(item.wage)));

  useEffect(() => {
    setOfferFee(String(Math.round(item.askingPrice)));
    setProposedWage(String(Math.round(item.wage)));
  }, [item]);

  const feeValue = Number(offerFee);
  const wageValue = Number(proposedWage);
  const canSubmit =
    Number.isFinite(feeValue) &&
    feeValue > 0 &&
    Number.isFinite(wageValue) &&
    wageValue >= 0 &&
    !isSubmitting;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit(feeValue, wageValue);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <button
        type="button"
        aria-label="Close offer dialog backdrop"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-lg border border-outline-variant bg-surface-container-high p-6 shadow-lg">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Make Offer</h3>
        <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
          {getPlayerDisplayName(item.firstName, item.lastName)} · {item.sellingClubName}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 rounded border border-outline-variant bg-surface-container p-3 text-body-sm">
          <div>
            <div className="font-label-caps text-label-caps text-on-surface-variant">Asking</div>
            <div className="text-on-surface">{formatSquadMoney(item.askingPrice)}</div>
          </div>
          <div>
            <div className="font-label-caps text-label-caps text-on-surface-variant">
              Current wage
            </div>
            <div className="text-on-surface">{formatTransferWage(item.wage)}</div>
          </div>
          <div className="col-span-2">
            <div className="font-label-caps text-label-caps text-on-surface-variant">
              Your cash
            </div>
            <div className="text-primary">{formatCash(clubCash)}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
              Offer fee
            </span>
            <input
              type="number"
              min={1}
              step={1}
              value={offerFee}
              onChange={(event) => setOfferFee(event.target.value)}
              className="w-full rounded border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface outline-none focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">
              Proposed weekly wage
            </span>
            <input
              type="number"
              min={0}
              step={1}
              value={proposedWage}
              onChange={(event) => setProposedWage(event.target.value)}
              className="w-full rounded border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface outline-none focus:border-primary"
            />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-outline-variant px-4 py-2 text-body-sm text-on-surface transition-colors hover:bg-surface-variant"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className={`rounded px-4 py-2 text-body-sm font-semibold transition-colors ${
                canSubmit
                  ? "bg-primary text-on-primary hover:bg-primary-fixed"
                  : "cursor-not-allowed bg-primary text-on-primary opacity-50"
              }`}
            >
              {isSubmitting ? "Sending..." : "Submit Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
