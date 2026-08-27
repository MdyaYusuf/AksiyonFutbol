import type { BribeStakeOption, BribeStakeTier, BriberyContext } from "../briberyTypes";
import { parseApiDate } from "../../../core/utils/dateTime";

/** Mirrors Api GameOptions defaults used by BriberyBusinessRules.CalculateSuccessChance. */
const BRIBE_DIFFICULTY_CASH_SCALE = 500;
const BRIBE_MIN_SUCCESS_CHANCE = 0.05;
const BRIBE_MAX_SUCCESS_CHANCE = 0.85;
const BRIBE_CORRUPTIBLE_BONUS = 0.15;

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

export const buildStakeOptions = (context: BriberyContext): BribeStakeOption[] => {
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

  const lowAmount = Math.round(min);
  const mediumAmount = Math.round(min + span * 0.4);
  const highAmount = Math.round(max);

  const defs: {
    tier: BribeStakeTier;
    title: string;
    description: string;
    amount: number;
    detectionChance: number;
  }[] = [
    {
      tier: "low",
      title: "Quiet Word",
      description:
        "Low risk. Soft nudges on midfield calls. Unlikely to swing major decisions.",
      amount: lowAmount,
      detectionChance: 0.05,
    },
    {
      tier: "medium",
      title: "Preparation Edge",
      description:
        "Medium risk. Clearer leniency on cards for your side, firmer calls against the opponent.",
      amount: mediumAmount,
      detectionChance: 0.25,
    },
    {
      tier: "high",
      title: "Full Arrangement",
      description:
        "High risk. Strong tilt on critical moments — spot kicks, dismissals, and late drama.",
      amount: highAmount,
      detectionChance: 0.6,
    },
  ];

  return defs.map((def) => ({
    ...def,
    successChance: estimateSuccessChance(def.amount, difficulty, personality),
  }));
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
