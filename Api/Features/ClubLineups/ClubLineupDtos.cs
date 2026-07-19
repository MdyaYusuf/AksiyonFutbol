using Api.Features.PlayerInstances;

namespace Api.Features.ClubLineups;

public sealed record UpsertClubLineupRequest(
  TeamFormation Formation,
  TeamMentality Mentality,
  List<Guid> StarterPlayerIds,
  List<Guid> BenchPlayerIds);

public sealed class ClubLineupResponseDto
{
  public Guid Id { get; init; }
  public Guid ClubId { get; init; }
  public string ClubName { get; init; } = default!;
  public TeamFormation Formation { get; init; }
  public TeamMentality Mentality { get; init; }
  public List<ClubLineupPlayerDto> Starters { get; init; } = [];
  public List<ClubLineupPlayerDto> Bench { get; init; } = [];
  public DateTime CreatedDate { get; init; }
  public DateTime? UpdatedDate { get; init; }
}

public sealed class ClubLineupPlayerDto
{
  public Guid PlayerInstanceId { get; init; }
  public string FirstName { get; init; } = default!;
  public string LastName { get; init; } = default!;
  public string Position { get; init; } = default!;
  public int OverallRating { get; init; }
  public bool IsInjured { get; init; }
  public int SortOrder { get; init; }
}

public sealed class MatchDaySquad
{
  public required List<PlayerInstance> StartingPlayers { get; init; }
  public TeamFormation Formation { get; init; }
  public TeamMentality Mentality { get; init; }
  public bool UsedSavedLineup { get; init; }
}
