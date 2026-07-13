namespace Api.Features.LeagueDivisions;

// Responses
public sealed record LeagueDivisionResponseDto
{
  public int Id { get; init; }
  public string Name { get; init; } = default!;
  public int Tier { get; init; }
  public int GroupNumber { get; init; }
  public int CurrentMatchWeek { get; init; }
  public DateTime CreatedDate { get; init; }
}

public sealed record LeagueDivisionPreviewDto
{
  public int Id { get; init; }
  public string Name { get; init; } = default!;
  public int Tier { get; init; }
  public int GroupNumber { get; init; }
  public int CurrentMatchWeek { get; init; }
}

public sealed record CreatedLeagueDivisionResponseDto
{
  public int Id { get; init; }
  public string Name { get; init; } = default!;
  public int Tier { get; init; }
  public int GroupNumber { get; init; }
}

public sealed record ProcessMatchWeekResultDto
{
  public int DivisionId { get; init; }
  public int ProcessedMatchWeek { get; init; }
  public int SimulatedMatchCount { get; init; }
  public int CurrentMatchWeek { get; init; }
  public bool WeekAdvanced { get; init; }
}

// Requests
public sealed record CreateLeagueDivisionRequest(
  string Name,
  int Tier,
  int GroupNumber);

public sealed record UpdateLeagueDivisionRequest(
  int Id,
  string Name,
  int Tier,
  int GroupNumber);

public sealed record UpdateLeagueDivisionMatchWeekRequest(
  int Id,
  int CurrentMatchWeek);
