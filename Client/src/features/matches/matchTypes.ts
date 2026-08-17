export const MatchEventType = {
  KickOff: 1,
  Goal: 2,
  YellowCard: 3,
  RedCard: 4,
  Injury: 5,
  HalfTime: 6,
  FullTime: 7,
  Possession: 8,
  BuildUp: 9,
  AttackLeft: 10,
  AttackCenter: 11,
  AttackRight: 12,
  Cross: 13,
  ThroughBall: 14,
  Shot: 15,
  Save: 16,
  Block: 17,
  Miss: 18,
  Corner: 19,
  FreeKick: 20,
  Tackle: 21,
  Interception: 22,
  Clearance: 23,
  LooseBall: 24,
  Foul: 25,
  ThrowIn: 26,
  GoalKick: 27,
} as const;

export type MatchEventType = (typeof MatchEventType)[keyof typeof MatchEventType];

// Responses
export interface MatchResponse {
  id: string;
  divisionId: number;
  divisionName: string;
  matchWeek: number;
  season: number;
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
  divisionId: number;
  matchWeek: number;
  season: number;
  homeClubId: string;
  homeClubName: string;
  awayClubId: string;
  awayClubName: string;
  matchDate: string;
  isPlayed: boolean;
  homeScore?: number | null;
  awayScore?: number | null;
}

export interface MatchLiveStatus {
  id: string;
  isPlayed: boolean;
  homeScore?: number | null;
  awayScore?: number | null;
}

export interface CreatedMatchResponse {
  id: string;
  divisionId: number;
  matchWeek: number;
  season: number;
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
  expectedGoals?: number | null;
  isBigChance?: boolean | null;
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
