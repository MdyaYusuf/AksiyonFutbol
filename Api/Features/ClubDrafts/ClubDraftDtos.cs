using Api.Features.BasePlayers;

namespace Api.Features.ClubDrafts;

public sealed record DraftCatalogPlayerDto
{
  public Guid Id { get; init; }
  public string DefaultFirstName { get; init; } = default!;
  public string DefaultLastName { get; init; } = default!;
  public string? Nationality { get; init; }
  public PlayerPosition Position { get; init; }
  public PreferredFoot PreferredFoot { get; init; }
  public int Age { get; init; }
  public int HeightCm { get; init; }
  public int WeightKg { get; init; }
  public int OverallRating { get; init; }
  public DraftTier DraftTier { get; init; }
  public decimal DraftFee { get; init; }
  public decimal Wage { get; init; }
  public bool IsPickedByMe { get; init; }
  public bool IsDraftOnly { get; init; }
  public bool IsFreeAgentTemplate { get; init; }
}

public sealed record DraftPickDto
{
  public Guid BasePlayerId { get; init; }
  public int PickOrder { get; init; }
  public string DefaultFirstName { get; init; } = default!;
  public string DefaultLastName { get; init; } = default!;
  public PlayerPosition Position { get; init; }
  public int OverallRating { get; init; }
  public DraftTier DraftTier { get; init; }
  public decimal DraftFee { get; init; }
  public decimal Wage { get; init; }
}

public sealed record DraftQuotaDto
{
  public PlayerPosition Position { get; init; }
  public int Required { get; init; }
  public int Selected { get; init; }
  public int Remaining { get; init; }
}

public sealed record ClubDraftStateDto
{
  public Guid ClubId { get; init; }
  public string ClubName { get; init; } = default!;
  public Clubs.ClubLifecycleStatus LifecycleStatus { get; init; }
  public decimal Cash { get; init; }
  public decimal WageBudget { get; init; }
  public decimal SpentFees { get; init; }
  public decimal CommittedWages { get; init; }
  public decimal RemainingCash { get; init; }
  public decimal RemainingWageBudget { get; init; }
  public bool CanFinalize { get; init; }
  public List<DraftQuotaDto> Quotas { get; init; } = [];
  public List<DraftPickDto> Picks { get; init; } = [];
}

public sealed record FinalizeClubDraftResponseDto
{
  public Guid ClubId { get; init; }
  public int TutorialDivisionId { get; init; }
  public string TutorialDivisionName { get; init; } = default!;
  public Clubs.ClubLifecycleStatus LifecycleStatus { get; init; }
  public int SquadSize { get; init; }
  public bool FixturesScheduled { get; init; }
}

public sealed record AddClubDraftPickRequest(Guid BasePlayerId);
