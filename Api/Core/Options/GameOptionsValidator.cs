using Microsoft.Extensions.Options;

namespace Api.Core.Options;

public sealed class GameOptionsValidator : IValidateOptions<GameOptions>
{
  public ValidateOptionsResult Validate(string? name, GameOptions options)
  {
    List<string> failures = [];

    if (options.StartingCash < 0)
    {
      failures.Add("StartingCash negatif olamaz.");
    }

    if (options.StartingWageBudget < 0)
    {
      failures.Add("StartingWageBudget negatif olamaz.");
    }

    if (options.StartingClubStatus < 0 || options.StartingClubStatus > 100)
    {
      failures.Add("StartingClubStatus 0 ile 100 arasında olmalıdır.");
    }

    if (options.MaximumClubsPerDivision <= 0)
    {
      failures.Add("MaximumClubsPerDivision 0'dan büyük olmalıdır.");
    }

    if (options.MinimumMatchWeek <= 0)
    {
      failures.Add("MinimumMatchWeek 0'dan büyük olmalıdır.");
    }

    if (options.MaximumMatchWeek < options.MinimumMatchWeek)
    {
      failures.Add("MaximumMatchWeek, MinimumMatchWeek değerinden küçük olamaz.");
    }

    if (options.StarterSquadGoalkeepers < 1)
    {
      failures.Add("StarterSquadGoalkeepers en az 1 olmalıdır.");
    }

    if (options.StarterSquadDefenders < 0)
    {
      failures.Add("StarterSquadDefenders negatif olamaz.");
    }

    if (options.StarterSquadMidfielders < 0)
    {
      failures.Add("StarterSquadMidfielders negatif olamaz.");
    }

    if (options.StarterSquadForwards < 0)
    {
      failures.Add("StarterSquadForwards negatif olamaz.");
    }

    if (options.StarterSquadGoalkeepers
        + options.StarterSquadDefenders
        + options.StarterSquadMidfielders
        + options.StarterSquadForwards <= 0)
    {
      failures.Add("Başlangıç kadrosu toplam oyuncu sayısı 0'dan büyük olmalıdır.");
    }

    if (options.StarterMarketValuePerOverall < 0)
    {
      failures.Add("StarterMarketValuePerOverall negatif olamaz.");
    }

    if (options.StarterWagePerOverall < 0)
    {
      failures.Add("StarterWagePerOverall negatif olamaz.");
    }

    if (options.PostMatchWinMoraleDelta < -100 || options.PostMatchWinMoraleDelta > 100)
    {
      failures.Add("PostMatchWinMoraleDelta -100 ile 100 arasında olmalıdır.");
    }

    if (options.PostMatchDrawMoraleDelta < -100 || options.PostMatchDrawMoraleDelta > 100)
    {
      failures.Add("PostMatchDrawMoraleDelta -100 ile 100 arasında olmalıdır.");
    }

    if (options.PostMatchLossMoraleDelta < -100 || options.PostMatchLossMoraleDelta > 100)
    {
      failures.Add("PostMatchLossMoraleDelta -100 ile 100 arasında olmalıdır.");
    }

    if (options.PostMatchWinCashReward < 0)
    {
      failures.Add("PostMatchWinCashReward negatif olamaz.");
    }

    if (options.PostMatchDrawCashReward < 0)
    {
      failures.Add("PostMatchDrawCashReward negatif olamaz.");
    }

    if (options.PostMatchLossCashReward < 0)
    {
      failures.Add("PostMatchLossCashReward negatif olamaz.");
    }

    if (options.LineupStarterCount != 11)
    {
      failures.Add("LineupStarterCount 11 olmalıdır.");
    }

    if (options.LineupMaxBenchSize < 0 || options.LineupMaxBenchSize > 12)
    {
      failures.Add("LineupMaxBenchSize 0 ile 12 arasında olmalıdır.");
    }

    if (options.TransferMinimumSquadSize < 11)
    {
      failures.Add("TransferMinimumSquadSize en az 11 olmalıdır.");
    }

    if (options.BribeMinAmount <= 0)
    {
      failures.Add("BribeMinAmount 0'dan büyük olmalıdır.");
    }

    if (options.BribeMaxAmount < options.BribeMinAmount)
    {
      failures.Add("BribeMaxAmount, BribeMinAmount değerinden küçük olamaz.");
    }

    if (options.BribeMinSuccessChance < 0 || options.BribeMinSuccessChance > 1)
    {
      failures.Add("BribeMinSuccessChance 0 ile 1 arasında olmalıdır.");
    }

    if (options.BribeMaxSuccessChance < options.BribeMinSuccessChance || options.BribeMaxSuccessChance > 1)
    {
      failures.Add("BribeMaxSuccessChance geçerli bir aralıkta olmalıdır.");
    }

    if (options.BribeDifficultyCashScale <= 0)
    {
      failures.Add("BribeDifficultyCashScale 0'dan büyük olmalıdır.");
    }

    if (options.BribeCorruptibleBonus < 0 || options.BribeCorruptibleBonus > 1)
    {
      failures.Add("BribeCorruptibleBonus 0 ile 1 arasında olmalıdır.");
    }

    if (options.BribeFavoredGoalMultiplier < 1)
    {
      failures.Add("BribeFavoredGoalMultiplier 1 veya daha büyük olmalıdır.");
    }

    if (options.BribeOpponentGoalMultiplier <= 0 || options.BribeOpponentGoalMultiplier > 1)
    {
      failures.Add("BribeOpponentGoalMultiplier 0 ile 1 arasında olmalıdır.");
    }

    if (options.StartingSuspicion < 0 || options.StartingSuspicion > 100)
    {
      failures.Add("StartingSuspicion 0 ile 100 arasında olmalıdır.");
    }

    if (options.MaxSuspicion < 1 || options.MaxSuspicion > 100)
    {
      failures.Add("MaxSuspicion 1 ile 100 arasında olmalıdır.");
    }

    if (options.StartingSuspicion > options.MaxSuspicion)
    {
      failures.Add("StartingSuspicion, MaxSuspicion değerinden büyük olamaz.");
    }

    if (options.SuspicionDecayPerMatch < 0)
    {
      failures.Add("SuspicionDecayPerMatch negatif olamaz.");
    }

    if (options.SuspicionDetectionScale < 0 || options.SuspicionDetectionScale > 1)
    {
      failures.Add("SuspicionDetectionScale 0 ile 1 arasında olmalıdır.");
    }

    if (options.SuspicionMaxDetectionChance < 0 || options.SuspicionMaxDetectionChance > 1)
    {
      failures.Add("SuspicionMaxDetectionChance 0 ile 1 arasında olmalıdır.");
    }

    if (options.ScandalFineCashRatio < 0 || options.ScandalFineCashRatio > 1)
    {
      failures.Add("ScandalFineCashRatio 0 ile 1 arasında olmalıdır.");
    }

    if (options.ScandalMoralePenalty < 0 || options.ScandalMoralePenalty > 100)
    {
      failures.Add("ScandalMoralePenalty 0 ile 100 arasında olmalıdır.");
    }

    if (options.ScandalReputationPenalty < 0)
    {
      failures.Add("ScandalReputationPenalty negatif olamaz.");
    }

    if (options.FacilityMaxLevel < 1)
    {
      failures.Add("FacilityMaxLevel en az 1 olmalıdır.");
    }

    if (options.FacilityBaseUpgradeCost <= 0)
    {
      failures.Add("FacilityBaseUpgradeCost 0'dan büyük olmalıdır.");
    }

    if (options.FacilityTrainingMoraleBonus < 0 || options.FacilityTrainingMoraleBonus > 100)
    {
      failures.Add("FacilityTrainingMoraleBonus 0 ile 100 arasında olmalıdır.");
    }

    if (options.FacilityTrainingChemistryBonus < 0 || options.FacilityTrainingChemistryBonus > 100)
    {
      failures.Add("FacilityTrainingChemistryBonus 0 ile 100 arasında olmalıdır.");
    }

    if (options.FacilityAcademyDisciplineBonus < 0 || options.FacilityAcademyDisciplineBonus > 100)
    {
      failures.Add("FacilityAcademyDisciplineBonus 0 ile 100 arasında olmalıdır.");
    }

    if (options.PromotionSlots < 1)
    {
      failures.Add("PromotionSlots en az 1 olmalıdır.");
    }

    if (options.RelegationSlots < 1)
    {
      failures.Add("RelegationSlots en az 1 olmalıdır.");
    }

    if (options.MatchLiveReplayDurationSeconds <= 0)
    {
      failures.Add("MatchLiveReplayDurationSeconds 0'dan büyük olmalıdır.");
    }

    if (options.MatchAutoSimulatePollSeconds <= 0)
    {
      failures.Add("MatchAutoSimulatePollSeconds 0'dan büyük olmalıdır.");
    }

    return failures.Count > 0
      ? ValidateOptionsResult.Fail(failures)
      : ValidateOptionsResult.Success;
  }
}
