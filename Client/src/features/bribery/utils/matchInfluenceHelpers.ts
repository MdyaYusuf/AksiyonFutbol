import type { BribeStakeOption, BribeStakeTier, BriberyContext } from "@/features/bribery/briberyTypes";
import { parseApiDate } from "@/core/utils/dateTime";

/** Mirrors Api GameOptions defaults used by BriberyBusinessRules.CalculateSuccessChance. */
const BRIBE_DIFFICULTY_CASH_SCALE = 500;
const BRIBE_MIN_SUCCESS_CHANCE = 0.05;
const BRIBE_MAX_SUCCESS_CHANCE = 0.85;
const BRIBE_CORRUPTIBLE_BONUS = 0.15;

const BRIBE_LOW_HEAT = 8;
const BRIBE_MEDIUM_HEAT = 20;
const BRIBE_HIGH_HEAT = 35;
const BRIBE_LOW_BASE_DETECTION = 0.05;
const BRIBE_MEDIUM_BASE_DETECTION = 0.25;
const BRIBE_HIGH_BASE_DETECTION = 0.6;
const SUSPICION_DETECTION_SCALE = 0.005;
const SUSPICION_MAX_DETECTION = 0.95;

export const scaleDetectionChance = (
  baseDetectionChance: number,
  suspicion: number,
): number => {
  let scaled = baseDetectionChance + suspicion * SUSPICION_DETECTION_SCALE;

  if (scaled < 0) {
    return 0;
  }

  if (scaled > SUSPICION_MAX_DETECTION) {
    return SUSPICION_MAX_DETECTION;
  }

  return Math.round(scaled * 10000) / 10000;
};

export const estimateSuccessChance = (
  amount: number,
  difficulty: number,
  personality: string,
): number => {
  const safeDifficulty = Math.max(1, difficulty);
  let chance = amount / (safeDifficulty * BRIBE_DIFFICULTY_CASH_SCALE);

  if (personality.toLowerCase() === "corruptible") {
    chance += BRIBE_CORRUPTIBLE_BONUS;
  }

  if (chance < BRIBE_MIN_SUCCESS_CHANCE) {
    return BRIBE_MIN_SUCCESS_CHANCE;
  }

  if (chance > BRIBE_MAX_SUCCESS_CHANCE) {
    return BRIBE_MAX_SUCCESS_CHANCE;
  }

  return Math.round(chance * 10000) / 10000;
};

const buildLocalStakeOptions = (context: BriberyContext): BribeStakeOption[] => {
  if (
    !context.canAttempt ||
    context.briberyDifficulty == null ||
    !context.refereePersonality
  ) {
    return [];
  }

  const difficulty = context.briberyDifficulty;
  const personality = context.refereePersonality;
  const min = context.minAmount;
  const max = Math.max(min, context.maxAmount);
  const span = max - min;
  const suspicion = context.suspicion ?? 0;

  const lowAmount = Math.round(min);
  const mediumAmount = Math.round(min + span * 0.4);
  const highAmount = Math.round(max);

  const defs: {
    tier: BribeStakeTier;
    title: string;
    description: string;
    amount: number;
    baseDetectionChance: number;
    heatGenerated: number;
  }[] = [
    {
      tier: "low",
      title: "Quiet Word",
      description:
        "Low exposure. Soft nudges on midfield calls. Unlikely to swing major decisions.",
      amount: lowAmount,
      baseDetectionChance: BRIBE_LOW_BASE_DETECTION,
      heatGenerated: BRIBE_LOW_HEAT,
    },
    {
      tier: "medium",
      title: "Preparation Edge",
      description:
        "Moderate exposure. Clearer leniency on cards for your side, firmer calls against the opponent.",
      amount: mediumAmount,
      baseDetectionChance: BRIBE_MEDIUM_BASE_DETECTION,
      heatGenerated: BRIBE_MEDIUM_HEAT,
    },
    {
      tier: "high",
      title: "Full Arrangement",
      description:
        "High exposure. Strong tilt on critical moments — spot kicks, dismissals, and late drama.",
      amount: highAmount,
      baseDetectionChance: BRIBE_HIGH_BASE_DETECTION,
      heatGenerated: BRIBE_HIGH_HEAT,
    },
  ];

  return defs.map((def) => ({
    ...def,
    successChance: estimateSuccessChance(def.amount, difficulty, personality),
    detectionChance: scaleDetectionChance(def.baseDetectionChance, suspicion),
  }));
};

export const buildStakeOptions = (context: BriberyContext): BribeStakeOption[] => {
  if (context.stakeOptions?.length) {
    return context.stakeOptions.map((option) => ({
      tier: option.tier,
      title: option.title,
      description: option.description,
      amount: option.amount,
      successChance: option.successChance,
      baseDetectionChance: option.baseDetectionChance,
      detectionChance: option.detectionChance,
      heatGenerated: option.heatGenerated,
    }));
  }

  return buildLocalStakeOptions(context);
};

export const getPreviewStakeOption = (
  context: BriberyContext,
): BribeStakeOption | null => {
  const options = buildStakeOptions(context);
  return options.find((option) => option.tier === "medium") ?? options[0] ?? null;
};

export const getDifficultyLabel = (difficulty: number): string => {
  if (difficulty <= 35) {
    return "Easy";
  }

  if (difficulty <= 70) {
    return "Moderate";
  }

  return "Hard";
};

export const getPersonalityBlurb = (personality: string): string => {
  const key = personality.toLowerCase();

  if (key === "corruptible") {
    return "Open to a quiet arrangement when the stakes are right, but careful in the spotlight.";
  }

  if (key === "strict") {
    return "By-the-book official. Soft approaches rarely move the needle.";
  }

  if (key === "lenient") {
    return "Lets the game flow. Soft pressure may nudge borderline calls.";
  }

  if (key === "showman") {
    return "Loves the spotlight. Bold approaches can backfire publicly.";
  }

  return "Balanced temperament. Outcomes depend heavily on how far you push.";
};

export const formatChancePercent = (chance: number): string => {
  return `${Math.round(chance * 100)}%`;
};

export const formatInfluenceMatchDate = (matchDate: string): string => {
  const date = parseApiDate(matchDate);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMatch = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = Math.round(
    (startOfMatch.getTime() - startOfToday.getTime()) / 86_400_000,
  );
  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (dayDiff === 0) {
    return `Today, ${time}`;
  }

  if (dayDiff === 1) {
    return `Tomorrow, ${time}`;
  }

  return date.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getOpponentLabel = (context: BriberyContext): string => {
  if (context.isHome) {
    return context.awayClubName ?? "Opponent";
  }

  return context.homeClubName ?? "Opponent";
};

export const formatFixtureHeadline = (context: BriberyContext): string => {
  const venue = context.isHome ? "Home" : "Away";
  return `Match Week ${context.matchWeek ?? "—"} • ${venue} vs ${getOpponentLabel(context)}`;
};

export const getAmountToneClass = (tier: BribeStakeTier): string => {
  if (tier === "low") {
    return "bg-on-primary-fixed-variant text-primary";
  }

  if (tier === "medium") {
    return "bg-on-secondary-fixed-variant text-secondary";
  }

  return "bg-on-error-container text-error";
};

export const getExposureWarningTitle = (detectionChance: number): string => {
  if (detectionChance >= 0.5) {
    return "High chance of exposure";
  }

  if (detectionChance >= 0.2) {
    return "Moderate chance of exposure";
  }

  return "Low chance of exposure";
};
