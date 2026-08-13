import {
  PlayerPosition,
  type PlayerAttributes,
} from "../../basePlayers/basePlayerTypes";

export type AttributePillar = "attack" | "midfield" | "defense";

export type AttributeGroupKind = "physical" | "mental" | "positional";

export type AttributeGroupId =
  | "physical"
  | "mental"
  | "attack"
  | "midfield"
  | "defense"
  | "goalkeeping";

export interface AttributeStatDef {
  key: string;
  label: string;
}

export interface AttributeGroupDef {
  id: AttributeGroupId;
  title: string;
  kind: AttributeGroupKind;
  pillar?: AttributePillar;
  fillClassName: string;
  stats: AttributeStatDef[];
}

const POSITIONAL_WEIGHT = 0.55;
const PHYSICAL_WEIGHT = 0.25;
const MENTAL_WEIGHT = 0.2;

const PHYSICAL_FILL = "bg-primary-container";
const MENTAL_FILL = "bg-violet-400";
const ATTACK_FILL = "bg-secondary";
const MIDFIELD_FILL = "bg-tertiary-container";
const DEFENSE_FILL = "bg-sky-500";
const GOALKEEPING_FILL = "bg-teal-400";

const PHYSICAL_GROUP: AttributeGroupDef = {
  id: "physical",
  title: "Physical",
  kind: "physical",
  fillClassName: PHYSICAL_FILL,
  stats: [
    { key: "pace", label: "Pace" },
    { key: "stamina", label: "Stamina" },
    { key: "strength", label: "Strength" },
    { key: "balance", label: "Balance" },
    { key: "jumping", label: "Jumping" },
  ],
};

const MENTAL_GROUP: AttributeGroupDef = {
  id: "mental",
  title: "Mental",
  kind: "mental",
  fillClassName: MENTAL_FILL,
  stats: [
    { key: "decisions", label: "Decisions" },
    { key: "positioning", label: "Positioning" },
    { key: "teamwork", label: "Teamwork" },
    { key: "workRate", label: "Work Rate" },
    { key: "leadership", label: "Leadership" },
  ],
};

const ATTACK_GROUP: AttributeGroupDef = {
  id: "attack",
  title: "Attack",
  kind: "positional",
  pillar: "attack",
  fillClassName: ATTACK_FILL,
  stats: [
    { key: "finishing", label: "Finishing" },
    { key: "offTheBall", label: "Off The Ball" },
    { key: "crossing", label: "Crossing" },
    { key: "longShots", label: "Long Shots" },
    { key: "composure", label: "Composure" },
  ],
};

const MIDFIELD_GROUP: AttributeGroupDef = {
  id: "midfield",
  title: "Midfield",
  kind: "positional",
  pillar: "midfield",
  fillClassName: MIDFIELD_FILL,
  stats: [
    { key: "passing", label: "Passing" },
    { key: "technique", label: "Technique" },
    { key: "firstTouch", label: "First Touch" },
    { key: "dribbling", label: "Dribbling" },
    { key: "vision", label: "Vision" },
  ],
};

const DEFENSE_GROUP: AttributeGroupDef = {
  id: "defense",
  title: "Defense",
  kind: "positional",
  pillar: "defense",
  fillClassName: DEFENSE_FILL,
  stats: [
    { key: "tackling", label: "Tackling" },
    { key: "marking", label: "Marking" },
    { key: "heading", label: "Heading" },
    { key: "bravery", label: "Bravery" },
    { key: "concentration", label: "Concentration" },
  ],
};

const GOALKEEPING_GROUP: AttributeGroupDef = {
  id: "goalkeeping",
  title: "Goalkeeping",
  kind: "positional",
  pillar: "defense",
  fillClassName: GOALKEEPING_FILL,
  stats: [
    { key: "reflexes", label: "Reflexes" },
    { key: "oneOnOnes", label: "One on Ones" },
    { key: "handling", label: "Handling" },
    { key: "rushingOut", label: "Rushing Out" },
    { key: "distribution", label: "Distribution" },
  ],
};

const SHARED_GROUPS: AttributeGroupDef[] = [PHYSICAL_GROUP, MENTAL_GROUP];

const OUTFIELD_ROLE_GROUPS: AttributeGroupDef[] = [
  ATTACK_GROUP,
  MIDFIELD_GROUP,
  DEFENSE_GROUP,
];

export const isGoalkeeper = (position: PlayerPosition): boolean => {
  return position === PlayerPosition.Goalkeeper;
};

export const getPositionalGroup = (position: PlayerPosition): AttributeGroupDef => {
  if (position === PlayerPosition.Goalkeeper) {
    return GOALKEEPING_GROUP;
  }

  if (position === PlayerPosition.Defender) {
    return DEFENSE_GROUP;
  }

  if (position === PlayerPosition.Midfielder) {
    return MIDFIELD_GROUP;
  }

  return ATTACK_GROUP;
};

