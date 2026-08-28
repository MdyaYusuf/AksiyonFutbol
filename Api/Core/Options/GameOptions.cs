namespace Api.Core.Options;

public class GameOptions
{
  public const string SectionName = "GameOptions";

  public decimal StartingCash { get; set; }
  public decimal StartingWageBudget { get; set; }
  public int StartingClubStatus { get; set; }
  public int MaximumClubsPerDivision { get; set; } = 8;
  public int MinimumMatchWeek { get; set; }
  public int MaximumMatchWeek { get; set; }

  public int TutorialClubCount { get; set; } = 4;
  public int TutorialMatchWeeks { get; set; } = 6;
  public int CompetitiveMatchWeeks { get; set; } = 14;

  /// <summary>Local kickoff time (Europe/Istanbul) for auto-scheduled fixtures.</summary>
  public TimeSpan MatchKickoffLocalTime { get; set; } = new(19, 0, 0);

  public decimal DraftStartingCash { get; set; } = 65000m;
  public decimal DraftWageBudget { get; set; } = 25000m;

  public int StarterSquadGoalkeepers { get; set; } = 2;
  public int StarterSquadDefenders { get; set; } = 5;
  public int StarterSquadMidfielders { get; set; } = 5;
  public int StarterSquadForwards { get; set; } = 4;

  public int GraduationGoldMinPoints { get; set; } = 15;
  public int GraduationGoldMaxPoints { get; set; } = 18;
  public int GraduationSilverMinPoints { get; set; } = 10;
  public int GraduationSilverMaxPoints { get; set; } = 14;
  public int GraduationBronzeMinPoints { get; set; } = 5;
  public int GraduationBronzeMaxPoints { get; set; } = 9;
  public int GraduationIronMinPoints { get; set; } = 0;
  public int GraduationIronMaxPoints { get; set; } = 4;

  public decimal SeatingBonusGold { get; set; } = 25000m;
  public decimal SeatingBonusSilver { get; set; } = 15000m;
  public decimal SeatingBonusBronze { get; set; } = 10000m;
  public decimal SeatingBonusIron { get; set; } = 5000m;

  public decimal TierStartingWageBudgetGold { get; set; } = 15000m;
  public decimal TierStartingWageBudgetSilver { get; set; } = 12000m;
  public decimal TierStartingWageBudgetBronze { get; set; } = 10000m;
  public decimal TierStartingWageBudgetIron { get; set; } = 8000m;

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
  public int BribeLowHeatGenerated { get; set; } = 8;
  public decimal BribeLowBaseDetectionChance { get; set; } = 0.05m;
  public int BribeMediumHeatGenerated { get; set; } = 20;
  public decimal BribeMediumBaseDetectionChance { get; set; } = 0.25m;
  public int BribeHighHeatGenerated { get; set; } = 35;
  public decimal BribeHighBaseDetectionChance { get; set; } = 0.60m;
  public decimal BribeTierIIStakeSpanMultiplier { get; set; } = 1.15m;
  public decimal BribeTierIIMaxSuccessChanceBonus { get; set; } = 0.05m;

  // Honorable power action effect sizes.
  public int CommunityDayMoraleBonus { get; set; } = 4;
  public int CommunityDayChemistryBonus { get; set; } = 5;
  public int CommunityDayLegitimacyGain { get; set; } = 3;
  public int AcademyPushChemistryBonus { get; set; } = 4;
  public int AcademyPushDisciplineBonus { get; set; } = 3;
  public int AcademyPushLegitimacyGain { get; set; } = 2;
  public int FairPlayPledgeLegitimacyGain { get; set; } = 5;
  public int FairPlayPledgeLockDays { get; set; } = 7;
  public int CleanMediaCampaignLegitimacyGain { get; set; } = 4;
  public int CleanMediaCampaignSuspicionReduction { get; set; } = 10;
  public int FederationAllyLegitimacyGain { get; set; } = 2;
  public int FederationAllySuspicionReduction { get; set; } = 15;

  // Match-scoped ClubAction effect sizes consumed by MatchInfluence / the sim.
  public decimal MatchFixingOpponentGoalMultiplier { get; set; } = 0.85m;
  public decimal EspionageEdgeMultiplier { get; set; } = 1.05m;
  public decimal EspionageTierIIEdgeMultiplier { get; set; } = 1.10m;
  public decimal DopingPowerMultiplier { get; set; } = 1.08m;
  public decimal SabotageAwayPowerMultiplier { get; set; } = 0.92m;

  // Intimidate Referee: success chance deltas by personality (added to base).
  // Strict/Showman also reverse favor onto the opponent when the attempt fails.
  public decimal IntimidateStrictSuccessPenalty { get; set; } = 0.25m;
  public decimal IntimidateShowmanSuccessPenalty { get; set; } = 0.15m;
  public decimal IntimidateLenientSuccessBonus { get; set; } = 0.10m;
  public decimal IntimidateCorruptibleSuccessBonus { get; set; } = 0.05m;

