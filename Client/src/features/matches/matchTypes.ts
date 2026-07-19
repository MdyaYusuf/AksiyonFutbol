export const MatchEventType = {
  KickOff: 1,
  Goal: 2,
  YellowCard: 3,
  RedCard: 4,
  Injury: 5,
  HalfTime: 6,
  FullTime: 7,
} as const;

export type MatchEventType = (typeof MatchEventType)[keyof typeof MatchEventType];

// Responses
export interface MatchResponse {
  id: string;
  divisionId: number;
  divisionName: string;
  matchWeek: number;
  homeClubId: string;
  homeClubName: string;
  awayClubId: string;
  awayClubName: string;
  refereeId?: number | null;
  refereeName?: string | null;
  matchDate: string;
  isPlayed: boolean;
  homeScore?: number | null;
  awayScore?: number | null;
  matchLogJson?: string | null;
  createdDate: string;
}

export interface MatchPreview {
  id: string;
  matchWeek: number;
  homeClubId: string;
  homeClubName: string;
  awayClubId: string;
  awayClubName: string;
  matchDate: string;
  isPlayed: boolean;
  homeScore?: number | null;
  awayScore?: number | null;
}

export interface CreatedMatchResponse {
  id: string;
  divisionId: number;
  matchWeek: number;
  homeClubId: string;
  awayClubId: string;
  matchDate: string;
}

export interface MatchEvent {
  minute: number;
  type: MatchEventType;
  clubId?: string | null;
  playerId?: string | null;
  description: string;
}

export interface SimulatedMatchResult {
  homeScore: number;
  awayScore: number;
  matchLogJson: string;
}

// Requests
export interface CreateMatchRequest {
  divisionId: number;
  matchWeek: number;
  homeClubId: string;
  awayClubId: string;
  refereeId?: number | null;
  matchDate: string;
}

export interface UpdateMatchScheduleRequest {
  id: string;
  divisionId: number;
  matchWeek: number;
  homeClubId: string;
  awayClubId: string;
  refereeId?: number | null;
  matchDate: string;
}
