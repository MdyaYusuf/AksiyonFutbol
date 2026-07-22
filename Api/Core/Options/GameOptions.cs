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
}
