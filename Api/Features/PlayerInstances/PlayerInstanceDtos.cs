using Api.Features.BasePlayers;

namespace Api.Features.PlayerInstances;

// Responses
public sealed record PlayerInstanceResponseDto
{
  public Guid Id { get; init; }
  public string FirstName { get; init; } = default!;
  public string LastName { get; init; } = default!;
  public string? Nationality { get; init; }
  public PlayerPosition Position { get; init; }
  public int Age { get; init; }
  public int HeightCm { get; init; }
  public int WeightKg { get; init; }
  public PreferredFoot PreferredFoot { get; init; }
  public PlayerAttributesDto Attributes { get; init; } = default!;
  public int AttackPower { get; init; }
  public int DefenseStrength { get; init; }
  public int MidfieldControl { get; init; }
  public int OverallRating { get; init; }
  public bool IsInjured { get; init; }
  public int InjuryDays { get; init; }
  public int SeasonGoals { get; init; }
  public int SeasonAssists { get; init; }
  public int SeasonYellowCards { get; init; }
  public int SeasonRedCards { get; init; }
  public decimal MarketValue { get; init; }
  public decimal Wage { get; init; }
  public Guid ClubId { get; init; }
  public string ClubName { get; init; } = default!;
  public Guid? BasePlayerId { get; init; }
  public DateTime CreatedDate { get; init; }
}

public sealed record PlayerInstancePreviewDto
{
  public Guid Id { get; init; }
  public string FirstName { get; init; } = default!;
  public string LastName { get; init; } = default!;
  public PlayerPosition Position { get; init; }
  public int Age { get; init; }
  public int OverallRating { get; init; }
  public bool IsInjured { get; init; }
  public int InjuryDays { get; init; }
  public Guid ClubId { get; init; }
  public string ClubName { get; init; } = default!;
}

public sealed record CreatedPlayerInstanceResponseDto
{
  public Guid Id { get; init; }
  public string FirstName { get; init; } = default!;
  public string LastName { get; init; } = default!;
  public PlayerPosition Position { get; init; }
  public Guid ClubId { get; init; }
}

// Requests
public sealed record CreatePlayerInstanceFromBasePlayerRequest(
  Guid ClubId,
  Guid BasePlayerId,
  decimal MarketValue,
  decimal Wage);

public sealed record CreateCustomPlayerInstanceRequest(
  Guid ClubId,
  string FirstName,
  string LastName,
  string? Nationality,
  PlayerPosition Position,
  int Age,
  int HeightCm,
  int WeightKg,
  PreferredFoot PreferredFoot,
  PlayerAttributesDto Attributes,
  decimal MarketValue,
  decimal Wage);

public sealed record UpdatePlayerInstanceNameRequest(
  Guid Id,
  string FirstName,
  string LastName);

public sealed record UpdatePlayerInstanceStatsRequest(
  Guid Id,
  PlayerPosition Position,
  int Age,
  int HeightCm,
  int WeightKg,
  PreferredFoot PreferredFoot,
  PlayerAttributesDto Attributes,
  decimal MarketValue,
  decimal Wage);

public sealed record UpdatePlayerInstanceHealthRequest(
  Guid Id,
  bool IsInjured,
  int InjuryDays);

public sealed record UpdatePlayerInstanceSeasonStatsRequest(
  Guid Id,
  int SeasonGoals,
  int SeasonAssists,
  int SeasonYellowCards,
  int SeasonRedCards);
