import { formatSquadMoney } from "../../playerInstances/utils/squadHelpers";
import type { PlayerInstanceResponse } from "../../playerInstances/playerInstanceTypes";
import type { TransferMarketItem } from "../transferTypes";

export const getOfferFeeBounds = (askingPrice: number) => {
  const asking = Math.max(1, Math.round(askingPrice));
  const minFee = Math.max(1, Math.round(asking * 0.5));
  const maxFee = Math.max(minFee + 1, Math.round(asking * 1.75));
  const step = Math.max(1, Math.round((maxFee - minFee) / 40));

  return { minFee, maxFee, step, defaultFee: asking };
};

export const getAttributeToneClass = (value: number): string => {
  if (value >= 80) {
    return "bg-primary/20 text-primary border-primary/30";
  }

  if (value >= 60) {
    return "bg-secondary/20 text-secondary border-secondary/30";
  }

  return "bg-surface-variant text-on-surface-variant border-outline-variant";
};

export const getStarFillCount = (overallRating: number): number => {
  return Math.min(5, Math.max(0, Math.round(overallRating / 20)));
};

export const getEstimatedValueRange = (marketValue: number): string => {
  const low = Math.round(marketValue * 0.9);
  const high = Math.round(marketValue * 1.15);

  return `${formatCompactMoney(low)} - ${formatCompactMoney(high)}`;
};

export const formatCompactMoney = (amount: number): string => formatSquadMoney(amount);

export const buildScoutNote = (
  player: PlayerInstanceResponse,
  listing: TransferMarketItem,
): string => {
  const strengths: string[] = [];

  if (player.attackPower >= 75) {
    strengths.push("strong attacking output");
  }

  if (player.midfieldControl >= 75) {
    strengths.push("high midfield control");
  }

  if (player.defenseStrength >= 75) {
    strengths.push("solid defensive presence");
  }

  const strengthText =
    strengths.length > 0
      ? strengths.join(", ")
      : "balanced attributes across the board";

  const sellTone = listing.askingPrice >= player.marketValue
    ? "The selling club has set a firm asking price."
    : "The asking price looks negotiable relative to market value.";

  return `${player.firstName} ${player.lastName} offers ${strengthText}. ${sellTone}`;
};

export const getRemainingCashToneClass = (remaining: number, cash: number): string => {
  if (remaining < 0) {
    return "text-error";
  }

  if (cash > 0 && remaining < cash * 0.1) {
    return "text-secondary";
  }

  return "text-primary";
};

export const getBudgetBarClass = (remaining: number, cash: number): string => {
  if (remaining < 0) {
    return "bg-error";
  }

  if (cash > 0 && remaining < cash * 0.1) {
    return "bg-secondary";
  }

  return "bg-primary";
};
