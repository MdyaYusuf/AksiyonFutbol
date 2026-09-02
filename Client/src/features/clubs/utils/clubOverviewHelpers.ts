import { parseApiDate } from "@/core/utils/dateTime";

export const formatCashFull = (amount: number): string => {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
};

export const formatEstablishedYear = (createdDate: string): string => {
  return `Est. ${parseApiDate(createdDate).getFullYear()}`;
};

export const getMoraleSegmentCount = (morale: number): number => {
  if (morale >= 85) {
    return 5;
  }
  if (morale >= 70) {
    return 4;
  }
  if (morale >= 50) {
    return 3;
  }
  if (morale >= 30) {
    return 2;
  }
  if (morale > 0) {
    return 1;
  }
  return 0;
};
