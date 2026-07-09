import type { ClubResponse } from "../../clubs/clubTypes";
import type { LeagueDivisionResponse } from "../leagueDivisionTypes";

export interface AdminDivisionTableRow {
  division: LeagueDivisionResponse;
  clubCount: number;
}

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

export const filterDivisionsByName = (
  divisions: LeagueDivisionResponse[],
  searchQuery: string,
): LeagueDivisionResponse[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return divisions;
  }

  return divisions.filter((division) =>
    division.name.toLowerCase().includes(normalizedQuery),
  );
};

export const buildAdminDivisionTableRows = (
  divisions: LeagueDivisionResponse[],
  clubs: ClubResponse[],
): AdminDivisionTableRow[] => {
  return divisions.map((division) => ({
    division,
    clubCount: clubs.filter((club) => club.divisionId === division.id).length,
  }));
};

export const paginateItems = <T,>(items: T[], pageNumber: number, pageSize: number): T[] => {
  const startIndex = (pageNumber - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
};
