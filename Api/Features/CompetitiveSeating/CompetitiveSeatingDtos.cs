using Api.Features.LeagueDivisions;

namespace Api.Features.CompetitiveSeating;

public sealed record CompetitiveSeatingQueueTierDto
{
  public LeagueTier Tier { get; init; }
  public int ClubCount { get; init; }
}

public sealed record CompetitiveSeatingQueuePreviewDto
{
  public int TotalQueuedClubs { get; init; }
  public IReadOnlyList<CompetitiveSeatingQueueTierDto> ByTier { get; init; } = [];
}

public sealed record CompetitiveSeatingRunResultDto
{
  public int DivisionsCreated { get; init; }
  public int ClubsSeated { get; init; }
}
