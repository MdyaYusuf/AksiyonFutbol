using Api.Features.Matches;

namespace Api.Features.Bribery;

public class MatchBribeInfluenceProvider(
  IBribeAttemptRepository _bribeAttemptRepository) : IMatchBribeInfluenceProvider
{
  public async Task<MatchBribeInfluence> GetForMatchAsync(
    Guid matchId,
    CancellationToken cancellationToken = default)
  {
    List<BribeAttempt> successfulAttempts = await _bribeAttemptRepository.GetAllAsync(
      filter: a =>
        a.MatchId == matchId &&
        a.Outcome == BribeAttemptOutcome.Succeeded,
      cancellationToken: cancellationToken);

    if (successfulAttempts.Count == 0)
    {
      return MatchBribeInfluence.None;
    }

    return new MatchBribeInfluence
    {
      FavoredClubIds = successfulAttempts.Select(a => a.ClubId).ToHashSet()
    };
  }
}
