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
}
