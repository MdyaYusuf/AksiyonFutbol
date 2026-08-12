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

const DEFAULT_SUB_STAT = 50;

export const clampStat = (value: number): number => {
  if (value < 1) {
    return 1;
  }

  if (value > 100) {
    return 100;
  }

  return value;
};

export const averageStat = (values: number[]): number => {
  if (values.length === 0) {
    return 1;
  }

  let sum = 0;
  for (const value of values) {
    sum += value;
  }

  const rounded = Math.round(sum / values.length);
  return clampStat(rounded);
};

export const buildDefaultAttributes = (
  position: PlayerPosition,
): PlayerAttributes => {
  if (isGoalkeeper(position)) {
    return {
      goalkeeping: {
        reflexes: DEFAULT_SUB_STAT,
        oneOnOnes: DEFAULT_SUB_STAT,
        aerialReach: DEFAULT_SUB_STAT,
        positioning: DEFAULT_SUB_STAT,
      },
      command: {
        firstTouch: DEFAULT_SUB_STAT,
        handling: DEFAULT_SUB_STAT,
        rushingOut: DEFAULT_SUB_STAT,
      },
      distribution: {
        throwing: DEFAULT_SUB_STAT,
        kicking: DEFAULT_SUB_STAT,
        vision: DEFAULT_SUB_STAT,
      },
    };
  }

  return {
    attack: {
      pace: DEFAULT_SUB_STAT,
      finishing: DEFAULT_SUB_STAT,
      offTheBall: DEFAULT_SUB_STAT,
      composure: DEFAULT_SUB_STAT,
    },
    midfield: {
      passing: DEFAULT_SUB_STAT,
      technique: DEFAULT_SUB_STAT,
      stamina: DEFAULT_SUB_STAT,
      decisions: DEFAULT_SUB_STAT,
    },
    defense: {
      strength: DEFAULT_SUB_STAT,
      tackling: DEFAULT_SUB_STAT,
      marking: DEFAULT_SUB_STAT,
      bravery: DEFAULT_SUB_STAT,
    },
  };
};

export const attributesForPosition = (
  position: PlayerPosition,
  current: PlayerAttributes | null | undefined,
): PlayerAttributes => {
  const defaults = buildDefaultAttributes(position);

  if (isGoalkeeper(position)) {
    return {
      goalkeeping: current?.goalkeeping ?? defaults.goalkeeping,
      command: current?.command ?? defaults.command,
      distribution: current?.distribution ?? defaults.distribution,
    };
  }

  return {
    attack: current?.attack ?? defaults.attack,
    midfield: current?.midfield ?? defaults.midfield,
    defense: current?.defense ?? defaults.defense,
  };
};

export const applyPositionChange = (
  currentPosition: PlayerPosition,
  nextPosition: PlayerPosition,
  attributes: PlayerAttributes,
): PlayerAttributes => {
  if (isGoalkeeper(currentPosition) === isGoalkeeper(nextPosition)) {
    return attributesForPosition(nextPosition, attributes);
  }

  return buildDefaultAttributes(nextPosition);
};

export const computeMainStats = (
  position: PlayerPosition,
  attributes: PlayerAttributes | null | undefined,
): {
  attackPower: number;
  defenseStrength: number;
  midfieldControl: number;
} => {
  const groups = getAttributeGroups(position);
  let attackPower = 1;
  let defenseStrength = 1;
  let midfieldControl = 1;

  for (const group of groups) {
    const values = getAttributeGroupValues(attributes, group.id);
    const stats = group.stats.map((stat) => values[stat.key] ?? 0);
    const average = averageStat(stats);

    if (group.pillar === "attack") {
      attackPower = average;
    } else if (group.pillar === "defense") {
      defenseStrength = average;
    } else {
      midfieldControl = average;
    }
  }

  return { attackPower, defenseStrength, midfieldControl };
};

export const setAttributeStat = (
  attributes: PlayerAttributes,
  position: PlayerPosition,
  groupId: AttributeGroupId,
  key: string,
  value: number,
): PlayerAttributes => {
  const next = attributesForPosition(position, attributes);

  if (groupId === "attack" && next.attack) {
    return { ...next, attack: { ...next.attack, [key]: value } };
  }

  if (groupId === "midfield" && next.midfield) {
    return { ...next, midfield: { ...next.midfield, [key]: value } };
  }

  if (groupId === "defense" && next.defense) {
    return { ...next, defense: { ...next.defense, [key]: value } };
  }

  if (groupId === "goalkeeping" && next.goalkeeping) {
    return { ...next, goalkeeping: { ...next.goalkeeping, [key]: value } };
  }

  if (groupId === "command" && next.command) {
    return { ...next, command: { ...next.command, [key]: value } };
  }

  if (groupId === "distribution" && next.distribution) {
    return { ...next, distribution: { ...next.distribution, [key]: value } };
  }

  return next;
};

export const areAttributesEqual = (
  left: PlayerAttributes | null | undefined,
  right: PlayerAttributes | null | undefined,
  position: PlayerPosition,
): boolean => {
  const normalizedLeft = attributesForPosition(position, left);
  const normalizedRight = attributesForPosition(position, right);
  return JSON.stringify(normalizedLeft) === JSON.stringify(normalizedRight);
};
