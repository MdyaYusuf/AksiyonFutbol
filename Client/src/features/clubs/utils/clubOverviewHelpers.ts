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

export type AtmosphereStatTone = "excellent" | "good" | "fair" | "poor" | "critical";

export const getAtmosphereStatTone = (value: number): AtmosphereStatTone => {
  if (value >= 85) {
    return "excellent";
  }

  if (value >= 70) {
    return "good";
  }

  if (value >= 50) {
    return "fair";
  }

  if (value >= 30) {
    return "poor";
  }

  return "critical";
};

export const getAtmosphereStatTextClass = (value: number): string => {
  const tone = getAtmosphereStatTone(value);

  switch (tone) {
    case "excellent":
      return "text-primary";
    case "good":
      return "text-teal-400";
    case "fair":
      return "text-secondary";
    case "poor":
      return "text-orange-400";
    case "critical":
      return "text-error";
    default:
      return "text-on-surface";
  }
};

export const getAtmosphereStatBarClass = (value: number): string => {
  const tone = getAtmosphereStatTone(value);

  switch (tone) {
    case "excellent":
      return "bg-primary";
    case "good":
      return "bg-teal-400";
    case "fair":
      return "bg-secondary";
    case "poor":
      return "bg-orange-400";
    case "critical":
      return "bg-error";
    default:
      return "bg-surface-container-highest";
  }
};

export const getAtmosphereStatBarGlowClass = (value: number): string => {
  const tone = getAtmosphereStatTone(value);

  switch (tone) {
    case "excellent":
      return "shadow-[0_0_8px_rgba(34,197,94,0.5)]";
    case "good":
      return "shadow-[0_0_8px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]";
    case "fair":
      return "shadow-[0_0_8px_color-mix(in_srgb,var(--color-secondary)_35%,transparent)]";
    case "poor":
      return "shadow-[0_0_8px_rgba(251,146,60,0.35)]";
    case "critical":
      return "shadow-[0_0_8px_color-mix(in_srgb,var(--color-error)_35%,transparent)]";
    default:
      return "";
  }
};

export const getClubWeeklyWageBill = (players: { wage: number }[]): number => {
  return players.reduce((sum, player) => sum + player.wage, 0);
};

export const getWageUtilizationPercent = (
  wageBill: number,
  wageBudget: number,
): number => {
  if (wageBudget <= 0) {
    if (wageBill > 0) {
      return 100;
    }

    return 0;
  }

  return Math.min(100, Math.round((wageBill / wageBudget) * 100));
};

/** Higher wage use vs cap = tighter budget. */
export const getWageUtilizationTone = (utilizationPercent: number): AtmosphereStatTone => {
  if (utilizationPercent >= 95) {
    return "critical";
  }

  if (utilizationPercent >= 85) {
    return "poor";
  }

  if (utilizationPercent >= 70) {
    return "fair";
  }

  if (utilizationPercent >= 50) {
    return "good";
  }

  return "excellent";
};

export const getWageUtilizationTextClass = (utilizationPercent: number): string => {
  const tone = getWageUtilizationTone(utilizationPercent);

  switch (tone) {
    case "excellent":
      return "text-primary";
    case "good":
      return "text-teal-400";
    case "fair":
      return "text-secondary";
    case "poor":
      return "text-orange-400";
    case "critical":
      return "text-error";
    default:
      return "text-on-surface";
  }
};

export const getWageUtilizationBarClass = (utilizationPercent: number): string => {
  const tone = getWageUtilizationTone(utilizationPercent);

  switch (tone) {
    case "excellent":
      return "bg-primary";
    case "good":
      return "bg-teal-400";
    case "fair":
      return "bg-secondary";
    case "poor":
      return "bg-orange-400";
    case "critical":
      return "bg-error";
    default:
      return "bg-surface-container-highest";
  }
};

export const getWageUtilizationBarGlowClass = (utilizationPercent: number): string => {
  const tone = getWageUtilizationTone(utilizationPercent);

  switch (tone) {
    case "excellent":
      return "shadow-[0_0_8px_rgba(34,197,94,0.5)]";
    case "good":
      return "shadow-[0_0_8px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]";
    case "fair":
      return "shadow-[0_0_8px_color-mix(in_srgb,var(--color-secondary)_35%,transparent)]";
    case "poor":
      return "shadow-[0_0_8px_rgba(251,146,60,0.35)]";
    case "critical":
      return "shadow-[0_0_8px_color-mix(in_srgb,var(--color-error)_35%,transparent)]";
    default:
      return "";
  }
};
