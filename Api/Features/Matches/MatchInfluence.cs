namespace Api.Features.Matches;

/// <summary>
/// Aggregate pre-match influence for a fixture: referee favor, opponent underperformance,
/// power boosts, and sabotage. Built from successful bribes plus match-scoped ClubActions.
/// </summary>
public sealed class MatchInfluence
{
  public static MatchInfluence None { get; } = new();

  /// <summary>
  /// Clubs that receive the favored goal multiplier (successful referee bribe,
  /// successful intimidation, or the opponent after an intimidation backfire).
  /// </summary>
  public IReadOnlySet<Guid> FavoredClubIds { get; init; } = new HashSet<Guid>();

  /// <summary>
  /// Clubs that successfully fixed the match. Their opponent's goal chance is reduced
  /// when that opponent attacks.
  /// </summary>
  public IReadOnlySet<Guid> MatchFixingClubIds { get; init; } = new HashSet<Guid>();

  /// <summary>Clubs that successfully ran espionage and get a small midfield/attack edge.</summary>
  public IReadOnlySet<Guid> EspionageClubIds { get; init; } = new HashSet<Guid>();

  /// <summary>Clubs that successfully doped and get a general power boost.</summary>
  public IReadOnlySet<Guid> DopingClubIds { get; init; } = new HashSet<Guid>();

  /// <summary>
  /// Clubs that successfully sabotaged the away side. Their opponent (the visitors)
  /// receives a power penalty.
  /// </summary>
  public IReadOnlySet<Guid> SabotageClubIds { get; init; } = new HashSet<Guid>();

  public bool Favors(Guid clubId) => FavoredClubIds.Contains(clubId);

  public bool HasMatchFixing(Guid clubId) => MatchFixingClubIds.Contains(clubId);

  public bool HasEspionage(Guid clubId) => EspionageClubIds.Contains(clubId);

  public bool HasDoping(Guid clubId) => DopingClubIds.Contains(clubId);

  public bool HasSabotage(Guid clubId) => SabotageClubIds.Contains(clubId);
}

public interface IMatchInfluenceProvider
{
  Task<MatchInfluence> GetForMatchAsync(
    Guid matchId,
    CancellationToken cancellationToken = default);
}

public sealed class NullMatchInfluenceProvider : IMatchInfluenceProvider
{
  public Task<MatchInfluence> GetForMatchAsync(
    Guid matchId,
    CancellationToken cancellationToken = default)
  {
    return Task.FromResult(MatchInfluence.None);
  }
}
