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
}
