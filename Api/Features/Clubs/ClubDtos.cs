namespace Api.Features.Clubs;

// Responses
public sealed record ClubResponseDto
{
  public Guid Id { get; init; }
  public string Name { get; init; } = default!;
  public bool IsBot { get; init; }
  public decimal Cash { get; init; }
  public decimal WageBudget { get; init; }
  public int Morale { get; init; }
  public int Chemistry { get; init; }
  public int Discipline { get; init; }
  public int Suspicion { get; init; }
  public Guid? PresidentId { get; init; }
  public string? PresidentName { get; init; }
  public int DivisionId { get; init; }
  public string DivisionName { get; init; } = default!;
  public int DivisionTier { get; init; }
  public int DivisionGroupNumber { get; init; }
  public DateTime CreatedDate { get; init; }
}

public sealed record ClubPreviewDto
{
  public Guid Id { get; init; }
  public string Name { get; init; } = default!;
  public bool IsBot { get; init; }
  public Guid? PresidentId { get; init; }
  public string? PresidentName { get; init; }
  public int DivisionId { get; init; }
  public string DivisionName { get; init; } = default!;
}

public sealed record CreatedClubResponseDto
{
  public Guid Id { get; init; }
  public string Name { get; init; } = default!;
  public int DivisionId { get; init; }
}

public sealed record ClubCreationDefaultsDto
{
  public decimal StartingCash { get; init; }
  public decimal StartingWageBudget { get; init; }
  public int StartingClubStatus { get; init; }
}

// Requests
public sealed record CreateClubRequest(
  string Name,
  int DivisionId);

public sealed record CreateBotClubRequest(
  string Name,
  int DivisionId,
  decimal Cash,
  decimal WageBudget,
  int Morale,
  int Chemistry,
  int Discipline);

public sealed record UpdateClubRequest(
  Guid Id,
  string Name);

public sealed record UpdateClubFinancesRequest(
  Guid Id,
  decimal Cash,
  decimal WageBudget);

public sealed record UpdateClubStatusRequest(
  Guid Id,
  int Morale,
  int Chemistry,
  int Discipline);
