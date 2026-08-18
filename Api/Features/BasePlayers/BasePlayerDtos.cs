namespace Api.Features.BasePlayers;

// Responses
public sealed record BasePlayerResponseDto
{
  public Guid Id { get; init; }
  public string DefaultFirstName { get; init; } = default!;
  public string DefaultLastName { get; init; } = default!;
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
  public DraftTier DraftTier { get; init; }
  public decimal DraftFee { get; init; }
  public decimal Wage { get; init; }
  public decimal MarketValue { get; init; }
  public bool IsFreeAgentTemplate { get; init; }
  public bool IsDraftOnly { get; init; }
  public DateTime CreatedDate { get; init; }
}

public sealed record BasePlayerPreviewDto
{
  public Guid Id { get; init; }
  public string DefaultFirstName { get; init; } = default!;
  public string DefaultLastName { get; init; } = default!;
  public PlayerPosition Position { get; init; }
  public int Age { get; init; }
  public int HeightCm { get; init; }
  public int WeightKg { get; init; }
  public PreferredFoot PreferredFoot { get; init; }
  public int OverallRating { get; init; }
  public DraftTier DraftTier { get; init; }
  public decimal DraftFee { get; init; }
  public decimal Wage { get; init; }
  public decimal MarketValue { get; init; }
  public bool IsFreeAgentTemplate { get; init; }
  public bool IsDraftOnly { get; init; }
}

public sealed record CreatedBasePlayerResponseDto
{
  public Guid Id { get; init; }
  public string DefaultFirstName { get; init; } = default!;
  public string DefaultLastName { get; init; } = default!;
  public PlayerPosition Position { get; init; }
  public PreferredFoot PreferredFoot { get; init; }
}

// Requests
public sealed record CreateBasePlayerRequest(
  string DefaultFirstName,
  string DefaultLastName,
  string? Nationality,
  PlayerPosition Position,
  int Age,
  int HeightCm,
  int WeightKg,
  PreferredFoot PreferredFoot,
  PlayerAttributesDto Attributes,
  DraftTier DraftTier,
  decimal DraftFee,
  decimal Wage,
  decimal MarketValue,
  bool IsFreeAgentTemplate,
  bool IsDraftOnly);

public sealed record UpdateBasePlayerRequest(
  Guid Id,
  string DefaultFirstName,
  string DefaultLastName,
  string? Nationality,
  PlayerPosition Position,
  int Age,
  int HeightCm,
  int WeightKg,
  PreferredFoot PreferredFoot,
  PlayerAttributesDto Attributes,
  DraftTier DraftTier,
  decimal DraftFee,
  decimal Wage,
  decimal MarketValue,
  bool IsFreeAgentTemplate,
  bool IsDraftOnly);
