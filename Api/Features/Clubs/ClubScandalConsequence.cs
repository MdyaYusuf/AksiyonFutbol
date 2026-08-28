namespace Api.Features.Clubs;

/// <summary>
/// Result of applying scandal consequences after a gray-area move is detected.
/// </summary>
public sealed class ClubScandalConsequence
{
  public decimal FineAmount { get; init; }
  public int MoralePenalty { get; init; }
  public int ReputationPenalty { get; init; }
  public int InfamyGain { get; init; }
  public bool MatchPenaltyApplied { get; init; }
}
