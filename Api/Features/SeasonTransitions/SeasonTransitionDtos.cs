namespace Api.Features.SeasonTransitions;

public sealed class StandingRowDto
{
  public int Position { get; init; }
  public Guid ClubId { get; init; }
  public string ClubName { get; init; } = default!;
  public int Played { get; init; }
  public int Won { get; init; }
  public int Drawn { get; init; }
  public int Lost { get; init; }
  public int GoalsFor { get; init; }
  public int GoalsAgainst { get; init; }
  public int GoalDifference { get; init; }
  public int Points { get; init; }
}

public sealed class SeasonClubMovementDto
{
  public Guid ClubId { get; init; }
  public string ClubName { get; init; } = default!;
  public int Position { get; init; }
  public int Points { get; init; }
  public int FromDivisionId { get; init; }
  public string FromDivisionName { get; init; } = default!;
  public int FromTier { get; init; }
  public int? ToDivisionId { get; init; }
  public string? ToDivisionName { get; init; }
  public int? ToTier { get; init; }
  public SeasonMovementOutcome Outcome { get; init; }
}

public sealed class SeasonDivisionPreviewDto
{
  public int DivisionId { get; init; }
  public string DivisionName { get; init; } = default!;
  public int Tier { get; init; }
  public int GroupNumber { get; init; }
  public int CurrentMatchWeek { get; init; }
  public bool IsSeasonComplete { get; init; }
  public IReadOnlyList<StandingRowDto> Standings { get; init; } = [];
}

public sealed class SeasonEndPreviewDto
{
  public int GroupNumber { get; init; }
  public int PromotionSlots { get; init; }
  public int RelegationSlots { get; init; }
  public int SwapSlots { get; init; }
  public bool CanProcess { get; init; }
  public string? BlockReason { get; init; }
  public IReadOnlyList<SeasonDivisionPreviewDto> Divisions { get; init; } = [];
  public IReadOnlyList<SeasonClubMovementDto> Movements { get; init; } = [];
}

public sealed class SeasonEndProcessResultDto
{
  public int GroupNumber { get; init; }
  public int ClubsPromoted { get; init; }
  public int ClubsRelegated { get; init; }
  public int DivisionsReset { get; init; }
  public int ResetMatchWeek { get; init; }
  public int FixturesGenerated { get; init; }
  public IReadOnlyList<SeasonClubMovementDto> Movements { get; init; } = [];
}
