export const TeamFormation = {
  FourThreeThree: 1,
  FourFourTwo: 2,
  ThreeFiveTwo: 3,
  FourTwoThreeOne: 4,
} as const;

export type TeamFormation = (typeof TeamFormation)[keyof typeof TeamFormation];

export const TeamMentality = {
  Balanced: 1,
  Attacking: 2,
  Defensive: 3,
} as const;

export type TeamMentality = (typeof TeamMentality)[keyof typeof TeamMentality];

export interface ClubLineupPlayer {
  playerInstanceId: string;
  firstName: string;
  lastName: string;
  position: string;
  overallRating: number;
  isInjured: boolean;
  sortOrder: number;
}

export interface ClubLineupResponse {
  id: string;
  clubId: string;
  clubName: string;
  formation: TeamFormation;
  mentality: TeamMentality;
  starters: ClubLineupPlayer[];
  bench: ClubLineupPlayer[];
  createdDate: string;
  updatedDate?: string | null;
}

export interface UpsertClubLineupRequest {
  formation: TeamFormation;
  mentality: TeamMentality;
  starterPlayerIds: string[];
  benchPlayerIds: string[];
}