/** All groups needed to edit or persist a player of this position. */
export const getAttributeGroups = (
  position: PlayerPosition,
): AttributeGroupDef[] => {
  if (isGoalkeeper(position)) {
    return [...SHARED_GROUPS, GOALKEEPING_GROUP];
  }

  return [...SHARED_GROUPS, ...OUTFIELD_ROLE_GROUPS];
};

/** Detail and tactics popover: Physical, Mental, and the role group. */
export const getProfileAttributeGroups = (
  position: PlayerPosition,
): AttributeGroupDef[] => {
  return [...SHARED_GROUPS, getPositionalGroup(position)];
};

/** Pillar that matters most for this role — used for UI emphasis. */
export const getPrimaryPillar = (position: PlayerPosition): AttributePillar => {
  if (position === PlayerPosition.Forward) {
    return "attack";
  }

  if (position === PlayerPosition.Defender || position === PlayerPosition.Goalkeeper) {
    return "defense";
  }

  return "midfield";
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

  if (groupId === "physical") {
    return (attributes.physical ?? {}) as Record<string, number>;
  }

  if (groupId === "mental") {
    return (attributes.mental ?? {}) as Record<string, number>;
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

  return (attributes.goalkeeping ?? {}) as Record<string, number>;
};

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

export const blendStat = (
  positional: number,
  physical: number,
  mental: number,
): number => {
  const blended =
    positional * POSITIONAL_WEIGHT +
    physical * PHYSICAL_WEIGHT +
    mental * MENTAL_WEIGHT;

  return clampStat(Math.round(blended));
};

const groupAverage = (
  attributes: PlayerAttributes | null | undefined,
  group: AttributeGroupDef,
): number => {
  const values = getAttributeGroupValues(attributes, group.id);
  return averageStat(group.stats.map((stat) => values[stat.key] ?? 0));
};

export const computeMainStats = (
  position: PlayerPosition,
  attributes: PlayerAttributes | null | undefined,
): {
  attackPower: number;
  defenseStrength: number;
  midfieldControl: number;
} => {
  const physical = groupAverage(attributes, PHYSICAL_GROUP);
  const mental = groupAverage(attributes, MENTAL_GROUP);

  if (isGoalkeeper(position)) {
    return {
      attackPower: 0,
      defenseStrength: blendStat(
        groupAverage(attributes, GOALKEEPING_GROUP),
        physical,
        mental,
      ),
      midfieldControl: 0,
    };
  }

  return {
    attackPower: blendStat(
      groupAverage(attributes, ATTACK_GROUP),
      physical,
      mental,
    ),
    defenseStrength: blendStat(
      groupAverage(attributes, DEFENSE_GROUP),
      physical,
      mental,
    ),
    midfieldControl: blendStat(
      groupAverage(attributes, MIDFIELD_GROUP),
      physical,
      mental,
    ),
  };
};

export const computeOverallRating = (
  position: PlayerPosition,
  attributes: PlayerAttributes | null | undefined,
): number => {
  const physical = groupAverage(attributes, PHYSICAL_GROUP);
  const mental = groupAverage(attributes, MENTAL_GROUP);
  const positional = groupAverage(attributes, getPositionalGroup(position));
  return averageStat([physical, mental, positional]);
};

export const getGroupHeaderValue = (
  group: AttributeGroupDef,
  attributes: PlayerAttributes | null | undefined,
  attackPower: number,
  defenseStrength: number,
  midfieldControl: number,
): number => {
  if (group.kind !== "positional" || !group.pillar) {
    return groupAverage(attributes, group);
  }

  return getPillarValue(
    group.pillar,
    attackPower,
    defenseStrength,
    midfieldControl,
  );
};

const defaultPhysical = (
  position: PlayerPosition,
): NonNullable<PlayerAttributes["physical"]> => {
  if (position === PlayerPosition.Forward) {
    return { pace: 72, stamina: 62, strength: 58, balance: 64, jumping: 60 };
  }

  if (position === PlayerPosition.Midfielder) {
    return { pace: 62, stamina: 70, strength: 56, balance: 62, jumping: 54 };
  }

  if (position === PlayerPosition.Defender) {
    return { pace: 54, stamina: 64, strength: 74, balance: 66, jumping: 68 };
  }

  return { pace: 48, stamina: 54, strength: 62, balance: 64, jumping: 68 };
};

const defaultMental = (
  position: PlayerPosition,
): NonNullable<PlayerAttributes["mental"]> => {
  if (position === PlayerPosition.Forward) {
    return {
      decisions: 58,
      positioning: 64,
      teamwork: 56,
      workRate: 62,
      leadership: 48,
    };
  }

  if (position === PlayerPosition.Midfielder) {
    return {
      decisions: 72,
      positioning: 66,
      teamwork: 68,
      workRate: 70,
      leadership: 58,
    };
  }

  if (position === PlayerPosition.Defender) {
    return {
      decisions: 62,
      positioning: 70,
      teamwork: 64,
      workRate: 62,
      leadership: 58,
    };
  }

  return {
    decisions: 66,
    positioning: 70,
    teamwork: 58,
    workRate: 54,
    leadership: 62,
  };
};

const defaultAttack = (
  position: PlayerPosition,
): NonNullable<PlayerAttributes["attack"]> => {
  if (position === PlayerPosition.Forward) {
    return {
      finishing: 74,
      offTheBall: 72,
      crossing: 58,
      longShots: 64,
      composure: 66,
    };
  }

  if (position === PlayerPosition.Midfielder) {
    return {
      finishing: 54,
      offTheBall: 60,
      crossing: 62,
      longShots: 58,
      composure: 62,
    };
  }

  return {
    finishing: 38,
    offTheBall: 42,
    crossing: 48,
    longShots: 40,
    composure: 54,
  };
};

const defaultMidfield = (
  position: PlayerPosition,
): NonNullable<PlayerAttributes["midfield"]> => {
  if (position === PlayerPosition.Forward) {
    return {
      passing: 58,
      technique: 64,
      firstTouch: 66,
      dribbling: 68,
      vision: 56,
    };
  }

  if (position === PlayerPosition.Midfielder) {
    return {
      passing: 74,
      technique: 68,
      firstTouch: 66,
      dribbling: 64,
      vision: 72,
    };
  }

  return {
    passing: 56,
    technique: 52,
    firstTouch: 54,
    dribbling: 46,
    vision: 50,
  };
};

const defaultDefense = (
  position: PlayerPosition,
): NonNullable<PlayerAttributes["defense"]> => {
  if (position === PlayerPosition.Forward) {
    return {
      tackling: 42,
      marking: 40,
      heading: 56,
      bravery: 54,
      concentration: 50,
    };
  }

  if (position === PlayerPosition.Midfielder) {
    return {
      tackling: 56,
      marking: 54,
      heading: 50,
      bravery: 58,
      concentration: 62,
    };
  }

  return {
    tackling: 74,
    marking: 72,
    heading: 70,
    bravery: 68,
    concentration: 66,
  };
};

const defaultGoalkeeping = (): NonNullable<PlayerAttributes["goalkeeping"]> => {
  return {
    reflexes: 76,
    oneOnOnes: 72,
    handling: 74,
    rushingOut: 68,
    distribution: 66,
  };
};

export const buildDefaultAttributes = (
  position: PlayerPosition,
): PlayerAttributes => {
  if (isGoalkeeper(position)) {
    return {
      physical: defaultPhysical(position),
      mental: defaultMental(position),
      goalkeeping: defaultGoalkeeping(),
    };
  }

  return {
    physical: defaultPhysical(position),
    mental: defaultMental(position),
    attack: defaultAttack(position),
    midfield: defaultMidfield(position),
    defense: defaultDefense(position),
  };
};

export const attributesForPosition = (
  position: PlayerPosition,
  current: PlayerAttributes | null | undefined,
): PlayerAttributes => {
  const defaults = buildDefaultAttributes(position);

  if (isGoalkeeper(position)) {
    return {
      physical: current?.physical ?? defaults.physical,
      mental: current?.mental ?? defaults.mental,
      goalkeeping: current?.goalkeeping ?? defaults.goalkeeping,
    };
  }

  return {
    physical: current?.physical ?? defaults.physical,
    mental: current?.mental ?? defaults.mental,
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
  if (isGoalkeeper(currentPosition) !== isGoalkeeper(nextPosition)) {
    return buildDefaultAttributes(nextPosition);
  }

  const currentNormalized = attributesForPosition(currentPosition, attributes);
  const currentDefaults = buildDefaultAttributes(currentPosition);
  const stillOnDefaults =
    JSON.stringify(currentNormalized) === JSON.stringify(currentDefaults);

  if (stillOnDefaults) {
    return buildDefaultAttributes(nextPosition);
  }

  return attributesForPosition(nextPosition, attributes);
};

export const setAttributeStat = (
  attributes: PlayerAttributes,
  position: PlayerPosition,
  groupId: AttributeGroupId,
  key: string,
  value: number,
): PlayerAttributes => {
  const next = attributesForPosition(position, attributes);

  if (groupId === "physical" && next.physical) {
    return { ...next, physical: { ...next.physical, [key]: value } };
  }

  if (groupId === "mental" && next.mental) {
    return { ...next, mental: { ...next.mental, [key]: value } };
  }

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
