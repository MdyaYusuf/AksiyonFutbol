import {
  PlayerPosition,
  type PlayerAttributes,
} from "../../basePlayers/basePlayerTypes";

export type AttributePillar = "attack" | "midfield" | "defense";

export type AttributeGroupId =
  | "attack"
  | "midfield"
  | "defense"
  | "goalkeeping"
  | "command"
  | "distribution";

export interface AttributeStatDef {
  key: string;
  label: string;
}

export interface AttributeGroupDef {
  id: AttributeGroupId;
  title: string;
  pillar: AttributePillar;
  fillClassName: string;
  stats: AttributeStatDef[];
}

const ATTACK_FILL = "bg-secondary";
const MIDFIELD_FILL = "bg-primary-container";
const DEFENSE_FILL = "bg-primary-fixed-dim";

const OUTFIELD_GROUPS: AttributeGroupDef[] = [
  {
    id: "attack",
    title: "Attack",
    pillar: "attack",
    fillClassName: ATTACK_FILL,
    stats: [
      { key: "pace", label: "Pace" },
      { key: "finishing", label: "Finishing" },
      { key: "offTheBall", label: "Off The Ball" },
      { key: "composure", label: "Composure" },
    ],
  },
  {
    id: "midfield",
    title: "Midfield",
    pillar: "midfield",
    fillClassName: MIDFIELD_FILL,
    stats: [
      { key: "passing", label: "Passing" },
      { key: "technique", label: "Technique" },
      { key: "stamina", label: "Stamina" },
      { key: "decisions", label: "Decisions" },
    ],
  },
  {
    id: "defense",
    title: "Defense",
    pillar: "defense",
    fillClassName: DEFENSE_FILL,
    stats: [
      { key: "strength", label: "Strength" },
      { key: "tackling", label: "Tackling" },
      { key: "marking", label: "Marking" },
      { key: "bravery", label: "Bravery" },
    ],
  },
];

const GOALKEEPER_GROUPS: AttributeGroupDef[] = [
  {
    id: "goalkeeping",
    title: "Goalkeeping",
    pillar: "defense",
    fillClassName: DEFENSE_FILL,
    stats: [
      { key: "reflexes", label: "Reflexes" },
      { key: "oneOnOnes", label: "One on Ones" },
      { key: "aerialReach", label: "Aerial Reach" },
      { key: "positioning", label: "Positioning" },
    ],
  },
  {
    id: "command",
    title: "Command",
    pillar: "midfield",
    fillClassName: MIDFIELD_FILL,
    stats: [
      { key: "firstTouch", label: "First Touch" },
      { key: "handling", label: "Handling" },
      { key: "rushingOut", label: "Rushing Out" },
    ],
  },
  {
    id: "distribution",
    title: "Distribution",
    pillar: "attack",
    fillClassName: ATTACK_FILL,
    stats: [
      { key: "throwing", label: "Throwing" },
      { key: "kicking", label: "Kicking" },
      { key: "vision", label: "Vision" },
    ],
  },
];

export const isGoalkeeper = (position: PlayerPosition): boolean => {
  return position === PlayerPosition.Goalkeeper;
};

export const getAttributeGroups = (
  position: PlayerPosition,
): AttributeGroupDef[] => {
  if (isGoalkeeper(position)) {
    return GOALKEEPER_GROUPS;
  }

  return OUTFIELD_GROUPS;
};

export const getPillarValue = (
  pillar: AttributePillar,
  attackPower: number,
  defenseStrength: number,
  midfieldControl: number,
): number => {
  if (pillar === "attack") {
    return attackPower;
  }

  if (pillar === "defense") {
    return defenseStrength;
  }

  return midfieldControl;
};

export const getAttributeGroupValues = (
  attributes: PlayerAttributes | null | undefined,
  groupId: AttributeGroupId,
): Record<string, number> => {
  if (!attributes) {
    return {};
  }

  if (groupId === "attack") {
    return (attributes.attack ?? {}) as Record<string, number>;
  }

  if (groupId === "midfield") {
    return (attributes.midfield ?? {}) as Record<string, number>;
  }

  if (groupId === "defense") {
    return (attributes.defense ?? {}) as Record<string, number>;
  }

  if (groupId === "goalkeeping") {
    return (attributes.goalkeeping ?? {}) as Record<string, number>;
  }

  if (groupId === "command") {
    return (attributes.command ?? {}) as Record<string, number>;
  }

  return (attributes.distribution ?? {}) as Record<string, number>;
};

export const buildAttributesFromMains = (
  position: PlayerPosition,
  attackPower: number,
  defenseStrength: number,
  midfieldControl: number,
): PlayerAttributes => {
  if (isGoalkeeper(position)) {
    return {
      goalkeeping: {
        reflexes: defenseStrength,
        oneOnOnes: defenseStrength,
        aerialReach: defenseStrength,
        positioning: defenseStrength,
      },
      command: {
        firstTouch: midfieldControl,
        handling: midfieldControl,
        rushingOut: midfieldControl,
      },
      distribution: {
        throwing: attackPower,
        kicking: attackPower,
        vision: attackPower,
      },
    };
  }

  return {
    attack: {
      pace: attackPower,
      finishing: attackPower,
      offTheBall: attackPower,
      composure: attackPower,
    },
    midfield: {
      passing: midfieldControl,
      technique: midfieldControl,
      stamina: midfieldControl,
      decisions: midfieldControl,
    },
    defense: {
      strength: defenseStrength,
      tackling: defenseStrength,
      marking: defenseStrength,
      bravery: defenseStrength,
    },
  };
};
