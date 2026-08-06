namespace Api.Features.Matches;

// Responses
public sealed record MatchResponseDto
{
  public Guid Id { get; init; }
  public int DivisionId { get; init; }
  public string DivisionName { get; init; } = default!;
  public int MatchWeek { get; init; }
  public Guid HomeClubId { get; init; }
  public string HomeClubName { get; init; } = default!;
  public Guid AwayClubId { get; init; }
  public string AwayClubName { get; init; } = default!;
  public int? RefereeId { get; init; }
  public string? RefereeName { get; init; }
  public DateTime MatchDate { get; init; }
  public bool IsPlayed { get; init; }
  public int? HomeScore { get; init; }
  public int? AwayScore { get; init; }
  public string? MatchLogJson { get; init; }
  public DateTime CreatedDate { get; init; }
}

public sealed record MatchPreviewDto
{
  public Guid Id { get; init; }
  public int MatchWeek { get; init; }
  public Guid HomeClubId { get; init; }
  public string HomeClubName { get; init; } = default!;
  public Guid AwayClubId { get; init; }
  public string AwayClubName { get; init; } = default!;
  public DateTime MatchDate { get; init; }
  public bool IsPlayed { get; init; }
  public int? HomeScore { get; init; }
  public int? AwayScore { get; init; }
}

/// <summary>Lightweight poll payload for live kickoff / waiting-sim checks.</summary>
public sealed record MatchLiveStatusDto
{
  public Guid Id { get; init; }
  public bool IsPlayed { get; init; }
  public int? HomeScore { get; init; }
  public int? AwayScore { get; init; }
}

public sealed record CreatedMatchResponseDto
{
  public Guid Id { get; init; }
  public int DivisionId { get; init; }
  public int MatchWeek { get; init; }
  public Guid HomeClubId { get; init; }
  public Guid AwayClubId { get; init; }
  public DateTime MatchDate { get; init; }
}

// Requests
public sealed record CreateMatchRequest(
  int DivisionId,
  int MatchWeek,
  Guid HomeClubId,
  Guid AwayClubId,
  int? RefereeId,
  DateTime MatchDate);

public sealed record UpdateMatchScheduleRequest(
  Guid Id,
  int DivisionId,
  int MatchWeek,
  Guid HomeClubId,
  Guid AwayClubId,
  int? RefereeId,
  DateTime MatchDate);