  // Squad action effect sizes (immediate Club stat mutations).
  public int TeamBondingChemistryBonus { get; set; } = 8;
  public int TeamBondingDisciplinePenalty { get; set; } = 2;
  public int FinePlayerDisciplineBonus { get; set; } = 6;
  public int FinePlayerMoralePenalty { get; set; } = 4;
  public int MotivationalTalkMoraleBonus { get; set; } = 5;
  public int BrutalTrainingMoralePenalty { get; set; } = 6;
  public int BrutalTrainingDisciplineBonus { get; set; } = 4;
  public int PromiseWinBonusMoraleBonus { get; set; } = 8;
  public decimal PromiseWinBonusAmount { get; set; } = 10000m;

  // Politics action effect sizes.
  public int MediaSpinOpponentMoralePenalty { get; set; } = 8;
  public int MediaSpinReputationRepair { get; set; } = 15;
  public int LobbyFederationSuspicionReduction { get; set; } = 20;
  public int LobbyFederationReputationCost { get; set; } = 10;
  public decimal DodgySponsorshipCashGain { get; set; } = 50000m;
  public decimal TapUpTransferFeeDiscountRatio { get; set; } = 0.15m;
  public decimal TapUpTransferFeeDiscountRatioTierII { get; set; } = 0.25m;

  // President morality economy (Legitimacy stored in ReputationPoints).
  public int MaxLegitimacy { get; set; } = 100;
  public int MaxInfamy { get; set; } = 100;
  public int HonorablePowerLegitimacyThreshold { get; set; } = 40;
  public int ShadyTierIIInfamyThreshold { get; set; } = 40;
  public int ShadySuccessInfamyGain { get; set; } = 3;
  public int ScandalInfamyGain { get; set; } = 12;
  public int HonorableSquadLegitimacyGain { get; set; } = 2;
  public int CleanWinLegitimacyGain { get; set; } = 2;
  public decimal PresidentInfamyPepTalkMaxEffectReduction { get; set; } = 0.25m;

  // Post-match president attribute growth (build evolves from play).
  public int PostMatchCleanWinIntegrityGain { get; set; } = 1;
  public int PostMatchCleanWinCharismaGain { get; set; } = 1;
  public int PostMatchUndetectedShadyCunningGain { get; set; } = 1;
  public int PostMatchScandalIntegrityLoss { get; set; } = 1;
  public int PresidentMoralityDominanceThreshold { get; set; } = 10;

  // End-of-season identity packages (Legitimacy vs Infamy).
  public decimal SeasonHonorableCashReward { get; set; } = 25_000m;
  public decimal SeasonShadyCashReward { get; set; } = 35_000m;
  public decimal SeasonNeutralCashReward { get; set; } = 15_000m;
  public decimal SeasonPromotionCashBonus { get; set; } = 10_000m;
  public decimal SeasonRelegationCashPenalty { get; set; } = 5_000m;

  // Tutorial graduation identity packages.
  public decimal TutorialGraduationHonorableCash { get; set; } = 10_000m;
  public decimal TutorialGraduationShadyCash { get; set; } = 15_000m;
  public decimal TutorialGraduationNeutralCash { get; set; } = 8_000m;
  public decimal TutorialGraduationGoldCashBonus { get; set; } = 5_000m;
  public decimal TutorialGraduationSilverCashBonus { get; set; } = 3_000m;
  public decimal TutorialGraduationBronzeCashBonus { get; set; } = 1_500m;
  public decimal TutorialGraduationIronCashBonus { get; set; } = 500m;

  // President attribute affinity (levels above 1).
  public decimal PresidentIntegrityHonorableSuccessBonusPerLevel { get; set; } = 0.025m;
  public decimal PresidentCunningShadySuccessBonusPerLevel { get; set; } = 0.025m;
  public decimal PresidentCunningDetectionReductionPerLevel { get; set; } = 0.02m;
  public decimal PresidentIntegrityShadySuccessPenaltyPerLevel { get; set; } = 0.02m;
  public decimal PresidentIntegrityShadyDetectionPenaltyPerLevel { get; set; } = 0.015m;
  public int PresidentIntegrityEffectBonusPerLevel { get; set; } = 1;

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
  // Applied in the sim when doping or match-fixing is detected for that fixture.
  public decimal MatchPenaltyPowerMultiplier { get; set; } = 0.88m;

  // Mentality is the risk slider. Balanced stays 1.0 on every axis.
  // Tempo scales how often a side turns possession into an attack minute.
  public decimal MentalityAttackingAttack { get; set; } = 1.10m;
  public decimal MentalityAttackingDefense { get; set; } = 0.90m;
  public decimal MentalityAttackingMidfield { get; set; } = 1.06m;
  public decimal MentalityAttackingTempo { get; set; } = 1.06m;
  public decimal MentalityDefensiveAttack { get; set; } = 0.90m;
  public decimal MentalityDefensiveDefense { get; set; } = 1.12m;
  public decimal MentalityDefensiveMidfield { get; set; } = 0.96m;
  public decimal MentalityDefensiveTempo { get; set; } = 0.94m;

  // Formation is the shape slider vs a 4-3-3 baseline (4 DEF / 3 MID / 3 FWD).
  // Each extra or missing outfield player in a band shifts that axis by this amount.
  public decimal FormationShapeBonusPerPlayer { get; set; } = 0.025m;

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

  public BotDraftOptions BotDraft { get; set; } = new();
}
