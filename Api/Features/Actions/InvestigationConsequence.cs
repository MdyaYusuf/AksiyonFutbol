namespace Api.Features.Actions;

/// <summary>
/// Result of applying investigation consequences after a shady action is detected.
/// </summary>
public sealed class InvestigationConsequence
{
  public decimal FineAmount { get; init; }
  public int MoralePenalty { get; init; }
  public int ReputationPenalty { get; init; }
  public int InfamyGain { get; init; }
  public bool MatchPenaltyApplied { get; init; }
}
