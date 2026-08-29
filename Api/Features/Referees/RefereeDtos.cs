namespace Api.Features.Referees;

// Responses
public sealed record RefereeResponseDto
{
  public int Id { get; init; }
  public string Name { get; init; } = default!;
  public int BriberyDifficulty { get; init; }
  public RefereePersonalityType PersonalityType { get; init; }
  public string? Biography { get; init; }
  public DateTime CreatedDate { get; init; }
}

public sealed record RefereePreviewDto
{
  public int Id { get; init; }
  public string Name { get; init; } = default!;
  public int BriberyDifficulty { get; init; }
  public RefereePersonalityType PersonalityType { get; init; }
}

public sealed record CreatedRefereeResponseDto
{
  public int Id { get; init; }
  public string Name { get; init; } = default!;
  public RefereePersonalityType PersonalityType { get; init; }
}

// Requests
public sealed record CreateRefereeRequest(
  string Name,
  int BriberyDifficulty,
  RefereePersonalityType PersonalityType,
  string? Biography);

public sealed record UpdateRefereeRequest(
  int Id,
  string Name,
  int BriberyDifficulty,
  RefereePersonalityType PersonalityType,
  string? Biography);

public sealed class RefereeListQuery
{
  public string? Search { get; init; }
  public RefereePersonalityType? PersonalityType { get; init; }
  public int CurrentPage { get; init; } = 1;
  public int PageSize { get; init; } = 10;
}
