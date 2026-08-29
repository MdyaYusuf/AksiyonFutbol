export type ClubTypeFilter = "all" | "human" | "bot";

export const getClubInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export const getTierBadgeClassName = (tier?: number | null): string => {
  if (tier == null) {
    return "bg-outline-variant/30 text-on-surface-variant border-outline-variant";
  }

  if (tier === 1) {
    return "bg-secondary/10 text-secondary border-secondary/20";
  }

  return "bg-outline-variant/30 text-on-surface-variant border-outline-variant";
};

export const getStatusBarColor = (value: number): string => {
  if (value >= 70) {
    return "bg-primary";
  }

  if (value >= 50) {
    return "bg-secondary";
  }

  return "bg-error";
};
