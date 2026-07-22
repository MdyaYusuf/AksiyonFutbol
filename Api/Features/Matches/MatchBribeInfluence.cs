namespace Api.Features.Matches;

public sealed class MatchBribeInfluence
{
  public static MatchBribeInfluence None { get; } = new();

  public IReadOnlySet<Guid> FavoredClubIds { get; init; } = new HashSet<Guid>();

  public bool Favors(Guid clubId) => FavoredClubIds.Contains(clubId);
}

public interface IMatchBribeInfluenceProvider
{
  Task<MatchBribeInfluence> GetForMatchAsync(
    Guid matchId,
    CancellationToken cancellationToken = default);
}

public sealed class NullMatchBribeInfluenceProvider : IMatchBribeInfluenceProvider
{
  public Task<MatchBribeInfluence> GetForMatchAsync(
    Guid matchId,
    CancellationToken cancellationToken = default)
  {
    return Task.FromResult(MatchBribeInfluence.None);
  }
}
