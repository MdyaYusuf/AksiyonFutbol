export const PlayerPosition = {
  Goalkeeper: 1,
  Defender: 2,
  Midfielder: 3,
  Forward: 4,
} as const;

export type PlayerPosition = (typeof PlayerPosition)[keyof typeof PlayerPosition];

export const PreferredFoot = {
  Right: 1,
  Left: 2,
  Both: 3,
} as const;

export type PreferredFoot = (typeof PreferredFoot)[keyof typeof PreferredFoot];

export const DraftTier = {
  Gold: 1,
  Silver: 2,
  Bronze: 3,
  Iron: 4,
} as const;

export type DraftTier = (typeof DraftTier)[keyof typeof DraftTier];

export interface PhysicalAttributes {
  pace: number;
  stamina: number;
  strength: number;
  balance: number;
  jumping: number;
}

export interface MentalAttributes {
  decisions: number;
  positioning: number;
  teamwork: number;
  workRate: number;
  leadership: number;
}

export interface OutfieldAttackAttributes {
  finishing: number;
  offTheBall: number;
  crossing: number;
  longShots: number;
  composure: number;
}

export interface OutfieldMidfieldAttributes {
  passing: number;
  technique: number;
  firstTouch: number;
  dribbling: number;
  vision: number;
}

export interface OutfieldDefenseAttributes {
  tackling: number;
  marking: number;
  heading: number;
  bravery: number;
  concentration: number;
}

export interface GoalkeepingAttributes {
  reflexes: number;
  oneOnOnes: number;
  handling: number;
  rushingOut: number;
  distribution: number;
}

export interface PlayerAttributes {
  physical?: PhysicalAttributes | null;
  mental?: MentalAttributes | null;
  attack?: OutfieldAttackAttributes | null;
  midfield?: OutfieldMidfieldAttributes | null;
  defense?: OutfieldDefenseAttributes | null;
  goalkeeping?: GoalkeepingAttributes | null;
}

// Responses
export interface BasePlayerResponse {
  id: string;
  defaultFirstName: string;
  defaultLastName: string;
  nationality?: string | null;
  position: PlayerPosition;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  attributes: PlayerAttributes;
  attackPower: number;
  defenseStrength: number;
  midfieldControl: number;
  overallRating: number;
  draftTier: DraftTier;
  draftFee: number;
  wage: number;
  marketValue: number;
  isFreeAgentTemplate: boolean;
  isDraftOnly: boolean;
  createdDate: string;
}

export interface BasePlayerPreview {
  id: string;
  defaultFirstName: string;
  defaultLastName: string;
  position: PlayerPosition;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  overallRating: number;
  draftTier: DraftTier;
  draftFee: number;
  wage: number;
  marketValue: number;
  isFreeAgentTemplate: boolean;
  isDraftOnly: boolean;
}

export interface CreatedBasePlayerResponse {
  id: string;
  defaultFirstName: string;
  defaultLastName: string;
  position: PlayerPosition;
  preferredFoot: PreferredFoot;
}

export interface BasePlayerOption {
  id: string;
  defaultFirstName: string;
  defaultLastName: string;
  position: PlayerPosition;
}

// Requests
export interface CreateBasePlayerRequest {
  defaultFirstName: string;
  defaultLastName: string;
  nationality?: string | null;
  position: PlayerPosition;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  attributes: PlayerAttributes;
  draftTier: DraftTier;
  draftFee: number;
  wage: number;
  marketValue: number;
  isFreeAgentTemplate: boolean;
  isDraftOnly: boolean;
}

export interface UpdateBasePlayerRequest {
  id: string;
  defaultFirstName: string;
  defaultLastName: string;
  nationality?: string | null;
  position: PlayerPosition;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  attributes: PlayerAttributes;
  draftTier: DraftTier;
  draftFee: number;
  wage: number;
  marketValue: number;
  isFreeAgentTemplate: boolean;
  isDraftOnly: boolean;
}
