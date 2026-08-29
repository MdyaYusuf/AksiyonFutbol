export const getTierBadgeLabel = (tier: number): string => {
  return `T${tier}`;
};

export const getGroupDisplayLabel = (groupNumber: number): string => {
  if (groupNumber <= 0) {
    return "—";
  }

  return String.fromCharCode(64 + groupNumber);
};

export const getTierDotClassName = (tier: number): string => {
  const classes = [
    "bg-primary-container",
    "bg-secondary",
    "bg-tertiary-container",
    "bg-outline-variant",
  ];

  return classes[(Math.max(tier, 1) - 1) % classes.length];
};

export const paginateItems = <T,>(items: T[], currentPage: number, pageSize: number): T[] => {
  const startIndex = (currentPage - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
};
