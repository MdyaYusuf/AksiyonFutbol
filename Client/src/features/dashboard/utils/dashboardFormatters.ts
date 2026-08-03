import { parseApiDate } from "../../../core/utils/dateTime";

export const formatCash = (amount: number): string => {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }

  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  }

  return `$${amount.toLocaleString("en-US")}`;
};

export const formatMatchDateTime = (matchDate: string): string => {
  return parseApiDate(matchDate).toLocaleString("tr-TR", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getMoraleLabel = (morale: number): string => {
  if (morale >= 85) {
    return "Superb";
  }
  if (morale >= 70) {
    return "Good";
  }
  if (morale >= 50) {
    return "Developing";
  }
  return "Low";
};

export const getChemistryLabel = (chemistry: number): string => {
  if (chemistry >= 85) {
    return "Excellent";
  }
  if (chemistry >= 70) {
    return "Developing";
  }
  if (chemistry >= 50) {
    return "Fragile";
  }
  return "Poor";
};

export const getDisciplineLabel = (discipline: number): string => {
  if (discipline >= 90) {
    return "Excellent";
  }
  if (discipline >= 75) {
    return "Solid";
  }
  if (discipline >= 50) {
    return "Average";
  }
  return "Poor";
};
