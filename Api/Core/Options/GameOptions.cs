namespace Api.Core.Options;

public class GameOptions
{
  public const string SectionName = "GameOptions";

  public decimal StartingCash { get; set; }
  public decimal StartingWageBudget { get; set; }
  public int StartingClubStatus { get; set; }
  public int MaximumClubsPerDivision { get; set; }
  public int MinimumMatchWeek { get; set; }
  public int MaximumMatchWeek { get; set; }

  public int StarterSquadGoalkeepers { get; set; } = 2;
  public int StarterSquadDefenders { get; set; } = 5;
  public int StarterSquadMidfielders { get; set; } = 5;
  public int StarterSquadForwards { get; set; } = 4;
  public decimal StarterMarketValuePerOverall { get; set; } = 1000m;
  public decimal StarterWagePerOverall { get; set; } = 50m;

  public int PostMatchWinMoraleDelta { get; set; } = 3;
  public int PostMatchDrawMoraleDelta { get; set; } = 0;
  public int PostMatchLossMoraleDelta { get; set; } = -3;
  public decimal PostMatchWinCashReward { get; set; } = 5000m;
  public decimal PostMatchDrawCashReward { get; set; } = 2000m;
  public decimal PostMatchLossCashReward { get; set; } = 1000m;

  public int LineupStarterCount { get; set; } = 11;
  public int LineupMaxBenchSize { get; set; } = 7;

  public int TransferMinimumSquadSize { get; set; } = 11;

  public decimal BribeMinAmount { get; set; } = 1000m;
  public decimal BribeMaxAmount { get; set; } = 100000m;
  public decimal BribeMinSuccessChance { get; set; } = 0.05m;
  public decimal BribeMaxSuccessChance { get; set; } = 0.85m;
  public decimal BribeDifficultyCashScale { get; set; } = 500m;
  public decimal BribeCorruptibleBonus { get; set; } = 0.15m;
  public decimal BribeFavoredGoalMultiplier { get; set; } = 1.18m;
  public decimal BribeOpponentGoalMultiplier { get; set; } = 0.90m;

  // Match-scoped ClubAction effect sizes consumed by MatchInfluence / the sim.
  public decimal MatchFixingOpponentGoalMultiplier { get; set; } = 0.85m;
  public decimal EspionageEdgeMultiplier { get; set; } = 1.05m;
  public decimal DopingPowerMultiplier { get; set; } = 1.08m;
  public decimal SabotageAwayPowerMultiplier { get; set; } = 0.92m;

  // Intimidate Referee: success chance deltas by personality (added to base).
  // Strict/Showman also reverse favor onto the opponent when the attempt fails.
  public decimal IntimidateStrictSuccessPenalty { get; set; } = 0.25m;
  public decimal IntimidateShowmanSuccessPenalty { get; set; } = 0.15m;
  public decimal IntimidateLenientSuccessBonus { get; set; } = 0.10m;
  public decimal IntimidateCorruptibleSuccessBonus { get; set; } = 0.05m;

  // Suspicion / "Heat" foundation. Shady actions raise Suspicion, which increases
  // detection risk and scales investigation consequences. It decays after matches.
  public int StartingSuspicion { get; set; } = 0;
  public int MaxSuspicion { get; set; } = 100;
  public int SuspicionDecayPerMatch { get; set; } = 5;
  // Added to an action's base detection chance per point of current Suspicion
  // (e.g. 0.005 means Suspicion 100 adds +0.50 detection chance).
  public decimal SuspicionDetectionScale { get; set; } = 0.005m;
  public decimal SuspicionMaxDetectionChance { get; set; } = 0.95m;

  // Investigation consequences applied when a shady action is detected.
  public decimal ScandalFineCashRatio { get; set; } = 0.15m;
  public int ScandalMoralePenalty { get; set; } = 10;
  public int ScandalReputationPenalty { get; set; } = 25;

  // Per-action balancing overrides keyed by action name (e.g. "MatchFixing").
  // Code defaults are owned by the Actions feature and merged in at runtime, so
  // this only needs to contain the values you want to override.
  public Dictionary<string, ClubActionBalance> ClubActionBalances { get; set; } = new();

  public int FacilityMaxLevel { get; set; } = 5;
  public decimal FacilityBaseUpgradeCost { get; set; } = 25000m;
  public int FacilityTrainingMoraleBonus { get; set; } = 2;
  public int FacilityTrainingChemistryBonus { get; set; } = 2;
  public int FacilityAcademyDisciplineBonus { get; set; } = 1;

  public int PromotionSlots { get; set; } = 2;
  public int RelegationSlots { get; set; } = 2;

  public int MatchLiveReplayDurationSeconds { get; set; } = 180;
  public int MatchAutoSimulatePollSeconds { get; set; } = 5;
}
