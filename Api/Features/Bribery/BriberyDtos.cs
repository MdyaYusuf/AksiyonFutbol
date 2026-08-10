namespace Api.Features.Bribery;

public sealed record CreateBribeAttemptRequest(
  Guid? MatchId,
  decimal Amount);

public sealed class BriberyContextResponseDto
{
  public Guid ClubId { get; init; }
  public string ClubName { get; init; } = default!;
  public decimal ClubCash { get; init; }
  public bool CanAttempt { get; init; }
  public string? UnavailableReason { get; init; }
  public Guid? MatchId { get; init; }
  public int? MatchWeek { get; init; }
  public DateTime? MatchDate { get; init; }
  public Guid? HomeClubId { get; init; }
  public string? HomeClubName { get; init; }
  public Guid? AwayClubId { get; init; }
  public string? AwayClubName { get; init; }
  public bool? IsHome { get; init; }
  public int? RefereeId { get; init; }
  public string? RefereeName { get; init; }
  public int? BriberyDifficulty { get; init; }
  public string? RefereePersonality { get; init; }
  public bool AlreadyAttempted { get; init; }
  public BribeAttemptOutcome? ExistingOutcome { get; init; }
  public decimal EstimatedSuccessChance { get; init; }
  public decimal MinAmount { get; init; }
  public decimal MaxAmount { get; init; }
}

public sealed class BribeAttemptResponseDto
{
  public Guid Id { get; init; }
  public Guid ClubId { get; init; }
  public string ClubName { get; init; } = default!;
  public Guid MatchId { get; init; }
  public int MatchWeek { get; init; }
  public string HomeClubName { get; init; } = default!;
  public string AwayClubName { get; init; } = default!;
  public int RefereeId { get; init; }
  public string RefereeName { get; init; } = default!;
  public int BriberyDifficulty { get; init; }
  public decimal Amount { get; init; }
  public decimal SuccessChance { get; init; }
  public BribeAttemptOutcome Outcome { get; init; }
  public DateTime CreatedDate { get; init; }
}
