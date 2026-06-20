namespace Api.Features.ClubPresidents;

// Responses
public sealed record ClubPresidentResponseDto
{
  public Guid Id { get; init; }
  public Guid UserId { get; init; }
  public string UserName { get; init; } = default!;
  public string Name { get; init; } = default!;
  public int ReputationPoints { get; init; }
  public string? Title { get; init; }
  public DateTime CreatedDate { get; init; }
}

public sealed record ClubPresidentPreviewDto
{
  public Guid Id { get; init; }
  public string Name { get; init; } = default!;
  public int ReputationPoints { get; init; }
  public string? Title { get; init; }
}

public sealed record CreatedClubPresidentResponseDto
{
  public Guid Id { get; init; }
  public string Name { get; init; } = default!;
  public string? Title { get; init; }
}

// Requests
public sealed record CreateClubPresidentRequest(
  string Name,
  string? Title);

public sealed record UpdateClubPresidentRequest(
  Guid Id,
  string Name,
  string? Title);

public sealed record UpdateClubPresidentReputationRequest(
  Guid Id,
  int ReputationPoints);
