import type { ClubPreview, ClubResponse } from "@/features/clubs/clubTypes";

/** Player-facing club label (template name for bots; chosen name for humans). */
export const getClubDisplayName = (
  club:
    | Pick<ClubResponse, "displayName" | "name">
    | Pick<ClubPreview, "displayName" | "name">
    | { displayName: string; name?: string },
): string => {
  if (club.displayName && club.displayName.trim().length > 0) {
    return club.displayName;
  }

  if ("name" in club && club.name) {
    return club.name;
  }

  return "";
};
