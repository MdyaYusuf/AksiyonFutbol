namespace Api.Features.Matches;

// Responses
public sealed record MatchEventDto
{
  public int Minute { get; init; }
  public MatchEventType Type { get; init; }
  public Guid? ClubId { get; init; }
  public Guid? PlayerId { get; init; }
  public string Description { get; init; } = default!;
  public double? ExpectedGoals { get; init; }
  public bool? IsBigChance { get; init; }
}

public sealed record SimulatedMatchResultDto
{
  public int HomeScore { get; init; }
  public int AwayScore { get; init; }
  public string MatchLogJson { get; init; } = default!;
}
