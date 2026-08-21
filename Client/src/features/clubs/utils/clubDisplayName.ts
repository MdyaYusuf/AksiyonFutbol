import type { ClubPreview, ClubResponse } from "../clubTypes";

/** Player-facing club label (template name for bots; chosen name for humans). */
export const getClubDisplayName = (
  club: Pick<ClubResponse, "displayName" | "name"> | Pick<ClubPreview, "displayName" | "name">,
): string => {
  if (club.displayName && club.displayName.trim().length > 0) {
    return club.displayName;
  }

  return club.name;
};
