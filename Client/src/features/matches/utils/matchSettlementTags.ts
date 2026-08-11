export const matchSettlementRevealTags = (
  matchId?: string,
  clubIds: string[] = [],
) => {
  const tags: { type: "Club" | "Facility" | "Actions" | "Bribery" | "Match"; id: string }[] = [
    { type: "Club", id: "ME" },
    { type: "Facility", id: "ME" },
    { type: "Actions", id: "CONTEXT" },
    { type: "Bribery", id: "CONTEXT" },
  ];

  if (matchId) {
    tags.push({ type: "Match", id: matchId });
  }

  const uniqueClubIds = [...new Set(clubIds.filter((id) => id.length > 0))];
  uniqueClubIds.forEach((clubId) => {
    tags.push(
      { type: "Club", id: clubId },
      { type: "Match", id: `CLUB-${clubId}` },
    );
  });

  return tags;
};
