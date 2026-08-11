namespace Api.Features.Actions;

// Requests
public sealed record ExecuteClubActionRequest(
  ClubActionType ActionType,
  Guid? MatchId = null,
  MediaSpinMode? MediaSpinMode = null,
  Guid? TargetPlayerInstanceId = null);

// Responses
public sealed class ClubActionsContextResponseDto
{
  public Guid ClubId { get; init; }
  public string ClubName { get; init; } = default!;
  public decimal ClubCash { get; init; }
  public int Suspicion { get; init; }
  public int MaxSuspicion { get; init; }
  public bool CashSpendLocked { get; init; }
  public UpcomingMatchSummaryDto? UpcomingMatch { get; init; }
  public IReadOnlyList<ClubActionAvailabilityDto> Actions { get; init; } = [];
}

public sealed class UpcomingMatchSummaryDto
{
  public Guid MatchId { get; init; }
  public int MatchWeek { get; init; }
  public DateTime MatchDate { get; init; }
  public Guid HomeClubId { get; init; }
  public string HomeClubName { get; init; } = default!;
  public Guid AwayClubId { get; init; }
  public string AwayClubName { get; init; } = default!;
  public bool IsHome { get; init; }
}

public sealed class ClubActionAvailabilityDto
{
  public ClubActionType ActionType { get; init; }
  public ClubActionCategory Category { get; init; }
  public string DisplayName { get; init; } = default!;
  public string Description { get; init; } = default!;
  public decimal Cost { get; init; }
  public int HeatGenerated { get; init; }
  public decimal SuccessChance { get; init; }
  public decimal DetectionChance { get; init; }
  public bool IsShady { get; init; }
  public bool RequiresMatch { get; init; }
  public bool IsAvailable { get; init; }
  public string? UnavailableReason { get; init; }
  public int CooldownDays { get; init; }
  public int CooldownRemainingDays { get; init; }
}

public sealed class ClubActionDto
{
  public Guid Id { get; init; }
  public ClubActionType ActionType { get; init; }
  public ClubActionCategory Category { get; init; }
  public string DisplayName { get; init; } = default!;
  public Guid? MatchId { get; init; }
  public int? MatchWeek { get; init; }
  public Guid? TargetPlayerInstanceId { get; init; }
  public ClubActionOutcome Outcome { get; init; }
  public bool WasDetected { get; init; }
  public int HeatGenerated { get; init; }
  public decimal CashSpent { get; init; }
  public decimal SuccessChance { get; init; }
  public decimal DetectionChance { get; init; }
  public decimal FineAmount { get; init; }
  public int ScandalMoralePenaltyApplied { get; init; }
  public int ScandalReputationPenaltyApplied { get; init; }
  public bool MatchPenaltyApplied { get; init; }
  public DateTime CreatedDate { get; init; }
}

public sealed class ClubActionResultDto
{
  public ClubActionDto Action { get; init; } = default!;
  public decimal NewCash { get; init; }
  public int NewSuspicion { get; init; }
  public int NewMorale { get; init; }
  public int NewChemistry { get; init; }
  public int NewDiscipline { get; init; }
  public int? NewReputationPoints { get; init; }
  public InvestigationConsequenceDto? Investigation { get; init; }
}

public sealed class InvestigationConsequenceDto
{
  public decimal FineAmount { get; init; }
  public int MoralePenalty { get; init; }
  public int ReputationPenalty { get; init; }
  public bool MatchPenaltyApplied { get; init; }
}
