namespace Api.Features.ClubPresidents;

// Responses
public sealed record ClubPresidentResponseDto
{
  public Guid Id { get; init; }
  public Guid UserId { get; init; }
  public string UserName { get; init; } = default!;
  public string Name { get; init; } = default!;
  public int ReputationPoints { get; init; }
  public int InfamyPoints { get; init; }
  public string? Title { get; init; }
  public int Charisma { get; init; }
  public int Authority { get; init; }
  public int Integrity { get; init; }
  public int Cunning { get; init; }
  public int Connections { get; init; }
  public DateTime CreatedDate { get; init; }
}

public sealed record ClubPresidentPreviewDto
{
  public Guid Id { get; init; }
  public string Name { get; init; } = default!;
  public int ReputationPoints { get; init; }
  public int InfamyPoints { get; init; }
  public string? Title { get; init; }
  public int Charisma { get; init; }
  public int Authority { get; init; }
  public int Integrity { get; init; }
  public int Cunning { get; init; }
  public int Connections { get; init; }
}

public sealed record CreatedClubPresidentResponseDto
{
  public Guid Id { get; init; }
  public string Name { get; init; } = default!;
  public string? Title { get; init; }
  public int Charisma { get; init; }
  public int Authority { get; init; }
  public int Integrity { get; init; }
  public int Cunning { get; init; }
  public int Connections { get; init; }
}

// Requests
public sealed record CreateClubPresidentRequest(
  string Name,
  int Charisma,
  int Authority,
  int Integrity,
  int Cunning,
  int Connections);

public sealed record UpdateClubPresidentRequest(
  Guid Id,
  string Name);

public sealed record UpdateClubPresidentReputationRequest(
  Guid Id,
  int ReputationPoints);
